import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {accessCookieOptions,refreshCookieOptions} from "../utils/constant.js";
import validator from "validator";
import { uploadOnCloudinary , getPublicIdFromUrl , deleteFromCloudinary } from "../utils/cloudinary.js";

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
    
    // Check if user is already logged in
    if (req.cookies?.accessToken) {
        throw new ApiError(400, "User already logged in");
    }

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

console.log("Refresh token received:", !!incomingRefreshToken);
console.log("Refresh token in DB:", !!user.refreshToken);
console.log(
    "Tokens match:",
    incomingRefreshToken === user.refreshToken
);

if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(
        401,
        "Refresh token is invalid or expired"
    );
}

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
    const {userId} = req.body;
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

const updateProfile = asyncHandler(async (req, res) => {
    console.log("===== UPDATE PROFILE =====");
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    const userId = req.user._id;

    const {
        name,
        email,
        phone,
        address,
        dob,
        gender,
    } = req.body;

    // ==========================================
    // Check current user
    // ==========================================

    const currentUser = await User.findById(userId);

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    // ==========================================
    // Prepare update data
    // ==========================================

    const updateData = {};

    // Name
    if (name !== undefined && name !== "") {
        updateData.name = name;
    }

    // Email
    if (email !== undefined && email !== "") {
        // Validate email
        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Enter a valid email");
        }

        // Check whether email belongs to another user
        const existingUser = await User.findOne({
            email,
            _id: { $ne: userId },
        });

        if (existingUser) {
            throw new ApiError(409, "Email already exists");
        }

        updateData.email = email;
    }

    // Phone
    if (phone !== undefined && phone !== "") {
        updateData.phone = phone;
    }

    // Gender
    if (gender !== undefined && gender !== "") {
        updateData.gender = gender;
    }

    // DOB
    // Only update if a valid value is provided
    if (
        dob !== undefined &&
        dob !== "" &&
        dob !== "null" &&
        dob !== "undefined"
    ) {
        updateData.dob = dob;
    }

    // Address
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

    // ==========================================
    // Upload new image if selected
    // ==========================================

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

        console.log(
            "New image URL:",
            uploadedImage.secure_url
        );
    }

    // ==========================================
    // Check if anything was provided
    // ==========================================

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(
            400,
            "No profile data provided for update"
        );
    }

    console.log("UPDATE DATA:", updateData);

    // ==========================================
    // Update MongoDB
    // ==========================================

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

    // ==========================================
    // Response
    // ==========================================

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



export { registerUser, loginUser, logoutUser, getCurrentUser , getProfile, updateProfile , refreshAccessToken};