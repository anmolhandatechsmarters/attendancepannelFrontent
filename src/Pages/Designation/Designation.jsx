import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import getSwalTheme from "../../utils/Swaltheme";
import useIsMobile from "../../scss/vendors/MobileSetting";
import "../../scss/css/HeaderDiv.css";
import "../../scss/css/table.css";
import "../../scss/css/button.css";
const Designation = () => {
  const Swal = getSwalTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const theme = useSelector((state) => state.theme);
  const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");
  const [designation, setdesignation] = useState([]);
  const [editingdesignation, setEditingdesignation] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setlimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [tableLoading, settableLoading] = useState(false);
  const Role = localStorage.getItem("role");

  useEffect(() => {
    fetchdesignations();
  }, [page, searchTerm, sortOrder, limit]);

  const fetchdesignations = async () => {
    try {
      settableLoading(true);
      const result = await axiosInstance.get(`/admin/getdesignation`, {
        params: { page, limit, search: searchTerm, sortOrder },
      });
      setdesignation(result.data.designations);
      setTotal(result.data.total);
      setLoading(false);
      settableLoading(false);
    } catch (error) {
      console.error("Error fetching designations:", error);
    } finally {
      setLoading(false);
      settableLoading(false);
    }
  };

  const handleEditdesignation = async (id) => {
    if (!editValue.trim()) {
      Swal.fire({
        icon: "error",
        title: "Required Field",
        text: "Designation Field Cannot be empty for edit",
        confirmButtonText: "Try Again",
      });
      return;
    }
    try {
      await axiosInstance.put(
        `/admin/editdesignation/${id}`,
        { name: editValue, logid, logip },
        {}
      );
      Swal.fire("Success!", "Designation updated successfully!", "success");
      setEditingdesignation(null);
      setEditValue("");
      fetchdesignations();
    } catch (error) {
      console.error("Error editing desgnation:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message ||
          "There was a problem updating the designation.",
        "error"
      );
    }
  };

  const handleLimitChange = (newlimit) => {
    setlimit(newlimit);
  };
  const handleDeletedesignation = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "To Delete this Designation",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/deletedesignation/${id}`, {
          params: { logid, logip },
        });
        fetchdesignations();
        Swal.fire("Deleted!", "Your designation has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting designation:", error);
        Swal.fire(
          "Error!",
          error.response?.data?.message ||
            "There was a problem deleting the designation.",
          "error"
        );
      }
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleCancelEdit = () => {
    setEditingdesignation(null);
    setEditValue("");
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const handlemovedesignation = () => {
    console.log(Role)
    if (Role == "Admin") {
      navigate("/adddesignation");
    } else if (Role == "HR") {
      navigate("/hradddesignation");
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
              placeholder="Search Designation"
              value={searchTerm}
              style={{ width: "100%" }}
              className="form-control"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-8">
            <div className="action-controls">
              <button onClick={handlemovedesignation} id="Commonbutton">
                Add Designation
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* table start */}

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
                    ) : designation.length > 0 ? (
                      designation.map((item) => (
                        <tr key={item.id}>
                          <td>#{item.id}</td>
                          <td>
                            {editingdesignation === item.id ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                              />
                            ) : (
                              item.designation_name
                            )}
                          </td>
                          <td className="actionButton">
                            <div className="actiionButtonContainer">
                              {editingdesignation === item.id ? (
                                <>
                                  <button
                                    className="EditSaveButton"
                                    onClick={() =>
                                      handleEditdesignation(item.id)
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
                                      handleDeletedesignation(item.id)
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
                                      setEditingdesignation(item.id);
                                      setEditValue(item.designation_name);
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
                          No designation Found
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
                    <div className="text-center" style={{ padding: "30px 0" }}>
                      <ClipLoader
                        color="#5856d6"
                        size={50}
                        speedMultiplier={1.2}
                      />
                    </div>
                  ) : designation.length > 0 ? (
                    designation.map((item) => (
                      <div className="card" key={item.id}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <div>
                            <span className="ms-2">#{item.id}</span>
                          </div>
                          <div className="card-actions">
                            <MdDelete
                              className="tableDeleteBackground"
                              onClick={() => handleDeletedesignation(item.id)}
                              style={{
                                cursor: "pointer",
                                color: "red",
                                marginRight: "5px",
                              }}
                            />
                            <MdEdit
                              className="tableEditBackground"
                              onClick={() => {
                                setEditingdesignation(item.id);
                                setEditValue(item.designation_name);
                              }}
                              style={{ cursor: "pointer", color: "blue" }}
                            />
                          </div>
                        </div>

                        <div className="card-content">
                          <p>
                            <strong>designation:</strong>{" "}
                            {editingdesignation === item.id ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                              />
                            ) : (
                              item.designation_name
                            )}
                          </p>
                        </div>

                        {editingdesignation === item.id && (
                          <div className="card-footer d-flex justify-content-end">
                            <button
                              onClick={() => handleEditdesignation(item.id)}
                              style={{ marginRight: "10px" }}
                            >
                              Save
                            </button>
                            <button onClick={handleCancelEdit}>Cancel</button>
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
                      No designation Found
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

export default Designation;
