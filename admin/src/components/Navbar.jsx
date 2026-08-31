import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    // ==========================================
    // ADMIN CONTEXT
    // ==========================================

    const {
        isAdminLoggedIn,
        logoutAdmin
    } = useContext(AdminContext);


    // ==========================================
    // DOCTOR CONTEXT
    // ==========================================

    const {
        isDoctorLoggedIn,
        logoutDoctor
    } = useContext(DoctorContext);


    const navigate = useNavigate();


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = async () => {

        // ==========================================
        // ADMIN LOGOUT
        // ==========================================

        if (isAdminLoggedIn) {

            await logoutAdmin();

            navigate("/login");

            return;
        }


        // ==========================================
        // DOCTOR LOGOUT
        // ==========================================

        if (isDoctorLoggedIn) {

            await logoutDoctor();

            navigate("/login");

            return;
        }

    };


    // ==========================================
    // ROLE
    // ==========================================

    const role = isAdminLoggedIn
        ? "Admin"
        : isDoctorLoggedIn
            ? "Doctor"
            : "";


    return (

        <div className="flex justify-between items-center px-4 sm:px-10 py-3 bg-white border-b border-slate-200 shadow-sm">


            {/* ==========================================
                LOGO + ROLE
            ========================================== */}

            <div className="flex items-center gap-2 text-xs">

                <img
                    className="w-36 sm:w-40 cursor-pointer"
                    src={assets.admin_logo}
                    alt="MediBridge"
                />


                {/* ROLE */}

                {(isAdminLoggedIn || isDoctorLoggedIn) && (

                    <p className="bg-cyan-50 text-primary border border-primary/20 rounded-lg px-3 py-1 text-xs font-medium">

                        {role}

                    </p>

                )}

            </div>


            {/* ==========================================
                LOGOUT BUTTON
            ========================================== */}

            {(isAdminLoggedIn || isDoctorLoggedIn) && (

                <button
                    className="bg-primary hover:bg-cyan-700 text-white text-sm px-6 py-2.5 rounded-lg cursor-pointer transition font-medium"
                    onClick={logout}
                >

                    Logout

                </button>

            )}

        </div>

    );
};

export default Navbar;