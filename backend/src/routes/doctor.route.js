import express from "express";
import { doctorList , loginDoctor } from "../controllers/doctor.controller.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.get("/login", loginDoctor);

export default doctorRouter;