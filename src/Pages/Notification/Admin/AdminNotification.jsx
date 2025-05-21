import React, { useEffect, useState } from "react";
import axios from "axios";
import getSwalTheme from "../../../utils/Swaltheme";
import "./adminNotification.css";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNotification } from "../../../utils/NotificationContext";
const Aproveleave = () => {
  const Swal = getSwalTheme();
  const role = localStorage.getItem("role");
  const logid = localStorage.getItem("id");
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const [logip, setIpAddress] = useState("");
  const [loading, setloading] = useState(true);
  const theme = useSelector((state) => state.theme);
  const { refreshNotificationCount } = useNotification();
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
    const fetchAllLeave = async () => {
      try {
        const result = await axiosInstance.get(`/admin/approveleavenotification`);
        setLeaveData(result.data.leaveRequests);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch leave data.");
      } finally {
        setloading(false);
      }
    };

    fetchAllLeave();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.REACT_APP_BASE_URL}/api/hremp/approveleave/${id}`,
        null,
        { params: { role, logid, logip } }
      );
      setLeaveData((prev) => prev.filter((leave) => leave.id !== id));
      refreshNotificationCount();
      Swal.fire({ icon: "success", title: "Approved!", text: "Leave approved." });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error!", text: "Failed to approve leave." });
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.REACT_APP_BASE_URL}/api/hremp/rejectleave/${id}`,
        null,
        { params: { role, logid, logip } }
      );
      setLeaveData((prev) => prev.filter((leave) => leave.id !== id));
      refreshNotificationCount();
      Swal.fire({ icon: "success", title: "Rejected!", text: "Leave rejected." });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error!", text: "Failed to reject leave." });
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className={theme === "dark" ? "dark-theme" : "light-theme"} >
          {error && <p className="error">{error}</p>}
          {leaveData.length === 0 ? (
            <p className="text-center">No leave requests available.</p>
          ) : (
            <motion.div
              className="leave-cards"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {leaveData.map((leave) => (
                <motion.div
                  key={leave.id}
                  className="leave-card"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="leave-details">
                    <p><strong>Date:</strong> {leave.apply_date}</p>
                    <p><strong>Name:</strong> {leave.userDetails.first_name} {leave.userDetails.last_name}</p>
                    <p><strong>Employee ID:</strong> {leave.userDetails.emp_id}</p>
                    <p><strong>Leave Type:</strong> {leave.type}</p>
                    <p><strong>Apply Date:</strong> {leave.start_date} to {leave.end_date || "NULL"}</p>
                    {leave.type === "ShortLeave" && (
                      <>
                        <p><strong>Short In Time:</strong> {leave.shortInTime}</p>
                        <p><strong>Short Out Time:</strong> {leave.shortOutTime}</p>
                      </>
                    )}
                    <p><strong>Reason:</strong> {leave.comment}</p>
                  </div>
                  <div className="apply-buttona">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="apply-button"
                      onClick={() => handleApprove(leave.id)}
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="apply-button"
                      onClick={() => handleReject(leave.id)}
                    >
                      Reject
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Aproveleave;
