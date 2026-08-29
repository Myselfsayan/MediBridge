import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./context/AdminContext.jsx";
import { useContext } from "react";
import Navbar from "./components/Navbar.jsx";
import SideBar from "./components/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointment from "./pages/Admin/AllAppointment.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorList from "./pages/Admin/DoctorList.jsx";

function App() {

    const { isAdminLoggedIn } = useContext(AdminContext);

    return isAdminLoggedIn ? (
        <div className="bg-slate-50 min-h-screen w-full">
            <ToastContainer />

            <Navbar />

            <div className="flex items-start">

                <SideBar />

                <div className="flex-1 w-full p-2">
                    <Routes>
                        <Route path="/" element={<></>} />
                        <Route
                            path="/admin-dashboard"
                            element={<Dashboard />}
                        />
                        <Route
                            path="/all-appointments"
                            element={<AllAppointment />}
                        />
                        <Route
                            path="/add-doctor"
                            element={<AddDoctor />}
                        />
                        <Route
                            path="/doctor-list"
                            element={<DoctorList />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    ) : (
        <>
            <Login />
            <ToastContainer />
        </>
    );
}

export default App;