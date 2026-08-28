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
                // Clear login state
                setIsLoggedIn(false);
                setUserData(null);

                // Close mobile menu
                setShowMenu(false);

                toast.success("Logged out successfully");

                // Navigate after state update
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
        <div className="flex items-center justify-between py-4 mb-5 border-b border-b-gray-400">

            {/* Logo */}
            <img
                onClick={() => navigate("/")}
                className="w-44 cursor-pointer"
                src={assets.logo}
                alt="Logo"
            />

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-start gap-5 font-medium">

                <NavLink to="/">
                    <li className="py-1">
                        HOME
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

                <NavLink to="/all-doctors">
                    <li className="py-1">
                        ALL DOCTORS
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

                <NavLink to="/about">
                    <li className="py-1">
                        ABOUT
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

                <NavLink to="/contact">
                    <li className="py-1">
                        CONTACT
                        <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                    </li>
                </NavLink>

            </ul>

            <div className="flex items-center gap-4">

                {/* ==========================================
                    LOGGED IN USER
                ========================================== */}

                {isLoggedIn ? (

                    <div className="flex items-center gap-2 cursor-pointer group relative">

                        {/* USER AVATAR */}
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={userData?.image || assets.profile_pic}
                            alt="User avatar"
                        />

                        <img
                            className="w-2.5"
                            src={assets.dropdown_icon}
                            alt=""
                        />

                        {/* Dropdown */}
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">

                            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">

                                <p
                                    onClick={() => navigate("/my-profile")}
                                    className="hover:text-black cursor-pointer"
                                >
                                    My Profile
                                </p>

                                <p
                                    onClick={() => navigate("/my-appointments")}
                                    className="hover:text-black cursor-pointer"
                                >
                                    My Appointment
                                </p>

                                <p
                                    onClick={handleLogout}
                                    className={`hover:text-black ${
                                        loggingOut
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                    }`}
                                >
                                    {loggingOut ? "Logging out..." : "Logout"}
                                </p>

                            </div>

                        </div>

                    </div>

                ) : (

                    /* CREATE ACCOUNT */
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
                    >
                        Create Account
                    </button>

                )}

                {/* ==========================================
                    MOBILE MENU ICON
                ========================================== */}

                <img
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden cursor-pointer"
                    src={assets.menu_icon}
                    alt="Menu"
                />

                {/* ==========================================
                    MOBILE MENU
                ========================================== */}

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
                            alt="Logo"
                        />

                        <img
                            className="w-7 cursor-pointer"
                            onClick={() => setShowMenu(false)}
                            src={assets.cross_icon}
                            alt="Close"
                        />

                    </div>

                    <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/"
                        >
                            <p className="px-4 py-2 rounded inline-block">
                                Home
                            </p>
                        </NavLink>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/all-doctors"
                        >
                            <p className="px-4 py-2 rounded inline-block">
                                ALL DOCTORS
                            </p>
                        </NavLink>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/about"
                        >
                            <p className="px-4 py-2 rounded inline-block">
                                ABOUT
                            </p>
                        </NavLink>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/contact"
                        >
                            <p className="px-4 py-2 rounded inline-block">
                                CONTACT
                            </p>
                        </NavLink>

                    </ul>

                </div>

            </div>
        </div>
    );
};

export default Navbar;