import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Stethoscope, UserCircle } from "lucide-react";

const Navbar = () => {
    const { isAdminLoggedIn, logoutAdmin } = useContext(AdminContext);
    const { isDoctorLoggedIn, logoutDoctor } = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = async () => {
        if (isAdminLoggedIn) {
            await logoutAdmin();
            navigate("/login");
            return;
        }

        if (isDoctorLoggedIn) {
            await logoutDoctor();
            navigate("/login");
            return;
        }
    };

    const role = isAdminLoggedIn ? "Admin Portal" : isDoctorLoggedIn ? "Doctor Portal" : "";

    return (
        <header className="sticky top-0 z-40 flex justify-between items-center px-4 sm:px-8 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            {/* Logo & Portal Role Badge */}
            <div className="flex items-center gap-3">
                <img
                    className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
                    src={assets.admin_logo}
                    alt="MediBridge Portal"
                    onClick={() => navigate("/")}
                />

                {(isAdminLoggedIn || isDoctorLoggedIn) && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs border bg-cyan-50 text-cyan-800 border-cyan-200">
                        {isAdminLoggedIn ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        ) : (
                            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        )}
                        <span>{role}</span>
                    </div>
                )}
            </div>

            {/* Actions & Logout */}
            <div className="flex items-center gap-3">
                {(isAdminLoggedIn || isDoctorLoggedIn) && (
                    <button
                        onClick={logout}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs sm:text-sm px-4 py-2 rounded-xl transition-all font-semibold cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;