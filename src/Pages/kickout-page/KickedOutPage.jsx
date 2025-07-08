import React from "react";
import { useNavigate } from "react-router-dom";
import "./KickedOutPage.css";
import stars from "../../assets/spark.svg";

const KickedOutPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    sessionStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="kicked-out-container">
      <div className="kicked-out-card">
        <button className="btn btn-sm intervue-btn mb-4">
          <img src={stars} alt="logo" className="px-1" />
          Intervue Poll
        </button>

        <h2 className="poll-title ">You’ve been Kicked out !</h2>
        <p className="poll-description">
          Looks like the teacher had removed you from the poll system .Please Try again sometime.
        </p>

        {/* <button className="btn continue-btn" onClick={handleBackToHome}>
          Back to Home
        </button> */}
      </div>
    </div>
  );
};

export default KickedOutPage;
