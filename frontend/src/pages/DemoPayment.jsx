import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

function DemoPayment() {

    const location = useLocation();
    const navigate = useNavigate();

    const { markAppointmentAsPaid } = useContext(AppContext);

    const {
        appointmentId,
        doctorName,
        speciality,
        appointmentDate,
        appointmentTime,
        fees
    } = location.state || {};

    const [loading, setLoading] = useState(false);


    // ==========================================
    // HANDLE DEMO PAYMENT
    // ==========================================

    const handlePayment = () => {

        if (!appointmentId) {
            toast.error("Appointment information is missing");
            return;
        }

        if (loading) {
            return;
        }

        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {

            try {

                // ==========================================
                // MARK APPOINTMENT AS PAID
                // ==========================================

                markAppointmentAsPaid(appointmentId);


                // ==========================================
                // SUCCESS MESSAGE
                // ==========================================

                toast.success("Payment successful!");


                // ==========================================
                // RETURN TO APPOINTMENTS
                // ==========================================

                navigate("/my-appointments", {
                    replace: true
                });


            } catch (error) {

                console.error(
                    "Payment error:",
                    error
                );

                toast.error(
                    "Payment failed. Please try again."
                );

                setLoading(false);
            }

        }, 1500);
    };


    // ==========================================
    // MISSING APPOINTMENT INFORMATION
    // ==========================================

    if (!appointmentId) {

        return (
            <div className="flex justify-center items-center min-h-[70vh]">

                <div className="text-center">

                    <p className="text-red-500 font-medium mb-4">
                        Appointment information is missing.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/my-appointments")
                        }
                        className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-cyan-700 transition"
                    >
                        Back to appointments
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // PAYMENT PAGE
    // ==========================================

    return (

        <div className="min-h-[80vh] flex justify-center items-center px-4 py-12 bg-slate-50">

            <div className="w-full max-w-md border border-slate-200 rounded-xl shadow-sm p-8 bg-white">


                {/* ==========================================
                    TITLE
                ========================================== */}

                <h1 className="text-2xl font-bold text-slate-900 text-center mb-8">
                    Demo Payment
                </h1>


                {/* ==========================================
                    APPOINTMENT DETAILS
                ========================================== */}

                <div className="space-y-4 text-sm text-slate-600">


                    {/* Doctor */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Doctor
                        </span>

                        <span className="font-semibold text-slate-900 text-right">
                            {doctorName || "N/A"}
                        </span>

                    </div>


                    {/* Speciality */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Speciality
                        </span>

                        <span className="font-medium text-slate-800 text-right">
                            {speciality || "N/A"}
                        </span>

                    </div>


                    {/* Date */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Date
                        </span>

                        <span className="font-medium text-slate-800 text-right">
                            {appointmentDate || "N/A"}
                        </span>

                    </div>


                    {/* Time */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Time
                        </span>

                        <span className="font-medium text-slate-800 text-right">
                            {appointmentTime || "N/A"}
                        </span>

                    </div>


                    {/* Amount */}

                    <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between">

                        <span className="font-semibold text-slate-900 text-base">
                            Amount
                        </span>

                        <span className="font-bold text-primary text-xl">
                            ₹{fees || 500}
                        </span>

                    </div>

                </div>


                {/* ==========================================
                    DEMO NOTICE
                ========================================== */}

                <div className="mt-8 p-4 rounded-lg bg-amber-50 border border-amber-200">

                    <p className="text-sm font-medium text-amber-700 text-center">
                        This is a demo payment gateway.
                        No real money will be charged.
                    </p>

                </div>


                {/* ==========================================
                    PAY BUTTON
                ========================================== */}

                <button
                    type="button"
                    disabled={loading}
                    onClick={handlePayment}
                    className="w-full mt-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-cyan-700 hover:shadow-md transition-all duration-300 disabled:opacity-50"
                >

                    {loading
                        ? "Processing Payment..."
                        : `Pay ₹${fees || 500}`
                    }

                </button>


                {/* ==========================================
                    CANCEL BUTTON
                ========================================== */}

                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        navigate("/my-appointments")
                    }
                    className="w-full mt-4 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300"
                >
                    Cancel
                </button>

            </div>

        </div>
    );
}

export default DemoPayment;