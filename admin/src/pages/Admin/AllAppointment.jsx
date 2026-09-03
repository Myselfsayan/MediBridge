import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { 
    Clock, 
    CalendarDays, 
    User, 
    Stethoscope, 
    CheckCircle2, 
    XCircle, 
    RefreshCw, 
    Banknote,
    Mail,
    Phone,
    MapPin,
    Award
} from "lucide-react";

const AllAppointments = () => {
    const {
        appointments,
        getAllAppointments,
        isAdminLoggedIn,
        cancelAppointment,
        slotDateFormat
    } = useContext(AdminContext);

    const { calculateAge, currency } = useContext(AppContext);

    useEffect(() => {
        if (isAdminLoggedIn) {
            getAllAppointments();
        }
    }, [isAdminLoggedIn]);

    const getPaymentStatusBadge = (appointment) => {
        if (appointment.paymentStatus === "paid") {
            return (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Paid
                </span>
            );
        }

        if (
            appointment.paymentStatus === "cash" ||
            (appointment.paymentStatus === "pending" && appointment.doctorConfirmed)
        ) {
            return (
                <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full px-2.5 py-1 text-xs font-bold">
                    <Banknote className="w-3.5 h-3.5 text-primary" />
                    Pay in Clinic
                </span>
            );
        }

        if (appointment.paymentStatus === "refunded") {
            return (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2.5 py-1 text-xs font-bold">
                    <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                    Refunded
                </span>
            );
        }

        if (appointment.paymentStatus === "failed") {
            return (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1 text-xs font-bold">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Failed
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Pending
            </span>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Master Schedule</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        All Patient Bookings
                    </h1>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    Total: {appointments?.length || 0} scheduled records
                </p>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm min-w-[900px]">
                        {/* Table Header */}
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-4 sm:px-6 w-12 text-center">#</th>
                                <th className="py-4 px-4 sm:px-6 min-w-[200px]">Patient</th>
                                <th className="py-4 px-4 sm:px-6 min-w-[220px]">Assigned Doctor</th>
                                <th className="py-4 px-4 sm:px-6 min-w-[150px]">Date & Slot</th>
                                <th className="py-4 px-4 sm:px-6 min-w-[130px]">Fee & Payment</th>
                                <th className="py-4 px-4 sm:px-6 text-right min-w-[110px]">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-100">
                            {appointments && appointments.length > 0 ? (
                                appointments.map((item, index) => {
                                    const userAge = item.userData?.dob ? calculateAge(item.userData.dob) : null;
                                    const userGender = item.userData?.gender && item.userData.gender !== "Not Selected" ? item.userData.gender : null;
                                    const userLocation = item.userData?.address?.city || item.userData?.address?.line1 || null;
                                    const doctorLocation = item.docData?.address?.line1 || null;

                                    return (
                                        <tr 
                                            key={item._id || index}
                                            className="hover:bg-slate-50/60 transition-colors"
                                        >
                                            {/* Number */}
                                            <td className="py-4 px-4 sm:px-6 text-center text-xs font-bold text-slate-400 align-top">
                                                {index + 1}
                                            </td>

                                            {/* Patient Information */}
                                            <td className="py-4 px-4 sm:px-6 align-top">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200 mt-0.5">
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={item.userData?.image || "https://avatar.iran.liara.run/public"}
                                                            alt={item.userData?.name || "Patient"}
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <p className="font-bold text-slate-900 text-sm truncate max-w-[170px]">
                                                            {item.userData?.name || "Anonymous Patient"}
                                                        </p>

                                                        {/* Demographics: Age & Gender */}
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                            {userAge && <span>{userAge} yrs</span>}
                                                            {userAge && userGender && <span>•</span>}
                                                            {userGender && <span>{userGender}</span>}
                                                            {!userAge && !userGender && <span className="text-slate-400">Patient</span>}
                                                        </div>

                                                        {/* Email */}
                                                        {item.userData?.email && (
                                                            <p className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                                                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                                                <span className="truncate">{item.userData.email}</span>
                                                            </p>
                                                        )}

                                                        {/* Phone */}
                                                        {item.userData?.phone && (
                                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                                                <span>{item.userData.phone}</span>
                                                            </p>
                                                        )}

                                                        {/* Address */}
                                                        {userLocation && (
                                                            <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[180px]">
                                                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                                <span className="truncate">{userLocation}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Doctor Information */}
                                            <td className="py-4 px-4 sm:px-6 align-top">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-50 overflow-hidden shrink-0 border border-slate-200 mt-0.5">
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={item.docData?.image}
                                                            alt={item.docData?.name || "Doctor"}
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <p className="font-bold text-slate-900 text-sm truncate max-w-[180px]">
                                                            {item.docData?.name || "Doctor"}
                                                        </p>
                                                        
                                                        {/* Speciality & Degree */}
                                                        <p className="text-xs text-primary font-semibold truncate max-w-[180px]">
                                                            {item.docData?.speciality || "Specialist"}
                                                            {item.docData?.degree && <span className="text-slate-400 font-normal"> • {item.docData.degree}</span>}
                                                        </p>

                                                        {/* Experience */}
                                                        {item.docData?.experience && (
                                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Award className="w-3 h-3 text-primary shrink-0" />
                                                                <span>{item.docData.experience} exp</span>
                                                            </p>
                                                        )}

                                                        {/* Email */}
                                                        {item.docData?.email && (
                                                            <p className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                                                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                                                <span className="truncate">{item.docData.email}</span>
                                                            </p>
                                                        )}

                                                        {/* Clinic Location */}
                                                        {doctorLocation && (
                                                            <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[180px]">
                                                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                                <span className="truncate">{doctorLocation}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date & Time */}
                                            <td className="py-4 px-4 sm:px-6 align-top">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-900 text-xs">
                                                        {slotDateFormat(item.slotDate) || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-primary font-semibold flex items-center gap-1 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-md w-fit">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{item.slotTime || ""}</span>
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Fees & Payment Status */}
                                            <td className="py-4 px-4 sm:px-6 align-top space-y-1.5">
                                                <p className="font-extrabold text-slate-900 text-sm">
                                                    {currency || "₹"}{item.amount || item.docData?.fees || 500}
                                                </p>
                                                <div>
                                                    {getPaymentStatusBadge(item)}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4 sm:px-6 text-right align-top">
                                                {item.cancelled ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                                                        Cancelled
                                                    </span>
                                                ) : item.isCompleted || item.doctorConfirmed ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => cancelAppointment(item._id)}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-white bg-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Cancel</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        No scheduled appointments found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllAppointments;