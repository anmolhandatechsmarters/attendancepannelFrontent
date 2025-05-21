import React, { useState, useEffect } from "react";

import getSwalTheme from "../../utils/Swaltheme";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../scss/css/SingleForm.css";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import { useSelector } from "react-redux";
const EditLeave = () => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const GetRole = localStorage.getItem("role");
  const { id } = useParams();
  const [employeeId, setEmployeeId] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("FullDay");
  const [shortOutTime, setShortOutTime] = useState("");
  const [shortInTime, setShortInTime] = useState("");
  const [status, setStatus] = useState("Approve"); // New state for status
  const [loading, setLoading] = useState(false);
  const logid = localStorage.getItem("id");
  const Swal = getSwalTheme();
  const logip = useSelector((state) => state.ipAddress);
  useEffect(() => {
    fetchLeaveData();
  }, [id]);

  const handleCancel = () => {};
  const fetchLeaveData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/getleavedata/${id}`);
      const leaveData = response.data;
      if (leaveData.success) {
        setEmployeeId(leaveData.record.userDetails.emp_id);
        setReason(leaveData.record.comment);
        setStartDate(leaveData.record.start_date);
        setEndDate(leaveData.record.end_date);
        setLeaveType(leaveData.record.type);
        setShortOutTime(leaveData.record.shortOutTime || "");
        setShortInTime(leaveData.record.shortInTime || "");
        setStatus(leaveData.record.status || "Approve"); // Set initial status
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Leave data not found.",
        });
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch leave data.",
      });
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    if (!startDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Start date is required",
      });
      return;
    }

    const leaveData = {
      comment: reason,
      start_date: startDate,
      end_date: leaveType === "HalfDay" ? null : endDate || null,
      type: leaveType,
      empid: employeeId,
      shortOutTime: leaveType === "ShortLeave" ? shortOutTime : null,
      shortInTime: leaveType === "ShortLeave" ? shortInTime : null,
      status,
      logid,
      logip,
    };
    console.log(leaveData);
    try {
      await axiosInstance.put(`/admin/editleave/${id}`, leaveData);
      Swal.fire({
        icon: "success",
        title: "Leave Updated",
        text: "The Employee Leave has been updated successfully.",
      });
      setEmployeeId("");
      setReason("");
      setStartDate("");
      setEndDate("");
      setLeaveType("FullDay");
      setShortOutTime("");
      setShortInTime("");
      setStatus("Approve");
      if (GetRole == "Admin") {
        navigate("/adminapproveleave");
      } else {
        navigate("/hrapproveleave");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error updating your leave request. Please try again later.",
      });
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
          <motion.div
            className="employee-leave"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="SingleForm">
              <div className="form-container">
                <h2 className="text-center">Edit Leave</h2>
                <form onSubmit={handleLeaveSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Employee ID:</label>
                        <span>{employeeId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave Type:</label>
                        <select
                          value={leaveType}
                          onChange={(e) => setLeaveType(e.target.value)}
                          className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                        >
                          <option value="FullDay">Full Day</option>
                          <option value="HalfDay">Half Day</option>
                          <option value="ShortLeave">Short Leave</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Start Date:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                        />
                      </div>
                    </div>

                    {leaveType === "FullDay" && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>End Date (Optional):</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                          />
                        </div>
                      </div>
                    )}

                    {leaveType === "ShortLeave" && (
                      <>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Short Out Time:</label>
                            <input
                              type="time"
                              value={shortOutTime}
                              onChange={(e) => setShortOutTime(e.target.value)}
                              required
                              className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Short In Time:</label>
                            <input
                              type="time"
                              value={shortInTime}
                              onChange={(e) => setShortInTime(e.target.value)}
                              required
                              className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status:</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                        >
                          <option value="Approved">Approve</option>
                          <option value="Reject">Reject</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Reason for Leave:</label>
                        <textarea
                          rows="4"
                          style={{ width: "100%" }}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          required
                          className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                          placeholder="Describe your reason"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <button type="submit" id="Commonbutton">
                      Update Leave
                    </button>
                    <button type="button" id="CancelButton" onClick={() => navigate(-1)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EditLeave;
