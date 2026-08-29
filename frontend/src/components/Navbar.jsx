import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const {
        isLoggedIn,
        setIsLoggedIn,
        setUserData,
        backendUrl,
        userData
    } = useContext(AppContext);

    const handleLogout = async () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);

            const { data } = await axios.post(
                `${backendUrl}/api/v1/user/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            if (data.success) {
                setIsLoggedIn(false);
                setUserData(null);
                setShowMenu(false);
                toast.success("Logged out successfully");
                navigate("/login", { replace: true });
            } else {
                toast.error(data.message || "Logout failed");
            }

        } catch (error) {
            console.error("Logout error:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to logout. Please try again."
            );
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="flex items-center justify-between py-4 mb-5 border-b border-slate-200">

            {/* Logo */}
            <img
                onClick={() => navigate("/")}
                className="w-44 cursor-pointer"
                src={assets.logo}
                alt="MediBridge"
            />

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-start gap-5 font-medium">

                <NavLink to="/">
                    <li className="py-1 text-slate-700 hover:text-primary transition-colors">
                        HOME
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

                <NavLink to="/all-doctors">
                    <li className="py-1 text-slate-700 hover:text-primary transition-colors">
                        ALL DOCTORS
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

                <NavLink to="/about">
                    <li className="py-1 text-slate-700 hover:text-primary transition-colors">
                        ABOUT
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

                <NavLink to="/contact">
                    <li className="py-1 text-slate-700 hover:text-primary transition-colors">
                        CONTACT
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

            </ul>

            <div className="flex items-center gap-4">

                {isLoggedIn ? (

                    <div className="flex items-center gap-2 cursor-pointer group relative">

                        <img
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                            src={userData?.image || assets.profile_pic}
                            alt="User avatar"
                        />

                        <img
                            className="w-2.5"
                            src={assets.dropdown_icon}
                            alt=""
                        />

                        {/* Dropdown */}
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-slate-600 z-20 hidden group-hover:block">

                            <div className="min-w-48 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col gap-4 p-4">

                                <p
                                    onClick={() => navigate("/my-profile")}
                                    className="hover:text-primary cursor-pointer transition-colors"
                                >
                                    My Profile
                                </p>

                                <p
                                    onClick={() => navigate("/my-appointments")}
                                    className="hover:text-primary cursor-pointer transition-colors"
                                >
                                    My Appointment
                                </p>

                                <p
                                    onClick={handleLogout}
                                    className={`hover:text-primary ${
                                        loggingOut
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                    } transition-colors`}
                                >
                                    {loggingOut ? "Logging out..." : "Logout"}
                                </p>

                            </div>

                        </div>

                    </div>

                ) : (

                    <button
                        onClick={() => navigate("/login")}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-medium hidden md:block hover:bg-cyan-700 transition-colors"
                    >
                        Create Account
                    </button>

                )}

                <img
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden cursor-pointer"
                    src={assets.menu_icon}
                    alt="Menu"
                />

                <div
                    className={`${
                        showMenu
                            ? "fixed w-full"
                            : "h-0 w-0"
                    } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
                >

                    <div className="flex items-center justify-between px-5 py-6">

                        <img
                            className="w-36"
                            src={assets.logo}
                            alt="MediBridge"
                        />

                        <img
                            className="w-7 cursor-pointer"
                            onClick={() => setShowMenu(false)}
                            src={assets.cross_icon}
                            alt="Close"
                        />

                    </div>

                    <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">

                        <NavLink onClick={() => setShowMenu(false)} to="/">
                            <p className="px-4 py-2 rounded inline-block">Home</p>
                        </NavLink>

                        <NavLink onClick={() => setShowMenu(false)} to="/all-doctors">
                            <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
                        </NavLink>

                        <NavLink onClick={() => setShowMenu(false)} to="/about">
                            <p className="px-4 py-2 rounded inline-block">ABOUT</p>
                        </NavLink>

                        <NavLink onClick={() => setShowMenu(false)} to="/contact">
                            <p className="px-4 py-2 rounded inline-block">CONTACT</p>
                        </NavLink>

                    </ul>

                </div>

            </div>
        </div>
    );
};

export default Navbar;