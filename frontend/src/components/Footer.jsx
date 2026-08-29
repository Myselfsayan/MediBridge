
import { assets } from "../assets/assets"

function Footer() {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ----- Left Section ----- */}

                    <div>
                    <img className="mb-5 w-40" src={assets.logo} alt="" />

                    <p className='w-full md:w-2/3 text-slate-600 leading-6'>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </p>
                    </div>

                    {/* ----- Center Section ----- */}

                    <div>
                    <p className='text-xl font-medium mb-5 text-slate-900'>COMPANY</p>

                    <ul className='flex flex-col gap-2 text-slate-600'>
                        <li className="hover:text-primary transition cursor-pointer">Home</li>
                        <li className="hover:text-primary transition cursor-pointer">About us</li>
                        <li className="hover:text-primary transition cursor-pointer">Contact us</li>
                        <li className="hover:text-primary transition cursor-pointer">Privacy policy</li>
                    </ul>
                    </div>

                    {/* ----- Right Section ----- */}

                    <div>
                        <p className='text-xl font-medium mb-5 text-slate-900'>GET IN TOUCH</p>

                        <ul className='flex flex-col gap-2 text-slate-600'>
                            <li>+1-123-456-7890</li>
                            <li>contact@medibridge.com</li>
                        </ul>
                    </div>

                    </div>

                    {/* -------- Copyright Text -------- */}

                    <div>
                        <hr className="border-slate-200" />

                        <p className="py-5 text-sm text-center text-slate-500">
                            Copyright 2026@ MediBridge - All Right Reserved.
                        </p>
                    </div>
            </div>
        
    )
}

export default Footer
