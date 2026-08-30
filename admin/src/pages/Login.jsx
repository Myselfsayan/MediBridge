import { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [state, setState] = useState("Admin");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { backendUrl,  checkAdminAuth } = useContext(AdminContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {

            if (state === "Admin") {

                const { data } = await axios.post(
                    `${backendUrl}/api/v1/admin/login`,
                    {
                        email,
                        password
                    },
                    {
                        withCredentials: true
                    }
                );

                if (data.success) {
                    navigate("/admin-dashboard");
                    console.log("Admin login successful:", data);

                    toast.success(data.message);
                    await checkAdminAuth();

                    // No localStorage
                    // No aToken
                    // Token is stored in HTTP-only cookie

                } else {

                    toast.error(data.message);

                }

            } else {
                    const { data } = await axios.post(
                        backendUrl + "/api/v1/doctor/login",
                        {
                            email,
                            password
                        },
                        {
                            withCredentials: true
                        }
                    );

                    if (data.success) {
                        toast.success(data.message);
                        console.log(data);

                        // Don't store doctor token in localStorage.
                        // Backend has already set doctorAccessToken
                        // as an HTTP-only cookie.

                        navigate("/doctor-dashboard");
                    } else {
                        toast.error(data.message);
                    }
                }
        } catch (error) {

            console.log("Login error:", error.response?.data || error);

            toast.error(
                error.response?.data?.message ||
                "Invalid credentials"
            );
        }
    };


    return (
        <form
            onSubmit={onSubmitHandler}
            className="min-h-[80vh] flex items-center bg-slate-50"
        >

            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 bg-white rounded-2xl shadow-xl border border-slate-100 text-slate-600 text-sm">

                <p className="text-2xl font-semibold m-auto text-slate-900">
                    <span className="text-primary">
                        {state}
                    </span>{" "}
                    Login
                </p>


                <div className="w-full mt-4">

                    <p className="mb-1 font-medium text-slate-700">Email</p>

                    <input
                        className="border border-slate-300 rounded-lg w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />

                </div>


                <div className="w-full mt-2">

                    <p className="mb-1 font-medium text-slate-700">Password</p>

                    <input
                        className="border border-slate-300 rounded-lg w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />

                </div>


                <button
                    type="submit"
                    className="bg-primary hover:bg-cyan-700 text-white w-full py-2.5 mt-4 rounded-lg text-base font-medium transition"
                >
                    Login
                </button>


                {state === "Admin" ? (

                    <p className="mt-2 w-full text-center">
                        Doctor Login?{" "}

                        <span
                            onClick={() => setState("Doctor")}
                            className="text-primary hover:text-cyan-700 underline cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>

                ) : (

                    <p className="mt-2 w-full text-center">
                        Admin Login?{" "}

                        <span
                            onClick={() => setState("Admin")}
                            className="text-primary hover:text-cyan-700 underline cursor-pointer"
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