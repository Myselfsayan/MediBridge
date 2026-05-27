import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: [true, "Doctor name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50,
        },

        email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        index: true,
        },

        password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false,
        },

        image: {
        type: String,
        required: true,
        trim: true,
        },

        speciality: {
        type: String,
        required: true,
        trim: true,
        index: true,
        },

        degree: {
        type: String,
        required: true,
        trim: true,
        },

        experience: {
        type: Number,
        required: true,
        min: 0,
        },

        about: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
        },

        available: {
        type: Boolean,
        default: true,
        },

        fees: {
        type: Number,
        required: true,
        min: 0,
        },

        address: {
        line1: {
            type: String,
            required: true,
            trim: true,
        },

        line2: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        pincode: {
            type: String,
            required: true,
            trim: true,
        },
        },

        slots_booked: {
        type: Map,
        of: [String],
        default: {},
        },
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false,
    }
);

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;