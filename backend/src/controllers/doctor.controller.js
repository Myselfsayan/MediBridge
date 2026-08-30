import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import doctorModel from "../models/doctor.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const changeAvailability = asyncHandler(async (req, res) => {
    const { doctorId } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found");
    }

    doctor.available = !doctor.available;
    await doctor.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            doctor,
            "Availability updated successfully"
        )
    );
});
const doctorList = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({})
        .select("-password -email");

    return res.status(200).json(
        new ApiResponse(
            200,
            doctors,
            "Doctors fetched successfully"
        )
    );
});

// DOCTOR LOGIN


const loginDoctor = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }

    // Find doctor and include password
    const doctor = await doctorModel
        .findOne({ email })
        .select("+password");

    if (!doctor) {
        throw new ApiError(
            401,
            "Invalid credentials"
        );
    }

    // Compare password
    const isMatch = await bcrypt.compare(
        password,
        doctor.password
    );

    if (!isMatch) {
        throw new ApiError(
            401,
            "Invalid credentials"
        );
    }

    // Generate access token
    const accessToken = jwt.sign(
        {
            _id: doctor._id,
            email: doctor.email,
            role: "doctor"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
        {
            _id: doctor._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );

    // Save refresh token
    doctor.refreshToken = refreshToken;

    await doctor.save({
        validateBeforeSave: false
    });

    // HTTP-only cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax"
    };

    // Send tokens in HTTP-only cookies
    return res
        .cookie("doctorAccessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        })
        .cookie("doctorRefreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    doctor: {
                        _id: doctor._id,
                        name: doctor.name,
                        email: doctor.email
                    }
                },
                "Doctor logged in successfully"
            )
        );
});


export { changeAvailability, doctorList , loginDoctor };