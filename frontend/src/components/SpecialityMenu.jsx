import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets";
import { Activity } from "lucide-react";

function SpecialityMenu() {
    return (
        <section id="speciality" className="flex flex-col items-center gap-4 py-16 text-slate-800">
            {/* Tag / Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>Medical Specialties</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center tracking-tight">
                Find by Speciality
            </h2>

            <p className="max-w-md text-center text-sm sm:text-base text-slate-600">
                Browse our curated network of certified specialists and schedule your consultation in seconds.
            </p>

            {/* Specialities Grid / Horizontal Scroll */}
            <div className="flex sm:justify-center items-center gap-4 sm:gap-6 pt-6 w-full overflow-x-auto no-scrollbar pb-4 px-2">
                {specialityData.map((item, index) => (
                    <Link
                        key={index}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        to={`/doctors/${item.speciality}`}
                        className="group flex flex-col items-center text-center cursor-pointer shrink-0 w-28 sm:w-32 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-primary/40 hover:-translate-y-2 transition-all duration-300"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-50 to-teal-50/50 p-2 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ring-1 ring-cyan-100">
                            <img 
                                className="w-full h-full object-contain" 
                                src={item.image} 
                                alt={item.speciality} 
                            />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors line-clamp-2">
                            {item.speciality}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default SpecialityMenu;
