import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


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

        // IMPORTANT:
        // Admin only uses adminAccessToken

        const token =
            req.cookies?.adminAccessToken;

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