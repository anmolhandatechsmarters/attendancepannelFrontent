import React, { useEffect, useState } from "react";
import axios from "axios";
import getSwalTheme from "../../../utils/Swaltheme";
import "./AproveleaveNotification.css";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
const Aproveleave = () => {
  const Swal = getSwalTheme();
  const role = localStorage.getItem("role");
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const logid = localStorage.getItem("id");
  const [logip, setIpAddress] = useState("");
  const [loading, setloading] = useState(true);
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
        const result = await axiosInstance.get(
          `/admin/approveleavenotification`,
          {}
        );
        setLeaveData(result.data.leaveRequests);
        console.log(result.data.leaveRequests);
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
        {
          params: { role, logid, logip },
        }
      );
      setLeaveData((prevLeaveData) =>
        prevLeaveData.filter((leave) => leave.id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Leave request has been approved.",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to approve leave.",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.REACT_APP_BASE_URL}/api/hremp/rejectleave/${id}`,
        null,
        {
          params: { role, logid, logip },
        }
      );
      setLeaveData((prevLeaveData) =>
        prevLeaveData.filter((leave) => leave.id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "Leave request has been rejected.",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to reject leave.",
      });
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="hr-approve-leave-notification">
          {error && <p className="error">{error}</p>}
          {leaveData.length === 0 ? (
            <p className="text-center" style={{}}>
              No leave requests available.
            </p>
          ) : (
            <div className="leave-cards">
              {leaveData.map((leave) => (
                <div key={leave.id} className="leave-card">
                  <div className="leave-details">
                    <p>
                      <strong>Date:</strong> {leave.apply_date}
                    </p>
                    <p>
                      <strong>Name:</strong> {leave.userDetails.first_name}{" "}
                      {leave.userDetails.last_name}
                    </p>
                    <p>
                      <strong>Employee ID:</strong> {leave.userDetails.emp_id}
                    </p>
                    <p>
                      <strong>Leave Type:</strong> {leave.type}
                    </p>
                    <p>
                      <strong>Apply Date:</strong> {leave.start_date} to{" "}
                      {leave.end_date || "NULL"}
                    </p>

                    {/* Conditionally render short leave times */}
                    {leave.type === "ShortLeave" && (
                      <>
                        <p>
                          <strong>Short In Time:</strong> {leave.shortInTime}
                        </p>
                        <p>
                          <strong>Short Out Time:</strong> {leave.shortOutTime}
                        </p>
                      </>
                    )}
                  </div>
                  <p>
                    <strong>Reason:</strong> {leave.comment}
                  </p>
                  <div className="apply-buttona">
                    <button
                      className="apply-button"
                      onClick={() => handleApprove(leave.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="apply-button"
                      onClick={() => handleReject(leave.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Aproveleave;
