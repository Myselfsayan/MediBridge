import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";

import { AdminContext } from "./context/AdminContext.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";

import { useContext } from "react";

import Navbar from "./components/Navbar.jsx";
import SideBar from "./components/Sidebar.jsx";

import { Route, Routes } from "react-router-dom";


// ==========================================
// ADMIN PAGES
// ==========================================

import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointment from "./pages/Admin/AllAppointment.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorList from "./pages/Admin/DoctorList.jsx";


// ==========================================
// DOCTOR PAGES
// ==========================================

import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";


function App() {

    const { isAdminLoggedIn } = useContext(AdminContext);

    const { isDoctorLoggedIn } = useContext(DoctorContext);


    // ==========================================
    // ADMIN
    // ==========================================

    if (isAdminLoggedIn) {

        return (

            <div className="bg-slate-50 min-h-screen w-full">

                <ToastContainer />

                <Navbar />

                <div className="flex items-start">

                    <SideBar />

                    <div className="flex-1 w-full p-2">

                        <Routes>

                            <Route
                                path="/"
                                element={<></>}
                            />

                            {/* ADMIN DASHBOARD */}

                            <Route
                                path="/admin-dashboard"
                                element={<Dashboard />}
                            />

                            {/* ADMIN APPOINTMENTS */}

                            <Route
                                path="/all-appointments"
                                element={<AllAppointment />}
                            />

                            {/* ADD DOCTOR */}

                            <Route
                                path="/add-doctor"
                                element={<AddDoctor />}
                            />

                            {/* DOCTOR LIST */}

                            <Route
                                path="/doctor-list"
                                element={<DoctorList />}
                            />

                        </Routes>

                    </div>

                </div>

            </div>

        );
    }


    // ==========================================
    // DOCTOR
    // ==========================================

    if (isDoctorLoggedIn) {

        return (

            <div className="bg-slate-50 min-h-screen w-full">

                <ToastContainer />

                <Navbar />

                <div className="flex items-start">

                    <SideBar />

                    <div className="flex-1 w-full p-2">

                        <Routes>

                            <Route
                                path="/"
                                element={<></>}
                            />

                            {/* DOCTOR DASHBOARD */}

                            <Route
                                path="/doctor-dashboard"
                                element={<DoctorDashboard />}
                            />

                            {/* DOCTOR APPOINTMENTS */}

                            <Route
                                path="/doctor-appointments"
                                element={<DoctorAppointments />}
                            />

                        </Routes>

                    </div>

                </div>

            </div>

        );
    }


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    return (

        <>
            <Login />
            <ToastContainer />
        </>

    );
}

export default App;