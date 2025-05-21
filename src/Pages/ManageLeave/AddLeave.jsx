import React, { useState, useEffect } from "react";
import getSwalTheme from "../../utils/Swaltheme";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
let debounceTimeout = null;
import "../../scss/css/SingleForm.css";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
const AddLeave = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const Swal = getSwalTheme();
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("FullDay");
  const [shortOutTime, setShortOutTime] = useState("");
  const [shortInTime, setShortInTime] = useState("");
  const [loading, setloading] = useState(false);
  const userrole = localStorage.getItem("role");
  const logid = localStorage.getItem("id");
  const Role = localStorage.getItem("role");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [allUserIds, setAllUserIds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const theme = useSelector((state) => state.theme);

  const logip = useSelector((state) => state.ipAddress);
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
      end_date: leaveType === "HalfDay" ? null : endDate || null, // Only set end_date if not Half Day
      type: leaveType,
      empid: selectedOptions.empid,
      shortOutTime: leaveType === "ShortLeave" ? shortOutTime : null,
      shortInTime: leaveType === "ShortLeave" ? shortInTime : null,
      userrole: userrole,
    };

    console.log(leaveData);

    try {
      const response = await axiosInstance.post(
        `/api/hremp/addleave`,
        leaveData,
        {
          params: { logid, logip },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Leaved Approved ",
        text: "The Employee Leave is Approved",
      });
      // Reset the form
      setEmployeeId("");
      setReason("");
      setStartDate("");
      setEndDate("");
      setLeaveType("FullDay");
      setShortOutTime("");
      setShortInTime("");
      if (Role == "Admin") {
        navigate("/adminapproveleave");
      } else if (Role == "HR") {
        navigate("/hrapproveleave");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get("/api/message/viewoption");
        const fetchedOptions = response.data.map((option) => ({
          empid: option.empid,
          value: option.value,
          label: option.label,
        }));
        setOptions(fetchedOptions);
        const userIds = response.data.map((option) => option.value);
        setAllUserIds(userIds);
      } catch (error) {
        console.error("Error fetching options:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch options. Please try again later.",
        });
      }
    };

    fetchOptions();
  }, []);

  const handleCancel = () => {};

  const fetchOptions = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setOptions([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      axiosInstance
        .get("/api/message/viewoption", {
          params: { search: trimmed },
        })
        .then((response) => {
          setOptions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    }, 300);
  };
  const handleSelect = (option) => {
    setSelectedUser(option);
    setSelectedOptions(option);
    setSearch(option.label);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    setShowDropdown(true);

    if (!newSearch.trim()) {
      setSelectedUser(null);
      setOptions([]);
      return;
    }

    fetchOptions(newSearch);
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
                <h2 className="text-center">Add Leave</h2>
                <form onSubmit={handleLeaveSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Employee ID:</label>
                        <div
                          className={`autocomplete-wrapper ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                        >
                          <input
                            type="text"
                            value={search}
                            onChange={handleInputChange}
                            placeholder="Search user..."
                            className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`} // Dynamic class based on theme
                          />
                          {showDropdown && options.length > 0 && (
                            <ul
                              className={`dropdown-list ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                            >
                              {options.map((option) => (
                                <li
                                  key={option.value}
                                  onClick={() => handleSelect(option)}
                                  className={`dropdown-item ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                                >
                                  {option.label}
                                </li>
                              ))}
                            </ul>
                          )}
                          {showDropdown && options.length === 0 && (
                            <div
                              className={`no-user-found ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                            >
                              No user found
                            </div>
                          )}
                          {selectedUser && (
                            <div
                              className={`selected-user ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                            >
                              <strong>Selected:</strong> {selectedUser.label}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave Type:</label>
                        <select
                          value={leaveType}
                          onChange={(e) => {
                            setLeaveType(e.target.value);
                            if (e.target.value === "HalfDay") setEndDate("");
                          }}
                          className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                        >
                          <option value="FullDay">Full Day</option>
                          <option value="HalfDay">Half Day</option>
                          <option value="ShortLeave">Short Leave</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
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
                  </div>

                  {leaveType === "ShortLeave" && (
                    <div className="row">
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
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Reason for Leave:</label>
                        <br />
                        <textarea
                          rows="4"
                          style={{ width: "100%" }}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          required
                          className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                          placeholder="Describe your reason"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <button type="submit" id="Commonbutton">
                      Add Leave
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

export default AddLeave;
