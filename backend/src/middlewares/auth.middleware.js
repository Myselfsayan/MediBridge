import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";


// ==========================================
// USER AUTHENTICATION
// ==========================================

export const verifyUserJWT = asyncHandler(async (req, _, next) => {

    try {

        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(
                401,
                "Unauthorized Request"
            );
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Never allow admin token/payload as a user
        if (
            decodedToken.role === "admin" ||
            decodedToken._id === "admin"
        ) {
            throw new ApiError(
                403,
                "Admin authentication is not allowed here"
            );
        }

        const user = await User.findById(
            decodedToken._id
        ).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid Access Token"
            );
        }

        req.user = user;

        next();

    } catch (error) {

        throw new ApiError(
            error.statusCode || 401,
            error.message || "Invalid Access Token"
        );

    }

});


// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {

    try {

        const token =
            req.cookies?.adminAccessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(
                401,
                "Admin authentication required"
            );
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Admin must have exactly this payload
        if (
            decodedToken.role !== "admin" ||
            decodedToken._id !== "admin"
        ) {
            throw new ApiError(
                403,
                "Invalid admin authentication"
            );
        }

        req.user = {
            _id: "admin",
            email: decodedToken.email,
            role: "admin"
        };

        next();

    } catch (error) {

        throw new ApiError(
            error.statusCode || 401,
            error.message || "Invalid Admin Access Token"
        );

    }

});


// ==========================================
// DOCTOR AUTHENTICATION
// ==========================================

export const verifyDoctorJWT = asyncHandler(
    async (req, _, next) => {

        try {

            // ==========================================
            // GET DOCTOR TOKEN
            // ==========================================

            const token =
                req.cookies?.doctorAccessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {

                throw new ApiError(
                    401,
                    "Doctor not authenticated"
                );
            }


            // ==========================================
            // VERIFY TOKEN
            // ==========================================

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );


            // ==========================================
            // CHECK DOCTOR ID
            // ==========================================

            if (!decodedToken?._id) {

                throw new ApiError(
                    401,
                    "Invalid doctor access token"
                );
            }


            // ==========================================
            // FIND DOCTOR
            // ==========================================

            const doctor = await Doctor.findById(
                decodedToken._id
            ).select("-password");


            if (!doctor) {

                throw new ApiError(
                    401,
                    "Doctor not found"
                );
            }


            // ==========================================
            // ATTACH DOCTOR TO REQUEST
            // ==========================================

            req.doctor = doctor;

            next();

        } catch (error) {

            console.log(
                "Doctor JWT verification error:",
                error.message
            );

            throw new ApiError(
                401,
                error.message ||
                "Invalid or expired doctor token"
            );
        }

    }
);