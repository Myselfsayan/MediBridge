import { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ShieldCheck, 
    Stethoscope, 
    ArrowRight,
    KeyRound
} from "lucide-react";
import { assets } from "../assets/assets.js";

const Login = () => {
    const [state, setState] = useState("Admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { backendUrl, checkAdminAuth } = useContext(AdminContext);
    const { checkDoctorAuth } = useContext(DoctorContext);

    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const cleanEmail = email.trim();

            if (state === "Admin") {
                const { data } = await axios.post(
                    `${backendUrl}/api/v1/admin/login`,
                    {
                        email: cleanEmail,
                        password: password
                    },
                    { withCredentials: true }
                );

                if (data.success) {
                    toast.success(data.message || "Admin authenticated successfully");
                    await checkAdminAuth();
                    navigate("/admin-dashboard", { replace: true });
                } else {
                    toast.error(data.message || "Admin login failed");
                }
            } else {
                const { data } = await axios.post(
                    `${backendUrl}/api/v1/doctor/login`,
                    {
                        email: cleanEmail,
                        password: password
                    },
                    {
                        withCredentials: true,
                        secure: true,
                        sameSite: "none"
                    }
                );

                if (data.success) {
                    toast.success(data.message || "Doctor logged in successfully");
                    await checkDoctorAuth();
                    navigate("/doctor-dashboard", { replace: true });
                } else {
                    toast.error(data.message || "Doctor login failed");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/40 to-slate-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 px-8 pt-8 pb-6 text-white text-center">
                    <div className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl mb-3.5 shadow-md">
                        <img 
                            src={assets.admin_logo} 
                            alt="MediBridge" 
                            className="h-6 w-auto object-contain" 
                        />
                    </div>
                    
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        {state === "Admin" ? "Administrator Portal" : "Practitioner Portal"}
                    </h1>
                    <p className="text-xs text-cyan-100 mt-1">
                        Secure MediBridge Management Console
                    </p>

                    {/* Portal Switcher Tabs */}
                    <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-2xl mt-6 border border-white/10">
                        <button
                            type="button"
                            onClick={() => setState("Admin")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                state === "Admin"
                                    ? "bg-white text-cyan-900 shadow-sm"
                                    : "text-white/80 hover:text-white"
                            }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Admin Login</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setState("Doctor")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                state === "Doctor"
                                    ? "bg-white text-cyan-900 shadow-sm"
                                    : "text-white/80 hover:text-white"
                            }`}
                        >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Doctor Login</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={onSubmitHandler} className="p-6 sm:p-8 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Authorized Email
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={state === "Admin" ? "admin@medibridge.com" : "doctor@medibridge.com"}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary text-white rounded-xl font-bold shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <span>{loading ? "Authenticating..." : `Sign In as ${state}`}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-2 text-center">
                        <p className="text-xs text-slate-500">
                            {state === "Admin" ? (
                                <>
                                    Looking for practitioner login?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setState("Doctor")}
                                        className="text-primary font-bold hover:underline cursor-pointer"
                                    >
                                        Doctor Portal
                                    </button>
                                </>
                            ) : (
                                <>
                                    Looking for administrator access?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setState("Admin")}
                                        className="text-primary font-bold hover:underline cursor-pointer"
                                    >
                                        Admin Portal
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Restricted to authorized personnel only</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;