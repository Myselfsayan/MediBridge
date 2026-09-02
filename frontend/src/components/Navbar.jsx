import { useState, useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { 
    Menu, 
    X, 
    ChevronDown, 
    User, 
    Calendar, 
    LogOut, 
    Home, 
    Stethoscope, 
    Info, 
    PhoneCall, 
    UserPlus,
    Sparkles
} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const dropdownRef = useRef(null);

    const {
        isLoggedIn,
        setIsLoggedIn,
        setUserData,
        backendUrl,
        userData
    } = useContext(AppContext);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [showMenu]);

    // Close mobile menu on route change
    useEffect(() => {
        setShowMenu(false);
        setDropdownOpen(false);
    }, [location.pathname]);

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
                setDropdownOpen(false);
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

    const navLinks = [
        { path: "/", label: "Home", icon: Home },
        { path: "/all-doctors", label: "Doctors", icon: Stethoscope },
        { path: "/about", label: "About", icon: Info },
        { path: "/contact", label: "Contact", icon: PhoneCall },
    ];

    return (
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-20">

                {/* Brand Logo */}
                <div 
                    onClick={() => navigate("/")} 
                    className="flex items-center gap-2.5 cursor-pointer group select-none py-2"
                >
                    <img
                        className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        src={assets.logo}
                        alt="MediBridge"
                    />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
                    {navLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-primary shadow-sm font-semibold"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User / CTA Action */}
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100/80 transition-colors border border-slate-200/60 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                                aria-expanded={dropdownOpen}
                            >
                                <img
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"
                                    src={userData?.image || assets.profile_pic}
                                    alt={userData?.name || "User"}
                                />
                                <span className="hidden sm:inline-block text-sm font-semibold text-slate-800 max-w-[120px] truncate">
                                    {userData?.name ? userData.name.split(" ")[0] : "Profile"}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* User header */}
                                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {userData?.name || "Patient"}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            {userData?.email || "patient@medibridge.com"}
                                        </p>
                                    </div>

                                    <div className="p-1.5 space-y-0.5">
                                        <button
                                            onClick={() => {
                                                navigate("/my-profile");
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-primary hover:bg-cyan-50/80 transition-colors text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-cyan-100/60 flex items-center justify-center text-primary">
                                                <User className="w-4 h-4" />
                                            </div>
                                            My Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/my-appointments");
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-primary hover:bg-cyan-50/80 transition-colors text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-teal-100/60 flex items-center justify-center text-teal-600">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            My Appointments
                                        </button>

                                        <div className="h-px bg-slate-100 my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50/80 transition-colors text-left disabled:opacity-50"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-rose-100/60 flex items-center justify-center text-rose-600">
                                                <LogOut className="w-4 h-4" />
                                            </div>
                                            {loggingOut ? "Signing out..." : "Sign Out"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                        >
                            <UserPlus className="w-4 h-4" />
                            Create Account
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMenu(true)}
                        className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {showMenu && (
                <div className="fixed inset-0 z-50 md:hidden flex justify-end">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <img
                                className="h-8 w-auto object-contain"
                                src={assets.logo}
                                alt="MediBridge"
                            />
                            <button
                                onClick={() => setShowMenu(false)}
                                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User summary in mobile drawer (if logged in) */}
                        {isLoggedIn && (
                            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-3">
                                <img
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40"
                                    src={userData?.image || assets.profile_pic}
                                    alt={userData?.name || "User"}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">
                                        {userData?.name || "Patient"}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {userData?.email || ""}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
                            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Menu
                            </p>
                            {navLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setShowMenu(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                                                isActive
                                                    ? "bg-primary text-white shadow-sm font-semibold"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`
                                        }
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </NavLink>
                                );
                            })}

                            {/* Patient Actions in mobile menu if logged in */}
                            {isLoggedIn && (
                                <>
                                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mt-6 mb-2">
                                        Account
                                    </p>
                                    <NavLink
                                        to="/my-profile"
                                        onClick={() => setShowMenu(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                                                isActive
                                                    ? "bg-primary text-white font-semibold"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`
                                        }
                                    >
                                        <User className="w-5 h-5" />
                                        My Profile
                                    </NavLink>
                                    <NavLink
                                        to="/my-appointments"
                                        onClick={() => setShowMenu(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                                                isActive
                                                    ? "bg-primary text-white font-semibold"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`
                                        }
                                    >
                                        <Calendar className="w-5 h-5" />
                                        My Appointments
                                    </NavLink>
                                </>
                            )}
                        </div>

                        {/* Drawer Footer / CTA */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {loggingOut ? "Signing out..." : "Sign Out"}
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        navigate("/login");
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-cyan-700 shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Create Account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;