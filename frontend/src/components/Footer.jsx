
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, Shield, Award } from "lucide-react";

function Footer() {
    return (
        <footer className="mt-24 border-t border-slate-200/80 pt-16 pb-12 text-sm text-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
                {/* Column 1: Brand & Mission */}
                <div className="md:col-span-1 space-y-4">
                    <img 
                        className="h-9 w-auto object-contain" 
                        src={assets.logo} 
                        alt="MediBridge" 
                    />
                    <p className="text-slate-500 leading-relaxed text-sm">
                        MediBridge is dedicated to bridging the gap between patients and premier healthcare providers through seamless appointment scheduling.
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 px-2.5 py-1 rounded-md border border-cyan-100 font-medium">
                            <Shield className="w-3.5 h-3.5 text-primary" /> HIPAA Compliant
                        </span>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Platform
                    </h4>
                    <ul className="space-y-2.5">
                        <li>
                            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/all-doctors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                All Doctors
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                About MediBridge
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                Contact Support
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Specialities */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Top Specialties
                    </h4>
                    <ul className="space-y-2.5">
                        <li>
                            <Link to="/doctors/General physician" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                General Physician
                            </Link>
                        </li>
                        <li>
                            <Link to="/doctors/Gynecologist" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                Gynecologist
                            </Link>
                        </li>
                        <li>
                            <Link to="/doctors/Dermatologist" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                Dermatologist
                            </Link>
                        </li>
                        <li>
                            <Link to="/doctors/Pediatricians" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-primary transition-colors">
                                Pediatricians
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Contact info */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Get In Touch
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>Rajarhat, Newtown, Kolkata 700021, India</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-primary shrink-0" />
                            <span>+1 (123) 456-7890</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-primary shrink-0" />
                            <span>contact@medibridge.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright divider */}
            <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p>
                    © 2026 MediBridge Healthcare Technologies. All rights reserved.
                </p>
                <p className="flex items-center gap-1">
                    Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for accessible healthcare.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
