import React, { useEffect, useState } from "react";
import getSwalTheme from "../../../utils/Swaltheme";
import { useNavigate, useParams } from "react-router-dom";
import "../../../scss/css/SingleForm.css";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
const EmployeeForm = () => {
  const theme = useSelector((state) => state.theme);

  const logid = localStorage.getItem("id");
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [comments, setComments] = useState("");
  const { id } = useParams();
  const [loading, setloading] = useState(true);
  const Role = localStorage.getItem("role");
  const logip = useSelector((state) => state.ipAddress);
  const Swal = getSwalTheme();
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/hr/getattendancebyid/${id}`,
          {}
        );
        const data = response.data.attendance;
        if (data) {
          setEmployeeData(data);
          setTimeIn(data.in_time);
          setTimeOut(data.out_time);
          setDate(data.date);
          setStatus(data.status || "Pending");
          setComments(data.comment || " ");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setloading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleTimeInChange = (e) => {
    setTimeIn(e.target.value);
  };

  const handleTimeOutChange = (e) => {
    setTimeOut(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
    });
    if (result.isConfirmed) {
      const updatedData = {
        in_time: timeIn,
        out_time: timeOut,
        date,
        status,
        comment: comments,
      };
      // if(Role == "Admin"){
      try {
        await axiosInstance.put(`/admin/saverecord/${id}`, updatedData, {
          params: { logid, logip },
        });

        Swal.fire({
          title: "Success!",
          text: "Employee data updated successfully!",
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
        console.error("Error updating employee data:", error);

        // Get backend message safely
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";

        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      // }
      // else if(Role == "HR"){

      // }
    }
  };

  const handleCancel = () => {
    if (Role == "Admin") {
      navigate("/attendance");
    } else if (Role == "HR") {
      navigate("/hremployeeattendance");
    }
  };

  if (!employeeData) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

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
            <h2>Edit Attendance</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Employee Name:</label>
                    <div className="form-control-static">
                      {employeeData.fullname}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Employee ID:</label>
                    <div className="form-control-static">
                      {employeeData.userDetails.emp_id}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Time In:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={timeIn}
                      onChange={handleTimeInChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Time Out:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={timeOut}
                      onChange={handleTimeOutChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Halfday">Halfday</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  rows="4"
                  className="form-control"
                  value={comments || ""}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>

              <div className="button-group">
                <button type="submit" id="Commonbutton">
                  Update Attendance
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

export default EmployeeForm;
