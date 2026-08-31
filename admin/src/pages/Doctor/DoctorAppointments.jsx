import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const DoctorAppointments = () => {

    const {
        dToken,
        appointments,
        getDoctorAppointments,
        cancelAppointment,
        acceptAppointment
    } = useContext(DoctorContext);

    const {
        calculateAge
    } = useContext(AppContext);


    // ==========================================
    // LOAD DOCTOR APPOINTMENTS
    // ==========================================

    useEffect(() => {

        if (dToken) {

            getDoctorAppointments();

        }

    }, [dToken]);


    // ==========================================
    // DATE FORMAT
    // ==========================================

    const formatDate = (slotDate) => {

        if (!slotDate) {
            return "N/A";
        }

        const dateArray = slotDate.split("_");

        if (dateArray.length !== 3) {
            return slotDate;
        }

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        return (
            dateArray[0] +
            " " +
            months[Number(dateArray[1]) - 1] +
            " " +
            dateArray[2]
        );

    };


    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    const getPaymentStatus = (paymentStatus) => {

        if (paymentStatus === "paid") {

            return (
                <span className="bg-green-50 text-green-600 border border-green-100 rounded-full px-3 py-1 text-xs font-medium">
                    Paid
                </span>
            );

        }

        if (paymentStatus === "refunded") {

            return (
                <span className="bg-purple-50 text-purple-600 border border-purple-100 rounded-full px-3 py-1 text-xs font-medium">
                    Refunded
                </span>
            );

        }

        if (paymentStatus === "failed") {

            return (
                <span className="bg-red-50 text-red-600 border border-red-100 rounded-full px-3 py-1 text-xs font-medium">
                    Failed
                </span>
            );

        }

        return (
            <span className="bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full px-3 py-1 text-xs font-medium">
                Pending
            </span>
        );

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="w-full max-w-6xl m-5">

            {/* ==========================================
                TITLE
            ========================================== */}

            <p className="mb-3 text-lg font-medium text-slate-900">
                All Appointments
            </p>


            {/* ==========================================
                APPOINTMENT TABLE
            ========================================== */}

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm text-sm max-h-[80vh] overflow-y-scroll">


                {/* ==========================================
                    TABLE HEADER

                    # | Patient | Payment | Age |
                    Date & Time | Fees | Action
                ========================================== */}

                <div className="hidden sm:grid grid-cols-[0.5fr_2.5fr_1.5fr_1fr_2fr_1fr_1.5fr] gap-4 py-3 px-6 border-b bg-slate-50 text-slate-600 font-medium">

                    <p>#</p>

                    <p>Patient</p>

                    <p>Payment</p>

                    <p>Age</p>

                    <p>Date & Time</p>

                    <p>Fees</p>

                    <p>Action</p>

                </div>


                {/* ==========================================
                    APPOINTMENT LIST
                ========================================== */}

                {appointments && appointments.length > 0 ? (

                    appointments.map((item, index) => (

                        <div
                            key={item._id || index}
                            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2.5fr_1.5fr_1fr_2fr_1fr_1.5fr] gap-4 items-center py-4 px-6 border-b text-slate-600 hover:bg-slate-50 transition"
                        >


                            {/* ==========================================
                                #
                            ========================================== */}

                            <p className="max-sm:hidden">
                                {index + 1}
                            </p>


                            {/* ==========================================
                                PATIENT
                            ========================================== */}

                            <div className="flex items-center gap-3">

                                <img
                                    className="w-8 h-8 rounded-full object-cover shadow-sm"
                                    src={item.userData?.image}
                                    alt=""
                                />

                                <p className="font-medium text-slate-700">
                                    {item.userData?.name || "N/A"}
                                </p>

                            </div>


                            {/* ==========================================
                                PAYMENT
                            ========================================== */}

                            <div>

                                {getPaymentStatus(
                                    item.paymentStatus
                                )}

                            </div>


                            {/* ==========================================
                                AGE
                            ========================================== */}

                            <p className="max-sm:hidden">

                                {item.userData?.dob
                                    ? calculateAge(item.userData.dob)
                                    : "N/A"}

                            </p>


                            {/* ==========================================
                                DATE & TIME
                            ========================================== */}

                            <p>

                                {formatDate(item.slotDate)}

                                <br />

                                <span className="text-slate-500 text-xs">
                                    {item.slotTime || ""}
                                </span>

                            </p>


                            {/* ==========================================
                                FEES
                            ========================================== */}

                            <p className="font-medium">

                                ₹{item.amount || 0}

                            </p>


                            {/* ==========================================
                                ACTION
                            ========================================== */}

                            <div>

                                {item.cancelled ? (

                                    <span className="bg-red-50 text-red-600 rounded-full px-3 py-1 text-xs font-medium border border-red-100">
                                        Cancelled
                                    </span>

                                ) : item.doctorConfirmed ? (

                                    <span className="bg-green-50 text-green-600 rounded-full px-3 py-1 text-xs font-medium border border-green-100">
                                        Accepted
                                    </span>

                                ) : (

                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() =>
                                                acceptAppointment(item._id)
                                            }
                                            className="text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer border border-transparent hover:border-green-100"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            onClick={() =>
                                                cancelAppointment(item._id)
                                            }
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer border border-transparent hover:border-red-100"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="py-10 text-center text-slate-500">
                        No appointments found
                    </div>

                )}

            </div>

        </div>

    );

};

export default DoctorAppointments;