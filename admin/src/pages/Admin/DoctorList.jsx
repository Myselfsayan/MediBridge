import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";

const DoctorsList = () => {

    const {
        doctors,
        isAdminLoggedIn,
        getAllDoctors,
        changeAvailability
    } = useContext(AdminContext);


    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    useEffect(() => {

        if (isAdminLoggedIn) {
            getAllDoctors();
        }

    }, [isAdminLoggedIn]);


    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">

            {/* Doctors List */}

            <h1 className="text-lg font-medium text-slate-900">
                All Doctors
            </h1>


            <div className="w-full flex flex-wrap gap-6 pt-5">

                {doctors.length > 0 ? (

                    doctors.map((item, index) => (

                        <div
                            className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition w-full sm:max-w-56 overflow-hidden cursor-pointer group flex flex-col"
                            key={item._id || index}
                        >

                            {/* Doctor Image */}

                            <div className="bg-cyan-50 group-hover:bg-primary transition-all duration-500 flex justify-center items-end h-56 pt-2">
                                <img
                                    className="w-full h-full object-cover object-bottom"
                                    src={item.image}
                                    alt={item.name}
                                />
                            </div>


                            <div className="p-4 flex flex-col flex-1">

                                {/* Doctor Name */}

                                <p className="text-slate-900 text-lg font-medium truncate">
                                    {item.name}
                                </p>


                                {/* Speciality */}

                                <p className="text-slate-500 text-sm mt-1">
                                    {item.speciality}
                                </p>


                                {/* Availability */}

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-700">

                                    <input
                                        onChange={() => {
                                            changeAvailability(item._id);
                                        }}
                                        type="checkbox"
                                        checked={item.available}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />

                                    <p className="font-medium">
                                        Available
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))

                ) : (

                    <p className="text-slate-500 mt-5 w-full text-center">
                        No doctors found
                    </p>

                )}

            </div>

        </div>
    );
};

export default DoctorsList;