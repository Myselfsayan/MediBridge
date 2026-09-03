import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import appointmentModel from "../models/appointment.model.js";
import {
    accessCookieOptions,
    refreshCookieOptions
} from "../utils/constant.js";

const changeAvailability = asyncHandler(async (req, res) => {
    const { doctorId } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
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

    // Clear doctor authentication cookies
    res.clearCookie("doctorAccessToken", accessCookieOptions);
    res.clearCookie("doctorRefreshToken", refreshCookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Doctor logged out successfully"
        )
    );
});

const getDoctorAppointments = asyncHandler(
    async (req, res) => {

        // Doctor is already verified by verifyDoctorJWT
        const doctorId = req.doctor._id;

        // Get all appointments belonging to this doctor
        const appointments = await appointmentModel
            .find({ docId: doctorId })
            .sort({ createdAt: -1 })
            .lean();

        // GET CURRENT USER PROFILE FOR EACH APPOINTMENT

        const updatedAppointments = await Promise.all(
            appointments.map(async (appointment) => {

                const currentUser = await User
                    .findById(appointment.userId)
                    .select("name image dob")
                    .lean();

                // If user still exists, use CURRENT profile
                if (currentUser) {

                    appointment.userData = {
                        ...appointment.userData,
                        name: currentUser.name,
                        image: currentUser.image,
                        dob: currentUser.dob
                    };

                }

                return appointment;
            })
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    appointments: updatedAppointments
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

    // Send tokens in HTTP-only cookies
    return res
        .cookie("doctorAccessToken", accessToken, accessCookieOptions)
        .cookie("doctorRefreshToken", refreshToken, refreshCookieOptions)
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
// DOCTOR CANCEL APPOINTMENT
// pending → pending
// paid → refunded

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


    // ==========================================
    // RELEASE DOCTOR SLOT
    // ==========================================

    const { docId, slotDate, slotTime } = appointment;
    const doctorData = await Doctor.findById(docId);

    if (doctorData) {
        const slots_booked = doctorData.slots_booked;
        const bookedSlots = slots_booked.get(slotDate);
        if (bookedSlots) {
            const normalizeSlot = (t) => (t ? String(t).replace(/[\u202F\u00A0]/g, " ").trim().toUpperCase() : "");
            const cleanSlotTime = slotTime ? String(slotTime).replace(/[\u202F\u00A0]/g, " ").trim() : "";
            const updatedSlots = bookedSlots.filter(
                (slot) => normalizeSlot(slot) !== normalizeSlot(cleanSlotTime)
            );
            slots_booked.set(slotDate, updatedSlots);
        }

        await Doctor.findByIdAndUpdate(
            docId,
            { slots_booked }
        );
    }


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
// COMPLETE APPOINTMENT
// Doctor completes an appointment

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

// ACCEPT APPOINTMENT
// Doctor accepts/confirms an appointment

const acceptDoctorAppointment = asyncHandler(async (req, res) => {

    const { appointmentId } = req.body;
    const doctorId = req.doctor._id;

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

    // Verify appointment belongs to this doctor
    if (appointment.docId.toString() !== doctorId.toString()) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized action: Appointment does not belong to this doctor",
        });
    }

    if (appointment.cancelled) {
        return res.status(400).json({
            success: false,
            message: "Cannot accept a cancelled appointment",
        });
    }

    // Doctor accepts appointment
    appointment.doctorConfirmed = true;

    // Pending payment means user will pay cash
    if (appointment.paymentStatus === "pending") {
        appointment.paymentStatus = "cash";
    }

    await appointment.save();

    return res.status(200).json({
        success: true,
        message: "Appointment accepted successfully",
        appointment,
        doctorConfirmed: appointment.doctorConfirmed,
        paymentStatus: appointment.paymentStatus,
    });
});
// DOCTOR DASHBOARD
const getDoctorDashboard = asyncHandler(async (req, res) => {

    // Doctor is already verified by verifyDoctorJWT
    const doctorId = req.doctor._id;

    // Get all appointments belonging to this doctor
    const appointments = await appointmentModel
        .find({ docId: doctorId })
        .sort({ createdAt: -1 });


    // ==========================================
    // CALCULATE TOTAL EARNINGS
    // ==========================================

    let earnings = 0;

    appointments.forEach((item) => {

        // Do not count cancelled/refunded appointments
        if (item.cancelled) {
            return;
        }

        // Online payment completed
        if (item.paymentStatus === "paid") {
            earnings += item.amount;
        }

        // Cash payment received after doctor completes appointment
        else if (item.paymentStatus === "cash") {
            earnings += item.amount;
        }
    });


    // ==========================================
    // CALCULATE UNIQUE PATIENTS
    // ==========================================

    const patients = [];

    appointments.forEach((item) => {

        const userId = item.userId?.toString();

        if (userId && !patients.includes(userId)) {
            patients.push(userId);
        }
    });


    // ==========================================
    // GET CURRENT USER DATA
    // ==========================================

    const latestAppointments = await Promise.all(
        appointments.slice(0, 5).map(async (item) => {

            const appointment = item.toObject();

            const currentUser = await User
                .findById(item.userId)
                .select("name image");

            if (currentUser) {
                appointment.userData = {
                    ...appointment.userData,
                    name: currentUser.name,
                    image: currentUser.image
                };
            }

            return appointment;
        })
    );


    // ==========================================
    // DASHBOARD DATA
    // ==========================================

    const dashData = {
        earnings,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments
    };


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json(
        new ApiResponse(
            200,
            dashData,
            "Doctor dashboard data fetched successfully"
        )
    );
});
// API to get doctor profile for Doctor Panel
const doctorProfile = asyncHandler(async (req, res) => {

    // Doctor is already verified by verifyDoctorJWT
    const doctorId = req.doctor._id;

    const profileData = await Doctor
        .findById(doctorId)
        .select("-password");

    if (!profileData) {
        return res.status(404).json(
            new ApiResponse(
                404,
                null,
                "Doctor profile not found"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profileData,
            "Doctor profile fetched successfully"
        )
    );
});
// API to update doctor profile data from Doctor Panel

const updateDoctorProfile = asyncHandler(async (req, res) => {

    // Doctor is already verified by verifyDoctorJWT
    const doctorId = req.doctor._id;

    const {
        about,
        fees,
        address,
        available
    } = req.body;


    const updatedDoctor = await Doctor.findByIdAndUpdate(
        doctorId,
        {
            about,
            fees,
            address,
            available
        },
        {
            new: true
        }
    ).select("-password");


    if (!updatedDoctor) {
        return res.status(404).json(
            new ApiResponse(
                404,
                null,
                "Doctor profile not found"
            )
        );
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            updatedDoctor,
            "Doctor profile updated successfully"
        )
    );
});

export { changeAvailability , 
        doctorList , 
        loginDoctor , 
        getCurrentDoctor , 
        updateDoctorProfile ,
        logoutDoctor , 
        cancelDoctorAppointment , 
        completeAppointment , 
        getDoctorAppointments , 
        acceptDoctorAppointment , 
        getDoctorDashboard , 
        doctorProfile
    };