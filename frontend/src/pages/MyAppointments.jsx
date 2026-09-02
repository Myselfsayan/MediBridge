import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function MyAppointment() {

    const {
        backendUrl,
        isLoggedIn,
        paidAppointments
    } = useContext(AppContext);

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [localPaidAppointments, setLocalPaidAppointments] = useState({});
    const [loading, setLoading] = useState(false);


    // ==========================================
    // MONTHS
    // ==========================================

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

        if (dateArray.length !== 3) {
            return slotDate;
        }

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

            setLoading(true);

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

            console.error(
                "Get appointments error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // CHECK PAYMENT STATUS
    // ==========================================

    const isAppointmentPaid = (appointment) => {

        return appointment?.paymentStatus === "paid";

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

            console.error(
                "Cancel appointment error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    };


    // ==========================================
    // REFUND
    // ==========================================

    const handleRefund = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/payment/refund`,
                {
                    appointmentId
                },
                {
                    withCredentials: true
                }
            );


            if (!data.success) {

                toast.error(data.message);

                return false;
            }


            // ==========================================
            // UPDATE APPOINTMENT LOCALLY
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


            toast.success(
                "Appointment cancelled and payment refunded"
            );


            return true;

        } catch (error) {

            console.error(
                "Refund error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Refund failed"
            );

            return false;
        }
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
    // REFRESH WHEN WINDOW GETS FOCUS
    // ==========================================

    useEffect(() => {

        const handleFocus = () => {

            loadPaymentStatus();

            getUserAppointments();

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
    // SYNC PAYMENT STATE
    // ==========================================

    useEffect(() => {

        loadPaymentStatus();

    }, [paidAppointments]);


    // ==========================================
    // RETURN
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
                LOADING
            ========================================== */}

            {loading && appointments.length === 0 ? (

                <p className="py-5 text-sm text-gray-500">
                    Loading appointments...
                </p>

            ) : (

                <div>

                    {appointments
                        .slice(0, 10)
                        .map((item, index) => {

                            const paid =
                                isAppointmentPaid(item);


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


                                        {/* DATE + TIME */}

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
                                        STATUS / ACTIONS
                                    ========================================== */}

                                    <div className="flex flex-col gap-2 justify-end">


                                        {/* ==================================================
                                            1. CANCELLED
                                            
                                            ALWAYS SHOW CANCELLED
                                            
                                            If paymentStatus === refunded,
                                            ALSO SHOW REFUNDED.
                                        ================================================== */}

                                        {item.cancelled && (

                                            <>

                                                {/* CANCELLED */}

                                                <button
                                                    type="button"
                                                    className="text-sm text-center sm:min-w-48 py-2 border border-red-500 bg-red-50 text-red-600 rounded font-medium cursor-default"
                                                >
                                                    Cancelled
                                                </button>


                                                {/* REFUNDED */}

                                                {item.paymentStatus === "refunded" && (

                                                    <button
                                                        type="button"
                                                        className="text-sm text-center sm:min-w-48 py-2 border border-green-500 bg-green-50 text-green-700 rounded font-medium cursor-default"
                                                    >
                                                        Refunded
                                                    </button>

                                                )}

                                            </>

                                        )}


                                        {/* ==================================================
                                            2. APPOINTMENT COMPLETED
                                            
                                            ONLY WHEN:
                                            cancelled = false
                                            doctorConfirmed = true
                                        ================================================== */}

                                        {!item.cancelled &&
                                            item.doctorConfirmed && (

                                                <button
                                                    type="button"
                                                    className="text-sm text-center sm:min-w-48 py-2 border border-green-500 bg-green-50 text-green-700 rounded font-medium cursor-default"
                                                >
                                                    Appointment Completed
                                                </button>

                                            )}


                                        {/* ==================================================
                                            3. PAID
                                            
                                            ONLY WHEN:
                                            cancelled = false
                                            doctorConfirmed = false
                                            paymentStatus = paid
                                        ================================================== */}

                                        {!item.cancelled &&
                                            !item.doctorConfirmed &&
                                            item.paymentStatus === "paid" && (

                                                <>

                                                    <button
                                                        type="button"
                                                        className="text-sm text-center sm:min-w-48 py-2 border border-green-500 bg-green-50 text-green-700 rounded font-medium cursor-default"
                                                    >
                                                        Paid
                                                    </button>


                                                    {/* CANCEL + REFUND */}

                                                    <button
                                                        type="button"
                                                        onClick={async () => {

                                                            const refundSuccess =
                                                                await handleRefund(
                                                                    item._id
                                                                );


                                                            if (refundSuccess) {

                                                                await cancelAppointment(
                                                                    item
                                                                );


                                                                setLocalPaidAppointments(
                                                                    (previous) => {

                                                                        const updated = {
                                                                            ...previous
                                                                        };

                                                                        delete updated[
                                                                            item._id
                                                                        ];

                                                                        return updated;

                                                                    }
                                                                );

                                                            }

                                                        }}
                                                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                                                    >
                                                        Cancel & Refund
                                                    </button>

                                                </>

                                            )}


                                        {/* ==================================================
                                            4. UNPAID / PENDING
                                            
                                            ONLY WHEN:
                                            cancelled = false
                                            doctorConfirmed = false
                                            paymentStatus != paid
                                        ================================================== */}

                                        {!item.cancelled &&
                                            !item.doctorConfirmed &&
                                            item.paymentStatus !== "paid" && (

                                                <>

                                                    {/* PAY ONLINE */}

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


                                                    {/* CANCEL APPOINTMENT */}

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

            )}

        </div>
    );
}


export default MyAppointment;