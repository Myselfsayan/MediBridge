import { assets } from "../assets/assets";
import { ArrowRight, ShieldCheck, Star, Users } from "lucide-react";

function Header() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-700 via-teal-600 to-cyan-800 shadow-xl my-6">
            {/* Background Decorative Circles */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 pt-10 md:pt-14 pb-0">
                {/* Left Content */}
                <div className="md:w-1/2 flex flex-col items-start gap-5 pb-10 md:pb-14 z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide shadow-xs">
                        <ShieldCheck className="w-4 h-4 text-cyan-200" />
                        <span>Trusted Medical Network</span>
                        <span className="w-1 h-1 rounded-full bg-white/60"></span>
                        <span className="flex items-center text-amber-300 gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-300" /> 4.9/5
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight">
                        Book Appointment <br />
                        <span className="text-cyan-200">With Top Verified Doctors</span>
                    </h1>

                    {/* Description & Social Proof */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-white/90 text-sm">
                        <div className="flex -space-x-2 overflow-hidden shrink-0">
                            <img 
                                className="w-28 h-auto object-contain rounded-full drop-shadow" 
                                src={assets.group_profiles} 
                                alt="Patients and doctors" 
                            />
                        </div>
                        <p className="leading-relaxed text-cyan-50/90 text-sm font-normal">
                            Connect with 100+ certified specialists. <br className="hidden sm:inline" />
                            Fast, secure, and hassle-free healthcare appointments.
                        </p>
                    </div>

                    {/* Action Button */}
                    <a 
                        href="#speciality" 
                        className="inline-flex items-center gap-2.5 bg-white text-cyan-800 font-bold px-8 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:bg-cyan-50 hover:scale-105 active:scale-98 transition-all duration-300 group text-sm sm:text-base mt-2"
                    >
                        <span>Book Appointment</span>
                        <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2 flex justify-center md:justify-end items-end relative self-end mt-4 md:mt-0">
                    <img 
                        className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl" 
                        src={assets.header_img} 
                        alt="Doctors of MediBridge" 
                    />
                </div>
            </div>
        </section>
    );
}

export default Header;
