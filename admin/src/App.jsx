import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./context/AdminContext.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";
import { useContext } from "react";
import Navbar from "./components/Navbar.jsx";
import SideBar from "./components/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";

// ADMIN PAGES
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointment from "./pages/Admin/AllAppointment.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorList from "./pages/Admin/DoctorList.jsx";

// DOCTOR PAGES
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

function App() {
    const { isAdminLoggedIn } = useContext(AdminContext);
    const { isDoctorLoggedIn } = useContext(DoctorContext);

    // ADMIN
    if (isAdminLoggedIn) {
        return (
            <div className="bg-slate-50 min-h-screen w-full flex flex-col antialiased">
                <ToastContainer position="top-right" autoClose={3000} />
                <Navbar />

                <div className="flex flex-1 items-start w-full">
                    <SideBar />

                    <main className="flex-1 w-full min-w-0 min-h-[calc(100vh-61px)] overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/admin-dashboard" element={<Dashboard />} />
                            <Route path="/all-appointments" element={<AllAppointment />} />
                            <Route path="/add-doctor" element={<AddDoctor />} />
                            <Route path="/doctor-list" element={<DoctorList />} />
                        </Routes>
                    </main>
                </div>
            </div>
        );
    }

    // DOCTOR
    if (isDoctorLoggedIn) {
        return (
            <div className="bg-slate-50 min-h-screen w-full flex flex-col antialiased">
                <ToastContainer position="top-right" autoClose={3000} />
                <Navbar />

                <div className="flex flex-1 items-start w-full">
                    <SideBar />

                    <main className="flex-1 w-full min-w-0 min-h-[calc(100vh-61px)] overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<DoctorDashboard />} />
                            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                            <Route path="/doctor-profile" element={<DoctorProfile />} />
                        </Routes>
                    </main>
                </div>
            </div>
        );
    }

    // NOT LOGGED IN
    return (
        <>
            <Login />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}

export default App;