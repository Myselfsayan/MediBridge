import { useEffect, useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Stethoscope } from "lucide-react";

function RelatedDoctors({ speciality, docId }) {
    const { doctors, currencySymbol } = useContext(AppContext);
    const navigate = useNavigate();

    const [relDoc, setRelDocs] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
            setRelDocs(doctorsData);
        }
    }, [doctors, speciality, docId]);

    if (!relDoc.length) return null;

    return (
        <section className="flex flex-col items-center gap-4 my-16 text-slate-900 border-t border-slate-200/80 pt-16">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Similar Practitioners</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center tracking-tight">
                Related Specialists
            </h3>

            <p className="max-w-md text-center text-sm text-slate-600">
                Other certified {speciality} doctors available for consultation.
            </p>

            {/* Doctors Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-6">
                {relDoc.slice(0, 5).map((item, index) => (
                    <div
                        key={item._id || index}
                        onClick={() => {
                            navigate(`/appointment/${item._id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative bg-gradient-to-b from-cyan-50 to-slate-100/80 aspect-4/3 flex items-end justify-center overflow-hidden">
                            <img
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                src={item.image}
                                alt={item.name}
                            />
                            
                            {/* Availability */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium shadow-xs">
                                <span className={`w-2 h-2 rounded-full ${item.available !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                <span className={item.available !== false ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                                    {item.available !== false ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                                    {item.speciality}
                                </p>
                                <h4 className="text-slate-900 text-sm font-bold group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
                                    {item.name}
                                </h4>
                                <p className="text-slate-500 text-xs mt-0.5">
                                    {item.degree} • {item.experience}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">
                                    {currencySymbol || "₹"}{item.fees || 500}
                                </span>
                                <span className="text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                    Book <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    navigate('/doctors');
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-8 inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-primary border border-slate-200/90 font-semibold px-6 py-2.5 rounded-full shadow-xs hover:shadow text-sm transition-all"
            >
                <span>View More Specialists</span>
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </section>
    );
}

export default RelatedDoctors;
