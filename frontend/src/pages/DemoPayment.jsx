import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { 
    ShieldCheck, 
    CreditCard, 
    Calendar, 
    Clock, 
    Stethoscope, 
    User, 
    AlertTriangle, 
    ArrowLeft,
    CheckCircle2,
    Lock,
    XCircle
} from "lucide-react";

function DemoPayment() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        backendUrl,
        markAppointmentAsPaid,
        currencySymbol
    } = useContext(AppContext);

    const {
        appointmentId,
        doctorName,
        speciality,
        appointmentDate,
        appointmentTime,
        fees
    } = location.state || {};

    const [loading, setLoading] = useState(false);

    // PAYMENT SUCCESS
    const handlePaymentSuccess = async () => {
        if (!appointmentId) {
            toast.error("Appointment information is missing");
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/v1/payment/success`,
                { appointmentId }
            );

            if (!data.success) {
                toast.error(data.message || "Payment update failed");
                setLoading(false);
                return;
            }

            markAppointmentAsPaid(appointmentId);
            toast.success("Payment verified successfully!");
            navigate("/my-appointments", { replace: true });
        } catch (error) {
            console.error("Payment success error:", error);
            toast.error(
                error.response?.data?.message ||
                "Payment failed. Please try again."
            );
            setLoading(false);
        }
    };

    // PAYMENT FAILED
    const handlePaymentFailed = async () => {
        if (!appointmentId) {
            toast.error("Appointment information is missing");
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/v1/payment/failed`,
                { appointmentId }
            );

            if (!data.success) {
                toast.error(data.message || "Payment failed");
                setLoading(false);
                return;
            }

            toast.error("Payment was declined or failed.");
            navigate("/my-appointments", { replace: true });
        } catch (error) {
            console.error("Payment failed error:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to update payment status."
            );
            setLoading(false);
        }
    };

    // MISSING APPOINTMENT INFORMATION
    if (!appointmentId) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] px-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 max-w-md w-full text-center shadow-xs">
                    <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Missing Appointment Information
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                        We could not find the selected appointment details. Please go back to your appointments list.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/my-appointments")}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-cyan-700 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Appointments</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[75vh] flex justify-center items-center px-4 py-8 sm:py-12">
            <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-700 to-teal-700 px-6 sm:px-8 py-6 text-white text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Secure Checkout</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold">
                        Consultation Payment
                    </h1>
                    <p className="text-xs text-cyan-100 mt-1">
                        MediBridge Healthcare Gateway (Demo Mode)
                    </p>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                    {/* Appointment Summary Box */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3.5 text-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Doctor Details
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-primary font-semibold border border-cyan-100">
                                {speciality || "Specialist"}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-xs">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-base">
                                    {doctorName || "Certified Doctor"}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {speciality} Consultation
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60">
                                <Calendar className="w-4 h-4 text-primary shrink-0" />
                                <span className="font-medium truncate">{appointmentDate || "Scheduled Date"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60">
                                <Clock className="w-4 h-4 text-primary shrink-0" />
                                <span className="font-medium truncate">{appointmentTime || "Time"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Calculation */}
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Consultation Fee</span>
                            <span className="font-semibold text-slate-900">
                                {currencySymbol || "₹"}{fees || 500}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Platform & Technology Fee</span>
                            <span className="font-medium text-emerald-600">FREE</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                            <span className="font-bold text-slate-900 text-base">Total Payable</span>
                            <span className="text-2xl font-extrabold text-primary">
                                {currencySymbol || "₹"}{fees || 500}
                            </span>
                        </div>
                    </div>

                    {/* Demo Notice Alert */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            <strong>Demo Payment Mode:</strong> This simulates a real payment gateway. No actual card charges will be made.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        {/* Success Pay Button */}
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handlePaymentSuccess}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary text-white rounded-xl font-bold shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>
                                {loading ? "Verifying Transaction..." : `Pay ${currencySymbol || "₹"}${fees || 500}`}
                            </span>
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Failed Button */}
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handlePaymentFailed}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Simulate Failure</span>
                            </button>

                            {/* Cancel Button */}
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => navigate("/my-appointments")}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DemoPayment;

