import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import validator from "validator";
import { accessCookieOptions, refreshCookieOptions } from "../utils/constant.js";

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




export { registerUser, loginUser, logoutUser, getCurrentUser };