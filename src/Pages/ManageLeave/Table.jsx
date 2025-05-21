import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getSwalTheme from "../../utils/Swaltheme";
import { MdDelete, MdEdit } from "react-icons/md";
import useIsMobile from "../../scss/vendors/MobileSetting";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";

import { useSelector } from "react-redux";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import { ClipLoader } from "react-spinners";

import "../../scss/css/table.css";
import "../../scss/css/HeaderDiv.css";
import "../../scss/css/button.css";

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
const ApproveLeave = () => {
  const theme = useSelector((state) => state.theme);
  const isMobile = useIsMobile();
  const Swal = getSwalTheme();
  const [logip, setIpAddress] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userSort, setUserSort] = useState({ column: "id", order: "desc" });
  const [leave, setleave] = useState("");
  const [limit, setlimit] = useState(10);
  const logid = localStorage.getItem("id");
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const [tableLoading, settableLoading] = useState(false);
  const Role = localStorage.getItem("role");

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

  const fetchUsers = useCallback(async () => {
    try {
      settableLoading(true);
      const response = await axiosInstance.get(`/admin/approveleavetable`, {
        params: { page, limit, search, sort: userSort, leave },
      });
      setUsers(response.data.data);
      setTotal(response.data.totalCount);
      setloading(false);
      settableLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setloading(false);
      settableLoading(false);
    }
  }, [page, search, userSort, leave, limit]);

  const fetchLeaveNotificationCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/approveleavecountnotification`,
        {}
      );
      
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  }, []);
  useEffect(() => {
    fetchUsers();
    fetchLeaveNotificationCount();
  }, [fetchUsers, fetchLeaveNotificationCount]);

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

  const deleteLeave = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this leave",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/hremp/deleteleave/${id}`, {
          params: { logip, logid },
        });
        setUsers(users.filter((user) => user.id !== id));
        setTotal(total - 1);
        Swal.fire("Deleted!", "The leave request has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting leave:", error);
        Swal.fire(
          "Error!",
          "There was a problem deleting the leave request.",
          "error"
        );
      }
    }
  };
  const allleaves = {
    leave: ["Approved", "Rejected", "Pending"],
  };
  const handleapproveChange = (e) => {
    setleave(e.target.value);
    setPage(1);
  };

  const handleDownloadLeave = async () => {
    try {
      const response = await axiosInstance.get(`/api/hremp/downloadleave`, {
        params: { logid, logip },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leave.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Your leave file has been downloaded.",
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
  const handleHelpClick = (comment) => {
    Swal.fire({
      title: "Comment",
      text: comment,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const handelviewuser = (id) => {
    if (Role === "Admin") {
      navigate(`/viewuser/${id}`);
    } else if (Role == "HR") {
      navigate(`/viewhruser/${id}`);
    }
  };

  const handleeditleave = (id) => {
    if (Role == "Admin") {
      navigate(`/geteditleave/${id}`);
    } else if (Role == "HR") {
      navigate(`/hreditleave/${id}`);
    }
  };
  const handleAddLeave = () => {
    if (Role == "Admin") {
      navigate("/adminaddleave");
    } else if (Role == "HR") {
      navigate("/hraddleave");
    }
  };
  const handleLimitChange = (newVal) => {
    setlimit(newVal);
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
                  placeholder="Search by name, emp_id..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "100%" }}
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-8">
                <div className="action-controls row g-2">
                  <div className="col-12 col-md-3">
                    <select
                      onChange={handleapproveChange}
                      className="form-select w-100"
                    >
                      <option>All</option>
                      {allleaves.leave.map((leave) => (
                        <option key={leave} value={leave}>
                          {leave}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-3">
                    <button
                      type="button"
                      id="Commonbutton"
                      className="w-100"
                      onClick={handleDownloadLeave}
                    >
                      Download
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
                    <button
                      type="button"
                      id="Commonbutton"
                      className="w-100"
                      onClick={handleAddLeave}
                    >
                      Add Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ------------------------ */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
                <div className="table-container">
                  {/* Desktop Table View */}
                  {!isMobile && (
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>
                            #ID
                            <span
                              onClick={() => handleSorting("id")}
                              style={{ cursor: "pointer" }}
                            >
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
                          <th>Emp ID</th>
                          <th>
                            On Date
                            <span
                              onClick={() => handleSorting("apply_date")}
                              style={{ cursor: "pointer" }}
                            >
                              {userSort.column === "apply_date" ? (
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
                          <th>Apply Date</th>
                          <th>Type</th>
                          <th>ShortOut-ShortIn</th>
                          {/* <th>Short In Time</th> */}
                          <th>Status</th>
                          <th>Handled By</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableLoading ? (
                          <tr>
                            <td colSpan="12" className="text-center">
                              <ClipLoader
                                color="#5856d6"
                                size={50}
                                speedMultiplier={1.2}
                              />
                            </td>
                          </tr>
                        ) : users.length > 0 ? (
                          users.map((user) => {
                            const shortComment =
                              user.comment && user.comment.length > 20
                                ? `${user.comment.substring(0, 20)}...`
                                : user.comment;

                            return (
                              <tr key={user.id}>
                                <td
                                  onClick={() => {
                                    handelviewuser(user.user_id);
                                  }}
                                  className="viewuserbyfield"
                                >
                                  #{user.id}
                                </td>
                                {/* <td onClick={()=>{handelviewuser(user.user_id)}} className='viewuserid'>{`${user.userDetails.first_name} ${user.userDetails.last_name}`}</td> */}
                                <td
                                  onClick={() => {
                                    handelviewuser(user.user_id);
                                  }}
                                  className="viewuserbyfield"
                                >
                                  {user.userDetails.emp_id}
                                </td>
                                <td>
                                  {new Date(user.apply_date).toDateString()}
                                </td>
                                <td>{`${new Date(user.start_date).toLocaleDateString()} - ${user.end_date || ""}`}</td>
                                {/* <td>
                  {shortComment}
                  {user.comment && user.comment.length > 20 && (
                    <MdHelp onClick={() => handleHelpClick(user.comment)} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                  )}
                </td> */}
                                <td>{user.type}</td>
                                <td>
                                  {user.shortOutTime
                                    ? convertTo12HourFormat(user.shortOutTime)
                                    : "-"}{" "}
                                  {user.shortInTime
                                    ? `/ ${convertTo12HourFormat(user.shortInTime)}`
                                    : ""}
                                </td>
                                {/* <td>
                                  
                                </td> */}
                                <td>
                                  {user.status === "Approved" ? (
                                    <span className="badge text-bg-success">
                                      Approved
                                    </span>
                                  ) : (
                                    <span className="badge text-bg-danger">
                                      Rejected
                                    </span>
                                  )}
                                </td>
                                <td>{user.handleBy}</td>
                                <td className="actionButton">
                                  <MdDelete
                                    className="tableDeleteBackground"
                                    onClick={() => deleteLeave(user.id)}
                                    style={{
                                      cursor: "pointer",
                                      color: "red",
                                      marginRight: "5px",
                                    }}
                                  />
                                  <MdEdit
                                    className="tableEditBackground"
                                    onClick={() => handleeditleave(user.id)}
                                    style={{ cursor: "pointer", color: "blue" }}
                                  />
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="12"
                              className="text-center"
                              style={{ fontWeight: "bold", fontSize: "large" }}
                            >
                              No Leave Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Mobile Card View */}
                  {isMobile && (
                    <div className="card-container">
                      {tableLoading ? (
                        <div
                          className="text-center"
                          style={{ padding: "30px 0" }}
                        >
                          <ClipLoader
                            color="#5856d6"
                            size={50}
                            speedMultiplier={1.2}
                          />
                        </div>
                      ) : users.length > 0 ? (
                        users.map((user) => (
                          <div className="card" key={user.id}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                              <div>
                                <input type="checkbox" />
                                <span className="ms-2">#{user.id}</span>
                              </div>
                              <div className="card-actions">
                                <MdDelete
                                  className="tableDeleteBackground"
                                  onClick={() => deleteUser(user.id)}
                                  style={{
                                    cursor: "pointer",
                                    color: "red",
                                    marginRight: "5px",
                                  }}
                                />
                                <MdEdit
                                  className="tableEditBackground"
                                  onClick={() => userDataEdit(user.id)}
                                  style={{ cursor: "pointer", color: "blue" }}
                                />
                              </div>
                            </div>

                            <div className="card-content">
                              <p>
                                <strong>Full Name:</strong> {user.first_name}{" "}
                                {user.middle_name} {user.last_name}
                              </p>
                              <p>
                                <strong>Email:</strong> {user.email}
                              </p>
                              <p>
                                <strong>Employee ID:</strong> {user.emp_id}
                              </p>
                              <p>
                                <strong>Role:</strong> {user.role}
                              </p>
                              <p>
                                <strong>Last Login:</strong>{" "}
                                {user.last_login
                                  ? new Date(user.last_login).toLocaleString()
                                  : "Never"}
                              </p>
                            </div>

                            <div className="card-footer">
                              <span
                                className={`badge ${
                                  user.status === "1"
                                    ? "bg-success"
                                    : "bg-danger"
                                } text-light`}
                              >
                                {user.status === "1" ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          className="text-center"
                          style={{
                            padding: "30px 0",
                            fontWeight: "bold",
                            fontSize: "large",
                          }}
                        >
                          No users found
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
            </>
          )}
          {/* ----------------------------------------------------------------------------- */}
        </>
      )}
    </div>
  );
};
export default ApproveLeave;
