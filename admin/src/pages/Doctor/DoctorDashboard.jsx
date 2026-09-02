import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
    const {
        dashData,
        getDashData,
        cancelAppointment,
    } = useContext(DoctorContext);

    const { currency, slotDateFormat } = useContext(AppContext);

    useEffect(() => {
        getDashData();
    }, []);

    return (
        dashData && (
            <div className="m-5">

                {/* Dashboard Cards */}
                <div className="flex flex-wrap gap-4">

                    {/* Earnings */}
                    <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100">
                        <img
                            className="w-14"
                            src={assets.earning_icon}
                            alt=""
                        />

                        <div>
                            <p className="text-xl font-semibold text-gray-600">
                                {currency} {dashData.earnings}
                            </p>

                            <p className="text-gray-400">
                                Earnings
                            </p>
                        </div>
                    </div>

                    {/* Appointments */}
                    <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100">
                        <img
                            className="w-14"
                            src={assets.appointments_icon}
                            alt=""
                        />

                        <div>
                            <p className="text-xl font-semibold text-gray-600">
                                {dashData.appointments}
                            </p>

                            <p className="text-gray-400">
                                Appointments
                            </p>
                        </div>
                    </div>

                    {/* Patients */}
                    <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100">
                        <img
                            className="w-14"
                            src={assets.patients_icon}
                            alt=""
                        />

                        <div>
                            <p className="text-xl font-semibold text-gray-600">
                                {dashData.patients}
                            </p>

                            <p className="text-gray-400">
                                Patients
                            </p>
                        </div>
                    </div>

                </div>


                {/* Latest Appointments */}
                <div className="bg-white mt-10 rounded border border-gray-100">

                    {/* Heading */}
                    <div className="flex items-center gap-2 px-6 py-4 border-b">
                        <img
                            className="w-5"
                            src={assets.list_icon}
                            alt=""
                        />

                        <p className="font-semibold text-gray-700">
                            Latest Appointments
                        </p>
                    </div>

                    {/* Appointments List */}
                    <div>
                        {dashData.latestAppointments?.map((item, index) => (
                            <div
                                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                                key={index}
                            >

                                {/* Doctor/Patient Image */}
                                <img
                                    className="rounded-full w-10"
                                    src={item.userData?.image}
                                    alt=""
                                />

                                {/* Details */}
                                <div className="flex-1 text-sm">
                                    <p className="text-gray-800 font-medium">
                                        {item.userData?.name}
                                    </p>

                                    <p className="text-gray-600">
                                        {slotDateFormat
                                            ? slotDateFormat(item.slotDate)
                                            : item.slotDate}
                                    </p>
                                </div>

                                {/* Cancel / Cancelled */}
                                {item.cancelled ? (
                                    <p className="text-red-400 text-xs font-medium">
                                        Cancelled
                                    </p>
                                ) : (
                                    <img
                                        onClick={() =>
                                            cancelAppointment(item._id)
                                        }
                                        className="w-10 cursor-pointer"
                                        src={assets.cancel_icon}
                                        alt="Cancel"
                                    />
                                )}

                            </div>
                        ))}
                    </div>

                </div>

            </div>
        )
    );
};

export default DoctorDashboard;