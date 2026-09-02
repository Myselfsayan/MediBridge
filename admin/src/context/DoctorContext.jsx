import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctorData, setDoctorData] = useState(null);

    const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);

    const [authLoading, setAuthLoading] = useState(true);

    const [appointments, setAppointments] = useState([]);
    
    const [dashData, setDashData] = useState(false);

    const [profileData, setProfileData] = useState(false);



    // CHECK DOCTOR AUTHENTICATION

    const checkDoctorAuth = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/v1/doctor/current-doctor`,
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setDoctorData(data.data.doctor);

                setIsDoctorLoggedIn(true);

                return data.data.doctor;

            }

            setDoctorData(null);

            setIsDoctorLoggedIn(false);

            return null;

        } catch (error) {

            console.log(
                "Doctor authentication failed:",
                error.response?.data || error.message
            );

            setDoctorData(null);

            setIsDoctorLoggedIn(false);

            return null;

        } finally {

            setAuthLoading(false);

        }

    };
    // GET DOCTOR APPOINTMENTS
    const getDoctorAppointments = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/v1/doctor/appointments`,
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

                toast.error(
                    data.message ||
                    "Failed to fetch appointments"
                );

            }

        } catch (error) {

            console.log(
                "Get doctor appointments error:",
                error.response?.data ||
                error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch appointments"
            );

        }

    };
    // DOCTOR CANCEL / REJECT APPOINTMENT
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/doctor/cancel-appointment`,
                {
                    appointmentId
                },
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setAppointments((previous) =>

                    previous.map((item) => {

                        if (item._id === appointmentId) {

                            return {
                                ...item,
                                cancelled: true,
                                paymentStatus:
                                    data.paymentStatus ||
                                    item.paymentStatus
                            };

                        }

                        return item;

                    })

                );

                toast.success(
                    data.message ||
                    "Appointment cancelled"
                );

                return true;

            }

            toast.error(
                data.message ||
                "Failed to cancel appointment"
            );

            return false;

        } catch (error) {

            console.error(
                "Doctor cancel error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel appointment"
            );

            return false;

        }

    };
    // COMPLETE APPOINTMENT
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/doctor/complete-appointment`,
                {
                    appointmentId
                },
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setAppointments((previous) =>

                    previous.map((item) => {

                        if (item._id === appointmentId) {

                            return {
                                ...item,
                                isCompleted: true
                            };

                        }

                        return item;

                    })

                );

                toast.success(
                    data.message ||
                    "Appointment completed"
                );

                return true;

            }

            toast.error(
                data.message ||
                "Failed to complete appointment"
            );

            return false;

        } catch (error) {

            console.error(
                "Complete appointment error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to complete appointment"
            );

            return false;

        }

    };
    // DOCTOR ACCEPT APPOINTMENT
    const acceptAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/doctor/accept-appointment`,
                {
                    appointmentId
                },
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setAppointments((previous) =>

                    previous.map((item) => {

                        if (item._id === appointmentId) {

                            return {
                                ...item,
                                doctorConfirmed: true
                            };

                        }

                        return item;

                    })

                );

                toast.success(
                    data.message ||
                    "Appointment accepted"
                );

                return true;

            }

            toast.error(
                data.message ||
                "Failed to accept appointment"
            );

            return false;

        } catch (error) {

            console.error(
                "Doctor accept error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to accept appointment"
            );

            return false;

        }

    };
    // DOCTOR LOGOUT
    const logoutDoctor = async () => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/v1/doctor/logout`,
                {},
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setDoctorData(null);

                setIsDoctorLoggedIn(false);

                setAppointments([]);

                toast.success(data.message);

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(
                "Doctor logout error:",
                error.response?.data ||
                error.message
            );

            setDoctorData(null);

            setIsDoctorLoggedIn(false);

            setAppointments([]);

            toast.error(
                error.response?.data?.message ||
                "Logout failed"
            );

        }

    };
    const getDashData = async () => {
    try {
        const { data } = await axios.get(
            `${backendUrl}/api/v1/doctor/doctor-dashboard`,
            {
                withCredentials: true
            }
        );

        if (data.success) {
            setDashData(data.data);
            console.log(data.data);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(
            error.response?.data?.message || error.message
        );
    }
    };
    const getProfileData = async () => {
    try {

        const { data } = await axios.get(
            `${backendUrl}/api/v1/doctor/profile`,
            {
                withCredentials: true
            }
        );

        if (data.success) {
            setProfileData(data.data);
            console.log(data.data);
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    };
    // CHECK AUTH ON APP START
    useEffect(() => {

        checkDoctorAuth();

    }, []);

    // LOAD APPOINTMENTS AFTER DOCTOR LOGIN
    useEffect(() => {

        if (
            isDoctorLoggedIn &&
            doctorData?._id
        ) {

            getDoctorAppointments();

        }

    }, [
        isDoctorLoggedIn,
        doctorData?._id
    ]);

    // CONTEXT VALUE

    const value = {

        backendUrl,
        doctorData,setDoctorData,
        isDoctorLoggedIn,setIsDoctorLoggedIn,
        authLoading,
        checkDoctorAuth,
        logoutDoctor,
        appointments,setAppointments,
        getDoctorAppointments,
        acceptAppointment,
        cancelAppointment,
        completeAppointment,
        dashData,getDashData,setDashData,
        profileData,getProfileData,setProfileData
    };


    return (

        <DoctorContext.Provider value={value}>

            {props.children}

        </DoctorContext.Provider>

    );

};

export default DoctorContextProvider;