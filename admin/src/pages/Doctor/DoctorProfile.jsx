import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { 
    User, 
    Stethoscope, 
    Award, 
    MapPin, 
    DollarSign, 
    FileText, 
    Edit3, 
    Save, 
    X, 
    CheckCircle2, 
    ShieldCheck, 
    Building2,
    CalendarDays
} from "lucide-react";

const DoctorProfile = () => {
    const {
        profileData,
        setProfileData,
        getProfileData,
        updateProfile
    } = useContext(DoctorContext);

    const { currency } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProfileData();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        const success = await updateProfile();
        if (success) {
            setIsEdit(false);
            await getProfileData();
        }
        setLoading(false);
    };

    if (!profileData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading doctor profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="pb-4 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Doctor Settings</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Profile & Practice Details
                    </h1>
                </div>

                {!isEdit ? (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-cyan-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm shadow-primary/25 transition-all cursor-pointer"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setIsEdit(false);
                                getProfileData();
                            }}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Gradient Cover Banner */}
                <div className="h-32 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 relative">
                    <div className="absolute -bottom-12 left-6 sm:left-10">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-white">
                            <img
                                className="w-full h-full object-cover"
                                src={profileData.image}
                                alt={profileData.name || "Doctor"}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-16 p-6 sm:p-10 space-y-8">
                    {/* Top Identity */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-extrabold text-slate-900">
                                    {profileData.name}
                                </h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-primary border border-cyan-200">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Verified
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                                <span className="font-semibold text-slate-800">{profileData.degree}</span>
                                <span>•</span>
                                <span className="text-primary font-bold">{profileData.speciality}</span>
                                <span>•</span>
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                                    {profileData.experience} {profileData.experience === 1 ? "Year" : "Years"} Experience
                                </span>
                            </div>
                        </div>

                        {/* Availability switch in read / edit mode */}
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80 w-fit">
                            <span className="text-xs font-bold text-slate-700">Practice Availability</span>
                            <label className={`relative inline-flex items-center ${isEdit ? "cursor-pointer" : "cursor-not-allowed opacity-75"}`}>
                                <input
                                    type="checkbox"
                                    checked={Boolean(profileData.available)}
                                    disabled={!isEdit}
                                    onChange={(e) =>
                                        setProfileData(prev => ({
                                            ...prev,
                                            available: e.target.checked
                                        }))
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                About Practitioner
                            </h3>
                        </div>

                        {isEdit ? (
                            <textarea
                                value={profileData.about || ""}
                                onChange={(e) =>
                                    setProfileData(prev => ({
                                        ...prev,
                                        about: e.target.value
                                    }))
                                }
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                        ) : (
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                                {profileData.about || "No biography provided yet."}
                            </p>
                        )}
                    </div>

                    {/* Fee & Address Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        {/* Fee */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Consultation Fee
                                </h3>
                            </div>

                            {isEdit ? (
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-slate-400 font-bold text-sm">
                                        {currency || "₹"}
                                    </span>
                                    <input
                                        type="number"
                                        value={profileData.fees ?? ""}
                                        onChange={(e) =>
                                            setProfileData(prev => ({
                                                ...prev,
                                                fees: e.target.value
                                            }))
                                        }
                                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                    />
                                </div>
                            ) : (
                                <p className="text-lg font-extrabold text-slate-900">
                                    {currency || "₹"} {profileData.fees || 500}
                                </p>
                            )}
                        </div>

                        {/* Clinic Address */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Clinic Location
                                </h3>
                            </div>

                            {isEdit ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Address Line 1"
                                        value={profileData.address?.line1 || ""}
                                        onChange={(e) =>
                                            setProfileData(prev => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    line1: e.target.value
                                                }
                                            }))
                                        }
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address Line 2"
                                        value={profileData.address?.line2 || ""}
                                        onChange={(e) =>
                                            setProfileData(prev => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    line2: e.target.value
                                                }
                                            }))
                                        }
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-slate-600 space-y-0.5">
                                    <p>{profileData.address?.line1 || "Main Clinic Building"}</p>
                                    <p>{profileData.address?.line2 || "City Center"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;