import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { 
    Mail, 
    Lock, 
    User, 
    Eye, 
    EyeOff, 
    ArrowRight 
} from "lucide-react";

function Login() {
    const { backendUrl, isLoggedIn, checkAuth } = useContext(AppContext);
    const [state, setState] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const cleanEmail = email.trim();

            if (state === "Sign Up") {
                if (password !== confirmPassword) {
                    toast.error("Passwords do not match");
                    setLoading(false);
                    return;
                }

                const { data } = await axios.post(
                    `${backendUrl}/api/v1/user/register`,
                    {
                        name,
                        email: cleanEmail,
                        password,
                    },
                    { withCredentials: true }
                );

                if (data.success) {
                    toast.success("Account created successfully!");
                    await checkAuth();
                    navigate("/");
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(
                    `${backendUrl}/api/v1/user/login`,
                    {
                        email: cleanEmail,
                        password,
                    },
                    { withCredentials: true }
                );

                if (data.success) {
                    toast.success("Welcome back to MediBridge!");
                    await checkAuth();
                    navigate("/");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error(
                error.response?.data?.message ||
                "Authentication failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
            <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-cyan-700 via-teal-600 to-cyan-800 px-8 pt-8 pb-6 text-white text-center">
                    <div className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl mb-3.5 shadow-md">
                        <img 
                            src={assets.logo} 
                            alt="MediBridge" 
                            className="h-6 w-auto object-contain" 
                        />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        {state === "Sign Up" ? "Create an Account" : "Welcome Back"}
                    </h1>
                    <p className="text-xs text-cyan-100 mt-1 max-w-xs mx-auto">
                        {state === "Sign Up"
                            ? "Join MediBridge to book and manage medical appointments"
                            : "Sign in to access your doctor consultations and health records"}
                    </p>

                    {/* Tab Switcher */}
                    <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-2xl mt-6 border border-white/10">
                        <button
                            type="button"
                            onClick={() => setState("Login")}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                state === "Login"
                                    ? "bg-white text-cyan-900 shadow-sm"
                                    : "text-white/80 hover:text-white"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setState("Sign Up")}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                state === "Sign Up"
                                    ? "bg-white text-cyan-900 shadow-sm"
                                    : "text-white/80 hover:text-white"
                            }`}
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={onSubmitHandler} className="p-6 sm:p-8 space-y-4">
                    {state === "Sign Up" && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Full Name
                            </label>
                            <div className="relative flex items-center">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="patient@medibridge.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {state === "Sign Up" && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Confirm Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary text-white rounded-xl font-bold shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <span>{loading ? "Processing..." : state === "Sign Up" ? "Create Account" : "Sign In"}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-2 text-center">
                        <p className="text-xs text-slate-500">
                            {state === "Sign Up" ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setState("Login")}
                                        className="text-primary font-bold hover:underline cursor-pointer"
                                    >
                                        Sign In
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account yet?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setState("Sign Up")}
                                        className="text-primary font-bold hover:underline cursor-pointer"
                                    >
                                        Create one now
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;