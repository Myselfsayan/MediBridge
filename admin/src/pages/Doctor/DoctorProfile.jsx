import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorProfile = () => {

    const {
        profileData,
        setProfileData,
        getProfileData,
        updateProfile
    } = useContext(DoctorContext);

    const { currency } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);


    // ==========================================
    // GET DOCTOR PROFILE
    // ==========================================

    useEffect(() => {
        getProfileData();
    }, []);


    // ==========================================
    // SAVE PROFILE
    // ONLY 4 FIELDS WILL BE UPDATED
    // ==========================================

    const handleSave = async () => {

        const success = await updateProfile();

        if (success) {
            setIsEdit(false);
            await getProfileData();
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (!profileData) {
        return (
            <div className="m-5">
                Loading...
            </div>
        );
    }


    return (
        <div className="m-5 max-w-5xl">

            {/* ==========================================
                DOCTOR IMAGE + BASIC INFORMATION
            ========================================== */}

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                {/* Doctor Image - NOT EDITABLE */}

                <img
                    className="w-40 h-40 object-cover rounded-lg"
                    src={profileData.image}
                    alt={profileData.name || "Doctor"}
                />


                {/* ==========================================
                    DOCTOR DETAILS
                ========================================== */}

                <div className="flex-1">

                    {/* ==========================================
                        NAME - NOT EDITABLE
                    ========================================== */}

                    <p className="text-2xl font-medium text-gray-700">
                        {profileData.name}
                    </p>


                    {/* ==========================================
                        DEGREE + SPECIALITY + EXPERIENCE
                        NOT EDITABLE
                    ========================================== */}

                    <div className="flex items-center gap-2 mt-1 text-gray-600">

                        <p>
                            {profileData.degree} - {profileData.speciality}
                        </p>

                        <button
                            type="button"
                            className="py-0.5 px-2 border text-xs rounded-full"
                        >
                            {profileData.experience}{profileData.experience === 1 ? " year" : " years"}
                        </button>

                    </div>


                    {/* ==========================================
                        ABOUT - EDITABLE
                    ========================================== */}

                    <div className="mt-4">

                        <p className="flex items-center gap-1 text-sm font-medium text-neutral-800">
                            About
                        </p>

                        {isEdit ? (

                            <textarea
                                value={profileData.about || ""}
                                onChange={(e) =>
                                    setProfileData(prev => ({
                                        ...prev,
                                        about: e.target.value
                                    }))
                                }
                                className="w-full max-w-[700px] border rounded px-2 py-1 text-sm mt-1"
                                rows={4}
                            />

                        ) : (

                            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                                {profileData.about}
                            </p>

                        )}

                    </div>


                    {/* ==========================================
                        APPOINTMENT FEE - EDITABLE
                    ========================================== */}

                    <p className="text-gray-600 font-medium mt-4">

                        Appointment fee:

                        {isEdit ? (

                            <input
                                type="number"
                                value={profileData.fees ?? ""}
                                onChange={(e) =>
                                    setProfileData(prev => ({
                                        ...prev,
                                        fees: e.target.value
                                    }))
                                }
                                className="border rounded px-2 py-1 ml-1 w-24 text-gray-800"
                            />

                        ) : (

                            <span className="text-gray-800 ml-1">
                                {currency} {profileData.fees}
                            </span>

                        )}

                    </p>


                    {/* ==========================================
                        ADDRESS - EDITABLE
                    ========================================== */}

                    <div className="flex gap-2 py-2">

                        <p>
                            Address:
                        </p>

                        {isEdit ? (

                            <div className="flex flex-col gap-2">

                                {/* Address Line 1 */}

                                <input
                                    type="text"
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
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="Address line 1"
                                />


                                {/* Address Line 2 */}

                                <input
                                    type="text"
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
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="Address line 2"
                                />

                            </div>

                        ) : (

                            <p className="text-sm">

                                {profileData.address?.line1}

                                <br />

                                {profileData.address?.line2}

                            </p>

                        )}

                    </div>


                    {/* ==========================================
                        AVAILABLE - EDITABLE
                    ========================================== */}

                    <div className="flex gap-1 pt-2">

                        <input
                            type="checkbox"
                            checked={profileData.available || false}
                            disabled={!isEdit}
                            onChange={(e) =>
                                setProfileData(prev => ({
                                    ...prev,
                                    available: e.target.checked
                                }))
                            }
                        />

                        <label>
                            Available
                        </label>

                    </div>


                    {/* ==========================================
                        EDIT / SAVE BUTTON
                    ========================================== */}

                    <div className="mt-5">

                        {isEdit ? (

                            <button
                                onClick={handleSave}
                                className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition"
                            >
                                Save
                            </button>

                        ) : (

                            <button
                                onClick={() => setIsEdit(true)}
                                className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition"
                            >
                                Edit
                            </button>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default DoctorProfile;