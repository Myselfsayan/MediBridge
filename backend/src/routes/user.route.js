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
import { verifyUserJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout",verifyUserJWT, logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/current-user",verifyUserJWT,getCurrentUser);
userRouter.get("/profile",verifyUserJWT,getProfile);
userRouter.put("/profile-update",verifyUserJWT,upload.single("image"),updateProfile);
userRouter.post("/book-appointment",verifyUserJWT,bookAppointment);
userRouter.get("/appointments",verifyUserJWT,listAppointment);
userRouter.post("/cancel-appointment",verifyUserJWT,cancelAppointment);

export default userRouter;