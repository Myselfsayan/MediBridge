import { asyncHandler } from "../utils/asyncHandler.js";
import appointmentModel from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";


// =====================================================
// PAYMENT SUCCESS
// pending → paid
// =====================================================

const paymentSuccess = asyncHandler(async (req, res) => {

    console.log("🔥 PAYMENT SUCCESS CONTROLLER HIT");

    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({
            success: false,
            message: "Appointment ID is required",
        });
    }

    const appointment =
        await appointmentModel.findById(appointmentId);

    if (!appointment) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found",
        });
    }

    console.log(
        "Appointment before update:",
        appointment
    );

    // pending → paid
    appointment.paymentStatus = "paid";

    await appointment.save();

    console.log(
        "Payment status after update:",
        appointment.paymentStatus
    );

    return res.status(200).json({
        success: true,
        message: "Payment successful",
        appointment,
    });
});


// =====================================================
// PAYMENT FAILED
// pending → failed
// =====================================================

const paymentFailed = asyncHandler(async (req, res) => {

    console.log("❌ PAYMENT FAILED CONTROLLER HIT");

    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({
            success: false,
            message: "Appointment ID is required",
        });
    }

    const appointment =
        await appointmentModel.findById(appointmentId);

    if (!appointment) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found",
        });
    }

    console.log(
        "Payment status before update:",
        appointment.paymentStatus
    );

    // pending → failed
    appointment.paymentStatus = "failed";

    await appointment.save();

    console.log(
        "Payment status after update:",
        appointment.paymentStatus
    );

    return res.status(200).json({
        success: true,
        message: "Payment failed",
        appointment,
    });
});


// =====================================================
// APPOINTMENT CANCELLED / REFUND
// paid → refunded
// cancelled → true
// slot → available again
// =====================================================

const paymentRefunded = asyncHandler(async (req, res) => {

    console.log("🔄 PAYMENT REFUND CONTROLLER HIT");

    const { appointmentId } = req.body;


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


    console.log("=================================");
    console.log("REFUND REQUEST");
    console.log("Appointment ID:", appointmentId);
    console.log(
        "Payment status before refund:",
        appointment.paymentStatus
    );
    console.log(
        "Doctor ID:",
        appointment.docId
    );
    console.log(
        "Slot Date:",
        appointment.slotDate
    );
    console.log(
        "Slot Time:",
        appointment.slotTime
    );
    console.log("=================================");


    // ==========================================
    // CHECK PAYMENT STATUS
    // ==========================================

    if (appointment.paymentStatus !== "paid") {

        return res.status(400).json({
            success: false,
            message:
                "Refund is only available for paid appointments",
            paymentStatus:
                appointment.paymentStatus,
        });

    }


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
        "Booked slots before removing:",
        bookedSlots
    );


    // ==========================================
    // REMOVE CANCELLED SLOT
    // ==========================================

    const updatedSlots =
        bookedSlots.filter(
            (slot) =>
                slot !== appointment.slotTime
        );


    console.log(
        "Booked slots after removing:",
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
    // UPDATE APPOINTMENT
    // ==========================================

    // paid → refunded
    appointment.paymentStatus = "refunded";

    // appointment → cancelled
    appointment.cancelled = true;


    await appointment.save();


    console.log("=================================");
    console.log(
        "Payment status after refund:",
        appointment.paymentStatus
    );
    console.log(
        "Appointment cancelled:",
        appointment.cancelled
    );
    console.log(
        "Slot released:",
        appointment.slotTime
    );
    console.log("=================================");


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({

        success: true,

        message:
            "Payment refunded, appointment cancelled and slot released",

        paymentStatus:
            appointment.paymentStatus,

        cancelled:
            appointment.cancelled,

        appointment,

    });

});


// =====================================================
// EXPORT
// =====================================================

export {
    paymentSuccess,
    paymentFailed,
    paymentRefunded
};