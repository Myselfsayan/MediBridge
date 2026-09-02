import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Camera, 
    Save, 
    Edit3, 
    ShieldCheck, 
    UserCheck,
    CheckCircle2
} from "lucide-react";
import { assets } from "../assets/assets";

function MyProfile() {
    const { userData, setUserData, backendUrl } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Wait until user data is loaded
    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("name", userData.name);
            formData.append("email", userData.email);
            formData.append("phone", userData.phone);
            formData.append("dob", userData.dob);
            formData.append("gender", userData.gender);

            formData.append(
                "address",
                JSON.stringify(userData.address)
            );

            // Add image only if a new image was selected
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const { data } = await axios.put(
                `${backendUrl}/api/v1/user/profile-update`,
                formData,
                {
                    withCredentials: true,
                }
            );

            if (data.success) {
                setUserData(data.data.user);
                setImageFile(null);
                setPreviewImage(null);
                setIsEdit(false);
            }
        } catch (error) {
            console.log(
                "Profile update error:",
                error.response?.data || error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-6 sm:py-8 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Patient Account</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Personal Profile
                    </h1>
                </div>

                {/* Edit / Save Action Button */}
                <div>
                    {isEdit ? (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEdit(false);
                                    setImageFile(null);
                                    setPreviewImage(null);
                                }}
                                disabled={isLoading}
                                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary text-white text-sm font-bold px-7 py-2.5 rounded-full shadow-md shadow-primary/20 hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEdit(true)}
                            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-primary border border-slate-200/90 text-sm font-bold px-6 py-2.5 rounded-full shadow-xs hover:shadow transition-all"
                        >
                            <Edit3 className="w-4 h-4 text-primary" />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Card Container */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Decorative Banner */}
                <div className="h-32 sm:h-40 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-800 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                </div>

                {/* Avatar and Basic Header */}
                <div className="px-6 sm:px-10 pb-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
                        {/* Profile Image with Upload Trigger */}
                        <div className="relative group">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl bg-slate-100 flex items-center justify-center">
                                <img
                                    className="w-full h-full object-cover"
                                    src={previewImage || userData?.image || assets.profile_pic}
                                    alt="Profile"
                                />
                            </div>

                            {isEdit && (
                                <label
                                    htmlFor="profile-image"
                                    className="absolute inset-0 rounded-3xl bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-white cursor-pointer opacity-90 hover:opacity-100 transition-opacity ring-4 ring-white"
                                >
                                    <Camera className="w-7 h-7 mb-1" />
                                    <span className="text-xs font-semibold">Change Photo</span>
                                    <input
                                        id="profile-image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImageFile(file);
                                                setPreviewImage(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Name and Status */}
                        <div className="flex-1 sm:pl-4">
                            {isEdit ? (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={userData.name || ""}
                                        onChange={(e) =>
                                            setUserData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="w-full max-w-sm px-4 py-2 border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Your Name"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                        {userData.name}
                                    </h2>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                        <Mail className="w-3.5 h-3.5 text-primary" />
                                        <span>{userData.email}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Information Sections Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                        {/* Section 1: Contact Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <Phone className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                    Contact Information
                                </h3>
                            </div>

                            <div className="space-y-3 text-sm">
                                {/* Email (Read-only) */}
                                <div>
                                    <span className="text-xs text-slate-400 font-medium">Email Address</span>
                                    <p className="font-semibold text-slate-800">{userData.email}</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <span className="text-xs text-slate-400 font-medium">Phone Number</span>
                                    {isEdit ? (
                                        <input
                                            type="text"
                                            value={userData.phone || ""}
                                            onChange={(e) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    phone: e.target.value,
                                                }))
                                            }
                                            className="w-full mt-1 px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="+1 234 567 8900"
                                        />
                                    ) : (
                                        <p className="font-semibold text-slate-800">
                                            {userData.phone || "Not provided"}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <span className="text-xs text-slate-400 font-medium">Address</span>
                                    {isEdit ? (
                                        <div className="space-y-2 mt-1">
                                            <input
                                                type="text"
                                                placeholder="Street Address Line 1"
                                                value={userData.address?.line1 || ""}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            line1: e.target.value,
                                                        },
                                                    }))
                                                }
                                                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                            <input
                                                type="text"
                                                placeholder="City, State, Zip Line 2"
                                                value={userData.address?.line2 || ""}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            line2: e.target.value,
                                                        },
                                                    }))
                                                }
                                                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    ) : (
                                        <p className="font-semibold text-slate-800">
                                            {userData.address?.line1 || userData.address?.line2 ? (
                                                <>
                                                    {userData.address?.line1}
                                                    {userData.address?.line1 && userData.address?.line2 && <br />}
                                                    {userData.address?.line2}
                                                </>
                                            ) : (
                                                "Not provided"
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Basic Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <User className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                    Basic Information
                                </h3>
                            </div>

                            <div className="space-y-3 text-sm">
                                {/* Gender */}
                                <div>
                                    <span className="text-xs text-slate-400 font-medium">Gender</span>
                                    {isEdit ? (
                                        <select
                                            value={userData.gender || ""}
                                            onChange={(e) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    gender: e.target.value,
                                                }))
                                            }
                                            className="w-full mt-1 px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    ) : (
                                        <p className="font-semibold text-slate-800">
                                            {userData.gender || "Not specified"}
                                        </p>
                                    )}
                                </div>

                                {/* Birthday */}
                                <div>
                                    <span className="text-xs text-slate-400 font-medium">Date of Birth</span>
                                    {isEdit ? (
                                        <input
                                            type="date"
                                            value={
                                                userData.dob
                                                    ? userData.dob.substring(0, 10)
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    dob: e.target.value,
                                                }))
                                            }
                                            className="w-full mt-1 px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        />
                                    ) : (
                                        <p className="font-semibold text-slate-800">
                                            {userData.dob ? userData.dob.substring(0, 10) : "Not specified"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;