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
                        className="px-6 py-2 bg-primary text-white rounded"
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

        <div className="min-h-[80vh] flex justify-center items-center px-4">

            <div className="w-full max-w-md border rounded-lg shadow-sm p-6 bg-white">


                {/* ==========================================
                    TITLE
                ========================================== */}

                <h1 className="text-xl font-semibold text-gray-800 text-center mb-6">
                    Demo Payment
                </h1>


                {/* ==========================================
                    APPOINTMENT DETAILS
                ========================================== */}

                <div className="space-y-3 text-sm text-gray-600">


                    {/* Doctor */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Doctor
                        </span>

                        <span className="font-medium text-gray-800 text-right">
                            {doctorName || "N/A"}
                        </span>

                    </div>


                    {/* Speciality */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Speciality
                        </span>

                        <span className="font-medium text-gray-800 text-right">
                            {speciality || "N/A"}
                        </span>

                    </div>


                    {/* Date */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Date
                        </span>

                        <span className="font-medium text-gray-800 text-right">
                            {appointmentDate || "N/A"}
                        </span>

                    </div>


                    {/* Time */}

                    <div className="flex justify-between gap-4">

                        <span>
                            Time
                        </span>

                        <span className="font-medium text-gray-800 text-right">
                            {appointmentTime || "N/A"}
                        </span>

                    </div>


                    {/* Amount */}

                    <div className="border-t pt-3 mt-3 flex justify-between">

                        <span className="font-medium text-gray-800">
                            Amount
                        </span>

                        <span className="font-semibold text-gray-800">
                            ₹{fees || 500}
                        </span>

                    </div>

                </div>


                {/* ==========================================
                    DEMO NOTICE
                ========================================== */}

                <div className="mt-6 p-3 rounded bg-yellow-50 border border-yellow-200">

                    <p className="text-xs text-yellow-700 text-center">
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
                    className="w-full mt-6 py-3 bg-primary text-white rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
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
                    className="w-full mt-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>

            </div>

        </div>
    );
}

export default DemoPayment;