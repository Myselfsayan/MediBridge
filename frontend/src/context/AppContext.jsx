import { createContext } from "react";
import { doctors } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useState , useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        }
    } catch (error) {
        setIsLoggedIn(false);
    }
};
    
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
            toast.error(error.response?.data?.message || error.message);
        }
    };
    
        const value = {
            doctors,
            currencySymbol,
            backendUrl,
            isLoggedIn,
            setIsLoggedIn
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