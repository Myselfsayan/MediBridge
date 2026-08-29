import {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    currentAdmin,
    logoutAdmin,
    cancelAppointmentAdmin
} from "../controllers/admin.controller.js";

import { changeAvailability } from "../controllers/doctor.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";

const adminRouter = express.Router();


// ==========================================
// ADMIN LOGIN
// ==========================================

adminRouter.post(
    "/login",
    loginAdmin
);


// ==========================================
// CURRENT ADMIN
// ==========================================

adminRouter.get(
    "/current-admin",
    verifyAdminJWT,
    currentAdmin
);


// ==========================================
// ADD DOCTOR
// ==========================================

adminRouter.post(
    "/add-doctor",
    verifyAdminJWT,
    upload.single("image"),
    addDoctor
);


// ==========================================
// ALL DOCTORS
// ==========================================

adminRouter.post(
    "/all-doctors",
    verifyAdminJWT,
    allDoctors
);


// ==========================================
// CHANGE AVAILABILITY
// ==========================================

adminRouter.post(
    "/change-availability",
    verifyAdminJWT,
    changeAvailability
);


// ==========================================
// ALL APPOINTMENTS
// ==========================================

adminRouter.get(
    "/appointments",
    verifyAdminJWT,
    appointmentsAdmin
);

adminRouter.post(
    "/logout",
    verifyAdminJWT,
    logoutAdmin
);

adminRouter.post(
    "/cancel-appointment",
    verifyAdminJWT,
    cancelAppointmentAdmin
);


export default adminRouter;