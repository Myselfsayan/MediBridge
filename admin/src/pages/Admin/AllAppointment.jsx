import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const AllAppointments = () => {

    const {
        appointments,
        getAllAppointments,
        isAdminLoggedIn
    } = useContext(AdminContext);

    const { calculateAge } = useContext(AppContext);

    // ==========================================
    // GET ALL APPOINTMENTS
    // ==========================================

    useEffect(() => {

        if (isAdminLoggedIn) {
            getAllAppointments();
        }

    }, [isAdminLoggedIn]);


    return (

        <div className="w-full max-w-6xl m-5">

            {/* Title */}

            <p className="mb-3 text-lg font-medium">
                All Appointments
            </p>


            {/* Appointment Table */}

            <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">

                {/* Table Header */}

                <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1.5fr_1.5fr_1fr] gap-4 py-3 px-6 border-b text-gray-600">

                    <p>#</p>

                    <p>Patient</p>

                    <p>Age</p>

                    <p>Date & Time</p>

                    <p>Doctor</p>

                    <p>Fees</p>

                    <p>Actions</p>

                </div>


                {/* Appointment List */}

                {appointments && appointments.length > 0 ? (

                    appointments.map((item, index) => {


                        // console.log("WHOLE APPOINTMENT OBJECT:", item);
                        // console.log("USER DATA:", item.userData);
                        // console.log("DOCTOR DATA:", item.docData);

                        return (

                            <div
                                key={item._id || index}
                                className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_1.5fr_1.5fr_1fr] gap-4 items-center py-3 px-6 border-b text-gray-500 hover:bg-gray-50"
                            >

                                {/* Number */}

                                <p className="max-sm:hidden">
                                    {index + 1}
                                </p>


                                {/* Patient */}

                                <div className="flex items-center gap-2">

                                    <img
                                        className="w-8 h-8 rounded-full object-cover"
                                        src={item.userData?.image}
                                        alt=""
                                    />

                                    <p>
                                        {item.userData?.name || "N/A"}
                                    </p>

                                </div>


                                {/* Age */}

                                <p className="max-sm:hidden">

                                    {item.userData?.dob
                                        ? calculateAge(item.userData.dob)
                                        : "N/A"}

                                </p>


                                {/* Date & Time */}

                                <p>

                                    {item.slotDate || "N/A"}

                                    <br />

                                    {item.slotTime || ""}

                                </p>


                                {/* Doctor */}

                                <div className="flex items-center gap-2">

                                    <img
                                        className="w-8 h-8 rounded-full object-cover bg-gray-100"
                                        src={item.docData?.image}
                                        alt=""
                                    />

                                    <p>
                                        {item.docData?.name || "N/A"}
                                    </p>

                                </div>


                                {/* Fees */}

                                <p>
                                    ₹{item.amount || 0}
                                </p>


                                {/* Actions */}

                                <div>

                                    {item.cancelled ? (

                                        <p className="text-red-500 text-xs">
                                            Cancelled
                                        </p>

                                    ) : item.isCompleted ? (

                                        <p className="text-green-500 text-xs">
                                            Completed
                                        </p>

                                    ) : (

                                        <p className="text-primary text-xs">
                                            Booked
                                        </p>

                                    )}

                                </div>

                            </div>

                        );

                    })

                ) : (

                    <div className="py-10 text-center text-gray-500">
                        No appointments found
                    </div>

                )}

            </div>

        </div>

    );
};

export default AllAppointments;