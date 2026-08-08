import express from "express";
import { registerUser , loginUser , logoutUser , getCurrentUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout",verifyJWT, logoutUser);
userRouter.get("/current-user",verifyJWT,getCurrentUser);

export default userRouter;