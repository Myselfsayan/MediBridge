import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

export { addDoctor };