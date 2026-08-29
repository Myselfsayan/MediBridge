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

            <h1 className="text-lg font-medium">
                All Doctors
            </h1>


            <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">

                {doctors.length > 0 ? (

                    doctors.map((item, index) => (

                        <div
                            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
                            key={item._id || index}
                        >

                            {/* Doctor Image */}

                            <img
                                className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
                                src={item.image}
                                alt={item.name}
                            />


                            <div className="p-4">

                                {/* Doctor Name */}

                                <p className="text-neutral-800 text-lg font-medium">
                                    {item.name}
                                </p>


                                {/* Speciality */}

                                <p className="text-zinc-600 text-sm">
                                    {item.speciality}
                                </p>


                                {/* Availability */}

                                <div className="mt-2 flex items-center gap-1 text-sm">

                                    <input
                                        onChange={() => {
                                            changeAvailability(item._id);
                                        }}
                                        type="checkbox"
                                        checked={item.available}
                                    />

                                    <p>
                                        Available
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))

                ) : (

                    <p className="text-gray-500 mt-5">
                        No doctors found
                    </p>

                )}

            </div>

        </div>
    );
};

export default DoctorsList;