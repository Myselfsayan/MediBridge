import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";
import { 
    LayoutDashboard, 
    CalendarDays, 
    UserPlus, 
    Users, 
    User, 
    ShieldCheck, 
    Stethoscope 
} from "lucide-react";

function Sidebar() {
    const { isAdminLoggedIn } = useContext(AdminContext);
    const { isDoctorLoggedIn } = useContext(DoctorContext);

    const baseNavLinkClass = ({ isActive }) =>
        `flex items-center gap-3 py-3 px-4 sm:px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isActive
                ? "bg-primary text-white shadow-sm shadow-primary/25 font-bold"
                : "text-slate-600 hover:text-primary hover:bg-cyan-50/60"
        }`;

    return (
        <aside className="w-20 md:w-64 shrink-0 min-h-[calc(100vh-61px)] bg-white border-r border-slate-200/80 p-3 sm:p-4 space-y-6">
            {/* Section label */}
            <div className="hidden md:block px-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {isAdminLoggedIn ? "Administrator Menu" : "Doctor Portal"}
                </span>
            </div>

            {/* ADMIN LINKS */}
            {isAdminLoggedIn && (
                <ul className="space-y-1.5">
                    <li>
                        <NavLink to="/admin-dashboard" className={baseNavLinkClass}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            <span className="hidden md:inline">Dashboard</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/all-appointments" className={baseNavLinkClass}>
                            <CalendarDays className="w-5 h-5 shrink-0" />
                            <span className="hidden md:inline">All Bookings</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/add-doctor" className={baseNavLinkClass}>
                            <UserPlus className="w-5 h-5 shrink-0" />
                            <span className="hidden md:inline">Add Doctor</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/doctor-list" className={baseNavLinkClass}>
                            <Users className="w-5 h-5 shrink-0" />
                            <span className="hidden md:inline">Doctor Directory</span>
                        </NavLink>
                    </li>
                </ul>
            )}

            {/* DOCTOR LINKS */}
            {isDoctorLoggedIn && (
                <ul className="space-y-1.5">
                    <li>
                        <NavLink to="/doctor-dashboard" className={baseNavLinkClass}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            <span className="hidden md:inline">My Overview</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/doctor-appointments" className={baseNavLinkClass}>
                            <CalendarDays className="w-5 h-5 shrink-0" />
                            <span className="hidden md:inline">My Patients & Slots</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/doctor-profile" className={baseNavLinkClass}>
                            <User className="w-5 h-5 shrink-0" />
                            <span className="hidden md:inline">Doctor Profile</span>
                        </NavLink>
                    </li>
                </ul>
            )}
        </aside>
    );
}

export default Sidebar;