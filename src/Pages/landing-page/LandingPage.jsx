import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import stars from "../../assets/spark.svg";
import "./LandingPage.css";

const apiUrl =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const selectRole = (role) => {
    setSelectedRole(role);
  };

  const continueToPoll = async () => {
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    if (selectedRole === "teacher") {
      try {
        const response = await axios.post(`${apiUrl}/teacher-login`);

        sessionStorage.setItem("username", response.data.username);
        navigate("/teacher-home-page");
      } catch (error) {
        console.error("Teacher login failed:", error);
        alert("Teacher login failed. Please try again.");
      }
    } else if (selectedRole === "student") {
      navigate("/student-home-page");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="poll-container text-center">
        <button className="btn btn-sm intervue-btn mb-5">
          <img src={stars} className="px-1" alt="Stars Icon" />
          Intervue Poll
        </button>

        <h3 className="poll-title">
          Welcome to the <b>Live Polling System</b>
        </h3>

        <p className="poll-description">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className="d-flex justify-content-around mb-4">
          <div
            className={`role-btn ${selectedRole === "student" ? "active" : ""}`}
            onClick={() => selectRole("student")}
          >
            <p>I'm a Student</p>
            <span>Join live polls and submit answers during interactive sessions.</span>
          </div>

          <div
            className={`role-btn ${selectedRole === "teacher" ? "active" : ""}`}
            onClick={() => selectRole("teacher")}
          >
            <p>I'm a Teacher</p>
            <span>Submit questions and view poll results in real time.</span>
          </div>
        </div>

        <button className="btn continue-btn" onClick={continueToPoll}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
