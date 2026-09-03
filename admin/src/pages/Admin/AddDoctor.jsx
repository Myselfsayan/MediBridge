import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { 
    UserPlus, 
    UploadCloud, 
    User, 
    Mail, 
    Lock, 
    Award, 
    GraduationCap, 
    MapPin, 
    DollarSign, 
    Stethoscope, 
    FileText, 
    CheckCircle2,
    Camera
} from "lucide-react";

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
    const [loading, setLoading] = useState(false);

    const { backendUrl } = useContext(AdminContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (!docImg) {
                return toast.error("Please upload a doctor profile photo");
            }

            setLoading(true);

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

            const { data } = await axios.post(
                `${backendUrl}/api/v1/admin/add-doctor`,
                formData,
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                toast.success(data.message || "Doctor registered successfully!");

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
            console.error("Add doctor error:", error.response?.data);
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong while adding the doctor"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="pb-4 border-b border-slate-200/80">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Practitioner Onboarding</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Add New Doctor
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                    Register and publish a certified medical practitioner to the MediBridge directory.
                </p>
            </div>

            {/* Form Card */}
            <form onSubmit={onSubmitHandler} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-8">
                {/* 1. Image Upload Dropzone */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Doctor Profile Photo
                    </label>
                    <div className="flex items-center gap-6">
                        <label
                            htmlFor="doc-img"
                            className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-cyan-50 to-slate-100 border-2 border-dashed border-slate-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all shadow-xs"
                        >
                            {docImg ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={URL.createObjectURL(docImg)}
                                    alt="Doctor Preview"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-slate-400 group-hover:text-primary">
                                    <Camera className="w-8 h-8 mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Upload</span>
                                </div>
                            )}
                        </label>

                        <input
                            onChange={(e) => setDocImg(e.target.files[0])}
                            type="file"
                            id="doc-img"
                            hidden
                            accept="image/*"
                        />

                        <div className="text-xs text-slate-500 space-y-1">
                            <p className="font-semibold text-slate-700">Recommended Dimensions</p>
                            <p>Square PNG, JPG or WebP (e.g. 500x500px). Max 5MB.</p>
                            {docImg && (
                                <p className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> File Selected: {docImg.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    {/* Doctor Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Dr. Alexander Wright"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Doctor Account Email
                        </label>
                        <input
                            type="email"
                            placeholder="alexander@medibridge.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Account Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                        />
                    </div>

                    {/* Speciality */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Primary Speciality
                        </label>
                        <select
                            value={speciality}
                            onChange={(e) => setSpeciality(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                        >
                            <option value="">Select Speciality</option>
                            <option value="General physician">General physician</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>

                    {/* Experience */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Experience
                        </label>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                        >
                            <option value="">Select Years</option>
                            <option value="1">1 Year</option>
                            <option value="2">2 Years</option>
                            <option value="3">3 Years</option>
                            <option value="4">4 Years</option>
                            <option value="5">5 Years</option>
                            <option value="6">6 Years</option>
                            <option value="7">7 Years</option>
                            <option value="8">8 Years</option>
                            <option value="9">9 Years</option>
                            <option value="10">10+ Years</option>
                        </select>
                    </div>

                    {/* Fees */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Consultation Fee
                        </label>
                        <input
                            type="number"
                            placeholder="500"
                            value={fees}
                            onChange={(e) => setFees(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                        />
                    </div>

                    {/* Education */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Medical Degree & Education
                        </label>
                        <input
                            type="text"
                            placeholder="MBBS, MD - General Medicine"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                        />
                    </div>

                    {/* Clinic Address Line 1 & 2 */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Clinic Address
                        </label>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Street Address Line 1"
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Suite, City, Postal Line 2"
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* About Doctor */}
                <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Doctor Biography & Experience Summary
                    </label>
                    <textarea
                        placeholder="Write a concise overview of the doctor's clinical background, specialties, and care philosophy..."
                        rows={4}
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>{loading ? "Registering Practitioner..." : "Add Doctor to Directory"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddDoctor;