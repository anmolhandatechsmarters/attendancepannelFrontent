import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import getSwalTheme from "../../utils/Swaltheme";
import useIsMobile from "../../scss/vendors/MobileSetting";
import "../../scss/css/table.css";

const DepartmentManagement = () => {
  const Swal = getSwalTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const theme = useSelector((state) => state.theme);
  const logip = useSelector((state) => state.ipAddress);
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setlimit] = useState(10);
  const [loading, setloading] = useState(true);
  const [tableLoading, settableLoading] = useState(false);
  const logid = localStorage.getItem("id");

  const Role = localStorage.getItem("role");
  const fetchDepartments = async () => {
    try {
      settableLoading(true);
      const result = await axiosInstance.get(`/admin/getdeparmentdetail`, {
        params: {
          page,
          limit,
          search: searchTerm,
          sortOrder,
        },
      });
      setDepartments(result.data.departments);
      setTotal(result.data.total);
      settableLoading(false);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setloading(false);
      settableLoading(false);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, [page, limit, searchTerm, sortOrder]);

  const handleEditDepartment = async (id) => {
    if (!editValue.trim()) {
      Swal.fire({
        icon: "error",
        title: "Required Field",
        text: "Department Field Cannot be empty for edit",
        confirmButtonText: "Try Again",
      });
      return;
    }
    try {
      await axiosInstance.put(
        `/admin/editdepartment/${id}`,
        { name: editValue, logid, logip },
        {}
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Department updated successfully!",
        confirmButtonText: "OK",
      });

      setEditingDepartment(null);
      setEditValue("");
      fetchDepartments();
    } catch (error) {
      console.error("Error editing department:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: error.response?.data?.message,

        confirmButtonText: "Try Again",
      });
    }
  };

  const handleDeleteDepartment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/deletedepartment/${id}`, {
          params: { logid, logip },
        });
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
        Swal.fire(
          "Error!",
          error.response?.data?.message ||
            "There was a problem deleting the department.",
          "error"
        );
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setEditValue("");
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handlemovedepartment = () => {
    if (Role == "Admin") {
      navigate("/adddepartment");
    } else if (Role == "HR") {
      navigate("/hradddepartment");
    }
  };

  const handleLimitChange = (newlimit) => {
    setlimit(newlimit);
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="upperdiv">
            <div className="row gy-3 align-items-center ">
              <div className="col-12 col-md-4">
                <input
                  type="text"
                  placeholder="Search Departments"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  required
                  style={{ width: "100%" }}
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-8">
                <div className="d-grid gap-2 d-md-flex justify-content-md-end actions mb-0">
                  <button onClick={handlemovedepartment} id="Commonbutton">
                    Add Department
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* table */}
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
                            #Id{" "}
                            <span onClick={handleSortToggle}>
                              {sortOrder === "asc" ? (
                                <FcAlphabeticalSortingAz />
                              ) : (
                                <FcAlphabeticalSortingZa />
                              )}
                            </span>
                          </th>
                          <th>Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableLoading ? (
                          <tr>
                            <td colSpan="3" className="text-center">
                              <ClipLoader
                                color="#5856d6"
                                size={50}
                                speedMultiplier={1.2}
                              />
                            </td>
                          </tr>
                        ) : departments.length > 0 ? (
                          departments.map((item) => (
                            <tr key={item.id}>
                              <td>#{item.id}</td>
                              <td>
                                {editingDepartment === item.id ? (
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    autoFocus
                                  />
                                ) : (
                                  item.department_name
                                )}
                              </td>
                              <td className="actionButton">
                                <div className="actiionButtonContainer">
                                  {editingDepartment === item.id ? (
                                    <>
                                      <button
                                        className="EditSaveButton"
                                        onClick={() =>
                                          handleEditDepartment(item.id)
                                        }
                                      >
                                        Save
                                      </button>
                                      <button
                                        className="EditCancelButton"
                                        onClick={handleCancelEdit}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <div className="EditDeleteBackgroundMain">
                                      <MdDelete
                                        onClick={() =>
                                          handleDeleteDepartment(item.id)
                                        }
                                        className="tableDeleteBackground"
                                        style={{
                                          color: "red",
                                          marginRight: "5px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <MdEdit
                                        onClick={() => {
                                          setEditingDepartment(item.id);
                                          setEditValue(item.department_name);
                                        }}
                                        className="tableEditBackground"
                                        style={{
                                          color: "blue",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-center"
                              style={{ fontWeight: "bold", fontSize: "large" }}
                            >
                              No Department Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Cards for smaller screens */}
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
                      ) : departments.length > 0 ? (
                        departments.map((item) => (
                          <div className="card" key={item.id}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                              <div>
                                <span className="ms-2">#{item.id}</span>
                              </div>
                              <div className="card-actions">
                                <MdDelete
                                  className="tableDeleteBackground"
                                  onClick={() =>
                                    handleDeleteDepartment(item.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    color: "red",
                                    marginRight: "5px",
                                  }}
                                />
                                <MdEdit
                                  className="tableEditBackground"
                                  onClick={() => {
                                    setEditingDepartment(item.id);
                                    setEditValue(item.department_name);
                                  }}
                                  style={{ cursor: "pointer", color: "blue" }}
                                />
                              </div>
                            </div>

                            <div className="card-content">
                              <p>
                                <strong>Department:</strong>{" "}
                                {editingDepartment === item.id ? (
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    autoFocus
                                  />
                                ) : (
                                  item.department_name
                                )}
                              </p>
                            </div>

                            {editingDepartment === item.id && (
                              <div className="card-footer d-flex justify-content-end">
                                <button
                                  onClick={() => handleEditDepartment(item.id)}
                                  style={{ marginRight: "10px" }}
                                >
                                  Save
                                </button>
                                <button onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </div>
                            )}
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
                          No Department Found
                        </div>
                      )}
                    </div>
                  )}

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

          {/* table  */}
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
