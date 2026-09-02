import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ArrowRight, Award, Calendar, CheckCircle2, Star, Stethoscope } from "lucide-react";

function TopDoctors() {
    const navigate = useNavigate();
    const { doctors, currencySymbol } = useContext(AppContext);

    return (
        <section className="flex flex-col items-center gap-4 my-16 text-slate-900">
            {/* Tag / Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Expert Care</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center tracking-tight">
                Top Doctors to Book
            </h2>

            <p className="max-w-md text-center text-sm sm:text-base text-slate-600">
                Book in-person or video consultations with verified, highly-rated medical specialists.
            </p>

            {/* Doctors Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-6">
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        key={item._id || index}
                        onClick={() => {
                            navigate(`/appointment/${item._id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
                    >
                        {/* Doctor Image Container */}
                        <div className="relative bg-gradient-to-b from-cyan-50 to-slate-100/80 aspect-4/3 flex items-end justify-center overflow-hidden">
                            <img
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                src={item.image}
                                alt={item.name}
                            />
                            
                            {/* Availability Badge */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium shadow-xs">
                                <span className={`w-2 h-2 rounded-full ${item.available !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                <span className={item.available !== false ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                                    {item.available !== false ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            {/* Experience Pill */}
                            {item.experience && (
                                <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[11px] font-medium">
                                    {item.experience}{item.experience === 1 ? ' yr' : ' yrs'} exp
                                </div>
                            )}
                        </div>

                        {/* Doctor Information */}
                        <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                                    {item.speciality}
                                </p>
                                <h3 className="text-slate-900 text-base font-bold group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
                                    {item.name}
                                </h3>
                                <p className="text-slate-500 text-xs mt-1">
                                    {item.degree} • {item.address?.line1 || "Clinic"}
                                </p>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] text-slate-400 uppercase font-medium">Fee</span>
                                    <p className="text-sm font-bold text-slate-900">
                                        {currencySymbol || "₹"}{item.fees || 500}
                                    </p>
                                </div>

                                <button
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-50 group-hover:bg-primary text-primary group-hover:text-white text-xs font-semibold transition-colors"
                                    tabIndex={-1}
                                >
                                    <span>Book</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <button
                onClick={() => {
                    navigate('/doctors');
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-10 inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-primary border border-slate-200/90 font-semibold px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all group"
            >
                <span>Explore All Doctors</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
        </section>
    );
}

export default TopDoctors;
