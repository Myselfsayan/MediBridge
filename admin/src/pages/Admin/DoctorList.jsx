import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { 
    Users, 
    Stethoscope, 
    Sparkles, 
    CheckCircle2, 
    XCircle,
    DollarSign,
    Award
} from "lucide-react";

const DoctorsList = () => {
    const {
        doctors,
        isAdminLoggedIn,
        getAllDoctors,
        changeAvailability
    } = useContext(AdminContext);

    useEffect(() => {
        if (isAdminLoggedIn) {
            getAllDoctors();
        }
    }, [isAdminLoggedIn]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Platform Network</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Doctor Directory
                    </h1>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    {doctors?.length || 0} Registered Practitioners
                </p>
            </div>

            {/* Doctors Grid */}
            {doctors && doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {doctors.map((item, index) => (
                        <div
                            key={item._id || index}
                            className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                        >
                            {/* Doctor Photo Container */}
                            <div className="relative bg-gradient-to-b from-cyan-50/70 to-slate-100 h-52 flex justify-center items-end overflow-hidden">
                                <img
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    src={item.image}
                                    alt={item.name}
                                />

                                {/* Availability pill overlay */}
                                <div className="absolute top-3 left-3">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs backdrop-blur-md border ${
                                        item.available
                                            ? "bg-emerald-50/90 text-emerald-700 border-emerald-200"
                                            : "bg-slate-100/90 text-slate-500 border-slate-200"
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.available ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                        <span>{item.available ? "Available" : "Unavailable"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 truncate">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-primary font-semibold mt-0.5 truncate">
                                        {item.speciality}
                                    </p>

                                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                                        <span>{item.experience || "1 Year"} Exp</span>
                                        <span className="font-bold text-slate-900">₹{item.fees || 500} / visit</span>
                                    </div>
                                </div>

                                {/* Availability Toggle Control */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">Accept Bookings</span>
                                    
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(item.available)}
                                            onChange={() => changeAvailability(item._id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
                    <p className="text-base font-medium">No doctors currently in the directory.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorsList;