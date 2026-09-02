import { assets } from "../assets/assets";
import { 
    MapPin, 
    Phone, 
    Mail, 
    Briefcase, 
    ArrowRight, 
    Headphones, 
    Clock, 
    Building2 
} from "lucide-react";

function Contact() {
    return (
        <div className="py-6 sm:py-8 space-y-12">
            {/* Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Get In Touch</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Contact <span className="text-primary">MediBridge</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Have questions about doctors, bookings, or careers? We're here to help around the clock.
                </p>
            </div>

            {/* Main Contact Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-10 lg:gap-14">
                <div className="md:w-5/12 shrink-0">
                    <img
                        className="w-full h-auto object-cover rounded-2xl shadow-sm"
                        src={assets.contact_image}
                        alt="MediBridge Headquarters"
                    />
                </div>

                <div className="md:w-7/12 space-y-8">
                    {/* Office Location */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-slate-900">
                                Corporate Office
                            </h2>
                        </div>

                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                                <span>Rajarhat, Newtown, Kolkata 700021, India</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>+1 (123) 456-7890 / +91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span>support@medibridge.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-primary shrink-0" />
                                <span>Mon - Sat: 9:00 AM - 8:00 PM IST</span>
                            </div>
                        </div>
                    </div>

                    {/* Careers Box */}
                    <div className="pt-6 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold text-slate-900">
                                Careers at MediBridge
                            </h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Join our mission to revolutionize healthcare accessibility. Explore openings in engineering, medical operations, and design.
                        </p>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 hover:border-primary text-slate-700 hover:text-primary font-semibold text-sm transition-all group"
                        >
                            <span>Explore Open Positions</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
