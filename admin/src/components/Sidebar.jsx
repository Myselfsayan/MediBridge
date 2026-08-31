import { NavLink } from "react-router-dom";
import { useContext } from "react";

import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";

import { assets } from "../assets/assets.js";


function Sidebar() {

    // ==========================================
    // ADMIN CONTEXT
    // ==========================================

    const { isAdminLoggedIn } = useContext(AdminContext);


    // ==========================================
    // DOCTOR CONTEXT
    // ==========================================

    const { isDoctorLoggedIn } = useContext(DoctorContext);


    return (

        <div className="min-h-screen bg-white border-r border-slate-200">


            {/* =====================================================
                ADMIN SIDEBAR
            ===================================================== */}

            {isAdminLoggedIn && (

                <ul className="text-slate-600 mt-5">


                    {/* ==========================================
                        ADMIN DASHBOARD
                    ========================================== */}

                    <NavLink
                        to="/admin-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition hover:bg-slate-50 ${
                                isActive
                                    ? "bg-cyan-50 border-r-4 border-primary text-primary"
                                    : ""
                            }`
                        }
                    >

                        <img
                            src={assets.home_icon}
                            alt=""
                        />

                        <p>Dashboard</p>

                    </NavLink>


                    {/* ==========================================
                        ADMIN APPOINTMENTS
                    ========================================== */}

                    <NavLink
                        to="/all-appointments"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition hover:bg-slate-50 ${
                                isActive
                                    ? "bg-cyan-50 border-r-4 border-primary text-primary"
                                    : ""
                            }`
                        }
                    >

                        <img
                            src={assets.appointment_icon}
                            alt=""
                        />

                        <p>Appointments</p>

                    </NavLink>


                    {/* ==========================================
                        ADD DOCTOR
                    ========================================== */}

                    <NavLink
                        to="/add-doctor"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition hover:bg-slate-50 ${
                                isActive
                                    ? "bg-cyan-50 border-r-4 border-primary text-primary"
                                    : ""
                            }`
                        }
                    >

                        <img
                            src={assets.add_icon}
                            alt=""
                        />

                        <p>Add Doctor</p>

                    </NavLink>


                    {/* ==========================================
                        DOCTOR LIST
                    ========================================== */}

                    <NavLink
                        to="/doctor-list"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition hover:bg-slate-50 ${
                                isActive
                                    ? "bg-cyan-50 border-r-4 border-primary text-primary"
                                    : ""
                            }`
                        }
                    >

                        <img
                            src={assets.people_icon}
                            alt=""
                        />

                        <p>Doctor List</p>

                    </NavLink>

                </ul>

            )}


            {/* =====================================================
                DOCTOR SIDEBAR
            ===================================================== */}

            {isDoctorLoggedIn && (

                <ul className="text-slate-600 mt-5">


                    {/* ==========================================
                        DOCTOR DASHBOARD
                    ========================================== */}

                    <NavLink
                        to="/doctor-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition hover:bg-slate-50 ${
                                isActive
                                    ? "bg-cyan-50 border-r-4 border-primary text-primary"
                                    : ""
                            }`
                        }
                    >

                        <img
                            src={assets.home_icon}
                            alt=""
                        />

                        <p>Dashboard</p>

                    </NavLink>


                    {/* ==========================================
                        DOCTOR APPOINTMENTS
                    ========================================== */}

                    <NavLink
                        to="/doctor-appointments"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition hover:bg-slate-50 ${
                                isActive
                                    ? "bg-cyan-50 border-r-4 border-primary text-primary"
                                    : ""
                            }`
                        }
                    >

                        <img
                            src={assets.appointment_icon}
                            alt=""
                        />

                        <p>Appointments</p>

                    </NavLink>

                    {/* ==========================================
    DOCTOR PROFILE
========================================== */}

<NavLink
    to="/doctor-profile"
    className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition hover:bg-slate-50 ${
            isActive
                ? "bg-cyan-50 border-r-4 border-primary text-primary"
                : ""
        }`
    }
>
    <img
        src={assets.people_icon}
        alt=""
    />

    <p>Profile</p>

</NavLink>

                </ul>

            )}

        </div>

    );
}


export default Sidebar;