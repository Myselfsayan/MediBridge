import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        // ==========================================
        // USER DETAILS
        // ==========================================
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        userData: {
            type: Object,
            required: true
        },


        // ==========================================
        // DOCTOR DETAILS
        // ==========================================
        docId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        docData: {
            type: Object,
            required: true
        },


        // ==========================================
        // APPOINTMENT DETAILS
        // ==========================================
        amount: {
            type: Number,
            required: true
        },
        confirmed: {
            type: Boolean,
            default: false
        },

        slotDate: {
            type: String,
            required: true
        },

        slotTime: {
            type: String,
            required: true
        },

        date: {
            type: Number,
            required: true
        },


        // ==========================================
        // APPOINTMENT STATUS
        // ==========================================
        cancelled: {
            type: Boolean,
            default: false
        },


        // ==========================================
        // PAYMENT STATUS
        // ==========================================
        paymentStatus: {
    type: String,
    default: "pending",
    enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "cash"
    ]
},


    },
    {
        timestamps: true
    }
);


const appointmentModel = mongoose.model(
    "Appointment",
    appointmentSchema
);

export default appointmentModel;