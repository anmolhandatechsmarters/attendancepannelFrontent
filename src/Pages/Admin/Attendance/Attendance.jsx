import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdOutlineDone, MdCancel } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const currentMonthIndex = new Date().getMonth() + 1;
const currentYearIndex = new Date().getFullYear();
import { ClipLoader } from "react-spinners";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import getSwalTheme from "../../../utils/Swaltheme";
import useIsMobile from "../../../scss/vendors/MobileSetting";
import "../../../scss/css/table.css";
import "../../../scss/css/HeaderDiv.css";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
import Graph from "./Graph/Graph";
import Swal from "sweetalert2";
// For time Change
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
// for Graph  component
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Attendance = () => {
  const Swal = getSwalTheme();
  const Navigate = useNavigate();
  const userids = useParams();
  const empid = userids.id;

  const logid = localStorage.getItem("id");
  const role = localStorage.getItem("role");
  const logip = useSelector((state) => state.ipAddress);
  const theme = useSelector((state) => state.theme);
  const isMobile = useIsMobile();

  const [loading, setloading] = useState(true);

  //graph=============================

  const [mode, setmode] = useState("Table");
  const [tableLoading, settableLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const [comments, setComments] = useState({});
  const [search, setSearch] = useState("");
  const [recordEdits, setRecordEdits] = useState({});
  const [userSort, setUserSort] = useState({ column: "id", order: "desc" });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [monthFilter, setMonthFilter] = useState(currentMonthIndex);
  const [yearFilter, setYearFilter] = useState(currentYearIndex);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [limit, setlimit] = useState(10);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const todaydate = today.getDate();
    setStartDate(
      new Date(currentYear, currentMonth, todaydate + 1)
        .toISOString()
        .split("T")[0]
    );
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    setEndDate(
      new Date(currentYear, currentMonth, lastDay).toISOString().split("T")[0]
    );
  }, []);
  useEffect(() => {
    async function fetchAttendance() {
      try {
        settableLoading(true);
        const response = await axiosInstance.get(`/admin/getattendance`, {
          params: {
            page,
            limit,
            search,
            sort: userSort,
            month: monthFilter,
            year: yearFilter,
            startDate,
            endDate,
            status: statusFilter,
            empid,
            role,
          },
        });

        if (response.data.success) {
          setAttendanceData(response.data.attendance);
          setTotal(response.data.total);
          settableLoading(false);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
        console.error("Error fetching attendance data:", error);
      } finally {
        setloading(false);
        settableLoading(false);
      }
    }

    fetchAttendance();
  }, [
    page,
    userSort,
    search,
    monthFilter,
    yearFilter,
    startDate,
    endDate,
    statusFilter,
    role,
    limit,
  ]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const handleSorting = (column) => {
    setUserSort((prevSort) => ({
      column,
      order:
        prevSort.column === column && prevSort.order === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const handleMonthChange = (e) => {
    setMonthFilter(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setYearFilter(e.target.value);
    setPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setPage(1);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setPage(1);
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString([], options);
  }

  const handleCommentChange = (id, event) => {
    setComments((prevComments) => ({
      ...prevComments,
      [id]: event.target.value,
    }));
  };

  const handleRecordChange = (field, event) => {
    setRecordEdits((prevEdits) => ({
      ...prevEdits,
      [field]: event.target.value,
    }));
  };

  const handleShowComment = (comment) => {
    Swal.fire({
      title: "Comment",
      text: comment,
      icon: "info",
      confirmButtonText: "Close",
    });
  };
  const handleAddComment = (record) => {
    Swal.fire({
      title: "Add Comment",
      input: "textarea",
      inputPlaceholder: "Type your comment...",
      inputValue: "",
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: (comment) => {
        if (!comment) {
          Swal.showValidationMessage("Please enter a comment");
        }
        return comment;
      },
      didOpen: () => {
        const input = Swal.getInput();
        input.addEventListener("input", () => {
          const words = input.value.split(/\s+/).filter(Boolean);
          if (words.length > 20) {
            const tooltip = document.createElement("span");
            tooltip.textContent = "Click for full comment";
            tooltip.style.position = "absolute";
            tooltip.style.top = "0";
            tooltip.style.left = "0";
            tooltip.style.backgroundColor = "#fff";
            tooltip.style.border = "1px solid #ccc";
            tooltip.style.padding = "4px";
            tooltip.style.zIndex = "1000";
            tooltip.style.cursor = "pointer";
            tooltip.style.display = "none";

            input.parentElement.appendChild(tooltip);

            input.addEventListener("mouseover", () => {
              tooltip.textContent = input.value;
              tooltip.style.display = "block";
            });
            input.addEventListener("mouseout", () => {
              tooltip.style.display = "none";
            });
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newComment = result.value;
        handleSaveComment(record.id, newComment);
      }
    });
  };

  const handleSaveComment = async (id, comment) => {
    try {
      await axiosInstance.put(
        `/admin/savecomment/${id}`,
        { comment },
        {
          params: { logid, logip },
        }
      );
      setAttendanceData((prevData) =>
        prevData.map((record) =>
          record.id === id ? { ...record, comment } : record
        )
      );
      Swal.fire("Success!", "Comment saved successfully!", "success");
    } catch (error) {
      setError("An error occurred while saving the comment.");
      console.error("Error saving comment:", error);
      Swal.fire("Error!", "Failed to save comment.", "error");
    }
  };

  const handleSaveRecord = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(
          `/admin/saverecord/${id}`,
          {
            id,
            ...recordEdits,
          },
          {
            params: { logid, logip },
          }
        );

        setAttendanceData((prevData) =>
          prevData.map((record) =>
            record.id === id ? { ...record, ...recordEdits } : record
          )
        );
        setEditRecordId(null);
        setEditCommentId(null);

        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "The record has been saved.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        setError("An error occurred while saving the record.");
        console.error("Error saving record:", error);

        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to save the record. Please try again.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleCancelRecord = () => {
    setEditRecordId(null);
    setEditCommentId(null);
  };

  const handleDeleteButtonClick = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "To Delete this attendance",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (confirmDelete.isConfirmed) {
      deleteAttendance(id);
    }
  };

  const deleteAttendance = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "to delete this attendance",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/deleteattendance/${id}`, {
          params: { logid, logip },
        });

        setAttendanceData((prevData) =>
          prevData.filter((record) => record.id !== id)
        );
        setTotal((prevTotal) => prevTotal - 1);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The attendance record has been deleted.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        setError("An error occurred while deleting the record.");
        console.error("Error deleting record:", error);

        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete the record. Please try again.",
          confirmButtonText: "OK",
        });
      }
    }
  };

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
  const status = ["Present", "Absent", "Halfday"];

  const years = Array.from(
    new Set(attendanceData.map((record) => new Date(record.date).getFullYear()))
  );

  const handleLimitChange = (newlimit) => {
    setlimit(newlimit);
  };

  const handleviewuser = (id) => {
    Navigate(`/viewuser/${id}`);
  };
  const handledowloadattendance = async () => {
    try {
      const response = await axiosInstance.get(`/admin/allattendancedownload`, {
        params: { logid, logip },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Attendance.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Your attendance file has been downloaded.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Download Failed!",
        text: "There was an error downloading the file.",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleEditRecord = (id) => {
    Navigate(`/editattendace/${id}`);
  };

  const handleAddAttendance = () => {
    Navigate(`/addadminattendance`);
  };

  const modes = ["Table", "Graph"];

  const handlemodeChange = (event) => {
    setmode(event.target.value);
  };

  const TableComponent = () => {
    return (
      <>
        <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
          <div className="table-container">
            {!isMobile && (
              <>
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>
                        #ID{" "}
                        <span onClick={() => handleSorting("id")}>
                          {userSort.column === "id" ? (
                            userSort.order === "asc" ? (
                              <FcAlphabeticalSortingAz />
                            ) : (
                              <FcAlphabeticalSortingZa />
                            )
                          ) : (
                            <FcAlphabeticalSortingAz />
                          )}
                        </span>
                      </th>
                      <th>Employee</th>
                      <th>In Time</th>
                      <th>Out Time</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Comment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableLoading ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          <ClipLoader
                            color="#6360FF"
                            size={40}
                            speedMultiplier={1.2}
                          />
                        </td>
                      </tr>
                    ) : attendanceData.length > 0 ? (
                      attendanceData.map((record) => (
                        <tr key={record.id}>
                          <td
                            className="viewuserbyfield"
                            onClick={() => handleviewuser(record.user_id)}
                          >
                            #{record.id}
                          </td>
                          <td
                            className="viewuserbyfield"
                            onClick={() => handleviewuser(record.user_id)}
                          >
                            {record.fullname}
                          </td>
                          <td>
                            {editRecordId === record.id ? (
                              <input
                                type="text"
                                value={recordEdits.in_time}
                                onChange={(e) =>
                                  handleRecordChange("in_time", e)
                                }
                                className="form-control"
                              />
                            ) : (
                              convertTo12HourFormat(record.in_time)
                            )}
                          </td>
                          <td>
                            {editRecordId === record.id ? (
                              <input
                                type="text"
                                value={recordEdits.out_time}
                                onChange={(e) =>
                                  handleRecordChange("out_time", e)
                                }
                                className="form-control"
                              />
                            ) : (
                              convertTo12HourFormat(record.out_time)
                            )}
                          </td>
                          <td>
                            {editRecordId === record.id ? (
                              <input
                                type="date"
                                value={recordEdits.date}
                                onChange={(e) => handleRecordChange("date", e)}
                                className="form-control"
                              />
                            ) : (
                              formatDate(record.date)
                            )}
                          </td>
                          <td>
                            {editRecordId === record.id ? (
                              <select
                                value={recordEdits.status}
                                onChange={(e) =>
                                  handleRecordChange("status", e)
                                }
                                className="form-control"
                              >
                                {status.map((s, i) => (
                                  <option key={i} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className={`badge ${
                                  record.status === "Absent"
                                    ? "text-bg-danger"
                                    : record.status === "Halfday"
                                      ? "text-bg-warning"
                                      : record.status === "Present"
                                        ? "text-bg-success"
                                        : record.status === "Leave"
                                          ? "text-bg-info"
                                          : "bg-secondary"
                                } text-light`}
                              >
                                {record.status}
                              </span>
                            )}
                          </td>
                          <td>
                            {editCommentId === record.id ? (
                              <div className="d-flex align-items-center gap-2">
                                <textarea
                                  className="form-control"
                                  value={comments[record.id] || ""}
                                  onChange={(e) =>
                                    handleCommentChange(record.id, e)
                                  }
                                />
                                <MdOutlineDone
                                  onClick={() => handleSaveComment(record.id)}
                                />
                                <MdCancel
                                  onClick={() => setEditCommentId(null)}
                                />
                              </div>
                            ) : (
                              <div className="d-flex align-items-center gap-2">
                                <span
                                  title={record.comment}
                                  onClick={() =>
                                    handleShowComment(record.comment)
                                  }
                                  className="text-truncate"
                                  style={{
                                    maxWidth: "160px",
                                    cursor: "pointer",
                                  }}
                                >
                                  {record.comment
                                    ? record.comment.slice(0, 20) +
                                      (record.comment.length > 20 ? "..." : "")
                                    : ""}
                                </span>

                                {!record.comment && (
                                  <IoIosAdd
                                    onClick={() => handleAddComment(record)}
                                  />
                                )}
                              </div>
                            )}
                          </td>
                          <td>
                            {editRecordId === record.id ? (
                              <>
                                <MdOutlineDone
                                  className="text-success"
                                  onClick={() => handleSaveRecord(record.id)}
                                />
                                <MdCancel
                                  className="text-danger"
                                  onClick={handleCancelRecord}
                                />
                              </>
                            ) : (
                              <div className="nowrap">
                                <MdDelete
                                  className="tableDeleteBackground"
                                  onClick={() =>
                                    handleDeleteButtonClick(record.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    color: "red",
                                    marginRight: "5px",
                                  }}
                                />
                                <MdEdit
                                  className="tableEditBackground"
                                  onClick={() => handleEditRecord(record.id)}
                                  style={{ cursor: "pointer", color: "blue" }}
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center fw-bold fs-5">
                          No attendance data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="table-footer">
                  <div className="pagination">
                    <span className="pagination-label">Rows per page:</span>
                    <select
                      value={limit}
                      onChange={(e) =>
                        handleLimitChange(Number(e.target.value))
                      }
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                    </select>

                    <span className="pagination-info">
                      {(page - 1) * limit + 1}-{Math.min(page * limit, total)}{" "}
                      of {total}
                    </span>

                    <button
                      className="paginationButton"
                      onClick={() => handlePageChange(page - 1)}
                      // disabled={page === 1}
                    >
                      &lt;
                    </button>
                    <button
                      className="paginationButton"
                      onClick={() => handlePageChange(page + 1)}
                      // disabled={page === Math.ceil(total / limit)}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </>
            )}

            {isMobile && (
              <div className="card-container">
                {tableLoading ? (
                  <div className="text-center py-4">
                    <ClipLoader
                      color="#FE7743"
                      size={40}
                      speedMultiplier={1.2}
                    />
                  </div>
                ) : attendanceData.length > 0 ? (
                  attendanceData.map((record) => (
                    <div className="card" key={record.id}>
                      <div className="card-header d-flex justify-content-between">
                        <span>#{record.id}</span>
                        <div>
                          <MdDelete
                          className="tableDeleteBackground"
                            onClick={() => handleDeleteButtonClick(record.id)}
                            style={{
                              cursor: "pointer",
                              color: "red",
                              marginRight: "5px",
                            }}
                          />
                          <MdEdit
                          className="tableEditBackground"
                            onClick={() => handleEditRecord(record.id)}
                            style={{ cursor: "pointer", color: "blue" }}
                          />
                        </div>
                      </div>
                      <div className="card-content">
                        <p>
                          <strong>Employee:</strong> {record.fullname}
                        </p>
                        <p>
                          <strong>In Time:</strong>{" "}
                          {convertTo12HourFormat(record.in_time)}
                        </p>
                        <p>
                          <strong>Out Time:</strong>{" "}
                          {convertTo12HourFormat(record.out_time)}
                        </p>
                        <p>
                          <strong>Date:</strong> {formatDate(record.date)}
                        </p>
                        <p>
                          <strong>Status:</strong> {record.status}
                        </p>
                        {record.comment && (
                          <p>
                            <strong>Comment:</strong> {record.comment}
                          </p>
                        )}
                      </div>
                      <div className="card-footer">
                        <span
                          className={`badge ${
                            record.status === "Absent"
                              ? "bg-danger"
                              : record.status === "Halfday"
                                ? "bg-warning"
                                : record.status === "Present"
                                  ? "bg-success"
                                  : "bg-info"
                          } text-light`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 fw-bold fs-5">
                    No attendance data found
                  </div>
                )}

                <div className="pagination-mobile">
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
                    // disabled={page === 1}
                  >
                    &lt;
                  </button>
                  <button
                    className="paginationButton"
                    onClick={() => handlePageChange(page + 1)}
                    // disabled={page === Math.ceil(total / limit)}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------------------------ */}
      </>
    );
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="upperdiv">
            <div className="row gy-3 align-items-center ">
              <div className="col-12 col-md-4">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "100%" }}
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-8">
                <div className="action-controls">
                  <button onClick={handledowloadattendance} id="Commonbutton">
                    Download
                  </button>

                  <button id="Commonbutton" onClick={handleAddAttendance}>
                    Add Attendance
                  </button>
                </div>
              </div>
            </div>

            <div className="row gy-3 gx-3 align-items-center mt-3">
              {/* Month Filter */}
              <div className="col-6 col-md-2">
                <select
                  value={monthFilter}
                  onChange={handleMonthChange}
                  className="form-select w-100"
                >
                  <option value="">All Months</option>
                  {months.map((item, index) => (
                    <option key={index} value={index + 1}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="col-6 col-md-2">
                <select
                  value={yearFilter}
                  onChange={handleYearChange}
                  className="form-select w-100"
                >
                  <option value="">All Years</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filters - shown only in Table mode */}
              {mode === "Table" && (
                <>
                  <div className="col-6 col-md-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      className="form-control w-100"
                    />
                  </div>
                  <div className="col-6 col-md-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      className="form-control w-100"
                    />
                  </div>
                </>
              )}

              {/* Status Filter */}
              <div className="col-6 col-md-2">
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="form-select w-100"
                >
                  <option value="">Status</option>
                  {status.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Switch */}
              <div className="col-6 col-md-2">
                <select
                  value={mode}
                  onChange={handlemodeChange}
                  className="form-select w-100"
                >
                  {modes.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------------- */}

          <div>
            {mode === "Table" ? (
              <TableComponent />
            ) : (
              <Graph months={monthFilter} year={yearFilter} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;
