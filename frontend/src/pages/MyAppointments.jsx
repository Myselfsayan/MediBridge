import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
    Calendar, 
    Clock, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    XCircle, 
    RefreshCw, 
    AlertCircle,
    CalendarDays,
    ArrowRight,
    Stethoscope,
    ShieldAlert
} from "lucide-react";

function MyAppointment() {
    const {
        backendUrl,
        isLoggedIn,
        paidAppointments,
        currencySymbol
    } = useContext(AppContext);

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [localPaidAppointments, setLocalPaidAppointments] = useState({});
    const [loading, setLoading] = useState(false);

    // MONTHS
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // LOAD PAYMENT STATUS
    const loadPaymentStatus = () => {
        try {
            const savedPayments = JSON.parse(
                localStorage.getItem("paidAppointments") || "{}"
            );
            setLocalPaidAppointments(savedPayments);
        } catch (error) {
            console.error("Error loading payment status:", error);
            setLocalPaidAppointments({});
        }
    };

    // FORMAT DATE
    const slotDateFormat = (slotDate) => {
        if (!slotDate) return "";
        const dateArray = slotDate.split("_");
        if (dateArray.length !== 3) return slotDate;
        return (
            dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
        );
    };

    // GET USER APPOINTMENTS
    const getUserAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${backendUrl}/api/v1/user/appointments`,
                { withCredentials: true }
            );

            if (data.success) {
                const appointmentData = data.data.appointments || [];
                setAppointments([...appointmentData].reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Get appointments error:", error);
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // CHECK PAYMENT STATUS
    const isAppointmentPaid = (appointment) => {
        return appointment?.paymentStatus === "paid";
    };

    // CANCEL APPOINTMENT
    const cancelAppointment = async (appointment) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/v1/user/cancel-appointment`,
                {
                    userId: appointment.userId,
                    appointmentId: appointment._id
                },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message);
                await getUserAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Cancel appointment error:", error);
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    };

    // REFUND
    const handleRefund = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/v1/payment/refund`,
                { appointmentId },
                { withCredentials: true }
            );

            if (!data.success) {
                toast.error(data.message);
                return false;
            }

            // UPDATE APPOINTMENT LOCALLY
            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) => {
                    if (appointment._id === appointmentId) {
                        return {
                            ...appointment,
                            paymentStatus: "refunded",
                            cancelled: true
                        };
                    }
                    return appointment;
                })
            );

            toast.success("Appointment cancelled and payment refunded");
            return true;
        } catch (error) {
            console.error("Refund error:", error);
            toast.error(
                error.response?.data?.message || "Refund failed"
            );
            return false;
        }
    };

    // INITIAL LOAD
    useEffect(() => {
        if (isLoggedIn) {
            getUserAppointments();
            loadPaymentStatus();
        }
    }, [isLoggedIn]);

    // REFRESH WHEN WINDOW GETS FOCUS
    useEffect(() => {
        const handleFocus = () => {
            loadPaymentStatus();
            getUserAppointments();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    // SYNC PAYMENT STATE
    useEffect(() => {
        loadPaymentStatus();
    }, [paidAppointments]);

    return (
        <div className="py-6 sm:py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/80">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Schedule Overview</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        My Appointments
                    </h1>
                </div>
                <p className="text-slate-500 text-sm">
                    {appointments.length} total scheduled {appointments.length === 1 ? 'session' : 'sessions'}
                </p>
            </div>

            {/* Loading Skeleton */}
            {loading && appointments.length === 0 ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse flex flex-col sm:flex-row gap-6">
                            <div className="w-28 h-28 bg-slate-100 rounded-xl shrink-0"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-slate-100 rounded w-1/3"></div>
                                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : appointments.length > 0 ? (
                /* Appointments List */
                <div className="space-y-4">
                    {appointments.map((item, index) => {
                        const paid = isAppointmentPaid(item);

                        return (
                            <div
                                key={item._id || index}
                                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                {/* Left Side: Doctor Image & Details */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
                                    {/* Doctor Thumbnail */}
                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-cyan-50 to-slate-100 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
                                        <img
                                            className="w-full h-full object-cover object-top"
                                            src={item.docData?.image}
                                            alt={item.docData?.name || "Doctor"}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                                                {item.docData?.name}
                                            </h3>
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-primary font-semibold border border-cyan-100/80">
                                                {item.docData?.speciality}
                                            </span>
                                        </div>

                                        {/* Address */}
                                        {item.docData?.address && (
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">
                                                    {item.docData.address.line1}, {item.docData.address.line2}
                                                </span>
                                            </p>
                                        )}

                                        {/* Date & Time Pill */}
                                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                {slotDateFormat(item.slotDate)}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                                                <Clock className="w-3.5 h-3.5 text-primary" />
                                                {item.slotTime}
                                            </span>
                                            <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                                Fee: {currencySymbol || "₹"}{item.docData?.fees || item.amount || 500}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Status Badges & Action Buttons */}
                                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                                    {/* 1. CANCELLED */}
                                    {item.cancelled && (
                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 min-w-40 sm:min-w-44">
                                                <XCircle className="w-4 h-4 text-rose-600" />
                                                <span>Cancelled</span>
                                            </div>

                                            {item.paymentStatus === "refunded" && (
                                                <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 min-w-40 sm:min-w-44">
                                                    <RefreshCw className="w-4 h-4 text-purple-600" />
                                                    <span>Refund Processed</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 2. APPOINTMENT COMPLETED */}
                                    {!item.cancelled && item.doctorConfirmed && (
                                        <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 min-w-40 sm:min-w-44">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span>Appointment Completed</span>
                                        </div>
                                    )}

                                    {/* 3. PAID (ONLINE) */}
                                    {!item.cancelled && !item.doctorConfirmed && item.paymentStatus === "paid" && (
                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 min-w-40 sm:min-w-44">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span>Payment Verified (Paid)</span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const refundSuccess = await handleRefund(item._id);
                                                    if (refundSuccess) {
                                                        await cancelAppointment(item);
                                                        setLocalPaidAppointments((previous) => {
                                                            const updated = { ...previous };
                                                            delete updated[item._id];
                                                            return updated;
                                                        });
                                                    }
                                                }}
                                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 transition-colors min-w-40 sm:min-w-44 cursor-pointer"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                <span>Cancel & Refund</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* 4. UNPAID / PENDING */}
                                    {!item.cancelled && !item.doctorConfirmed && item.paymentStatus !== "paid" && (
                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate("/demo-payment", {
                                                        state: {
                                                            appointmentId: item._id,
                                                            doctorName: item.docData?.name,
                                                            speciality: item.docData?.speciality,
                                                            appointmentDate: slotDateFormat(item.slotDate),
                                                            appointmentTime: item.slotTime,
                                                            fees: item.docData?.fees || item.amount || 500
                                                        }
                                                    })
                                                }
                                                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary shadow-xs hover:shadow-md transition-all min-w-40 sm:min-w-44 cursor-pointer"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                <span>Pay Online</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => cancelAppointment(item)}
                                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors min-w-40 sm:min-w-44 cursor-pointer"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                <span>Cancel Appointment</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-cyan-50 text-primary flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                        No Scheduled Appointments
                    </h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                        You don't have any booked appointments yet. Browse through our top medical practitioners and book a slot today.
                    </p>
                    <button
                        onClick={() => navigate('/doctors')}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-cyan-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow-sm transition-all"
                    >
                        <span>Book an Appointment</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default MyAppointment;