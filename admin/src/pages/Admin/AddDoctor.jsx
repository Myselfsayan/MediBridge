import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

function AddDoctor() {

    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("");
    const [fees, setFees] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [about, setAbout] = useState("");
    const [degree, setDegree] = useState("");

    const { backendUrl } = useContext(AdminContext);


    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try {

            // Check image
            if (!docImg) {
                return toast.error("Image is required");
            }


            // Create FormData
            const formData = new FormData();

            formData.append("image", docImg);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("experience", experience);
            formData.append("fees", Number(fees));
            formData.append("speciality", speciality);

            formData.append(
                "address",
                JSON.stringify({
                    line1: address1,
                    line2: address2
                })
            );

            formData.append("about", about);
            formData.append("degree", degree);


            // Debug FormData
            formData.forEach((value, key) => {
                console.log(key, value);
            });


            // Send request
            // HTTP-only accessToken cookie will be sent automatically
            const { data } = await axios.post(
                `${backendUrl}/api/v1/admin/add-doctor`,
                formData,
                {
                    withCredentials: true
                }
            );


            if (data.success) {

                toast.success(data.message);


                // Reset form
                setDocImg(false);
                setName("");
                setEmail("");
                setPassword("");
                setExperience("");
                setFees("");
                setSpeciality("");
                setAddress1("");
                setAddress2("");
                setAbout("");
                setDegree("");

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log("Add doctor error:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    };


    return (
        <form
            className="m-5 w-full"
            onSubmit={onSubmitHandler}
        >

            <p className="mb-3 text-lg font-medium text-slate-900">
                Add Doctor
            </p>


            <div className="bg-white px-8 py-8 border border-slate-200 rounded-xl shadow-sm w-full max-w-4xl max-h-[80vh] overflow-y-scroll">


                {/* Doctor Image */}

                <div className="flex items-center gap-4 mb-8 text-slate-500">

                    <label htmlFor="doc-img">

                        <img
                            className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full cursor-pointer object-cover shadow-sm"
                            src={
                                docImg
                                    ? URL.createObjectURL(docImg)
                                    : assets.upload_area
                            }
                            alt=""
                        />

                    </label>


                    <input
                        onChange={(e) =>
                            setDocImg(e.target.files[0])
                        }
                        type="file"
                        id="doc-img"
                        hidden
                        accept="image/*"
                    />


                    <p>
                        Upload doctor
                        <br />
                        picture
                    </p>

                </div>


                <div className="flex flex-col lg:flex-row items-start gap-10 text-slate-600">


                    {/* LEFT SIDE */}

                    <div className="w-full lg:flex-1 flex flex-col gap-4">


                        {/* Name */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Doctor Name</p>

                            <input
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Email */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Doctor Email</p>

                            <input
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Doctor Password</p>

                            <input
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Experience */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Experience</p>

                            <select
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                                value={experience}
                                onChange={(e) =>
                                    setExperience(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Select Experience
                                </option>

                                <option value="1">
                                    1 Year
                                </option>

                                <option value="2">
                                    2 Year
                                </option>

                                <option value="3">
                                    3 Year
                                </option>

                                <option value="4">
                                    4 Year
                                </option>

                                <option value="5">
                                    5 Year
                                </option>

                                <option value="6">
                                    6 Year
                                </option>

                                <option value="7">
                                    7 Year
                                </option>

                                <option value="8">
                                    8 Year
                                </option>

                                <option value="9">
                                    9 Year
                                </option>

                                <option value="10">
                                    10 Year
                                </option>

                            </select>

                        </div>


                        {/* Fees */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Fees</p>

                            <input
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                type="number"
                                placeholder="Fees"
                                value={fees}
                                onChange={(e) =>
                                    setFees(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="w-full lg:flex-1 flex flex-col gap-4">


                        {/* Speciality */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Speciality</p>

                            <select
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                                value={speciality}
                                onChange={(e) =>
                                    setSpeciality(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Select Speciality
                                </option>

                                <option value="General physician">
                                    General physician
                                </option>

                                <option value="Gynecologist">
                                    Gynecologist
                                </option>

                                <option value="Dermatologist">
                                    Dermatologist
                                </option>

                                <option value="Pediatricians">
                                    Pediatricians
                                </option>

                                <option value="Neurologist">
                                    Neurologist
                                </option>

                                <option value="Gastroenterologist">
                                    Gastroenterologist
                                </option>

                            </select>

                        </div>


                        {/* Education */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Education</p>

                            <input
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                type="text"
                                placeholder="Education"
                                value={degree}
                                onChange={(e) =>
                                    setDegree(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Address */}

                        <div className="flex-1 flex flex-col gap-1">

                            <p className="text-sm font-medium text-slate-700">Address</p>

                            <input
                                className="border border-slate-300 rounded-lg px-4 py-2.5 mb-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                type="text"
                                placeholder="Address 1"
                                value={address1}
                                onChange={(e) =>
                                    setAddress1(e.target.value)
                                }
                                required
                            />

                            <input
                                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                type="text"
                                placeholder="Address 2"
                                value={address2}
                                onChange={(e) =>
                                    setAddress2(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>

                </div>


                {/* ABOUT */}

                <div className="mt-4">

                    <p className="mt-2 mb-2 text-sm font-medium text-slate-700">
                        About Doctor
                    </p>

                    <textarea
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        placeholder="Write about the doctor"
                        rows={5}
                        value={about}
                        onChange={(e) =>
                            setAbout(e.target.value)
                        }
                        required
                    />

                </div>


                {/* SUBMIT */}

                <button
                    className="bg-primary hover:opacity-90 transition px-10 py-3 mt-6 text-white font-medium rounded-lg"
                    type="submit"
                >
                    Add Doctor
                </button>

            </div>

        </form>
    );
}

export default AddDoctor;