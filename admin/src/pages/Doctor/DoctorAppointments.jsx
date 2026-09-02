import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { 
    CalendarDays, 
    Clock, 
    User, 
    Check, 
    X, 
    CheckCircle2, 
    XCircle, 
    RefreshCw, 
    DollarSign,
    Banknote
} from "lucide-react";

const DoctorAppointments = () => {
    const {
        appointments,
        getDoctorAppointments,
        cancelAppointment,
        acceptAppointment
    } = useContext(DoctorContext);

    const { calculateAge, formatDate, currency } = useContext(AppContext);

    useEffect(() => {
        getDoctorAppointments();
    }, []);

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
                        <span>Doctor Practice</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        My Patient Consultations
                    </h1>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    Total: {appointments?.length || 0} Scheduled Patient Visits
                </p>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        {/* Header */}
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-4 sm:px-6 w-12 text-center">#</th>
                                <th className="py-4 px-4 sm:px-6">Patient</th>
                                <th className="py-4 px-4 sm:px-6">Payment</th>
                                <th className="py-4 px-4 sm:px-6">Age</th>
                                <th className="py-4 px-4 sm:px-6">Date & Slot</th>
                                <th className="py-4 px-4 sm:px-6">Fee</th>
                                <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* Body */}
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
                                                    {item.userData?.name || "Patient"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Payment Status */}
                                        <td className="py-4 px-4 sm:px-6">
                                            {getPaymentStatusBadge(item)}
                                        </td>

                                        {/* Age */}
                                        <td className="py-4 px-4 sm:px-6 text-slate-600">
                                            {item.userData?.dob ? calculateAge(item.userData.dob) : "N/A"}
                                        </td>

                                        {/* Date & Slot */}
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-slate-900 text-xs">
                                                    {formatDate ? formatDate(item.slotDate) : item.slotDate}
                                                </p>
                                                <p className="text-xs text-primary font-medium flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{item.slotTime || ""}</span>
                                                </p>
                                            </div>
                                        </td>

                                        {/* Fee */}
                                        <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                                            {currency || "₹"}{item.amount || 500}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-4 sm:px-6 text-right">
                                            {item.cancelled ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                                                    Cancelled
                                                </span>
                                            ) : item.doctorConfirmed ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                                    Accepted
                                                </span>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => acceptAppointment(item._id)}
                                                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Accept</span>
                                                    </button>

                                                    <button
                                                        onClick={() => cancelAppointment(item._id)}
                                                        className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        No scheduled patient appointments found.
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

export default DoctorAppointments;