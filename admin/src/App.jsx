import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./context/AdminContext.jsx";
import { useContext } from "react";
import Navbar from "./components/Navbar.jsx";

function App() {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div>
      <ToastContainer />
      <Navbar/>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;