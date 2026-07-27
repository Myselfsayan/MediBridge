import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

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

    // Validate image file exists
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Doctor image is required");
    }

    // Upload to Cloudinary
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    if (!uploadedImage) {
        throw new ApiError(500, "Failed to upload image");
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
        throw new ApiError(400, "All fields are required");
    }

    // Check existing doctor
    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
        throw new ApiError(409, "Doctor already exists");
    }

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
        address,
        image: uploadedImage.secure_url // Cloudinary URL
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            doctor,
            "Doctor added successfully"
        )
    );
});

// API For The Admin Panel
const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        throw new ApiError(401, "Invalid credentials");
    }

    const payload = {
        _id: "admin",
        email,
        role: "admin",
    };

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );

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
                    admin: {
                        email,
                        role: "admin",
                    },
                },
                "Admin logged in successfully"
            )
        );
});

export { addDoctor , loginAdmin };