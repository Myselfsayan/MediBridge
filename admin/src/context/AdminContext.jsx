import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    // Admin authentication state
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    // Prevent Login page from flashing while checking cookie
    const [authLoading, setAuthLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
    // CHECK ADMIN AUTHENTICATION
    // ==========================================

    const checkAdminAuth = async () => {
        try {

            const { data } = await axios.get(
                `${backendUrl}/api/v1/admin/current-admin`,
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                setIsAdminLoggedIn(true);
            } else {
                setIsAdminLoggedIn(false);
            }

        } catch (error) {

            setIsAdminLoggedIn(false);

        } finally {

            setAuthLoading(false);

        }
    };


    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    const getAllDoctors = async () => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/admin/all-doctors`,
                {},
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setDoctors(data.data);
                console.log(data.data);

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
    // CHANGE DOCTOR AVAILABILITY
    // ==========================================

    const changeAvailability = async (doctorId) => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/admin/change-availability`,
                { doctorId },
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                toast.success(data.message);

                getAllDoctors();

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
    // GET ALL APPOINTMENTS
    // ==========================================

    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/v1/admin/appointments`,
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setAppointments(data.data);
                console.log(data.data);

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
    // CHECK AUTH WHEN ADMIN PANEL LOADS
    // ==========================================

    const logoutAdmin = async () => {

    try {

        const { data } = await axios.post(
            `${backendUrl}/api/v1/admin/logout`,
            {},
            {
                withCredentials: true
            }
        );

        if (data.success) {

            setIsAdminLoggedIn(false);

            toast.success(data.message);

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            error.message ||
            "Logout failed"
        );
    }
};
// ==========================================
// CANCEL APPOINTMENT
// ==========================================

const cancelAppointment = async (appointmentId) => {

    try {

        const { data } = await axios.post(
            `${backendUrl}/api/v1/admin/cancel-appointment`,
            {
                appointmentId
            },
            {
                withCredentials: true
            }
        );

        if (data.success) {

            toast.success(data.message);

            // Refresh appointments
            getAllAppointments();

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            error.message ||
            "Failed to cancel appointment"
        );

    }
};

    useEffect(() => {

        checkAdminAuth();

    }, []);


    // ==========================================
    // CONTEXT VALUE
    // ==========================================

    const value = {

        backendUrl,

        // Authentication
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        checkAdminAuth,
        authLoading,
        logoutAdmin,

        // Doctors
        doctors,
        getAllDoctors,
        changeAvailability,

        // Appointments
        appointments,
        getAllAppointments,
        setAppointments,

        //admin can cancel appointment
        cancelAppointment,
        slotDateFormat
    };


    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;