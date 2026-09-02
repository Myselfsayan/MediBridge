import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
    Filter, 
    Stethoscope, 
    ArrowRight, 
    CheckCircle2, 
    X, 
    Search,
    UserCheck,
    ChevronRight,
    Sparkles
} from 'lucide-react';

const specialties = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
];

function Doctors() {
    const { speciality } = useParams();
    const { doctors, currencySymbol } = useContext(AppContext);
    const [filterDoc, setFilterDoc] = useState([]);
    const [showFilter, setShowFilters] = useState(false);
    const navigate = useNavigate();

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
        } else {
            setFilterDoc(doctors);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality]);

    return (
        <div className="py-6 sm:py-8 space-y-6">
            {/* Header / Banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Medical Directory</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {speciality ? `${speciality} Specialists` : "All Verified Practitioners"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Showing {filterDoc.length} verified {filterDoc.length === 1 ? 'doctor' : 'doctors'} available for appointments.
                    </p>
                </div>

                {/* Mobile Filter Toggle Button */}
                <div className="flex items-center gap-3 sm:hidden">
                    <button
                        onClick={() => setShowFilters(!showFilter)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                            showFilter || speciality
                                ? "bg-primary text-white border-primary shadow-xs"
                                : "bg-white text-slate-700 border-slate-200"
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filter Specialties {speciality ? `(1)` : ''}</span>
                    </button>
                    {speciality && (
                        <button
                            onClick={() => navigate('/doctors')}
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Clear filter"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Layout: Sidebar + Grid */}
            <div className="flex flex-col sm:flex-row items-start gap-8">
                {/* Desktop & Mobile Filter Sidebar */}
                <aside className={`w-full sm:w-64 lg:w-72 shrink-0 ${showFilter ? 'block' : 'hidden sm:block'}`}>
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs sticky top-24 space-y-2">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 px-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Specialty Filter
                            </span>
                            {speciality && (
                                <button
                                    onClick={() => {
                                        navigate('/doctors');
                                        setShowFilters(false);
                                    }}
                                    className="text-xs font-semibold text-primary hover:underline"
                                >
                                    Reset All
                                </button>
                            )}
                        </div>

                        {/* All Doctors option */}
                        <button
                            onClick={() => {
                                navigate('/doctors');
                                setShowFilters(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                                !speciality
                                    ? "bg-primary text-white shadow-xs font-semibold"
                                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                            }`}
                        >
                            <span>All Specialties</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${!speciality ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {doctors.length}
                            </span>
                        </button>

                        {/* Specialty options */}
                        {specialties.map((spec) => {
                            const isSelected = speciality === spec;
                            const count = doctors.filter((d) => d.speciality === spec).length;

                            return (
                                <button
                                    key={spec}
                                    onClick={() => {
                                        if (isSelected) {
                                            navigate('/doctors');
                                        } else {
                                            navigate(`/doctors/${spec}`);
                                        }
                                        setShowFilters(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                                        isSelected
                                            ? "bg-primary text-white shadow-xs font-semibold"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                                    }`}
                                >
                                    <span className="truncate pr-2">{spec}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Doctor Cards Grid */}
                <div className="flex-1 w-full min-w-0">
                    {filterDoc.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {filterDoc.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    onClick={() => {
                                        navigate(`/appointment/${item._id}`);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
                                >
                                    {/* Image Container */}
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
                                                {item.experience}
                                            </div>
                                        )}
                                    </div>

                                    {/* Information */}
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
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
                            <div className="w-16 h-16 rounded-full bg-cyan-50 text-primary flex items-center justify-center mx-auto mb-4">
                                <Stethoscope className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                No Specialists Found
                            </h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                                We currently don't have doctors listed under this category. Please check other specialties.
                            </p>
                            <button
                                onClick={() => navigate('/doctors')}
                                className="bg-primary hover:bg-cyan-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
                            >
                                View All Doctors
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Doctors;
