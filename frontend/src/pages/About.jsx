import React from 'react'
import {assets} from '../assets/assets.js'

function About() {
    return (
            <div>

                <div className='text-center text-3xl pt-10 text-slate-800 font-semibold'>
                <p>
                    ABOUT <span className='text-primary'>US</span>
                </p>
                </div>

                <div className='my-10 flex flex-col md:flex-row gap-12 bg-white p-8 rounded-xl border border-slate-200 shadow-sm'>

                <img className='w-full md:max-w-[360px] rounded-lg' src={assets.about_image} alt="" />

                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-slate-600'>

                    <p>
                    Welcome to MediBridge, your trusted partner in managing your healthcare needs conveniently and efficiently.
                    </p>

                    <p>
                    MediBridge is committed to excellence in healthcare technology. We continuously strive to improve our platform.
                    </p>

                    <b className='text-slate-900 text-lg'>Our Vision</b>

                    <p>
                    Our vision at MediBridge is to create a seamless healthcare experience for every user.
                    </p>

                </div>

                </div>
                <div className='text-2xl my-8 text-center text-slate-800 font-semibold'>
                    <p>
                        WHY <span className='text-primary'>CHOOSE US</span>
                    </p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-20'>
                        <div className='bg-white rounded-xl border border-slate-200 px-8 py-10 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 text-slate-600 cursor-pointer shadow-sm group'>
                            
                            <b className='text-slate-900 group-hover:text-white text-lg'>Efficiency</b>
                            <p>
                            Streamlined appointment scheduling that fits into your busy lifestyle.
                            </p>
                        </div>
                        <div className='bg-white rounded-xl border border-slate-200 px-8 py-10 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 text-slate-600 cursor-pointer shadow-sm group'>
                            <b className='text-slate-900 group-hover:text-white text-lg'>Convenience</b>
                            <p>
                            Access to a network of trusted healthcare professionals in your area.
                            </p>
                        </div>
                        
                        <div className='bg-white rounded-xl border border-slate-200 px-8 py-10 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 text-slate-600 cursor-pointer shadow-sm group'>
                            <b className='text-slate-900 group-hover:text-white text-lg'>Personalization</b>
                            <p>
                            Tailored recommendations and reminders to help you stay on top of your health.
                            </p>
                        </div>
                        
                </div>

            </div>
        )
}

export default About
