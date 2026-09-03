import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets.js';
import RelatedDoctors from '../components/RelatedDoctors.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    BadgeCheck, 
    Calendar, 
    Clock, 
    Info, 
    MapPin, 
    Award, 
    ChevronRight, 
    CalendarCheck2,
    ShieldCheck,
    Stethoscope
} from 'lucide-react';

function Appointment() {
    const { docId } = useParams();
    const {
        doctors,
        getDoctorsData,
        currencySymbol,
        backendUrl,
        isLoggedIn
    } = useContext(AppContext);

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const navigate = useNavigate();

    // Deterministic 12-hour slot time formatter: "hh:mm AM/PM" (e.g. "10:00 AM", "01:30 PM")
    const formatSlotTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    // Normalize time strings across browsers (strips narrow/non-breaking spaces, trims, standardizes case)
    const normalizeSlotTime = (timeStr) => {
        if (!timeStr) return "";
        return timeStr
            .replace(/[\u202F\u00A0]/g, " ")
            .trim()
            .toUpperCase();
    };

    const getAvailableSlots = async () => {
        setDocSlots([]);

        let today = new Date();
        let allSlots = [];

        for (let i = 0; i < 7; i++) {
            let dayDate = new Date(today);
            dayDate.setDate(today.getDate() + i);

            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date(today);
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            // Set starting time
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(
                    currentDate.getHours() > 10
                        ? currentDate.getHours() + 1
                        : 10
                );

                currentDate.setMinutes(
                    currentDate.getMinutes() > 30
                        ? 30
                        : 0
                );
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            // Create date format: DD_MM_YYYY
            const day = dayDate.getDate();
            const month = dayDate.getMonth() + 1;
            const year = dayDate.getFullYear();
            const slotDate = `${day}_${month}_${year}`;

            // Get already booked slots for this date and normalize them
            const rawBookedSlots = docInfo?.slots_booked?.[slotDate] || [];
            const normalizedBookedSlots = Array.isArray(rawBookedSlots)
                ? rawBookedSlots.map(normalizeSlotTime)
                : [];

            while (currentDate < endTime) {
                const formattedTime = formatSlotTime(currentDate);

                // Check whether this particular time is already booked
                const isSlotBooked = normalizedBookedSlots.includes(
                    normalizeSlotTime(formattedTime)
                );

                // Only show available slots
                if (!isSlotBooked) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                        slotDate: slotDate
                    });
                }

                // Next 30-minute slot
                currentDate.setMinutes(
                    currentDate.getMinutes() + 30
                );
            }

            timeSlots.dayDate = dayDate;
            timeSlots.slotDate = slotDate;

            allSlots.push(timeSlots);
        }

        setDocSlots(allSlots);
    };

    const bookAppointment = async () => {
        if (!isLoggedIn) {
            toast.warn("Login to book appointment");
            return navigate("/login");
        }

        if (!slotTime) {
            toast.warn("Please select a time slot");
            return;
        }

        const currentDaySlots = docSlots[slotIndex];
        const slotDate = currentDaySlots?.slotDate || 
            (currentDaySlots?.[0]?.datetime ? 
                `${currentDaySlots[0].datetime.getDate()}_${currentDaySlots[0].datetime.getMonth() + 1}_${currentDaySlots[0].datetime.getFullYear()}` 
                : null);

        if (!slotDate) {
            toast.warn("Please select a date");
            return;
        }

        try {
            setIsBooking(true);

            const { data } = await axios.post(
                `${backendUrl}/api/v1/user/book-appointment`,
                {
                    docId,
                    slotDate,
                    slotTime
                },
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                navigate("/my-appointments");
                toast.success(data.message);

                // Remove the booked slot immediately from frontend
                setDocSlots((prevSlots) => {
                    const updatedSlots = [...prevSlots];
                    if (updatedSlots[slotIndex]) {
                        const filtered = updatedSlots[slotIndex].filter(
                            (slot) => normalizeSlotTime(slot.time) !== normalizeSlotTime(slotTime)
                        );
                        filtered.dayDate = updatedSlots[slotIndex].dayDate;
                        filtered.slotDate = updatedSlots[slotIndex].slotDate;
                        updatedSlots[slotIndex] = filtered;
                    }
                    return updatedSlots;
                });

                setSlotTime("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            let errorMessage = "Something went wrong";

            if (typeof error.response?.data === "string") {
                const match = error.response.data.match(/<pre>Error: (.*?)<br/);
                if (match) {
                    errorMessage = match[1];
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };

    // GET FRESH DOCTOR DATA
    useEffect(() => {
        const loadFreshData = async () => {
            const freshDoctors = await getDoctorsData();
            if (freshDoctors) {
                const doc = freshDoctors.find((d) => d._id === docId);
                setDocInfo(doc || null);
            }
        };

        loadFreshData();
    }, [docId]);

    // SET CURRENT DOCTOR (fallback from context)
    useEffect(() => {
        if (doctors.length > 0 && !docInfo) {
            const doc = doctors.find((d) => d._id === docId);
            if (doc) setDocInfo(doc);
        }
    }, [doctors, docId]);

    // GENERATE AVAILABLE SLOTS
    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    if (!docInfo) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading doctor profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 sm:py-8 space-y-10">
            {/* Doctor Card Hero */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="flex flex-col md:flex-row items-stretch">
                    {/* Doctor Image */}
                    <div className="md:w-80 lg:w-96 bg-gradient-to-b from-cyan-50 to-slate-100 flex items-center justify-center p-6 shrink-0 border-b md:border-b-0 md:border-r border-slate-100">
                        <img 
                            className="w-full max-w-[260px] h-auto object-cover rounded-2xl shadow-sm drop-shadow-md" 
                            src={docInfo.image} 
                            alt={docInfo.name} 
                        />
                    </div>

                    {/* Doctor Details */}
                    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                            {/* Verified & Specialty Tag */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-bold uppercase tracking-wider">
                                    <Stethoscope className="w-3.5 h-3.5" />
                                    {docInfo.speciality}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    Verified Practitioner
                                </span>
                            </div>

                            {/* Doctor Name */}
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {docInfo.name}
                                </h1>
                                <BadgeCheck className="w-6 h-6 text-primary shrink-0" />
                            </div>

                            {/* Degree & Experience */}
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="font-semibold text-slate-800">{docInfo.degree}</span>
                                <span className="text-slate-300">•</span>
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                                    <Award className="w-3.5 h-3.5 text-primary" />
                                    {docInfo.experience}{docInfo.experience === 1 ? " year" : " years"} experience
                                </span>
                            </div>

                            {/* About Section */}
                            <div className="pt-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                                    <Info className="w-4 h-4 text-primary" />
                                    <span>About Doctor</span>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                                    {docInfo.about}
                                </p>
                            </div>
                        </div>

                        {/* Fee and Location Bar */}
                        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Appointment Fee</span>
                                <p className="text-2xl font-extrabold text-slate-900">
                                    {currencySymbol}{docInfo.fees}
                                </p>
                            </div>

                            {docInfo.address && (
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Location</span>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1 justify-end">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        {docInfo.address.line1}, {docInfo.address.line2}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Slots Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <CalendarCheck2 className="w-5 h-5 text-primary" />
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        Select Consultation Slot
                    </h2>
                </div>

                {/* Day selector carousel */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        1. Select Date
                    </label>
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        {docSlots.length > 0 && docSlots.map((item, index) => {
                            const isSelected = slotIndex === index;
                            const slotDateObj = item.dayDate || item[0]?.datetime;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSlotIndex(index)}
                                    className={`flex flex-col items-center justify-center min-w-18 sm:min-w-20 py-4 px-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'bg-gradient-to-b from-primary to-cyan-700 text-white border-transparent shadow-md shadow-primary/20 scale-105'
                                            : 'bg-white border-slate-200 hover:border-primary/40 hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>
                                        {slotDateObj ? daysOfWeek[slotDateObj.getDay()] : `Day ${index + 1}`}
                                    </span>
                                    <span className="text-xl sm:text-2xl font-extrabold mt-0.5">
                                        {slotDateObj ? slotDateObj.getDate() : '--'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time slots */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        2. Select Time Slot
                    </label>
                    {docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
                        <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1">
                            {docSlots[slotIndex].map((item, index) => {
                                const isSelected = item.time === slotTime;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSlotTime(item.time)}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-primary text-white border-primary shadow-xs'
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-primary/50 hover:bg-cyan-50/50'
                                        }`}
                                    >
                                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                        <span>{item.time}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm italic py-2">
                            No available slots remaining for this date. Please select another date.
                        </p>
                    )}
                </div>

                {/* Book CTA Button */}
                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={bookAppointment}
                        disabled={isBooking}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-cyan-700 hover:from-cyan-700 hover:to-primary text-white font-bold px-10 py-3.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 active:scale-98 text-sm sm:text-base cursor-pointer"
                    >
                        <CalendarCheck2 className="w-5 h-5" />
                        <span>{isBooking ? "Booking Slot..." : "Book an Appointment"}</span>
                    </button>
                </div>
            </div>

            {/* Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
}

export default Appointment;
