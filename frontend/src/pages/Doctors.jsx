import { useContext, useState , useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


function Doctors() {
    const {speciality} = useParams()
    const {doctors} = useContext(AppContext)
    const [filterDoc , setFilterDoc] = useState([])
    const [showFilter , setShowFilters] = useState(false)
    const navigate = useNavigate()
    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(
            doctors.filter((doc) => doc.speciality === speciality)
            )
        } else {
            setFilterDoc(doctors)
        }
    }
    useEffect(() => {
    applyFilter()
    }, [doctors, speciality])

    return (
        <div>
            <p className='text-slate-600 mb-6'>Browse through the doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-6 mt-5'>
                <button className={`py-2 px-4 border rounded-lg text-sm transition-all sm:hidden font-medium ${showFilter ? 'bg-primary text-white border-primary' : 'border-slate-300 text-slate-700'}`} onClick={()=>setShowFilters(prev=>!prev)}>Filters</button>
                <div className={`flex-col gap-3 text-sm text-slate-600 ${showFilter ? 'flex' : 'hidden sm:flex'} w-full sm:w-64`}>
                    <p onClick={()=>speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-full pl-4 py-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'hover:bg-slate-50'}`}>General physician</p>

                    <p onClick={()=>speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-full pl-4 py-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'hover:bg-slate-50'}`}>Gynecologist</p>

                    <p onClick={()=>speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-full pl-4 py-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'hover:bg-slate-50'}`}>Dermatologist</p>

                    <p onClick={()=>speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-full pl-4 py-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'hover:bg-slate-50'}`}>Pediatricians</p>

                    <p onClick={()=>speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-full pl-4 py-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'hover:bg-slate-50'}`}>Neurologist</p>

                    <p onClick={()=>speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-full pl-4 py-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'hover:bg-slate-50'}`}>Gastroenterologist</p>
                </div>
                <div className='w-full grid grid-cols-auto gap-6 gap-y-8'>
                    {
                        filterDoc.map((item, index) => (
                <div onClick={() => navigate(`/appointment/${item._id}`)} className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:translate-y-[-5px] transition-all duration-300" key={index}>

                    <img className='bg-cyan-50 w-full' src={item.image} alt="" />

                    <div className="p-5">
                    {item.available?<div className='flex items-center gap-2 text-xs font-medium text-emerald-600 mb-2'>
                        <p className='w-2 h-2 bg-emerald-500 rounded-full'></p>
                        <p >{item.available ? 'Available' : 'Not Available'}</p>
                    </div>:
                    <div className='flex items-center gap-2 text-xs font-medium text-red-500 mb-2'>
                        <p className='w-2 h-2 bg-red-500 rounded-full'></p>
                        <p >{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    }

                    <p className='text-slate-900 text-lg font-semibold'>{item.name}</p>
                    <p className='text-slate-500 text-sm'>{item.speciality}</p>
                    </div>

                </div>
                ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Doctors
