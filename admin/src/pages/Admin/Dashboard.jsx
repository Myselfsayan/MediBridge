import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { 
    Users, 
    CalendarCheck, 
    UserCheck, 
    Clock, 
    XCircle, 
    CalendarDays, 
    Stethoscope, 
    ArrowRight,
    TrendingUp,
    ShieldCheck
} from "lucide-react";

const Dashboard = () => {
    const {
        getDashData,
        cancelAppointment,
        dashData,
        slotDateFormat
    } = useContext(AdminContext);

    useEffect(() => {
        getDashData();
    }, []);

    if (!dashData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading platform analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Administrative Overview
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                        Platform-wide healthcare activity, active doctors, and patient bookings.
                    </p>
                </div>
            </div>

            {/* Dashboard Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Doctors Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Registered Doctors
                        </span>
                        <p className="text-3xl font-extrabold text-slate-900">
                            {dashData.doctors}
                        </p>
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> Verified Specialists
                        </span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-primary flex items-center justify-center shrink-0">
                        <Stethoscope className="w-7 h-7" />
                    </div>
                </div>

                {/* 2. Appointments Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Total Appointments
                        </span>
                        <p className="text-3xl font-extrabold text-slate-900">
                            {dashData.appointments}
                        </p>
                        <span className="text-xs text-primary font-semibold flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" /> All-time bookings
                        </span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <CalendarCheck className="w-7 h-7" />
                    </div>
                </div>

                {/* 3. Patients Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Active Patients
                        </span>
                        <p className="text-3xl font-extrabold text-slate-900">
                            {dashData.patients}
                        </p>
                        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" /> Unique Patient Accounts
                        </span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Users className="w-7 h-7" />
                    </div>
                </div>
            </div>

            {/* Latest Bookings Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <h2 className="font-bold text-slate-900 text-base">
                            Recent Consultation Requests
                        </h2>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                        Latest {dashData.latestAppointments?.length || 0} Records
                    </span>
                </div>

                {/* Booking List */}
                {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {dashData.latestAppointments.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 transition-colors gap-4"
                            >
                                {/* Doctor info */}
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="w-11 h-11 rounded-full overflow-hidden bg-cyan-50 shrink-0 border border-slate-200">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={item.docData?.image}
                                            alt={item.docData?.name || "Doctor"}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {item.docData?.name}
                                        </p>
                                        <p className="text-xs text-primary font-medium truncate">
                                            {item.docData?.speciality}
                                        </p>
                                    </div>
                                </div>

                                {/* Appointment Date & Time */}
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg w-fit">
                                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{slotDateFormat(item.slotDate)}</span>
                                    <span>•</span>
                                    <span className="font-semibold text-slate-800">{item.slotTime}</span>
                                </div>

                                {/* Status / Cancel Action */}
                                <div className="flex items-center justify-end">
                                    {item.cancelled ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                                            <XCircle className="w-3.5 h-3.5" />
                                            Cancelled
                                        </span>
                                    ) : item.doctorConfirmed ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                            Completed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-white bg-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                            title="Cancel Appointment"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>Cancel Booking</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-slate-400 text-sm">
                        No recent bookings found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;