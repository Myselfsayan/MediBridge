import mongoose from "mongoose";
import bcrypt from "bcrypt";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    image: {
      type: String,
      required: true,
    },

    speciality: {
      type: String,
      required: true,
    },

    degree: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    address: {
      line1: {
        type: String,
        required: true,
      },

      line2: {
        type: String,
        default: "",
      },
    },

    slots_booked: {
      type: Map,
      of: [String],
      default: {},
    },
    doctorConfirmed: {
    type: Boolean,
    default: false
  },
  },
  {
    timestamps: true,
  }
);

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

const doctorModel =
  mongoose.models.Doctor ||
  mongoose.model("Doctor", doctorSchema);


export { doctorModel as Doctor };
