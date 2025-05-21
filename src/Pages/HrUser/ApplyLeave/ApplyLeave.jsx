import React, { useState, useEffect } from "react";
import getSwalTheme from "../../../utils/Swaltheme";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
const HrAddLeave = () => {
  const Swal = getSwalTheme();
  const navigate = useNavigate();
  const Role = localStorage.getItem("role");
  //State Management
  const [employeeId, setEmployeeId] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("FullDay");
  const [shortOutTime, setShortOutTime] = useState("");
  const [shortInTime, setShortInTime] = useState("");
  const userrole = localStorage.getItem("role");
  const logid = localStorage.getItem("id");
  const [logip, setIpAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const darkmode = localStorage.getItem(
      "coreui-free-react-admin-template-theme"
    );
    setIsDarkMode(darkmode === "dark");
  }, []);

  //Get the Ip Address of the User
  const ip = useSelector((state) => state.ipAddress);
  useEffect(() => {
    if (ip) {
      setIpAddress(ip);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [ip]);

  //Submit Add Leave Function
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
      user_id: logid,
      comment: reason,
      start_date: startDate,
      end_date: leaveType === "HalfDay" ? null : endDate || null,
      type: leaveType,
      shortOutTime: leaveType === "ShortLeave" ? shortOutTime : null,
      shortInTime: leaveType === "ShortLeave" ? shortInTime : null,
      userrole: userrole,
    };

    try {
      const response = await axiosInstance.post(
        `/api/hremp/applyleave`,
        leaveData,
        {
          params: { logid, logip },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Apply Leave Successfully",
        text: "The Employee Leave is Applied Succefully Please wait for Approvel",
      });
      setEmployeeId("");
      setReason("");
      setStartDate("");
      setEndDate("");
      setLeaveType("FullDay");
      setShortOutTime("");
      setShortInTime("");
      if (Role == "HR") {
        navigate("/hrapplyleavetable");
      } else if (Role == "Employee") {
        navigate("/employeeleave");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your leave request. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  //Stucture of JSX Start Here of Apply leave Page
  return (
    <div className="Hr-Apply-Leave">
      {loading ? (
        <Spinner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-center mb-4">Apply Leave</h1>
          <form onSubmit={handleLeaveSubmit}>
            <div className="row mb-3">
              <div className="col-12">
                <label htmlFor="reason">
                  Write the Employee Reason for Leave:
                </label>
                <textarea
                  id="reason"
                  rows="4"
                  value={reason}
                  placeholder="Describe Your Reason"
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="leave-type">Select Type</label>
                <select
                  id="leave-type"
                  value={leaveType}
                  onChange={(e) => {
                    setLeaveType(e.target.value);
                    if (e.target.value === "HalfDay") {
                      setEndDate("");
                    }
                  }}
                  className="form-control"
                >
                  <option value="FullDay">Full Day</option>
                  <option value="HalfDay">Half Day</option>
                  <option value="ShortLeave">Short Leave</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="start-date">Select Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  min={getTodayDate()}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              {leaveType === "FullDay" && (
                <div className="col-12 col-md-6">
                  <label htmlFor="end-date">Select End Date (Optional)</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    required
                    min={getTodayDate()}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              )}
            </div>

            {leaveType === "ShortLeave" && (
              <div className="row mb-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="short-out-time">Select Short Out Time</label>
                  <input
                    type="time"
                    id="short-out-time"
                    value={shortOutTime}
                    onChange={(e) => setShortOutTime(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="short-in-time">Select Short In Time</label>
                  <input
                    type="time"
                    id="short-in-time"
                    value={shortInTime}
                    onChange={(e) => setShortInTime(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
              </div>
            )}

            <div className="text-center">
              <button type="submit" className="btn btn-primary mt-3">
                Submit Leave
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default HrAddLeave;
