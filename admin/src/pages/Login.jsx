import { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [state, setState] = useState("Admin");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        backendUrl,
        checkAdminAuth
    } = useContext(AdminContext);

    const {
        checkDoctorAuth
    } = useContext(DoctorContext);

    const navigate = useNavigate();


    // ==========================================
    // LOGIN HANDLER
    // ==========================================

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try {

            const cleanEmail = email.trim();

            // ==========================================
            // ADMIN LOGIN
            // ==========================================

            if (state === "Admin") {

                const { data } = await axios.post(
                    `${backendUrl}/api/v1/admin/login`,
                    {
                        email: cleanEmail,
                        password: password
                    },
                    {
                        withCredentials: true
                    }
                );


                if (data.success) {

                    console.log(
                        "Admin login successful:",
                        data
                    );

                    toast.success(data.message);

                    // Check admin authentication
                    await checkAdminAuth();

                    // Go to admin dashboard
                    navigate(
                        "/admin-dashboard",
                        {
                            replace: true
                        }
                    );

                } else {

                    toast.error(
                        data.message ||
                        "Admin login failed"
                    );

                }

            }

            // ==========================================
            // DOCTOR LOGIN
            // ==========================================

            else {

                console.log(
                    "================================="
                );

                console.log(
                    "STARTING DOCTOR LOGIN"
                );

                console.log(
                    "Email:",
                    cleanEmail
                );

                console.log(
                    "Backend URL:",
                    backendUrl
                );

                console.log(
                    "================================="
                );


                const { data } = await axios.post(
                    `${backendUrl}/api/v1/doctor/login`,
                    {
                        email: cleanEmail,
                        password: password
                    },
                    {
                        withCredentials: true
                    }
                );


                console.log(
                    "================================="
                );

                console.log(
                    "DOCTOR LOGIN RESPONSE:",
                    data
                );

                console.log(
                    "================================="
                );


                // ==========================================
                // DOCTOR LOGIN SUCCESS
                // ==========================================

                if (data.success) {

                    console.log(
                        "Doctor login successful"
                    );

                    console.log(
                        "Doctor:",
                        data.data?.doctor
                    );


                    toast.success(
                        data.message ||
                        "Doctor logged in successfully"
                    );


                    // ==========================================
                    // CHECK DOCTOR AUTHENTICATION
                    // ==========================================

                    const authResult =
                        await checkDoctorAuth();


                    console.log(
                        "Doctor authentication checked:",
                        authResult
                    );


                    // ==========================================
                    // GO TO DOCTOR DASHBOARD
                    // ==========================================

                    navigate(
                        "/doctor-dashboard",
                        {
                            replace: true
                        }
                    );

                } else {

                    toast.error(
                        data.message ||
                        "Doctor login failed"
                    );

                }

            }

        } catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "LOGIN ERROR"
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Response:",
                error.response?.data
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "================================="
            );


            toast.error(
                error.response?.data?.message ||
                "Invalid credentials"
            );

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <form
            onSubmit={onSubmitHandler}
            className="min-h-[80vh] flex items-center bg-slate-50"
        >

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    m-auto
                    items-start
                    p-8
                    min-w-[340px]
                    sm:min-w-96
                    bg-white
                    rounded-2xl
                    shadow-xl
                    border
                    border-slate-100
                    text-slate-600
                    text-sm
                "
            >

                {/* ==========================================
                    TITLE
                ========================================== */}

                <p
                    className="
                        text-2xl
                        font-semibold
                        m-auto
                        text-slate-900
                    "
                >

                    <span className="text-primary">
                        {state}
                    </span>

                    {" "}Login

                </p>


                {/* ==========================================
                    EMAIL
                ========================================== */}

                <div className="w-full mt-4">

                    <p
                        className="
                            mb-1
                            font-medium
                            text-slate-700
                        "
                    >
                        Email
                    </p>


                    <input
                        className="
                            border
                            border-slate-300
                            rounded-lg
                            w-full
                            px-4
                            py-2.5
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/20
                            focus:border-primary
                            transition
                        "
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                </div>


                {/* ==========================================
                    PASSWORD
                ========================================== */}

                <div className="w-full mt-2">

                    <p
                        className="
                            mb-1
                            font-medium
                            text-slate-700
                        "
                    >
                        Password
                    </p>


                    <input
                        className="
                            border
                            border-slate-300
                            rounded-lg
                            w-full
                            px-4
                            py-2.5
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/20
                            focus:border-primary
                            transition
                        "
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                </div>


                {/* ==========================================
                    LOGIN BUTTON
                ========================================== */}

                <button
                    type="submit"
                    className="
                        bg-primary
                        hover:bg-cyan-700
                        text-white
                        w-full
                        py-2.5
                        mt-4
                        rounded-lg
                        text-base
                        font-medium
                        transition
                    "
                >
                    Login
                </button>


                {/* ==========================================
                    SWITCH LOGIN
                ========================================== */}

                {state === "Admin" ? (

                    <p
                        className="
                            mt-2
                            w-full
                            text-center
                        "
                    >

                        Doctor Login?{" "}

                        <span
                            onClick={() =>
                                setState("Doctor")
                            }
                            className="
                                text-primary
                                hover:text-cyan-700
                                underline
                                cursor-pointer
                            "
                        >
                            Click here
                        </span>

                    </p>

                ) : (

                    <p
                        className="
                            mt-2
                            w-full
                            text-center
                        "
                    >

                        Admin Login?{" "}

                        <span
                            onClick={() =>
                                setState("Admin")
                            }
                            className="
                                text-primary
                                hover:text-cyan-700
                                underline
                                cursor-pointer
                            "
                        >
                            Click here
                        </span>

                    </p>

                )}

            </div>

        </form>

    );

};

export default Login;