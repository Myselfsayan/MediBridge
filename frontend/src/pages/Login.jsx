import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
    const [state, setState] = useState("Sign Up");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const { isLoggedIn, setIsLoggedIn, backendUrl, checkAuth } =
        useContext(AppContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (state === "Sign Up") {
                const { data } = await axios.post(
                    `${backendUrl}/api/v1/user/register`,
                    {
                        name,
                        email,
                        password,
                    },
                    {
                        withCredentials: true,
                    }
                );

                // console.log(data);
                toast.success(data.message);

                // Registration successful
                setState("Login");
            } else {
                const { data } = await axios.post(
                    `${backendUrl}/api/v1/user/login`,
                    {
                        email,
                        password,
                    },
                    {
                        withCredentials: true,
                    }
                );

                console.log(data);
                toast.success(data.message);

                // Login successful — fetch user data
                await checkAuth();
                navigate("/");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );
            console.log(
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cyan-50/50 to-white">
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-4 m-auto items-start p-10 min-w-[340px] sm:min-w-96 bg-white border border-slate-100 rounded-2xl text-slate-600 text-sm shadow-xl"
            >
                <div className="w-full text-center mb-2">
                    <h1 className="text-3xl font-bold text-primary mb-1">MediBridge</h1>
                    <p className="text-slate-500 text-xs">Healthcare Management System</p>
                </div>

                <p className="text-2xl font-semibold text-slate-900">
                    {state === "Sign Up"
                        ? "Create Account"
                        : "Login"}
                </p>

                <p>
                    Please{" "}
                    {state === "Sign Up"
                        ? "sign up"
                        : "log in"}{" "}
                    to book appointment
                </p>

                {state === "Sign Up" && (
                    <div className="w-full">
                        <p className="mb-1 font-medium">Full Name</p>

                        <input
                            className="border border-slate-300 rounded-lg w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            type="text"
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            value={name}
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <p className="mb-1 font-medium">Email</p>

                    <input
                        className="border border-slate-300 rounded-lg w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        type="email"
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        value={email}
                        required
                    />
                </div>

                <div className="w-full">
                    <p className="mb-1 font-medium">Password</p>

                    <input
                        className="border border-slate-300 rounded-lg w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        type="password"
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        value={password}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary hover:bg-cyan-700 text-white w-full py-3 rounded-lg text-base font-medium transition shadow-md mt-2"
                >
                    {state === "Sign Up"
                        ? "Create Account"
                        : "Login"}
                </button>

                {state === "Sign Up" ? (
                    <p className="mt-2 w-full text-center">
                        Already have an account?{" "}
                        <span
                            onClick={() =>
                                setState("Login")
                            }
                            className="text-primary font-medium hover:text-cyan-700 underline cursor-pointer"
                        >
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className="mt-2 w-full text-center">
                        Create a new account?{" "}
                        <span
                            onClick={() =>
                                setState("Sign Up")
                            }
                            className="text-primary font-medium hover:text-cyan-700 underline cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
}

export default Login;