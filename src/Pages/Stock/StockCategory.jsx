import  { useState, useEffect } from "react";
import axiosInstance from "../../components/utils/AxiosIntance";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";

import getSwalTheme from "../../utils/Swaltheme";
import Spinner from "../../utils/Spinner";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import useIsMobile from "../../scss/vendors/MobileSetting";
import "../../scss/css/table.css"
const StockCategory = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const theme = useSelector((state) => state.theme);
const Swal = getSwalTheme()
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [pageSize, setPageSize] = useState(10);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setloading] = useState(true);
  const role = localStorage.getItem("role");
  const logip = useSelector((state) => state.ipAddress);
  const [tableLoading, settableLoading] = useState(false);
  const logid = localStorage.getItem("id");
  const [limit, setlimit] = useState(10);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        settableLoading(true);
        const response = await axiosInstance.get(
          "/api/grocery/getstockcategorydata",
          {
            params: {
              search: search,
              page: currentPage,
              limit,
            },
          }
        );
        setCategory(response.data.data);
        setTotalPages(response.data.pagination.totalItems);
        setloading(false);
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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalPages / limit)) {
      setCurrentPage(newPage);
    }
  };
  const handleLimitChange = (newval) => {
    setlimit(newval);
  };
  const handleAddCategory = () => {
    if (role === "Admin") {
      navigate("/addgrocerydata");
    } else {
      navigate("/hraddgrocerydata");
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the category. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/grocery/deletecategorydata/${id}`, {
          params: {
            logid,
            logip,
          },
        });

        setCategory(category.filter((item) => item.id !== id));

        Swal.fire(
          "Deleted!",
          "The category has been deleted successfully.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting category:", error);

        if (error.response && error.response.status === 400) {
          Swal.fire(
            "Cannot Delete!",
            error.response.data.message ||
              "This category is being used in Stock Inventory.",
            "error"
          );
        } else {
          Swal.fire("Error!", "Failed to delete category.", "error");
        }
      }
    }
  };

  const handleEditCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Changing the category name will affect all records using this category due to foreign key relationships. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/api/grocery/editcategorydata/${id}`, {
          category_name: editValue,
          logid,
          logip,
        });

        setCategory(
          category.map((item) =>
            item.id === id ? { ...item, category_name: editValue } : item
          )
        );

        setEditingCategory(null);
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
    setEditingCategory(null); 
    setEditValue("");
  };

  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

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
              <button
                className="btn btn-primary department-add-button"
                onClick={handleAddCategory}
                id="Commonbutton"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ===================================== */}
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="table-container">
          {/* Desktop View */}
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
                        color="#6360FF"
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
                      <td style={{gap:"10px"}}>
                        {editingCategory === item.id ? (
                          <>
                            <button onClick={() => handleEditCategory(item.id)} className="SaveButton">
                              Save
                            </button>
                            <button onClick={handleCancelEdit} className="CancelButton" style={{marginLeft:"10px"}}>Cancel</button>
                          </>
                        ) : (
                          <div>
                            <MdDelete
                              onClick={() => handleDeleteCategory(item.id)}
                              className="tableDeleteBackground"
                              style={{color:"red"}}
                            />
                            <MdEdit
                            className="tableEditBackground"
                               style={{color:"blue",marginLeft:"10px"}}
                              onClick={() => {
                                setEditingCategory(item.id);
                                setEditValue(item.category_name);
                                
                              }}
                              
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

          {/* Mobile View */}
          {isMobile && (
            <div className="card-container">
              {tableLoading ? (
                <div className="text-center" style={{ padding: "30px 0" }}>
                  <ClipLoader color="#FE7743" size={50} speedMultiplier={1.2} />
                </div>
              ) : category.length > 0 ? (
                category.map((item) => (
                  <div className="card" key={item.id}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span>#{item.id}</span>
                      <div className="card-actions">
                        {editingCategory === item.id ? (
                          <>
                            <button onClick={() => handleEditCategory(item.id)}>
                              Save
                            </button>
                            <button onClick={handleCancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <MdDelete
                              onClick={() => handleDeleteCategory(item.id)}
                              className="tabledeleteBackground"
                            />
                            <MdEdit
                              className="tableEditBackground"
                               style={{color:"blue",marginLeft:"10px"}}
                              onClick={() => {
                                setEditingCategory(item.id);
                                setEditValue(item.category_name);
                              }}
                            
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

          {/* Pagination */}
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
                {Math.min(currentPage * limit, totalPages)} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
               style={{background:"#6360FF"}}
              >
                &lt;
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                style={{background:"#6360FF"}}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================== */}
    </div>
  );
};

export default StockCategory;
