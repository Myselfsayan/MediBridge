import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Check authentication and get current user
    const checkAuth = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/v1/user/current-user`,
                {
                    withCredentials: true,
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

    // Get all doctors
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/v1/doctor/list`
            );

            if (data.success) {
                setDoctors(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    const value = {
        doctors,
        currencySymbol,
        backendUrl,

        isLoggedIn,
        setIsLoggedIn,

        userData,
        setUserData,
    };

    useEffect(() => {
        getDoctorsData();
        checkAuth();
    }, []);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;