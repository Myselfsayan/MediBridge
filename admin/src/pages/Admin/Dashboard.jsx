import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const Dashboard = () => {

    const {
        getDashData,
        cancelAppointment,
        dashData,
        slotDateFormat
    } = useContext(AdminContext);

    useEffect(() => {
        getDashData();
    }, []);

    return dashData && (
        <div className="m-5">

            {/* Dashboard Cards */}
            <div className="flex flex-wrap gap-5">

                {/* Doctors */}
                <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border">
                    <img
                        src={assets.doctor_icon}
                        alt=""
                        className="w-10"
                    />

                    <div>
                        <p className="text-xl font-semibold text-gray-600">
                            {dashData.doctors}
                        </p>

                        <p className="text-gray-400">
                            Doctors
                        </p>
                    </div>
                </div>


                {/* Appointments */}
                <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border">
                    <img
                        src={assets.appointments_icon}
                        alt=""
                        className="w-10"
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
                <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border">
                    <img
                        src={assets.patients_icon}
                        alt=""
                        className="w-10"
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


            {/* Latest Bookings */}
            <div className="bg-white mt-10">

                {/* Header */}
                <div className="flex items-center gap-2.5 px-4 py-4 border-b">
                    <img
                        src={assets.list_icon}
                        alt=""
                    />

                    <p className="font-semibold">
                        Latest Bookings
                    </p>
                </div>


                {/* Booking List */}
                <div className="pt-4 border border-t-0">

                    {dashData.latestAppointments &&
                        dashData.latestAppointments.map((item, index) => (

                            <div
                                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                                key={index}
                            >

                                {/* Doctor Image */}
                                <img
                                    className="rounded-full w-10 h-10 object-cover"
                                    src={item.docData?.image}
                                    alt=""
                                />


                                {/* Doctor Details */}
                                <div className="flex-1 text-sm">

                                    <p className="text-gray-800">
                                        {item.docData?.name}
                                    </p>

                                    <p className="text-gray-500">
                                        {slotDateFormat(item.slotDate)}
                                    </p>

                                </div>


                                {/* Appointment Status / Cancel */}
                                {item.cancelled ? (
                                    <p className="text-red-400 text-xs font-medium">
                                        Cancelled
                                    </p>
                                ) : (
                                    <img
                                        onClick={() =>
                                            cancelAppointment(item._id)
                                        }
                                        src={assets.cancel_icon}
                                        alt="Cancel"
                                        className="w-10 cursor-pointer"
                                    />
                                )}

                            </div>

                        ))}

                </div>

            </div>

        </div>
    );
};

export default Dashboard;