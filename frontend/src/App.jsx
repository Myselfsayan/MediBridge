import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Login from './pages/Login'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import About from './pages/About'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DemoPayment from './pages/DemoPayment'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='min-h-screen bg-slate-50/50 flex flex-col'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col'>
        <Navbar />
        <main className='flex-1 pb-10'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/appointment/:docId" element={<Appointment />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/all-doctors" element={<Doctors />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/demo-payment" element={<DemoPayment />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
