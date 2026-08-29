import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


// ==========================================
// ADD DOCTOR
// ==========================================

const addDoctor = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        password,
        speciality,
        degree,
        experience,
        about,
        fees,
        address
    } = req.body;


    // Validate image
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(
            400,
            "Doctor image is required"
        );
    }


    // Upload image to Cloudinary
    const uploadedImage =
        await uploadOnCloudinary(imageLocalPath);

    if (!uploadedImage) {
        throw new ApiError(
            500,
            "Failed to upload image"
        );
    }


    // Validate fields
    if (
        !name ||
        !email ||
        !password ||
        !speciality ||
        !degree ||
        !experience ||
        !about ||
        !fees ||
        !address
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }


    // Check existing doctor
    const existingDoctor =
        await Doctor.findOne({ email });

    if (existingDoctor) {
        throw new ApiError(
            409,
            "Doctor already exists"
        );
    }


    // Parse address
    const parsedAddress = JSON.parse(address);


    // Create doctor
    const doctor = await Doctor.create({
        name,
        email,
        password,
        speciality,
        degree,
        experience,
        about,
        fees,
        address: parsedAddress,
        image: uploadedImage.secure_url
    });


    return res.status(201).json(
        new ApiResponse(
            201,
            doctor,
            "Doctor added successfully"
        )
    );
});


// ==========================================
// COOKIE OPTIONS
// ==========================================

const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24
};


const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7
};


// ==========================================
// ADMIN LOGIN
// ==========================================

const loginAdmin = asyncHandler(async (req, res) => {

    const {
        email,
        password
    } = req.body;


    // Validate credentials
    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }


    // Check admin credentials
    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        throw new ApiError(
            401,
            "Invalid credentials"
        );
    }


    // JWT payload
    const payload = {
        _id: "admin",
        email,
        role: "admin"
    };


    // ==========================================
    // ACCESS TOKEN
    // ==========================================

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:
                process.env.ACCESS_TOKEN_EXPIRY
        }
    );


    // ==========================================
    // REFRESH TOKEN
    // ==========================================

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:
                process.env.REFRESH_TOKEN_EXPIRY
        }
    );


    // ==========================================
    // SET HTTP-ONLY COOKIES
    // ==========================================

    return res
        .status(200)

        .cookie(
            "accessToken",
            accessToken,
            accessCookieOptions
        )

        .cookie(
            "refreshToken",
            refreshToken,
            refreshCookieOptions
        )

        .json(
            new ApiResponse(
                200,
                {
                    admin: {
                        email,
                        role: "admin"
                    }
                },
                "Admin logged in successfully"
            )
        );
});


// ==========================================
// CURRENT ADMIN
// ==========================================

const currentAdmin = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                admin: req.user
            },
            "Admin authenticated successfully"
        )
    );
});


// ==========================================
// GET ALL DOCTORS
// ==========================================

const allDoctors = asyncHandler(async (req, res) => {

    const doctors = await Doctor
        .find()
        .select("-password");


    return res.status(200).json(
        new ApiResponse(
            200,
            doctors,
            "Doctors fetched successfully"
        )
    );
});


// ==========================================
// GET ALL APPOINTMENTS
// ==========================================

const appointmentsAdmin = asyncHandler(async (req, res) => {

    const appointments =
        await appointmentModel.find({});


    return res.status(200).json(
        new ApiResponse(
            200,
            appointments,
            "Appointments fetched successfully"
        )
    );
});


// ==========================================
// ADMIN LOGOUT
// ==========================================

const logoutAdmin = asyncHandler(async (req, res) => {

    return res
        .status(200)

        .clearCookie(
            "accessToken",
            accessCookieOptions
        )

        .clearCookie(
            "refreshToken",
            refreshCookieOptions
        )

        .json(
            new ApiResponse(
                200,
                {},
                "Admin logged out successfully"
            )
        );
});


export {
    addDoctor,
    loginAdmin,
    currentAdmin,
    allDoctors,
    appointmentsAdmin,
    logoutAdmin
};