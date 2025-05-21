import React, { useState, useEffect } from "react";
import axiosInstance from "../../../components/utils/AxiosIntance";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import getSwalTheme from "../../../utils/Swaltheme";
import axios from "axios";
import Spinner from "../../../utils/Spinner";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import useIsMobile from "../../../scss/vendors/MobileSetting";
const DepartmentManagement = () => {
  const theme = useSelector((state) => state.theme);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const Swal = getSwalTheme();
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setloading] = useState(true);
  const role = localStorage.getItem("role");
  const [tableLoading, settableLoading] = useState(false);
  const [limit, setlimit] = useState(10);

  const [logip, setIpAddress] = useState("");
  const logid = localStorage.getItem("id");
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

  // Fetch category data with pagination and search
  useEffect(() => {
    async function fetchCategoryData() {
      try {
        settableLoading(true);
        const response = await axiosInstance.get(
          "/api/inventory/getcategorydata",
          {
            params: {
              search: search,
              page: currentPage,
              limit,
            },
          }
        );
        setloading(false);
        setCategory(response.data.data);
        setTotalItems(response.data.pagination.totalItems);
        console.log(response.data.pagination.totalItems);
        settableLoading(false);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setloading(false);
        settableLoading(false);
      }
    }

    fetchCategoryData();
  }, [search, currentPage, pageSize, limit]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleLimitChange = (newval) => {
    setlimit(newval);
  };
  const handleAddCategory = () => {
    if (role === "Admin") {
      navigate("/addcategory");
    } else {
      navigate("/hraddcategory");
    }
  };

  const handleDeleteCategory = async (id) => {
    // Show a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the category. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true, // Reverse the order of buttons (Cancel on the left)
    });

    // If user confirms the deletion
    if (result.isConfirmed) {
      try {
        // Make the API call to delete the category
        await axiosInstance.delete(`/api/inventory/deletecategory/${id}`, {
          params: {
            logid,
            logip,
          },
        });

        // Update the UI by removing the deleted category from the list
        setCategory(category.filter((item) => item.id !== id));

        // Show success message using SweetAlert2
        Swal.fire(
          "Deleted!",
          "The category has been deleted successfully.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting category:", error);

        // Show error message using SweetAlert2
        Swal.fire("Error!", "Failed to delete category.", "error");
      }
    }
  };

  const handleEditCategory = async (id) => {
    // Show confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Changing the category name will affect all records using this category due to foreign key relationships. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    // If user confirmed the update
    if (result.isConfirmed) {
      try {
        // Send the update request to the server
        await axiosInstance.put(`/api/inventory/editcategory/${id}`, {
          category_name: editValue,
          logid,
          logip,
        });

        // Update the category list in the UI
        setCategory(
          category.map((item) =>
            item.id === id ? { ...item, category_name: editValue } : item
          )
        );

        setEditingCategory(null); // Exit editing mode
        Swal.fire(
          "Updated!",
          "Category has been updated successfully.",
          "success"
        );
      } catch (error) {
        console.error("Error updating category:", error);
        Swal.fire("Error!", "Failed to update category.", "error");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null); // Cancel editing mode
    setEditValue(""); // Clear temporary value
  };

  if (loading) {
    return <Spinner />;
  }

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(totalItems / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="upperdiv">
        <div className="row gy-3 align-items-center ">
          <div className="col-12 col-md-4">
            <input
              type="text"
              placeholder="Search by Name..."
              value={search}
              onChange={handleSearch}
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-8">
            <div className="action-controls">
              <button onClick={handleAddCategory} id="Commonbutton">
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* =================== */}
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="table-container">
          {!isMobile && (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Category Name</th>
                  <th>Action</th>
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
                ) : category.length > 0 ? (
                  category.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>
                        {editingCategory === item.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        ) : (
                          item.category_name
                        )}
                      </td>
                      <td className="actionButton">
                        {editingCategory === item.id ? (
                          <>
                            <button
                              onClick={() => handleEditCategory(item.id)}
                              className="btn btn-primary btn-sm me-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <div className="EditDeleteBackgroundMain">
                            <MdDelete
                              onClick={() => handleDeleteCategory(item.id)}
                              className="tableDeleteBackground"
                              style={{
                                cursor: "pointer",
                                color: "red",
                                marginRight: "5px",
                              }}
                            />
                            <MdEdit
                              onClick={() => {
                                setEditingCategory(item.id);
                                setEditValue(item.category_name);
                              }}
                              className="tableEditBackground"
                              style={{ cursor: "pointer", color: "blue" }}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center fw-bold">
                      No categories available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {isMobile && (
            <div className="card-container">
              {tableLoading ? (
                <div className="text-center" style={{ padding: "30px 0" }}>
                  <ClipLoader color="#5856d6" size={50} speedMultiplier={1.2} />
                </div>
              ) : category.length > 0 ? (
                category.map((item) => (
                  <div className="card" key={item.id}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span>#{item.id}</span>
                      <div className="card-actions">
                        {editingCategory === item.id ? (
                          <>
                            <button
                              onClick={() => handleEditCategory(item.id)}
                              className="btn btn-primary btn-sm me-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <MdDelete
                              onClick={() => handleDeleteCategory(item.id)}
                              className="tableDeleteBackground"
                              style={{
                                cursor: "pointer",
                                color: "red",
                                marginRight: "5px",
                              }}
                            />
                            <MdEdit
                              onClick={() => {
                                setEditingCategory(item.id);
                                setEditValue(item.category_name);
                              }}
                              className="tableEditBackground"
                              style={{ cursor: "pointer", color: "blue" }}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="card-content">
                      <p>
                        <strong>Category Name:</strong>{" "}
                        {editingCategory === item.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        ) : (
                          item.category_name
                        )}
                      </p>
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
                  No categories available
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
                {(currentPage - 1) * limit + 1}-
                {Math.min(currentPage * limit, totalItems)} of {totalItems}
              </span>

              <button
                className="paginationButton"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <button
                className="paginationButton"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalItems / limit)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================ */}
    </div>
  );
};

export default DepartmentManagement;
