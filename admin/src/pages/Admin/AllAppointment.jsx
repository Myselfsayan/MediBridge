import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { 
    Calendar, 
    Clock, 
    CalendarDays, 
    User, 
    Stethoscope, 
    CheckCircle2, 
    XCircle, 
    RefreshCw, 
    AlertCircle,
    UserCheck,
    Search
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
                    <table className="w-full text-left border-collapse text-sm">
                        {/* Table Header */}
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-4 sm:px-6 w-12 text-center">#</th>
                                <th className="py-4 px-4 sm:px-6">Patient</th>
                                <th className="py-4 px-4 sm:px-6">Age</th>
                                <th className="py-4 px-4 sm:px-6">Date & Slot</th>
                                <th className="py-4 px-4 sm:px-6">Assigned Doctor</th>
                                <th className="py-4 px-4 sm:px-6">Fees</th>
                                <th className="py-4 px-4 sm:px-6">Payment</th>
                                <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-100">
                            {appointments && appointments.length > 0 ? (
                                appointments.map((item, index) => (
                                    <tr 
                                        key={item._id || index}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        {/* Number */}
                                        <td className="py-4 px-4 sm:px-6 text-center text-xs font-bold text-slate-400">
                                            {index + 1}
                                        </td>

                                        {/* Patient */}
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={item.userData?.image || "https://avatar.iran.liara.run/public"}
                                                        alt={item.userData?.name || "Patient"}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-900 truncate max-w-[140px]">
                                                    {item.userData?.name || "Anonymous Patient"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Age */}
                                        <td className="py-4 px-4 sm:px-6 text-slate-600">
                                            {item.userData?.dob ? calculateAge(item.userData.dob) : "N/A"}
                                        </td>

                                        {/* Date & Time */}
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-slate-900 text-xs">
                                                    {slotDateFormat(item.slotDate) || "N/A"}
                                                </p>
                                                <p className="text-xs text-primary font-medium flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{item.slotTime || ""}</span>
                                                </p>
                                            </div>
                                        </td>

                                        {/* Doctor */}
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-cyan-50 overflow-hidden shrink-0 border border-slate-200">
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={item.docData?.image}
                                                        alt={item.docData?.name || "Doctor"}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-xs truncate max-w-[130px]">
                                                        {item.docData?.name || "Doctor"}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                                                        {item.docData?.speciality}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Fees */}
                                        <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                                            {currency || "₹"}{item.amount || item.docData?.fees || 500}
                                        </td>

                                        {/* Payment Status */}
                                        <td className="py-4 px-4 sm:px-6">
                                            {item.paymentStatus === "paid" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                    Paid
                                                </span>
                                            ) : item.paymentStatus === "refunded" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                    <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                                                    Refunded
                                                </span>
                                            ) : item.paymentStatus === "failed" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                                    Failed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-4 sm:px-6 text-right">
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
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-white bg-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    <span>Cancel</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400">
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