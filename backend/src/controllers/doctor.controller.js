import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Doctor} from "../models/doctor.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import appointmentModel from "../models/appointment.model.js";

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
const logoutDoctor = asyncHandler(async (req, res) => {

    // Clear doctor authentication cookie
    res.clearCookie("doctorAccessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Doctor logged out successfully"
        )
    );
});
// ==========================================
// GET DOCTOR APPOINTMENTS
// ==========================================

const getDoctorAppointments = asyncHandler(
    async (req, res) => {

        // Doctor is already verified by verifyDoctorJWT
        const doctorId = req.doctor._id;

        // Get all appointments belonging to this doctor
        const appointments = await appointmentModel.find({
            docId: doctorId
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    appointments
                },
                "Doctor appointments fetched successfully"
            )
        );
    }
);


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
    const doctor = await Doctor
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

const getCurrentDoctor = asyncHandler(async (req, res) => {

    const doctor = req.doctor;

    if (!doctor) {
        throw new ApiError(401, "Doctor not authenticated");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                doctor
            },
            "Current doctor fetched successfully"
        )
    );
});

// =====================================================
// DOCTOR CANCEL APPOINTMENT
// pending → pending
// paid → refunded
// =====================================================

const cancelDoctorAppointment = asyncHandler(async (req, res) => {

    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({
            success: false,
            message: "Appointment ID is required",
        });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found",
        });
    }

    console.log("=================================");
    console.log("DOCTOR CANCEL APPOINTMENT");
    console.log("Appointment ID:", appointmentId);
    console.log("Payment before:", appointment.paymentStatus);
    console.log("Cancelled before:", appointment.cancelled);
    console.log("=================================");


    // Already cancelled
    if (appointment.cancelled) {
        return res.status(400).json({
            success: false,
            message: "Appointment is already cancelled",
        });
    }


    // ==========================================
    // CANCEL APPOINTMENT
    // ==========================================

    appointment.cancelled = true;


    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    if (appointment.paymentStatus === "paid") {

        // Paid appointment → Refund
        appointment.paymentStatus = "refunded";

    }

    // If paymentStatus is pending,
    // it remains pending.


    await appointment.save();


    console.log("Payment after:", appointment.paymentStatus);
    console.log("Cancelled after:", appointment.cancelled);


    return res.status(200).json({
        success: true,
        message:
            appointment.paymentStatus === "refunded"
                ? "Appointment cancelled and payment refunded"
                : "Appointment cancelled successfully",

        appointment,
        paymentStatus: appointment.paymentStatus,
        cancelled: appointment.cancelled,
    });
});

// =====================================================
// COMPLETE APPOINTMENT
// Doctor completes an appointment
// =====================================================

const completeAppointment = asyncHandler(async (req, res) => {

    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({
            success: false,
            message: "Appointment ID is required"
        });
    }

    const appointment =
        await appointmentModel.findById(appointmentId);

    if (!appointment) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found"
        });
    }

    // Doctor confirms appointment
    appointment.completed = true;

    // Doctor has confirmed -> cash mode
    appointment.confirmed = true;
    appointment.paymentStatus = "cash";

    await appointment.save();

    return res.status(200).json({
        success: true,
        message: "Appointment completed successfully",
        appointment
    });

});

export { changeAvailability, doctorList , loginDoctor , getCurrentDoctor , logoutDoctor , cancelDoctorAppointment , completeAppointment , getDoctorAppointments };