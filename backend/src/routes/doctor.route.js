import express from "express";

import {
    doctorList,
    loginDoctor,
    getCurrentDoctor,
    logoutDoctor,
    getDoctorAppointments,
    cancelDoctorAppointment,
    completeAppointment
} from "../controllers/doctor.controller.js";

import {
    verifyDoctorJWT
} from "../middlewares/auth.middleware.js";

const doctorRouter = express.Router();

doctorRouter.get(
    "/list",
    doctorList
);

doctorRouter.post(
    "/login",
    loginDoctor
);

doctorRouter.get(
    "/current-doctor",
    verifyDoctorJWT,
    getCurrentDoctor
);

doctorRouter.get(
    "/appointments",
    verifyDoctorJWT,
    getDoctorAppointments
);

doctorRouter.post(
    "/logout",
    verifyDoctorJWT,
    logoutDoctor
);

doctorRouter.post(
    "/cancel-appointment",
    verifyDoctorJWT,
    cancelDoctorAppointment
);

doctorRouter.post("/complete-appointment", verifyDoctorJWT, completeAppointment);

doctorRouter.post("/doctor-dashboard", verifyDoctorJWT, getDoctorAppointments);

export default doctorRouter;