// src/SignOutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignOutButton = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await fetch("https://productlab-4.onrender.com/signout", {
        method: "POST",
        credentials: "include",
      });

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        toast.success(data.message || "Signed out successfully", {
          autoClose: 2000, // ✅ closes in 2 seconds
        });
        setIsAuthenticated(false);
        navigate("/signin");
      } else {
        const errorText = await res.text();
        console.error("Sign out error:", errorText);
        toast.error("Sign out failed. Server returned an unexpected response.", {
          autoClose: 3000, // ✅ closes in 3 seconds
        });
      }
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Error during sign out. Please try again.", {
        autoClose: 3000, // ✅ closes in 3 seconds
      });
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
