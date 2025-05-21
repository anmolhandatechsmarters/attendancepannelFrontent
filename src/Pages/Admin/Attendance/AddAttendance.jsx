import React, { useState } from "react";
import getSwalTheme from "../../../utils/Swaltheme";
import "../../../scss/css/SingleForm.css";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
let debounceTimeout = null;
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
const AddAttendance = () => {
  const theme = useSelector((state) => state.theme);
  const logid = localStorage.getItem("id");
  const Swal = getSwalTheme();
  const navigate = useNavigate();
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [comments, setComments] = useState("");
  const [loading, setloading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const logip = useSelector((state) => state.ipAddress);
  const Role = localStorage.getItem("role");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAttendanceData = {
      empId: selectedOptions.empid,
      in_time: timeIn,
      out_time: timeOut,
      date,
      status,
      comment: comments,
    };

    try {
      await axiosInstance.post(`/admin/addattendanceadmin`, newAttendanceData, {
        params: { logid, logip },
      });

      Swal.fire({
        title: "Success!",
        text: "Attendance added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        if (Role == "Admin") {
          navigate("/attendance");
        } else if (Role == "HR") {
          navigate("/hremployeeattendance");
        }
      });
    } catch (error) {
      console.error("Error adding attendance:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add attendance. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCancel = () => {
    if (Role == "Admin") {
      navigate("/attendance");
    } else if (Role == "HR") {
      navigate("/hremployeeattendance");
    }
  };

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
            className="SingleForm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Add Attendance</h2>

            <form onSubmit={handleSubmit}>
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
                    <label>Date:</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Time In:</label>
                    <div className="time-field">
                      <input
                        type="time"
                        value={timeIn}
                        onChange={(e) => setTimeIn(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Time Out:</label>
                    <div className="time-field">
                      <input
                        type="time"
                        value={timeOut}
                        onChange={(e) => setTimeOut(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Halfday">Halfday</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Comments:</label>
                    <textarea
                      rows="4"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" id="Commonbutton">
                  Add Attendance
                </button>
                <button type="button" id="CancelButton" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AddAttendance;
