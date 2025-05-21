import { useEffect, useState } from "react";
import getSwalTheme from "../../../utils/Swaltheme";
import { MdHelp } from "react-icons/md";
import Spinner from "../../../utils/Spinner";
import axiosInstance from "../../../components/utils/AxiosIntance";
import { ClipLoader } from "react-spinners";
import "../../../scss/css/table.css";
import useIsMobile from "../../../scss/vendors/MobileSetting";
const convertTo12HourFormat = (time) => {
  if (!time) return "N/A";

  const [hours, minutes, seconds] = time.split(":");
  if (hours === undefined || minutes === undefined || seconds === undefined)
    return "N/A";

  const parsedHours = parseInt(hours, 10);
  const modifier = parsedHours >= 12 ? "PM" : "AM";
  const normalizedHours = parsedHours % 12 || 12;

  return `${normalizedHours}:${minutes}:${seconds} ${modifier}`;
};
import { useSelector } from "react-redux";
const HrAttendanceTable = () => {
  const Swal = getSwalTheme()
  const id = localStorage.getItem("id");
  const isMobile = useIsMobile();
  const theme = useSelector((state) => state.theme);
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userattendance, setUserAttendance] = useState([]);
  const [countattendance, setCountAttendance] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setloading] = useState(true);
  const [tableloading, settableloading] = useState(false);
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

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        settableloading(true);
        const result = await axiosInstance.get(
          `/api/employee/getattendance/${id}`,
          {
            params: {
              page,
              limit,
              month: monthFilter || undefined,
              year: yearFilter || undefined,
              startDate: startDate || undefined,
              endDate: endDate || undefined,
              status: statusFilter || undefined,
            },
          }
        );
        setCountAttendance(result.data.count);
        setUserAttendance(result.data.data);
        setTotal(result.data.totalCount);
        settableloading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
        settableloading(false);
      }
    };

    fetchAttendance();
  }, [id, monthFilter, yearFilter, startDate, endDate, statusFilter, page]);

  const years = Array.from(
    new Set(userattendance.map((record) => new Date(record.date).getFullYear()))
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const statusOptions = ["Present", "Absent", "Halfday"];

  const handleMonthChange = (e) => setMonthFilter(e.target.value);
  const handleYearChange = (e) => setYearFilter(e.target.value);
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const handleHelpClick = (comment) => {
    Swal.fire({
      title: "Comment",
      text: comment,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  return (
    <div>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <>
          <div className="upperdiv">
            <div className="row gy-3">
              {/* Month Filter */}
              <div className="col-12 col-md-3">
                <div className="form-group">
                
                  <select
                    value={monthFilter}
                    onChange={handleMonthChange}
                    className="form-select"
                  >
                    <option value="">All Months</option>
                    {months.map((item, index) => (
                      <option key={index} value={index + 1}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year Filter */}
              <div className="col-12 col-md-3">
                <div className="form-group">
                 
                  <select
                    value={yearFilter}
                    onChange={handleYearChange}
                    className="form-select"
                  >
                    <option value="">Year</option>
                    {years.length > 0 ? (
                      years.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))
                    ) : (
                      <option value="">No years available</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Start Date */}
              <div className="col-12 col-md-2">
                <div className="form-group">
            
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="col-12 col-md-2">
                <div className="form-group">
    
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-12 col-md-2">
                <div className="form-group">
    
                  <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="form-select"
                  >
                    <option value="">Status</option>
                    {statusOptions.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* ---------------------- */}
          <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
            <div className="table-container">
              {!isMobile ? (
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Intime</th>
                      <th>Outtime</th>
                      <th>Comment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableloading ? (
                      <tr>
                        <td colSpan="12" className="text-center">
                          <ClipLoader
                            color="#5856d6"
                            size={50}
                            speedMultiplier={1.2}
                          />
                        </td>
                      </tr>
                    ) : userattendance.length > 0 ? (
                      userattendance.map((user, index) => {
                        const shortComment =
                          user.comment && user.comment.length > 20
                            ? user.comment.substring(0, 20) + "..."
                            : user.comment;

                        return (
                          <tr key={index}>
                            <td>{new Date(user.date).toLocaleDateString()}</td>
                            <td>{convertTo12HourFormat(user.in_time)}</td>
                            <td>{convertTo12HourFormat(user.out_time)}</td>
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
                              {user.status === "Present" ? (
                                <span>Present</span>
                              ) : user.status === "Absent" ? (
                                <span>Absent</span>
                              ) : user.status === "Halfday" ? (
                                <span>Halfday</span>
                              ) : (
                                <span>Pending</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center fw-bold fs-5">
                          No Records Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                // Mobile Card View
                <div className="card-container">
                  {tableloading ? (
                    <div className="text-center" style={{ padding: "30px 0" }}>
                      <ClipLoader
                        color="#5856d6"
                        size={50}
                        speedMultiplier={1.2}
                      />
                    </div>
                  ) : userattendance.length > 0 ? (
                    userattendance.map((user, index) => (
                      <div className="card" key={index}>
                        <div className="card-content">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(user.date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>In Time:</strong>{" "}
                            {convertTo12HourFormat(user.in_time)}
                          </p>
                          <p>
                            <strong>Out Time:</strong>{" "}
                            {convertTo12HourFormat(user.out_time)}
                          </p>
                          <p>
                            <strong>Comment:</strong>{" "}
                            {user.comment?.length > 20
                              ? user.comment.substring(0, 20) + "..."
                              : user.comment}
                            {user.comment && user.comment.length > 20 && (
                              <MdHelp
                                onClick={() => handleHelpClick(user.comment)}
                                style={{ cursor: "pointer", marginLeft: "8px" }}
                              />
                            )}
                          </p>
                        </div>
                        <div className="card-footer">
                          {user.status === "Present" ? (
                            <span>Present</span>
                          ) : user.status === "Absent" ? (
                            <span>Absent</span>
                          ) : user.status === "Halfday" ? (
                            <span>Halfday</span>
                          ) : (
                            <span>Pending</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="text-center fw-bold fs-5"
                      style={{ padding: "30px 0" }}
                    >
                      No Records Found
                    </div>
                  )}
                </div>
              )}

              {/* Pagination Footer */}
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

          {/* --------------------------------------------------------------------------- */}
       
        </>
      )}
    </div>
  );
};

export default HrAttendanceTable;
