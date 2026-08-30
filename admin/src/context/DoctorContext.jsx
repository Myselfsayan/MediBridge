import { createContext } from "react";
import { useState } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctorData, setDoctorData] = useState(null);

const value = {
    doctorData,
    setDoctorData,
    backendUrl,
};
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;