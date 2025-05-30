import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { MdDelete, MdEdit } from "react-icons/md";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

import Spinner from "../../utils/Spinner";
import axiosInstance from "../../components/utils/AxiosIntance";
import getSwalTheme from "../../utils/Swaltheme";
import useIsMobile from "../../scss/vendors/MobileSetting";
import "../../scss/css/HeaderDiv.css";
import "../../scss/css/button.css";
import "../../scss/css/table.css";

const Employees = () => {
  const Swal = getSwalTheme();
  const isMobile = useIsMobile();
  const logip = useSelector((state) => state.ipAddress);
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const Role = localStorage.getItem("role");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [usersort, setUsersort] = useState({ column: "id", order: "desc" });
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const logid = localStorage.getItem("id");
  const [tablelodinag, settableloading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      settableloading(true);
      const response = await axiosInstance.get(`/admin/showalluser`, {
        params: {
          page,
          limit,
          search,
          role,
          sort: usersort,
          toggle: isToggled ? "Inactive" : "Active",
        },
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
      setLoading(false);
      settableloading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, usersort, role, isToggled]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const searhword = useCallback(
    debounce((text) => setSearch(text), 10),
    []
  );

  const handleSearch = (text) => {
    searhword(text);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const handleSorting = (column) => {
    setUsersort((prevSort) => ({
      column,
      order:
        prevSort.column === column && prevSort.order === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const deleteUser = async (id) => {
    const confirmDeleteUser = await Swal.fire({
      title: "Are you sure?",
      text: "Are You Sure You want to Delete this Employee",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmDeleteUser.isConfirmed) {
      try {
        console.log("Deleting user with id:", id, "Log ID:", logid);

        const response = await axiosInstance.delete(`/admin/deleteuser/${id}`, {
          params: { logid, logip },
        });

        if (response.status === 200) {
          setUsers(users.filter((user) => user.id !== id));
          setTotal(total - 1);
          Swal.fire("Deleted!", "User has been deleted.", "success");
        }
      } catch (error) {
        console.error("Error deleting user:", error);

        if (error.response && error.response.status === 400) {
          // Show specific error message from backend
          Swal.fire("Warning!", error.response.data.message, "warning");
        } else {
          Swal.fire(
            "Error!",
            "An error occurred while deleting the user.",
            "error"
          );
        }
      }
    }
  };

  const userdataedit = (userid) => {
    if (Role === "Admin") {
      navigate(`/editemployee/${userid}`);
    } else if (Role === "HR") {
      navigate(`/hredituser/${userid}`);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const options = {
    roles: ["HR", "Employee"],
  };

  const handleadduser = () => {
    if (Role === "Admin") {
      navigate("/addemployee");
    } else if (Role === "HR") {
      navigate("/hraddemployee");
    }
  };

  const handleviewuser = (userid) => {
    if (Role === "Admin") {
      navigate(`/viewuser/${userid}`);
    } else if (Role === "HR") {
      navigate(`/viewhruser/${userid}`);
    }
  };

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
  };

  const handledowloademployee = async () => {
    try {
      const response = await axiosInstance.get(`/admin/employeelistdownlaod`, {
        params: { logid, logip },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "EmployeeList.csv");
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

  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <div className="upperdiv">
        <div className="row gy-3 align-items-center ">
          <div className="col-12 col-md-4">
            <input
              type="text"
              placeholder="Search By Name, Email or Employee ID"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control transitionEffectOccur"
            />
          </div>

          <div className="col-12 col-md-8">
            <div className="action-controls">
              <div className="toggle-control" onClick={handleToggle}>
                {isToggled ? (
                  // Display "On" icon
                  <FaToggleOff size={40} color="#ccc" />
                ) : (
                  <FaToggleOn size={40} color="#4caf50" />
                )}
              </div>

              <select
                id="role"
                name="role"
                value={role}
                className="form-select role-select"
                onChange={handleRoleChange}
              >
                <option value="">All</option>
                {options.roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <button
                type="button"
                id="Commonbutton"
                onClick={handledowloademployee}
              >
                Download
              </button>

              <button
                type="Commonbutton"
                id="Commonbutton"
                onClick={handleadduser}
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* =========================================================== */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
            <div className="table-container">
              {!isMobile && (
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>
                        #id
                        <span onClick={() => handleSorting("id")}>
                          {usersort.column === "id" ? (
                            usersort.order === "asc" ? (
                              <FcAlphabeticalSortingAz />
                            ) : (
                              <FcAlphabeticalSortingZa />
                            )
                          ) : (
                            <FcAlphabeticalSortingAz />
                          )}
                        </span>
                      </th>
                      <th>
                        Full Name
                        <span onClick={() => handleSorting("first_name")}>
                          {usersort.column === "first_name" ? (
                            usersort.order === "asc" ? (
                              <FcAlphabeticalSortingAz />
                            ) : (
                              <FcAlphabeticalSortingZa />
                            )
                          ) : (
                            <FcAlphabeticalSortingAz />
                          )}
                        </span>
                      </th>
                      <th>
                        Email
                        <span onClick={() => handleSorting("email")}>
                          {usersort.column === "email" ? (
                            usersort.order === "asc" ? (
                              <FcAlphabeticalSortingAz />
                            ) : (
                              <FcAlphabeticalSortingZa />
                            )
                          ) : (
                            <FcAlphabeticalSortingAz />
                          )}
                        </span>
                      </th>
                      <th>
                        Employee ID
                        <span onClick={() => handleSorting("emp_id")}>
                          {usersort.column === "emp_id" ? (
                            usersort.order === "asc" ? (
                              <FcAlphabeticalSortingAz />
                            ) : (
                              <FcAlphabeticalSortingZa />
                            )
                          ) : (
                            <FcAlphabeticalSortingAz />
                          )}
                        </span>
                      </th>
                      <th>Role</th>
                      <th>
                        Last Login
                        <span onClick={() => handleSorting("last_login")}>
                          {usersort.column === "last_login" ? (
                            usersort.order === "asc" ? (
                              <FcAlphabeticalSortingAz />
                            ) : (
                              <FcAlphabeticalSortingZa />
                            )
                          ) : (
                            <FcAlphabeticalSortingAz />
                          )}
                        </span>
                      </th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablelodinag ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          <ClipLoader
                            color="#5856d6"
                            size={50}
                            speedMultiplier={1.2}
                          />
                        </td>
                      </tr>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td
                            className="viewuserbyfield"
                            onClick={() => handleviewuser(user.id)}
                          >
                            #{user.id}
                          </td>
                          <td
                            className="viewuserbyfield"
                            onClick={() => handleviewuser(user.id)}
                          >
                            {user.first_name}
                            {user.middle_name} {user.last_name}
                          </td>
                          <td>{user.email}</td>
                          <td>{user.emp_id}</td>
                          <td>{user.role}</td>
                          <td>
                            {user.last_login === null
                              ? ""
                              : new Date(user.last_login).toLocaleString()}
                          </td>
                          <td>
                            {user.status === "1" ? (
                              <div>
                                <span className="badge text-bg-success text-light">
                                  Active
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="badge text-bg-danger text-light">
                                  InActive
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="actionButton">
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
                              onClick={() => userdataedit(user.id)}
                              style={{ cursor: "pointer", color: "blue" }}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center"
                          style={{ fontWeight: "bold", fontSize: "large" }}
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {isMobile && (
                <div className="card-container">
                  {tablelodinag ? (
                    <div className="text-center" style={{ padding: "30px 0" }}>
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
                            <span
                              className="ms-2"
                              onClick={() => handleviewuser(user.id)}
                            >
                              #{user.id}
                            </span>
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
                              onClick={() => userdataedit(user.id)}
                              style={{ cursor: "pointer", color: "blue" }}
                            />
                          </div>
                        </div>

                        <div className="card-content">
                          <p>
                            <strong onClick={() => handleviewuser(user.id)}>
                              Full Name:
                            </strong>{" "}
                            {user.first_name} {user.middle_name}{" "}
                            {user.last_name}
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
                              user.status === "1" ? "bg-success" : "bg-danger"
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
        </>
      )}
    </>
  );
};

export default Employees;
