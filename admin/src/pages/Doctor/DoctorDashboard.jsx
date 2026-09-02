import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { 
    Wallet, 
    CalendarCheck, 
    Users, 
    Clock, 
    CalendarDays, 
    XCircle, 
    CheckCircle2,
    TrendingUp,
    Stethoscope
} from "lucide-react";

const DoctorDashboard = () => {
    const {
        dashData,
        getDashData,
        cancelAppointment,
    } = useContext(DoctorContext);

    const { currency, formatDate } = useContext(AppContext);

    useEffect(() => {
        getDashData();
    }, []);

    if (!dashData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading clinical overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Practitioner Dashboard</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Clinical Overview
                    </h1>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* 1. Earnings */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Total Practice Earnings
                        </span>
                        <p className="text-3xl font-extrabold text-slate-900">
                            {currency || "₹"} {dashData.earnings || 0}
                        </p>
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> Direct Consultation Revenue
                        </span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Wallet className="w-7 h-7" />
                    </div>
                </div>

                {/* 2. Appointments */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Patient Appointments
                        </span>
                        <p className="text-3xl font-extrabold text-slate-900">
                            {dashData.appointments || 0}
                        </p>
                        <span className="text-xs text-primary font-semibold flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" /> Total Bookings
                        </span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-primary flex items-center justify-center shrink-0">
                        <CalendarCheck className="w-7 h-7" />
                    </div>
                </div>

                {/* 3. Patients */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Unique Patients
                        </span>
                        <p className="text-3xl font-extrabold text-slate-900">
                            {dashData.patients || 0}
                        </p>
                        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Patient base
                        </span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Users className="w-7 h-7" />
                    </div>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <h2 className="font-bold text-slate-900 text-base">
                            Recent Patient Bookings
                        </h2>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                        Latest Consultations
                    </span>
                </div>

                {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {dashData.latestAppointments.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 transition-colors gap-4"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={item.userData?.image || "https://avatar.iran.liara.run/public"}
                                            alt={item.userData?.name || "Patient"}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {item.userData?.name || "Patient"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formatDate ? formatDate(item.slotDate) : item.slotDate} • {item.slotTime || ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    {item.cancelled ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                                            <XCircle className="w-3.5 h-3.5" />
                                            Cancelled
                                        </span>
                                    ) : item.isCompleted ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Completed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-white bg-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-slate-400 text-sm">
                        No recent patient appointments found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;