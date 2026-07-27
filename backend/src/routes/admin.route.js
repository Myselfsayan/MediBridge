import {addDoctor , loginAdmin} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import express from "express";
import {upload} from "../middlewares/multer.middleware.js";

const adminRouter = express.Router();

adminRouter.post('/add-doctor',upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);

export default adminRouter;
