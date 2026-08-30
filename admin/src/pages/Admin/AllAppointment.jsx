import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const AllAppointments = () => {

    const {
        appointments,
        getAllAppointments,
        isAdminLoggedIn,
        cancelAppointment,
        slotDateFormat
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

            <p className="mb-3 text-lg font-medium text-slate-900">
                All Appointments
            </p>


            {/* Appointment Table */}

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm text-sm max-h-[80vh] overflow-y-scroll">

                {/* Table Header */}

                <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1.5fr_1.5fr_1fr] gap-4 py-3 px-6 border-b bg-slate-50 text-slate-600 font-medium">

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
                                className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_1.5fr_1.5fr_1fr] gap-4 items-center py-4 px-6 border-b text-slate-600 hover:bg-slate-50 transition"
                            >

                                {/* Number */}

                                <p className="max-sm:hidden">
                                    {index + 1}
                                </p>


                                {/* Patient */}

                                <div className="flex items-center gap-3">

                                    <img
                                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                                        src={item.userData?.image}
                                        alt=""
                                    />

                                    <p className="font-medium text-slate-700">
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

                                    {slotDateFormat(item.slotDate) || "N/A"}

                                    <br />

                                    <span className="text-slate-500 text-xs">{item.slotTime || ""}</span>

                                </p>


                                {/* Doctor */}

                                <div className="flex items-center gap-3">

                                    <img
                                        className="w-8 h-8 rounded-full object-cover bg-slate-100 shadow-sm"
                                        src={item.docData?.image}
                                        alt=""
                                    />

                                    <p className="font-medium text-slate-700">
                                        {item.docData?.name || "N/A"}
                                    </p>

                                </div>


                                {/* Fees */}

                                <p className="font-medium">
                                    ₹{item.amount || 0}
                                </p>


                                {/* Actions */}

                                <div>

                                  {item.cancelled ? (

                                      <span className="bg-red-50 text-red-600 rounded-full px-3 py-1 text-xs font-medium border border-red-100">
                                          Cancelled
                                      </span>

                                  ) : item.isCompleted ? (

                                      <span className="bg-emerald-50 text-emerald-600 rounded-full px-3 py-1 text-xs font-medium border border-emerald-100">
                                          Completed
                                      </span>

                                  ) : (

                                      <button
                                          onClick={() => cancelAppointment(item._id)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer border border-transparent hover:border-red-100"
                                      >
                                          Cancel
                                      </button>

                                  )}

                                </div>

                            </div>

                        );

                    })

                ) : (

                    <div className="py-10 text-center text-slate-500">
                        No appointments found
                    </div>

                )}

            </div>

        </div>

    );
};

export default AllAppointments;