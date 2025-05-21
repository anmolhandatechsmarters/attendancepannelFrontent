import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ViewUser.css";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import InventoryShow from "./InventoryShow";
import getSwalTheme from "../../utils/Swaltheme";
import { MdHelp } from "react-icons/md";
import { motion } from "framer-motion";

const convertTo12HourFormat = (time) => {
  if (!time) {
    return "N/A";
  }

  const [hours, minutes, seconds] = time.split(":");

  if (hours === undefined || minutes === undefined || seconds === undefined) {
    return "N/A";
  }

  const parsedHours = parseInt(hours, 10);
  const modifier = parsedHours >= 12 ? "PM" : "AM";
  const normalizedHours = parsedHours % 12 || 12;

  const formattedTime = `${normalizedHours}:${minutes}:${seconds} ${modifier}`;

  if (formattedTime.includes("AM") || formattedTime.includes("PM")) {
    return formattedTime;
  } else {
    return time;
  }
};

function ViewUser() {
  const navigate = useNavigate();
  const Swal = getSwalTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setloading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeSection, setActiveSection] = useState("user");
  const { id } = useParams();
  const theme = useSelector((state) => state.theme);
  const [userattendance, setUserAttendance] = useState([]);
  const [countattendance, setCountAttendance] = useState(0);
  const adminid = localStorage.getItem("id");
  const admintoken = localStorage.getItem("token");
  const Role = localStorage.getItem("role");
  useEffect(() => {
    async function getUser() {
      try {
        const result = await axiosInstance.get(`/admin/viewuser/${id}`, {});
        setUser(result.data.user);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    const fetchAttendanceRecords = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/viewuserattendence/${id}`,
          {}
        );
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance records", error);
      }
    };

    fetchAttendanceRecords();
    getUser();
  }, [id]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const result = await axiosInstance.get(
          `/api/employee/viewuserattendance/${id}`,
          {}
        );
        setCountAttendance(result.data.count);
        setUserAttendance(result.data.data);
        console.log(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  const handleImageUpload = async () => {
    if (!selectedImage || !id) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      await axiosInstance.put(`/admin/upload/${id}`, formData, {});
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      handleImageUpload();
    }
  }, [selectedImage]);

  const profileImageUrl = `${import.meta.env.REACT_APP_BASE_URL}/${user.image}`;

  const handleAttendanceUser = (userid) => {
    if (Role == "Admin") {
      navigate(`/attendance/${userid}`);
    } else if (Role == "HR") {
      navigate(`/hremployeeattendance/${userid}`);
    }
  };

  const handleEditUser = (userid) => {
    if (Role == "Admin") {
      navigate(`/edituser/${userid}`);
    } else if (Role == "HR") {
      navigate(`/hredituser/${userid}`);
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleString();
  };

  const handleInventory = () => {
    setActiveSection("inventory");
  };
  const handleuserinfo = () => {
    setActiveSection("user");
  };

  const handleLoginAsClient = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with Login As Client?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Login",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const result = await axiosInstance.get(`/admin/loginasClient/${id}`, {
          params: { admintoken },
        });
        console.log("data", result.data.user);
        const user = result.data.user;
        localStorage.setItem("id", user.id);
        localStorage.setItem("role", user.roleDetails.role);
        localStorage.setItem("token", user.token);
        localStorage.setItem("adminid", adminid);
        localStorage.setItem("admintoken", admintoken);
        localStorage.setItem("asClientLogin", true);

        const userRole = user.roleDetails.role;
        if (userRole == "Employee") {
          navigate("/employeedetail");
          window.location.reload();
        } else if (userRole == "HR") {
          navigate("/hrdetail");
          window.location.reload();
        }
      } catch (error) {}
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <motion.div
        className="main-container-view-user container-fluid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="row ContainerUserInfo">
          {/* Sidebar */}
          <motion.div
            className="col-md-3 col-12 sidebarss p-3 mb-4 mb-md-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="profile text-center mb-4">
              <div className="img mb-3">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="img-fluid shadow"
                  style={{ maxHeight: "200px", borderRadius: "1rem" }}
                />
              </div>
              <p className="fw-bold">{user.emp_id}</p>
            </div>
            <div className="menu d-grid gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={handleuserinfo}
              >
                User Info
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => handleEditUser(user.id)}
              >
                Edit User
              </button>
              <button
                className="btn btn-outline-success"
                onClick={() => handleAttendanceUser(user.emp_id)}
              >
                Attendance
              </button>
              <button
                className="btn btn-outline-warning"
                onClick={handleInventory}
              >
                Inventory
              </button>
              {Role == "Admin" && (
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLoginAsClient}
                >
                  Login As Client
                </button>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="col-md-9 col-12 content"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {activeSection === "user" && (
              <div className="user-info">
                <h2 className="text-center mb-4">User Information</h2>
                <div className="container">
                  {[
                    ["Employee ID", user.emp_id, "First Name", user.first_name],
                    ["Last Name", user.last_name, "Email ID", user.email],
                    [
                      "Role",
                      user.roleDetails ? user.roleDetails.role : "N/A",
                      "Created By",
                      user.created_by,
                    ],
                    [
                      "Status",
                      user.status === 1 ? "Inactive" : "Active",
                      "Country",
                      user.countryDetails ? user.countryDetails.name : "N/A",
                    ],
                    [
                      "State",
                      user.stateDetails ? user.stateDetails.name : "N/A",
                      "City",
                      user.cityDetails ? user.cityDetails.name : "N/A",
                    ],
                    [
                      "Aadhar Card",
                      user.aadharcard || "N/A",
                      "PAN Card",
                      user.pancard || "N/A",
                    ],
                    [
                      "Bank Account",
                      user.bankaccount || "N/A",
                      "IFSC Code",
                      user.account_holder_name || "N/A",
                    ],
                    ["IP", user.ip, "Last Login", formatDate(user.last_login)],
                    [
                      "Created On",
                      formatDate(user.created_on),
                      "Updated On",
                      formatDate(user.updated_on),
                    ],
                  ].map(([label1, value1, label2, value2], index) => (
                    <div className="row mb-3" key={index}>
                      <div className="col-md-6">
                        <strong>{label1}:</strong> {value1}
                      </div>
                      <div className="col-md-6">
                        <strong>{label2}:</strong> {value2}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <h3 className="text-center mb-3">
                    Attendance Table (Last 7 Days)
                  </h3>
                  <div className="table-responsive">
                    <table className="table attendance-table table-bordered">
                      <thead className="table-primary">
                        <tr>
                          <th>Date</th>
                          <th>Intime</th>
                          <th>Outtime</th>
                          <th>Comment</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userattendance.length > 0 ? (
                          userattendance.map((ua, index) => {
                            const shortComment =
                              ua.comment && ua.comment.length > 20
                                ? ua.comment.substring(0, 20) + "..."
                                : ua.comment;

                            return (
                              <tr key={index}>
                                <td>
                                  {new Date(ua.date).toLocaleDateString()}
                                </td>
                                <td>{convertTo12HourFormat(ua.in_time)}</td>
                                <td>{convertTo12HourFormat(ua.out_time)}</td>
                                <td>
                                  {shortComment}
                                  {ua.comment && ua.comment.length > 20 && (
                                    <MdHelp
                                      onClick={() =>
                                        handleHelpClick(ua.comment)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: "8px",
                                      }}
                                    />
                                  )}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      ua.status === "Present"
                                        ? "bg-success"
                                        : ua.status === "Absent"
                                          ? "bg-danger"
                                          : ua.status === "Halfday" ||
                                              ua.status === "Leave"
                                            ? "bg-warning text-dark"
                                            : "bg-secondary"
                                    }`}
                                  >
                                    {ua.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "inventory" && (
              <div className="inventory-section">
                <InventoryShow userid={user.emp_id} />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ViewUser;
