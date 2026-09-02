
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { ArrowRight, Sparkles, UserCheck } from "lucide-react";

export default function Banner() {
    const navigate = useNavigate();
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-700 via-teal-600 to-cyan-800 my-16 shadow-xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 py-10 md:py-0">
                {/* Left Side */}
                <div className="flex-1 md:py-14 z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-cyan-100 text-xs font-semibold mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Instant Online Booking</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                        Ready to Consult with <br />
                        <span className="text-cyan-200">100+ Trusted Doctors?</span>
                    </h2>

                    <p className="mt-3 text-sm text-cyan-50/90 max-w-md mx-auto md:mx-0">
                        Create your free MediBridge account today and get access to seamless appointment booking anytime, anywhere.
                    </p>

                    <button 
                        onClick={() => {
                            navigate("/login"); 
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }} 
                        className="mt-6 inline-flex items-center gap-2.5 bg-white text-cyan-800 font-bold px-8 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:bg-cyan-50 hover:scale-105 active:scale-98 transition-all duration-300 group text-sm sm:text-base cursor-pointer"
                    >
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Right Side */}
                <div className="hidden md:flex md:w-5/12 lg:w-4/12 justify-end self-end pt-6">
                    <img
                        className="w-full max-w-sm h-auto object-contain drop-shadow-xl"
                        src={assets.appointment_img}
                        alt="Book Doctor"
                    />
                </div>
            </div>
        </section>
    );
}
