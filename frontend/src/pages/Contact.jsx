import { assets } from "../assets/assets"

function Contact() {
    return (
        <div>

                <div className='text-center text-3xl pt-10 text-slate-800 font-semibold'>
                <p>
                    CONTACT <span className='text-primary'>US</span>
                </p>
                </div>

                <div className='my-10 flex flex-col justify-center md:flex-row gap-12 mb-28 text-sm bg-white p-8 rounded-xl border border-slate-200 shadow-sm'>

                <img className='w-full md:max-w-[360px] rounded-lg' src={assets.contact_image} alt="" />

                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-xl text-slate-900'>Our OFFICE</p>

                    <p className='text-slate-600 text-base'>
                    Rajarhat <br /> Kolkata 700021, Newtown, India
                    </p>

                    <p className='text-slate-600 text-base'>
                    Tel: (123) 456-890 <br />
                    Email: medi@gmail.com
                    </p>

                    <p className='font-semibold text-xl text-slate-900 mt-4'>Careers at MediBridge</p>

                    <p className='text-slate-600 text-base'>
                    Learn more about our teams and job openings.
                    </p>

                    <button className='border border-slate-300 text-slate-700 rounded-lg px-8 py-3 font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm'>Explore Jobs</button>
                </div>

                </div>

        </div>
)
}

export default Contact
