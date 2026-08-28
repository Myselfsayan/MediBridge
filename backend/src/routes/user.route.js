import express from "express";
import { registerUser , 
        loginUser ,
        logoutUser ,
        getCurrentUser ,
        getProfile ,
        updateProfile ,
        refreshAccessToken,
        bookAppointment,
        listAppointment,
        cancelAppointment} 
from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout",verifyJWT, logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/current-user",verifyJWT,getCurrentUser);
userRouter.get("/profile",verifyJWT,getProfile);
userRouter.put("/profile-update",verifyJWT,upload.single("image"),updateProfile);
userRouter.post("/book-appointment",verifyJWT,bookAppointment);
userRouter.get("/appointments",verifyJWT,listAppointment);
userRouter.post("/cancel-appointment",verifyJWT,cancelAppointment);

export default userRouter;