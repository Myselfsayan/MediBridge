import {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    currentAdmin,
    logoutAdmin
} from "../controllers/admin.controller.js";

import { changeAvailability } from "../controllers/doctor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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
    verifyJWT,
    currentAdmin
);


// ==========================================
// ADD DOCTOR
// ==========================================

adminRouter.post(
    "/add-doctor",
    verifyJWT,
    upload.single("image"),
    addDoctor
);


// ==========================================
// ALL DOCTORS
// ==========================================

adminRouter.post(
    "/all-doctors",
    verifyJWT,
    allDoctors
);


// ==========================================
// CHANGE AVAILABILITY
// ==========================================

adminRouter.post(
    "/change-availability",
    verifyJWT,
    changeAvailability
);


// ==========================================
// ALL APPOINTMENTS
// ==========================================

adminRouter.get(
    "/appointments",
    verifyJWT,
    appointmentsAdmin
);

adminRouter.post(
    "/logout",
    verifyJWT,
    logoutAdmin
);


export default adminRouter;