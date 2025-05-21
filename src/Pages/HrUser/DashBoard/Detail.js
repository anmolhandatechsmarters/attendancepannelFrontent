import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "./detail.css";
import getSwalTheme from "../../../utils/Swaltheme";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../components/utils/AxiosIntance";
import ShowMessage from "../../../utils/Messagebox/ShowMessage";
import Spinner from "../../../utils/Spinner";
const convertTo12HourFormat = (time) => {
  if (!time) return "N/A";
  const [hours, minutes, seconds] = time.split(":");
  const parsedHours = parseInt(hours, 10); //========================
  // routes/attendance.js
  const modifier = parsedHours >= 12 ? "PM" : "AM";
  const normalizedHours = parsedHours % 12 || 12;
  return `${normalizedHours}:${minutes}:${seconds} ${modifier}`;
};

const today = new Date().toISOString().split("T")[0];

const Detailemployee = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [logip, setIpAddress] = useState("");
  const [user, setUser] = useState(null);
  const [userAttendance, setUserAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const id = localStorage.getItem("id");
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const Swal = getSwalTheme();
  const logid = localStorage.getItem("id");
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };
    fetchIpAddress();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResult = await axiosInstance.get(`/api/hr/gethrdata/${id}`);
        setUser(userResult.data.user);

        const attendanceResult = await axiosInstance.get(
          `/api/employee/userattendance/${id}`
        );
        setUserAttendance(attendanceResult.data);
        setMessageContent("Data fetched successfully!");
        setShowMessage(true);
      } catch (error) {
        setError("Failed to load data");
        console.error(error);
        setMessageContent("Failed to fetch data.");
        setShowMessage(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        await axios.put(
          `${import.meta.env.REACT_APP_BASE_URL}/admin/upload/${user.id}`,
          formData,
          {
            params: { logid: id, logip },
          }
        );
        const result = await axiosInstance.get(
          `/api/employee/employeedetail/${id}`
        );
        setUser(result.data.user);
        window.location.reload();
      } catch (error) {
        console.error("Error uploading image", error);
        setError("Failed to upload image");
      }
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/employee/markattendance/${id}`,
        {
          logip,
          logid,
        }
      );

      if (!response.data.success) {
        Swal.fire({
          title: "Incomplete Attendance",
          text: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      setUserAttendance(response.data.record);
      Swal.fire({
        title: `Welcome, User!`,
        text: "Your attendance has been marked successfully.",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {},
      });
    } catch (error) {
      console.error("Failed to mark attendance", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data.message ||
          "Failed to mark attendance. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/user/logout/${id}`, { params: { logip } });
        localStorage.clear();
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        Swal.fire({
          title: "Error!",
          text: "Logout failed. Please try again.",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const handleUnmarkAttendance = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to unmark your attendance?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, unmark it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/api/employee/unmarkattendance/${id}`, {
          logip,
          logid,
        });

        const response = await axiosInstance.get(
          `/api/employee/userattendance/${id}`
        );
        setUserAttendance(response.data);
        Swal.fire({
          title: "Success!",
          text: "Your attendance has been unmarked.",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
        }).then(async () => {
          const logoutConfirmation = await Swal.fire({
            title: "Logout?",
            text: "Do you want to log out now?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, log me out!",
            cancelButtonText: "No, stay logged in!",
          });

          if (logoutConfirmation.isConfirmed) {
            await handleLogout();
          }
        });
      } catch (error) {
        console.error("Failed to unmark attendance", error);
        Swal.fire({
          title: "Error!",
          text: "There was a problem unmarking your attendance. Please try again.",
          icon: "error",
        });
      }
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="error-message">{error}</p>;

  const profileImageUrl = user
    ? `${import.meta.env.REACT_APP_BASE_URL}/${user.image}`
    : "";

  return (
    <div>
      <div>
        {!localStorage.getItem("islogin") && showMessage && (
          <ShowMessage
            message={messageContent}
            onClose={() => setShowMessage(false)}
          />
        )}
      </div>
      <div className="employee-Main-box">
        <div className="employeeImage">
          <img src={profileImageUrl} alt="Profile" />
          <FaCamera className="camera-icon" onClick={handleCameraClick} />
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {user && (
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              EmpID: {user.emp_id}
            </p>
          )}
        </div>

        <div className="employeedetail">
          {user && (
            <>
              <div className="detail-row">
                <span className="detail-title">Name:</span>
                <span className="detail-value">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">Role:</span>
                <span className="detail-value">
                  {user.roleDetails ? user.roleDetails.role : "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">Status:</span>
                <span className="detail-value">
                  {user.status === "1" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">Date:</span>
                <span className="detail-value">
                  {userAttendance && userAttendance.date
                    ? new Date(userAttendance.date).toLocaleDateString()
                    : new Date(today).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">In Time:</span>
                <span className="detail-value">
                  {convertTo12HourFormat(userAttendance.in_time) || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">Out Time:</span>
                <span className="detail-value">
                  {convertTo12HourFormat(userAttendance.out_time) || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">Today Attendance:</span>
                <span className="detail-value">
                  {userAttendance.status === "Present" ? (
                    <span className="badge badge-success">Present</span>
                  ) : userAttendance.status === "Absent" ? (
                    <span className="badge badge-danger">Absent</span>
                  ) : userAttendance.status === "Halfday" ? (
                    <span className="badge badge-warning">Halfday</span>
                  ) : (
                    <span className="badge badge-secondary">Pending</span>
                  )}
                </span>
              </div>
            </>
          )}

          <div className="text-center mt-2">
            {!userAttendance.in_time ? (
              <button onClick={handleMarkAttendance}>Mark Attendance</button>
            ) : userAttendance.in_time && !userAttendance.out_time ? (
              <button onClick={handleUnmarkAttendance}>Logout</button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailemployee;
