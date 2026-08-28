import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    // ==========================================
    // DOCTORS
    // ==========================================

    const [doctors, setDoctors] = useState([]);


    // ==========================================
    // AUTHENTICATION
    // ==========================================

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);


    // ==========================================
    // PAID APPOINTMENTS
    // ==========================================

    const [paidAppointments, setPaidAppointments] = useState(() => {

        try {

            const savedPayments =
                localStorage.getItem("paidAppointments");

            return savedPayments
                ? JSON.parse(savedPayments)
                : {};

        } catch (error) {

            console.error(
                "Error loading paid appointments:",
                error
            );

            return {};
        }
    });


    // ==========================================
    // MARK APPOINTMENT AS PAID
    // ==========================================

    const markAppointmentAsPaid = (appointmentId) => {

        if (!appointmentId) {

            console.error(
                "Appointment ID is missing"
            );

            return false;
        }

        try {

            // Read the latest localStorage value
            const savedPayments = JSON.parse(
                localStorage.getItem("paidAppointments") || "{}"
            );


            // Add this appointment
            const updatedPayments = {
                ...savedPayments,
                [appointmentId]: true
            };


            // Save immediately to localStorage
            localStorage.setItem(
                "paidAppointments",
                JSON.stringify(updatedPayments)
            );


            // Update React state immediately
            setPaidAppointments(updatedPayments);


            return true;

        } catch (error) {

            console.error(
                "Error marking appointment as paid:",
                error
            );

            toast.error(
                "Unable to save payment status"
            );

            return false;
        }
    };


    // ==========================================
    // CANCEL & REFUND
    // ==========================================

    const cancelAndRefund = async (appointmentId) => {

        if (!appointmentId) {

            toast.error(
                "Appointment ID is missing"
            );

            return false;
        }

        try {

            // Read latest payment data
            const savedPayments = JSON.parse(
                localStorage.getItem("paidAppointments") || "{}"
            );


            // Remove payment status
            delete savedPayments[appointmentId];


            // Save updated payment data
            localStorage.setItem(
                "paidAppointments",
                JSON.stringify(savedPayments)
            );


            // Update React state immediately
            setPaidAppointments(savedPayments);


            toast.success(
                "Refund processed successfully"
            );


            return true;

        } catch (error) {

            console.error(
                "Refund error:",
                error
            );

            toast.error(
                "Refund failed"
            );

            return false;
        }
    };


    // ==========================================
    // CHECK AUTHENTICATION
    // ==========================================

    const checkAuth = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/v1/user/current-user`,
                {
                    withCredentials: true
                }
            );


            if (data.success) {

                setIsLoggedIn(true);
                setUserData(data.data.user);

            } else {

                setIsLoggedIn(false);
                setUserData(null);
            }

        } catch (error) {

            setIsLoggedIn(false);
            setUserData(null);
        }
    };


    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    const getDoctorsData = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/v1/doctor/list`
            );


            if (data.success) {

                setDoctors(data.data);

            } else {

                toast.error(
                    data.message
                );
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
    // CONTEXT VALUE
    // ==========================================

    const value = {

        // Doctors
        doctors,


        // Common
        currencySymbol,
        backendUrl,


        // Authentication
        isLoggedIn,
        setIsLoggedIn,

        userData,
        setUserData,


        // Payment
        paidAppointments,
        setPaidAppointments,

        markAppointmentAsPaid,
        cancelAndRefund,


        // Functions
        checkAuth
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        getDoctorsData();
        checkAuth();

    }, []);


    // ==========================================
    // PROVIDER
    // ==========================================

    return (

        <AppContext.Provider value={value}>

            {props.children}

        </AppContext.Provider>
    );
};


export default AppContextProvider;