import express from "express";

import {
    doctorList,
    loginDoctor,
    getCurrentDoctor,
    logoutDoctor,
    getDoctorAppointments,
    cancelDoctorAppointment,
    completeAppointment,
    acceptDoctorAppointment,
    getDoctorDashboard
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
    "/accept-appointment",
    verifyDoctorJWT,
    acceptDoctorAppointment
);

doctorRouter.post(
    "/cancel-appointment",
    verifyDoctorJWT,
    cancelDoctorAppointment
);

doctorRouter.post("/complete-appointment", verifyDoctorJWT, completeAppointment);

doctorRouter.get("/doctor-dashboard", verifyDoctorJWT, getDoctorDashboard);

export default doctorRouter;