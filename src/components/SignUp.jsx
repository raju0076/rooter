import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://productlab-4.onrender.com/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Signup success");
        toast.success(data.message || "Signed up successfully!");
        setFormData({ email: "", password: "" });
        setTimeout(() => navigate("/signin"), 1000); // Delay optional
      } else {
        setMessage(data.message || "Signup failed.");
        toast.error(data.message || "Signup failed.");
      }
    } catch (err) {
      setMessage("Signup failed. Please try again.");
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link to="/signin" className="text-purple-600 font-medium hover:underline">
              Login
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
