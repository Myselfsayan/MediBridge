import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const { isAdminLoggedIn, logoutAdmin } = useContext(AdminContext);

    const navigate = useNavigate();


    const logout = async () => {

        if (isAdminLoggedIn) {

            await logoutAdmin();

            navigate("/login");

        }

    };


    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 bg-white border-b border-slate-200 shadow-sm">

            <div className="flex items-center gap-2 text-xs">

                <img
                    className="w-36 sm:w-40 cursor-pointer"
                    src={assets.admin_logo}
                    alt="MediBridge"
                />

                <p className="bg-cyan-50 text-primary border border-primary/20 rounded-lg px-3 py-1 text-xs font-medium">
                    Admin
                </p>

            </div>


            <button
                className="bg-primary hover:bg-cyan-700 text-white text-sm px-6 py-2.5 rounded-lg cursor-pointer transition font-medium"
                onClick={logout}
            >
                Logout
            </button>

        </div>
    );
};

export default Navbar;