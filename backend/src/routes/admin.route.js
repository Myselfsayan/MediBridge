import {addDoctor , loginAdmin , allDoctors } from "../controllers/admin.controller.js";
import { changeAvailability } from "../controllers/doctor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import express from "express";
import {upload} from "../middlewares/multer.middleware.js";

const adminRouter = express.Router();

adminRouter.post('/add-doctor',verifyJWT,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-doctors',verifyJWT,allDoctors);
adminRouter.post('/change-availability',verifyJWT,changeAvailability);

export default adminRouter;
