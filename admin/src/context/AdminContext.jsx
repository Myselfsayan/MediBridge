import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem("aToken")?localStorage.getItem("aToken"):'');
    const [doctors, setDoctors] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
            `${backendUrl}/api/v1/admin/all-doctors`,
            {},
            {
                headers: {
                Authorization: `Bearer ${aToken}`,
                },
            }
            );

            if (data.success) {
            setDoctors(data.data);
            console.log(data.data);
            } else {
            toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
        };

        const changeAvailability = async (doctorId) => {
        try {
            const { data } = await axios.post(
            `${backendUrl}/api/v1/admin/change-availability`,
            { doctorId },
            {
                headers: {
                Authorization: `Bearer ${aToken}`,
                },
                
            }
            );
            if (data.success) {
            toast.success(data.message);
            getAllDoctors();
            }else{
            toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
        }

    const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;