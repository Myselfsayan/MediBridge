import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";

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


export { changeAvailability, doctorList };