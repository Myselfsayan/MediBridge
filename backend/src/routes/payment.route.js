import express from "express";

import {
    paymentSuccess,
    paymentFailed,
    paymentRefunded,
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/success", paymentSuccess);

paymentRouter.post("/failed", paymentFailed);

paymentRouter.post("/refund", paymentRefunded);

export default paymentRouter;