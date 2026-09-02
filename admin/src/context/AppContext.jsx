import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }
    const currency = '₹';
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

    const value = {
        calculateAge,
        currency,
        formatDate
    };

    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;