import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";



function MyAppointment() {

    const {
        backendUrl,
        isLoggedIn,
        paidAppointments,
        cancelAndRefund
    } = useContext(AppContext);

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [localPaidAppointments, setLocalPaidAppointments] = useState({});
        const [loading, setLoading] = useState(false);

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


    // ==========================================
    // LOAD PAYMENT STATUS
    // ==========================================

    const loadPaymentStatus = () => {

        try {

            const savedPayments = JSON.parse(
                localStorage.getItem("paidAppointments") || "{}"
            );

            setLocalPaidAppointments(savedPayments);

        } catch (error) {

            console.error(
                "Error loading payment status:",
                error
            );

            setLocalPaidAppointments({});
        }
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const slotDateFormat = (slotDate) => {

        if (!slotDate) {
            return "";
        }

        const dateArray = slotDate.split("_");

        return (
            dateArray[0] +
            " " +
            months[Number(dateArray[1]) - 1] +
            " " +
            dateArray[2]
        );
    };


    // ==========================================
    // GET USER APPOINTMENTS
    // ==========================================

    const getUserAppointments = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/v1/user/appointments`,
                {
                    withCredentials: true
                }
            );


            if (data.success) {

                const appointmentData =
                    data.data.appointments || [];

                setAppointments(
                    [...appointmentData].reverse()
                );

            } else {

                toast.error(data.message);
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    };


    // ==========================================
    // CANCEL APPOINTMENT
    // ==========================================

    const cancelAppointment = async (appointment) => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/user/cancel-appointment`,
                {
                    userId: appointment.userId,
                    appointmentId: appointment._id
                },
                {
                    withCredentials: true
                }
            );


            if (data.success) {

                toast.success(data.message);

                await getUserAppointments();

            } else {

                toast.error(data.message);
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    };

const handleRefund = async (appointmentId) => {

    try {

        const { data } = await axios.post(
            `${backendUrl}/api/v1/payment/refund`,
            {
                appointmentId
            }
        );

        if (!data.success) {
            toast.error(data.message);
            return false;
        }


        // ==========================================
        // UPDATE UI IMMEDIATELY
        // ==========================================

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
            error.response?.data?.message ||
            "Refund failed"
        );

        return false;
    }
};

    // ==========================================
    // CHECK PAYMENT STATUS
    // ==========================================

const isAppointmentPaid = (appointment) => {
    return appointment?.paymentStatus === "paid";
};


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        if (isLoggedIn) {

            getUserAppointments();

            loadPaymentStatus();
        }

    }, [isLoggedIn]);


    // ==========================================
    // UPDATE PAYMENT STATUS WHEN PAGE BECOMES
    // ACTIVE AGAIN
    // ==========================================

    useEffect(() => {

        const handleFocus = () => {

            loadPaymentStatus();
        };


        window.addEventListener(
            "focus",
            handleFocus
        );


        return () => {

            window.removeEventListener(
                "focus",
                handleFocus
            );

        };

    }, []);


    // ==========================================
    // KEEP LOCAL PAYMENT STATE IN SYNC
    // ==========================================

    useEffect(() => {

        loadPaymentStatus();

    }, [paidAppointments]);


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div>

            {/* ==========================================
                TITLE
            ========================================== */}

            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
                My appointments
            </p>


            {/* ==========================================
                APPOINTMENTS
            ========================================== */}

            <div>

                {appointments
                    .slice(0, 4)
                    .map((item, index) => {

                        const paid = isAppointmentPaid(item);


                        return (

                            <div
                                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
                                key={item._id || index}
                            >


                                {/* ==========================================
                                    DOCTOR IMAGE
                                ========================================== */}

                                <div>

                                    <img
                                        className="w-32 bg-indigo-50"
                                        src={item.docData?.image}
                                        alt=""
                                    />

                                </div>


                                {/* ==========================================
                                    DOCTOR DETAILS
                                ========================================== */}

                                <div className="flex-1 text-sm text-zinc-600">

                                    <p className="text-neutral-800 font-semibold">
                                        {item.docData?.name}
                                    </p>


                                    <p>
                                        {item.docData?.speciality}
                                    </p>


                                    <p className="text-zinc-700 font-medium mt-1">
                                        Address:
                                    </p>


                                    <p className="text-xs">
                                        {item.docData?.address?.line1}
                                    </p>


                                    <p className="text-xs">
                                        {item.docData?.address?.line2}
                                    </p>


                                    {/* Date & Time */}

                                    <p className="text-xs mt-1">

                                        <span className="text-sm text-neutral-700 font-medium">
                                            Date & Time:
                                        </span>

                                        {" "}

                                        {slotDateFormat(
                                            item.slotDate
                                        )}

                                        {" | "}

                                        {item.slotTime}

                                    </p>

                                </div>


                                <div></div>


                                {/* ==========================================
                                    BUTTONS
                                ========================================== */}

                                <div className="flex flex-col gap-2 justify-end">


                                    {/* ==========================================
                                        CANCELLED
                                    ========================================== */}

                                    {item.cancelled && (

                                        <button
                                            type="button"
                                            className="sm:min-w-48 py-2 border border-red-500 text-red-500 rounded"
                                        >
                                            Cancelled
                                        </button>

                                    )}


                                    {/* ==========================================
                                        PAID
                                    ========================================== */}

                                    {!item.cancelled && paid && (

                                        <>

                                            <button
                                                type="button"
                                                className="text-sm text-center sm:min-w-48 py-2 border border-green-500 bg-green-50 text-green-700 rounded font-medium cursor-default flex items-center justify-center gap-1.5"
                                            >

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >

                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                    />

                                                    <path d="m9 12 2 2 4-4" />

                                                </svg>

                                                Paid

                                            </button>


                                            {/* Cancel & Refund */}

                                            {!item.doctorConfirmed && (

                                                <button
                                                    type="button"
                                                    onClick={async () => {

                                                        const refundSuccess =
                                                            await handleRefund(item._id);

                                                        if (refundSuccess) {

                                                            await cancelAppointment(item);

                                                            setLocalPaidAppointments((previous) => {

                                                                const updated = {
                                                                    ...previous
                                                                };

                                                                delete updated[item._id];

                                                                return updated;
                                                            });
                                                        }

                                                    }}
                                                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                                                >
                                                    Cancel & Refund
                                                </button>

                                            )}

                                        </>

                                    )}


                                    {/* ==========================================
                                        UNPAID & DOCTOR CONFIRMED (PAID IN CASH)
                                    ========================================== */}

                                    {!item.cancelled && !paid && item.doctorConfirmed && (

                                        <button
                                            type="button"
                                            className="text-sm text-center sm:min-w-48 py-2 border border-green-500 bg-green-50 text-green-700 rounded font-medium cursor-default flex items-center justify-center gap-1.5"
                                        >
                                            Paid in Cash
                                        </button>

                                    )}


                                    {/* ==========================================
                                        UNPAID & NOT CONFIRMED
                                    ========================================== */}

                                    {!item.cancelled && !paid && !item.doctorConfirmed && (

                                        <>

                                            {/* Pay Online */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        "/demo-payment",
                                                        {
                                                            state: {

                                                                appointmentId:
                                                                    item._id,

                                                                doctorName:
                                                                    item.docData?.name,

                                                                speciality:
                                                                    item.docData?.speciality,

                                                                appointmentDate:
                                                                    slotDateFormat(
                                                                        item.slotDate
                                                                    ),

                                                                appointmentTime:
                                                                    item.slotTime,

                                                                fees:
                                                                    item.docData?.fees ||
                                                                    item.amount ||
                                                                    500
                                                            }
                                                        }
                                                    )
                                                }
                                                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                                            >

                                                Pay Online

                                            </button>


                                            {/* Cancel Appointment */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cancelAppointment(
                                                        item
                                                    )
                                                }
                                                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                                            >

                                                Cancel appointment

                                            </button>

                                        </>

                                    )}

                                </div>

                            </div>

                        );

                    })}

            </div>

        </div>
    );
}


export default MyAppointment;