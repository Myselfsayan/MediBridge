import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {
    accessCookieOptions,
    refreshCookieOptions
} from "../utils/constant.js";


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
            "adminAccessToken",
            accessToken,
            accessCookieOptions
        )

        .cookie(
            "adminRefreshToken",
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
            "adminAccessToken",
            accessCookieOptions
        )

        .clearCookie(
            "adminRefreshToken",
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

// ==========================================
// CANCEL APPOINTMENT BY ADMIN
// ==========================================

const cancelAppointmentAdmin = asyncHandler(async (req, res) => {

    console.log("=================================");
    console.log("🔥 ADMIN CANCEL APPOINTMENT");
    console.log("=================================");


    // ==========================================
    // GET APPOINTMENT ID
    // ==========================================

    const { appointmentId } = req.body;

    console.log("Appointment ID:", appointmentId);


    // ==========================================
    // CHECK APPOINTMENT ID
    // ==========================================

    if (!appointmentId) {

        return res.status(400).json({
            success: false,
            message: "Appointment ID is required",
        });

    }


    // ==========================================
    // FIND APPOINTMENT
    // ==========================================

    const appointment =
        await appointmentModel.findById(appointmentId);


    if (!appointment) {

        return res.status(404).json({
            success: false,
            message: "Appointment not found",
        });

    }


    console.log(
        "Payment status before cancellation:",
        appointment.paymentStatus
    );

    console.log(
        "Cancelled before:",
        appointment.cancelled
    );


    // ==========================================
    // CHECK IF ALREADY CANCELLED
    // ==========================================

    if (appointment.cancelled) {

        return res.status(400).json({
            success: false,
            message: "Appointment is already cancelled",
            paymentStatus: appointment.paymentStatus,
        });

    }


    // ==========================================
    // PAYMENT STATUS LOGIC
    // ==========================================

    if (appointment.paymentStatus === "paid") {

        // paid → refunded
        appointment.paymentStatus = "refunded";

    }

    // pending → pending
    // failed → failed
    // refunded → refunded


    // ==========================================
    // CANCEL APPOINTMENT
    // ==========================================

    appointment.cancelled = true;


    // ==========================================
    // FIND DOCTOR
    // ==========================================

    const doctor =
        await Doctor.findById(appointment.docId);


    if (!doctor) {

        return res.status(404).json({
            success: false,
            message: "Doctor not found",
        });

    }


    // ==========================================
    // GET BOOKED SLOTS
    // ==========================================

    const bookedSlots =
        doctor.slots_booked.get(
            appointment.slotDate
        ) || [];


    console.log(
        "Booked slots before:",
        bookedSlots
    );


    // ==========================================
    // REMOVE CANCELLED SLOT
    // ==========================================

    const normalizeSlot = (t) => (t ? String(t).replace(/[\u202F\u00A0]/g, " ").trim().toUpperCase() : "");
    const cleanSlotTime = appointment.slotTime ? String(appointment.slotTime).replace(/[\u202F\u00A0]/g, " ").trim() : "";
    const updatedSlots =
        bookedSlots.filter(
            (slot) =>
                normalizeSlot(slot) !== normalizeSlot(cleanSlotTime)
        );


    console.log(
        "Booked slots after:",
        updatedSlots
    );


    // ==========================================
    // UPDATE DOCTOR SLOTS
    // ==========================================

    doctor.slots_booked.set(
        appointment.slotDate,
        updatedSlots
    );


    await doctor.save();


    // ==========================================
    // SAVE APPOINTMENT
    // ==========================================

    await appointment.save();


    // ==========================================
    // FINAL LOG
    // ==========================================

    console.log(
        "Payment status after cancellation:",
        appointment.paymentStatus
    );

    console.log(
        "Cancelled after:",
        appointment.cancelled
    );

    console.log(
        "Released slot:",
        appointment.slotTime
    );

    console.log("=================================");


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({

        success: true,

        message:
            appointment.paymentStatus === "refunded"
                ? "Appointment cancelled and payment refunded"
                : "Appointment cancelled successfully",

        paymentStatus:
            appointment.paymentStatus,

        cancelled:
            appointment.cancelled,

        appointment,

    });

});


// API to get dashboard data for admin panel
const adminDashboard = asyncHandler(async (req, res) => {

    const doctors = await Doctor.find({});
    const users = await User.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: appointments
            .slice()
            .reverse()
            .slice(0, 5),
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            dashData,
            "Admin dashboard data fetched successfully"
        )
    );
});


export {
    addDoctor,
    loginAdmin,
    currentAdmin,
    allDoctors,
    appointmentsAdmin,
    logoutAdmin,
    cancelAppointmentAdmin,
    adminDashboard
};