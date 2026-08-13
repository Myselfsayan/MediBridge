import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

function MyProfile() {
    const { userData, setUserData, backendUrl } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    console.log(userData);

    // Wait until user data is loaded
    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading profile...</p>
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
            console.log("Updated user:", data.data.user);

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

    return userData && (
        <div className="max-w-lg flex flex-col gap-2 text-sm">

            {/* Profile Image */}
            {isEdit ? (
            <>
                <label
                    htmlFor="profile-image"
                    className="cursor-pointer inline-block"
                >
                    <img
                        className="w-36 h-36 rounded object-cover"
                        src={previewImage || userData?.image}
                        alt="Profile"
                    />
                </label>

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

                <p className="text-sm text-gray-500">
                    Click image to change profile photo
                </p>
            </>
        ) : (
            <img
                className="w-36 h-36 rounded object-cover"
                src={userData?.image}
                alt="Profile"
            />
        )}

            {/* Name */}
            {isEdit ? (
                <input
                    className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
                    type="text"
                    value={userData.name || ""}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                />
            ) : (
                <p className="font-medium text-3xl text-neutral-800 mt-4">
                    {userData.name}
                </p>
            )}

            <hr className="bg-zinc-400 h-[1px] border-none" />

            {/* Contact Information */}
            <div>
                <p className="text-neutral-500 underline mt-3">
                    CONTACT INFORMATION
                </p>

                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">

                    {/* Email */}
                    <p className="font-medium">Email id:</p>

                    <p className="text-blue-500">
                        {userData.email}
                    </p>

                    {/* Phone */}
                    <p className="font-medium">Phone:</p>

                    {isEdit ? (
                        <input
                            className="bg-gray-100 max-w-52"
                            type="text"
                            value={userData.phone || ""}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                }))
                            }
                        />
                    ) : (
                        <p className="text-blue-400">
                            {userData.phone}
                        </p>
                    )}

                    {/* Address */}
                    <p className="font-medium">Address:</p>

                    {isEdit ? (
                        <div className="flex flex-col gap-2">

                            {/* Address Line 1 */}
                            <input
                                className="bg-gray-50 border px-2 py-1"
                                type="text"
                                placeholder="Address Line 1"
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
                            />

                            {/* Address Line 2 */}
                            <input
                                className="bg-gray-50 border px-2 py-1"
                                type="text"
                                placeholder="Address Line 2"
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
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            {userData.address?.line1}
                            <br />
                            {userData.address?.line2}
                        </p>
                    )}
                </div>
            </div>

            {/* Basic Information */}
            <div>
                <p className="text-neutral-500 underline mt-3">
                    BASIC INFORMATION
                </p>

                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">

                    {/* Gender */}
                    <p className="font-medium">Gender:</p>

                    {isEdit ? (
                        <select
                            className="max-w-24 bg-gray-100"
                            value={userData.gender || ""}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    gender: e.target.value,
                                }))
                            }
                        >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
</select>
                    ) : (
                        <p className="text-gray-400">
                            {userData.gender}
                        </p>
                    )}

                    {/* Birthday */}
                    <p className="font-medium">Birthday:</p>

                    {isEdit ? (
                        <input
                            className="max-w-36 bg-gray-100"
                            type="date"
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    dob: e.target.value,
                                }))
                            }
                            value={
                                userData.dob
                                    ? userData.dob.substring(0, 10)
                                    : ""
                            }
                        />
                    ) : (
                        <p className="text-gray-400">
                            {userData.dob
                                ? userData.dob.substring(0, 10)
                                : ""}
                        </p>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-10">
                {isEdit ? (
                    <button
                        className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Saving..."
                            : "Save information"}
                    </button>
                ) : (
                    <button
                        className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                        onClick={() => setIsEdit(true)}
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}

export default MyProfile;