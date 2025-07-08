import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentPollPage.css";

import stopwatch from "../../assets/stopwatch.svg";
import stars from "../../assets/spark.svg";
import ChatPopover from "../../components/chat/ChatPopover";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";

const StudentPollPage = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollId, setPollId] = useState("");
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [kickedOut, setKickedOut] = useState(false);

  const timerRef = useRef(null);
  const navigate = useNavigate();
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const handlePollCreated = (pollData) => {
      setPollQuestion(pollData.question || "");
      setPollOptions(pollData.options || ["a", "b", "c", "d"]);
      setPollId(pollData._id || pollData.id || "");
      setVotes({});
      setSelectedOption(null);
      setSubmitted(false);
      setTimeLeft(pollData.timer || 60);
    };

    const handlePollResults = (updatedVotes) => {
      setVotes(updatedVotes || {});
    };

    const handleKickedOut = () => {
      setKickedOut(true);
      sessionStorage.removeItem("username");
      navigate("/kicked-out");
    };

    socket.on("pollCreated", handlePollCreated);
    socket.on("pollResults", handlePollResults);
    socket.on("kickedOut", handleKickedOut);

    return () => {
      socket.off("pollCreated", handlePollCreated);
      socket.off("pollResults", handlePollResults);
      socket.off("kickedOut", handleKickedOut);
      clearInterval(timerRef.current);
    };
  }, [navigate]);

  useEffect(() => {
    if (pollQuestion && timeLeft > 0 && !submitted) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [pollQuestion, timeLeft, submitted]);

  const handleOptionSelect = (optionText) => {
    setSelectedOption(optionText);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    const username = sessionStorage.getItem("username");
    if (!username) return;

    socket.emit("submitAnswer", {
      username,
      option: selectedOption,
      pollId,
    });

    setSubmitted(true);
  };

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  return (
    <>
      <ChatPopover />
      {kickedOut ? (
        <div className="text-center mt-5">
          <h4>You have been kicked out.</h4>
        </div>
      ) : (
        <>
          {!pollQuestion && pollOptions.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center vh-100 w-75 mx-auto">
              <div className="student-landing-container text-center">
                <button className="btn btn-sm intervue-btn mb-5">
                  <img src={stars} className="px-1" alt="" />
                  Intervue Poll
                </button>
                <br />
                <div className="spinner-border text-center spinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="landing-title mt-3">
                  <b>Wait for the teacher to ask questions...</b>
                </h3>
              </div>
            </div>
          ) : (
            <div className="container mt-5 w-50">
              <div className="d-flex align-items-center mb-4">
                <h5 className="m-0 pe-5">Question</h5>
                <img src={stopwatch} width="15px" height="auto" alt="Stopwatch" />
                <span className="ps-2 ml-2 text-danger">{timeLeft}s</span>
              </div>
              <div className="card">
                <div className="card-body">
                  <h6 className="question py-2 ps-2 float-left rounded text-white">
                    {pollQuestion}?
                  </h6>
                  <div className="list-group mt-4">
                    {pollOptions.map((option) => (
                      <div
                        key={option._id || option.id || option.text}
                        className={`list-group-item rounded m-1 ${
                          selectedOption === option.text ? "border option-border" : ""
                        }`}
                        style={{
                          padding: "10px",
                          cursor: submitted || timeLeft === 0 ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                          if (!submitted && timeLeft > 0) {
                            handleOptionSelect(option.text);
                          }
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className={`ml-2 text-left ${
                              submitted ? "fw-bold" : ""
                            }`}
                          >
                            {option.text}
                          </span>
                          {submitted && (
                            <span className="text-right">
                              {Math.round(
                                calculatePercentage(votes[option.text] || 0)
                              )}
                              %
                            </span>
                          )}
                        </div>
                        {submitted && (
                          <div className="progress mt-2">
                            <div
                              className="progress-bar progress-bar-bg"
                              role="progressbar"
                              style={{
                                width: `${calculatePercentage(
                                  votes[option.text] || 0
                                )}%`,
                              }}
                              aria-valuenow={votes[option.text] || 0}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!submitted && selectedOption && timeLeft > 0 && (
                <div className="d-flex justify-content-end align-items-center">
                  <button
                    type="submit"
                    className="btn continue-btn my-3 w-25"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}

              {submitted && (
                <div className="mt-5">
                  <h6 className="text-center">
                    Wait for the teacher to ask a new question...
                  </h6>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default StudentPollPage;
