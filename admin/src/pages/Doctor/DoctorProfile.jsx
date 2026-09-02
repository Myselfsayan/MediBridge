import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { 
    ShieldCheck, 
    Edit3, 
    Save, 
    X
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
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Main Profile Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                {/* 1. Header: Doctor Image + Identity + Actions */}
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Doctor Image */}
                    <img
                        className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                        src={profileData.image}
                        alt={profileData.name || "Doctor"}
                    />

                    {/* Identity & Header Controls */}
                    <div className="flex-1 w-full min-w-0">
                        {/* Name + Verified Badge + Edit/Save Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                    {profileData.name}
                                </h1>
                                <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold bg-cyan-50 border border-cyan-100 px-2.5 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Verified
                                </span>
                            </div>

                            {/* Edit / Save Actions */}
                            <div>
                                {!isEdit ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEdit(true)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-cyan-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEdit(false);
                                                getProfileData();
                                            }}
                                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                            <span>{loading ? "Saving..." : "Save"}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Degree, Speciality & Experience */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-600 font-medium">
                            <span>{profileData.degree}</span>
                            <span>•</span>
                            <span className="text-primary font-semibold">{profileData.speciality}</span>
                            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium border border-slate-200">
                                {profileData.experience} {profileData.experience === 1 ? "Year" : "Years"} Experience
                            </span>
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                            <label className={`inline-flex items-center gap-2 text-sm font-medium text-slate-700 select-none ${isEdit ? "cursor-pointer" : "cursor-default"}`}>
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
                                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary focus:ring-offset-0 disabled:opacity-75 cursor-pointer"
                                />
                                <span>Available for appointments</span>
                            </label>

                            {profileData.available ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    Offline
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-slate-100" />

                {/* 2. About Practitioner */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                        About Practitioner
                    </h3>

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
                            placeholder="Enter clinical biography..."
                            className="w-full max-w-3xl border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all leading-relaxed"
                        />
                    ) : (
                        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                            {profileData.about || "No clinical biography provided."}
                        </p>
                    )}
                </div>

                {/* 3. Practice Details: Consultation Fee & Clinic Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
                    {/* Consultation Fee */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-1.5">
                            Consultation Fee
                        </h3>

                        {isEdit ? (
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-slate-500">
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
                                    className="w-36 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        ) : (
                            <p className="text-base font-bold text-slate-900">
                                {currency || "₹"} {profileData.fees || 500}
                            </p>
                        )}
                    </div>

                    {/* Clinic Address */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-1.5">
                            Clinic Address
                        </h3>

                        {isEdit ? (
                            <div className="space-y-2 max-w-md">
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
                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
    );
};

export default DoctorProfile;