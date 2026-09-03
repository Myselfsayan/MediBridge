import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Trust reverse proxy headers on Render
app.set("trust proxy", 1);

// ================= MIDDLEWARE =================

// Parse comma-separated CORS origins from env and include localhost fallbacks
const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:5175",
];

const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
    : [];

const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. curl, mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ================= ROUTES =================

app.use("/api/v1/status", (req, res) =>
    res.send("  Server is ready !!!")
);


import adminRouter from "./routes/admin.route.js";
import doctorRouter from "./routes/doctor.route.js";
import userRouter from "./routes/user.route.js";
import paymentRouter from "./routes/payment.route.js";


app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/payment", paymentRouter);

// ================= ERROR HANDLER =================
// Must be after all routes. Catches ApiError and other errors,
// returns JSON instead of Express 5's default HTML error page.

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        data: null,
    });
});


export { app };