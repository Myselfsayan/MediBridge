import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {Doctor} from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    accessCookieOptions,
    refreshCookieOptions
} from "../utils/constant.js";
import validator from "validator";
import {
    uploadOnCloudinary,
    getPublicIdFromUrl,
    deleteFromCloudinary
} from "../utils/cloudinary.js";

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: req.user,
            },
            "Current user fetched successfully"
        )
    );
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Missing Details");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Enter a valid email");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Enter a strong password");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // 2. Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // 3. Check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // 4. Generate access token
    const accessToken = user.generateAccessToken();

    // 5. Generate refresh token
    const refreshToken = user.generateRefreshToken();

    // 6. Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 7. Send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken,
                    user: {
                        _id: user._id,
                        userName: user.userName,
                        email: user.email,
                        fullName: user.fullName,
                        avatar: user.avatar,
                    },
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", accessCookieOptions)
        .clearCookie("refreshToken", refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id).select("+refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(
                401,
                "Refresh token is invalid or expired"
            );
        }

        const newAccessToken = user.generateAccessToken();

        return res
            .status(200)
            .cookie(
                "accessToken",
                newAccessToken,
                accessCookieOptions
            )
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: newAccessToken
                    },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid refresh token"
        );
    }
});

const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userData = await User.findById(userId).select("-password");

    if (!userData) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: userData,
            },
            "User profile fetched successfully"
        )
    );
});

// API to Book Appointment
const bookAppointment = asyncHandler(async (req, res) => {

    const { docId, slotDate, slotTime } = req.body;

    // Get logged-in user ID from authentication middleware
    const userId = req.user._id;
    // console.log("docId:", docId);
    // Get doctor data
    const docData = await Doctor
        .findById({_id:docId})
        .select("-password");
        
    if (!docData) {
        throw new ApiError(404, "Doctor not found");
    }

    if (!docData.available) {
        throw new ApiError(400, "Doctor not available");
    }

    // Check slot availability
    const slots_booked = docData.slots_booked;
    const bookedSlots = slots_booked.get(slotDate) || [];

    if (bookedSlots.includes(slotTime)) {
        throw new ApiError(400, "Slot not available");
    }

    bookedSlots.push(slotTime);
    slots_booked.set(slotDate, bookedSlots);

    // Get user data
    const userData = await User
        .findById(userId)
        .select("-password");

    if (!userData) {
        throw new ApiError(404, "User not found");
    }

    // Remove slots_booked from doctor data before storing in appointment
    const docDataObj = docData.toObject();
    delete docDataObj.slots_booked;

    // Create appointment data
    const appointmentData = {
        userId,
        docId,
        userData,
        docData: docDataObj,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    //console.log("Appointment booked:", newAppointment);

    // Update doctor's booked slots
    await Doctor.findByIdAndUpdate(
        docId,
        { slots_booked }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                appointmentData,
                "Appointment booked successfully"
            )
        );
});

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const {
        name,
        email,
        phone,
        address,
        dob,
        gender,
    } = req.body;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    const updateData = {};

    if (name !== undefined && name !== "") {
        updateData.name = name;
    }

    if (email !== undefined && email !== "") {
        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Enter a valid email");
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: userId },
        });

        if (existingUser) {
            throw new ApiError(409, "Email already exists");
        }

        updateData.email = email;
    }

    if (phone !== undefined && phone !== "") {
        updateData.phone = phone;
    }

    if (gender !== undefined && gender !== "") {
        updateData.gender = gender;
    }

    if (
        dob !== undefined &&
        dob !== "" &&
        dob !== "null" &&
        dob !== "undefined"
    ) {
        updateData.dob = dob;
    }

    if (
        address !== undefined &&
        address !== "" &&
        address !== "null" &&
        address !== "undefined"
    ) {
        try {
            updateData.address =
                typeof address === "string"
                    ? JSON.parse(address)
                    : address;
        } catch (error) {
            throw new ApiError(400, "Invalid address format");
        }
    }

    let oldImage = currentUser.image;

    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(
            req.file.path
        );

        if (!uploadedImage) {
            throw new ApiError(
                500,
                "Image upload failed"
            );
        }

        updateData.image = uploadedImage.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(
            400,
            "No profile data provided for update"
        );
    }

    const updatedUser =
        await User.findByIdAndUpdate(
            userId,
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: updatedUser,
            },
            "User profile updated successfully"
        )
    );
});

// API to get user appointments for frontend my-appointments page
const listAppointment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const appointments = await appointmentModel.find({ userId });

    return res.status(200).json(
        new ApiResponse(
            200,
            { appointments },
            "Appointments fetched successfully"
        )
    );
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointmentData.userId.toString() !== userId.toString()) {
        throw new ApiError(401, "Unauthorized action");
    }

    await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { cancelled: true }
    );

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await Doctor.findById(docId);

    if (!doctorData) {
        throw new ApiError(404, "Doctor not found");
    }

    const slots_booked = doctorData.slots_booked;
    const bookedSlots = slots_booked.get(slotDate);
    if (bookedSlots) {
        const updatedSlots = bookedSlots.filter(e => e !== slotTime);
        slots_booked.set(slotDate, updatedSlots);
    }

    await Doctor.findByIdAndUpdate(
        docId,
        { slots_booked }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Appointment Cancelled"
        )
    );
});


export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser , 
    getProfile, 
    updateProfile , 
    refreshAccessToken , 
    bookAppointment, 
    listAppointment , 
    cancelAppointment 
};