import React, { useEffect, useState } from "react";
import getSwalTheme from "../../../utils/Swaltheme";
import { MdHelp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
import { ClipLoader } from "react-spinners";
import useIsMobile from "../../../scss/vendors/MobileSetting";
import { useSelector } from "react-redux";
const EmployeeLeave = () => {
  const navigate = useNavigate();
  const Swal= getSwalTheme()
  const id = localStorage.getItem("id");
  const isMobile = useIsMobile();
  const logip = useSelector((state) => state.ipAddress);
  const theme = useSelector((state) => state.theme);
  const Role = localStorage.getItem("role")
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userAttendance, setUserAttendance] = useState([]);
  const [leaveNotification, setLeaveNotification] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [tableLoading, settableloading] = useState(false);



  //Get the Today Date function
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    setStartDate(
      new Date(currentYear, currentMonth, 2).toISOString().split("T")[0]
    );
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    setEndDate(
      new Date(currentYear, currentMonth, lastDay).toISOString().split("T")[0]
    );
  }, []);

  //Fetch the Data of All Leave
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        settableloading(true);
        const result = await axiosInstance.get(
          `/api/hremp/showallleave/${id}`,
          {
            params: {
              page,
              limit,
              month: monthFilter,
              year: yearFilter,
              startDate,
              endDate,
            },
          }
        );
        setUserAttendance(result.data.data);
        setTotal(result.data.totalCount);
        setLoading(false);
        settableloading(false);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to fetch attendance data", "error");
      } finally {
        setLoading(false);
        settableloading(false);
      }
    };

    const fetchNotification = async () => {
      try {
        const result = await axiosInstance.get(
          `/api/hremp/latestnotification/${id}`,
          {}
        );
        setLeaveNotification(result.data || {});
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotification();
    fetchAttendance();
  }, [id, monthFilter, yearFilter, startDate, endDate, page]);

  const years = Array.from(
    new Set(
      userAttendance.map((record) => new Date(record.apply_date).getFullYear())
    )
  );
  const months = Array.from({ length: 12 }, (v, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const handleMonthChange = (e) => setMonthFilter(e.target.value);
  const handleYearChange = (e) => setYearFilter(e.target.value);

  //Page Changes Function For Pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  //Show the Full Comment
  const handleHelpClick = (comment) => {
    Swal.fire({
      title: "Comment",
      text: comment,
      icon: "info",
      confirmButtonText: "Close",
    });
  };
  //Move to HrApplyLeavePage
  const handleApplyLeave = () => {
    if (Role == "HR") {
      navigate("/hrapplyleaveform");
    } else if (Role == "Employee") {
      navigate("/employeeapplyleave");
    }
  };
  //Move To Leave Notification Page
  const handleNotificationLeave = () => {
    navigate("/hrapplyleavenotification");
  };

  return (
    <div>
      {/* Spinner is Loaded  */}
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="upperdiv">
            <div className="row gy-3 align-items-center">
              {/* Filters Column */}
              <div className="col-12 col-md-4">
                <div className="row g-2">
                  <div className="col-6">
                    <select
                      value={monthFilter}
                      onChange={handleMonthChange}
                      className="form-select"
                    >
                      <option value="">All Months</option>
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <select
                      value={yearFilter}
                      className="form-select"
                      onChange={handleYearChange}
                    >
                      <option value="">Year</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date Range + Buttons Column */}
              <div className="col-12 col-md-8">
                <div className="action-controls">
                  <div className="row g-2 align-items-center">
                    <div className="col-6 col-lg-3">
                      <input
                        type="date"
                        value={startDate}
                        className="form-control"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-6 col-lg-3">
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-lg-4">
                      <button id="Commonbutton" onClick={handleApplyLeave}>
                        Apply Leave
                      </button>
                    </div>
                    {/* <div className="col-6 col-lg-3">
                    <button id="Commonbutton" onClick={handleNotificationLeave}>
                      Notification
                    </button>
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ------------------------- */}
          <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
            <div className="table-container">
              {!isMobile ? (
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Apply Date</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Comment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAttendance.length > 0 ? (
                      userAttendance.map((user, index) => {
                        const shortComment =
                          user.comment && user.comment.length > 20
                            ? user.comment.substring(0, 20) + "..."
                            : user.comment;

                        return (
                          <tr key={index}>
                            <td>
                              {new Date(user.apply_date).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(user.start_date).toLocaleDateString()}
                            </td>
                            <td>
                              {user.end_date
                                ? new Date(user.end_date).toLocaleDateString()
                                : "NULL"}
                            </td>
                            <td>
                              {shortComment}
                              {user.comment && user.comment.length > 20 && (
                                <MdHelp
                                  onClick={() => handleHelpClick(user.comment)}
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                  }}
                                />
                              )}
                            </td>
                            <td>
                              {user.status === "Approved" ? (
                                <span className="badge bg-success text-light">
                                  Approved
                                </span>
                              ) : user.status === "Reject" ? (
                                <span className="badge bg-danger text-light">
                                  Rejected
                                </span>
                              ) : (
                                <span className="badge bg-secondary text-light">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center fw-bold fs-5">
                          No leave records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="card-container">
                  {userAttendance.length > 0 ? (
                    userAttendance.map((user, index) => {
                      const shortComment =
                        user.comment && user.comment.length > 20
                          ? user.comment.substring(0, 20) + "..."
                          : user.comment;

                      return (
                        <div className="card" key={index}>
                          <div className="card-content">
                            <p>
                              <strong>Apply Date:</strong>{" "}
                              {new Date(user.apply_date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Start Date:</strong>{" "}
                              {new Date(user.start_date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>End Date:</strong>{" "}
                              {user.end_date
                                ? new Date(user.end_date).toLocaleDateString()
                                : "NULL"}
                            </p>
                            <p>
                              <strong>Comment:</strong> {shortComment}
                              {user.comment && user.comment.length > 20 && (
                                <MdHelp
                                  onClick={() => handleHelpClick(user.comment)}
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                  }}
                                />
                              )}
                            </p>
                            <p>
                              <strong>Status:</strong>{" "}
                              {user.status === "Approved" ? (
                                <span className="badge bg-success text-light">
                                  Approved
                                </span>
                              ) : user.status === "Reject" ? (
                                <span className="badge bg-danger text-light">
                                  Rejected
                                </span>
                              ) : (
                                <span className="badge bg-secondary text-light">
                                  Pending
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className="text-center fw-bold fs-5"
                      style={{ padding: "30px 0" }}
                    >
                      No leave records found
                    </div>
                  )}
                </div>
              )}
              <div className="table-footer">
                <div className="pagination">
                  <span className="pagination-label">Rows per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>

                  <span className="pagination-info">
                    {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
                    {total}
                  </span>

                  <button
                    className="paginationButton"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    &lt;
                  </button>
                  <button
                    className="paginationButton"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === Math.ceil(total / limit)}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* \---------------------------------------------- */}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeave;
