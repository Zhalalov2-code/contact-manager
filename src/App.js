import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import Login from "./pages/loginPage";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import Register from "./pages/registerPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            } 
          />
          <Route path="/register" element={<Register />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 