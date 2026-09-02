import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorProfile = () => {

    const {
        profileData,
        setProfileData,
        getProfileData,
        updateDoctorProfile
    } = useContext(DoctorContext);

    const {
        currency
    } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);


    // ==========================================
    // GET DOCTOR PROFILE
    // ==========================================

    useEffect(() => {
        getProfileData();
    }, []);


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSave = async () => {

        const success = await updateDoctorProfile(
            profileData.fees,
            profileData.address,
            profileData.available
        );

        if (success) {
            setIsEdit(false);
            getProfileData();
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
        <div className="max-w-5xl m-5">

            {/* ==========================================
                DOCTOR BASIC INFORMATION
            ========================================== */}

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                <img
                    className="w-40 h-40 object-cover rounded-lg bg-primary"
                    src={profileData.image}
                    alt=""
                />

                <div className="flex-1">

                    <h1 className="flex items-center gap-2 text-2xl font-medium text-gray-700">
                        {profileData.name}
                    </h1>

                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <p>
                            {profileData.degree} - {profileData.speciality}
                        </p>

                        <button className="py-0.5 px-2 border text-xs rounded-full">
                            {profileData.experience}
                        </button>
                    </div>


                    {/* ==========================================
                        ABOUT
                    ========================================== */}

                    <div className="mt-4">

                        <p className="flex items-center gap-1 text-sm font-medium text-neutral-800">
                            About
                        </p>

                        <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                            {profileData.about}
                        </p>

                    </div>


                    {/* ==========================================
                        APPOINTMENT FEE
                    ========================================== */}

                    <p className="text-gray-600 font-medium mt-4">

                        Appointment fee:

                        <span className="text-gray-800 ml-1">
                            {currency} {profileData.fees}
                        </span>

                    </p>


                    {/* ==========================================
                        ADDRESS
                    ========================================== */}

                    <div className="flex gap-2 py-2">

                        <p>Address:</p>

                        <p className="text-sm">

                            {profileData.address?.line1}

                            <br />

                            {profileData.address?.line2}

                        </p>

                    </div>


                    {/* ==========================================
                        AVAILABLE
                    ========================================== */}

                    <div className="flex gap-1 pt-2">

                        <input
                            type="checkbox"
                            checked={profileData.available || false}
                            disabled={!isEdit}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    available: e.target.checked
                                })
                            }
                        />

                        <label>
                            Available
                        </label>

                    </div>


                    {/* ==========================================
                        EDIT / SAVE
                    ========================================== */}

                    <div className="mt-4">

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