import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./context/AdminContext.jsx";
import { useContext } from "react";
import Navbar from "./components/Navbar.jsx";
import SideBar from "./components/Sidebar.jsx"
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointment from "./pages/Admin/AllAppointment.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorList from "./pages/Admin/DoctorList.jsx";

function App() {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div>
      <ToastContainer />
      <Navbar/>
      <div className="flex items-start">
        <SideBar/>
        <Routes>
          <Route path="/" element={<></>} ></Route>
          <Route path="/admin-dashboard" element={<Dashboard />} ></Route>
          <Route path="/all-appointments" element={<AllAppointment />} ></Route>
          <Route path="/add-doctor" element={<AddDoctor />} ></Route>
          <Route path="/doctor-list" element={<DoctorList />} ></Route>
        </Routes>
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