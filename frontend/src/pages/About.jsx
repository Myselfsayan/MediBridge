import { assets } from '../assets/assets.js';
import { 
    ShieldCheck, 
    Zap, 
    HeartHandshake, 
    Target,
    Activity
} from 'lucide-react';

function About() {
    return (
        <div className="py-6 sm:py-8 space-y-16">
            {/* Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-primary text-xs font-semibold uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Our Story</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    About <span className="text-primary">MediBridge</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Transforming the healthcare experience through technology, empathy, and seamless practitioner access.
                </p>
            </div>

            {/* About Hero Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-10 lg:gap-14">
                <div className="md:w-5/12 shrink-0">
                    <img
                        className="w-full h-auto object-cover rounded-2xl shadow-sm"
                        src={assets.about_image}
                        alt="MediBridge Healthcare Team"
                    />
                </div>

                <div className="md:w-7/12 space-y-5 text-sm sm:text-base text-slate-600">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Bridging Patients & Medical Care
                    </h2>
                    <p className="leading-relaxed">
                        Welcome to <strong className="text-slate-900">MediBridge</strong>, your trusted partner in managing healthcare needs conveniently and efficiently. We understand the challenges individuals face when scheduling doctor appointments and managing personal health journeys.
                    </p>
                    <p className="leading-relaxed">
                        MediBridge is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating cutting-edge advances to deliver a frictionless user experience.
                    </p>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                            <Target className="w-5 h-5 text-primary" />
                            <span>Our Vision</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            To create a seamless, accessible healthcare ecosystem where every patient connects with verified top-tier medical specialists without delays or logistical barriers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Why Choose <span className="text-primary">MediBridge</span>
                    </h2>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Engineered with patient convenience and medical compliance at the core.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-primary flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Instant Efficiency
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Streamlined 24/7 appointment scheduling that eliminates waiting queues and fits into your busy lifestyle.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Verified Specialists
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Access our curated network of certified, background-checked medical practitioners across multiple disciplines.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <HeartHandshake className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Patient-First Care
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Transparent fees, instant confirmations, and dedicated patient support for total peace of mind.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
