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

                    {/* Mobile Menu Button (Hamburger) */}
                    <button
                        type="button"
                        onClick={() => setShowMenu(prev => !prev)}
                        className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Navigation Menu */}
            {showMenu && (
                <div className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-md shadow-2xl animate-in slide-in-from-top duration-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-1.5">
                    {/* 1. Home */}
                    <NavLink
                        to="/"
                        onClick={() => setShowMenu(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                                isActive
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-slate-700 hover:bg-slate-100"
                            }`
                        }
                    >
                        <Home className="w-5 h-5 shrink-0" />
                        <span>Home</span>
                    </NavLink>

                    {/* 2. Doctors */}
                    <NavLink
                        to="/all-doctors"
                        onClick={() => setShowMenu(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                                isActive
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-slate-700 hover:bg-slate-100"
                            }`
                        }
                    >
                        <Stethoscope className="w-5 h-5 shrink-0" />
                        <span>Doctors</span>
                    </NavLink>

                    {/* 3. About Us */}
                    <NavLink
                        to="/about"
                        onClick={() => setShowMenu(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                                isActive
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-slate-700 hover:bg-slate-100"
                            }`
                        }
                    >
                        <Info className="w-5 h-5 shrink-0" />
                        <span>About Us</span>
                    </NavLink>

                    {/* 4. Contact Us */}
                    <NavLink
                        to="/contact"
                        onClick={() => setShowMenu(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                                isActive
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-slate-700 hover:bg-slate-100"
                            }`
                        }
                    >
                        <PhoneCall className="w-5 h-5 shrink-0" />
                        <span>Contact Us</span>
                    </NavLink>
                </div>
            )}
        </header>
    );
};

export default Navbar;