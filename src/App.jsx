import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInForm from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./components/SignUp"; 
import ErrorBoundary from "./components/ErrorBoundary";




const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://productlab-4.onrender.com/users/verify", {
          credentials: "include",
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <ErrorBoundary>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={<SignInForm setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<Signup />} /> {/* ✅ Corrected usage */}
      </Routes>
    </>
  );
};

export default App;
