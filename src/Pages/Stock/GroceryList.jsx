import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/utils/AxiosIntance";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import getSwalTheme from "../../utils/Swaltheme";

import Spinner from "../../utils/Spinner";
import { ClipLoader } from "react-spinners";
import useIsMobile from "../../scss/vendors/MobileSetting";
import { useSelector } from "react-redux";

const GroceryCategory = () => {
  const [limit, setlimit] = useState(10);
  const isMobile = useIsMobile();
  const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");
  const [tableLoading, settableLoading] = useState(false);
  const Swal = getSwalTheme();
  //========================for logip and logid end ==================================

  const getrole = localStorage.getItem("role");
  const navigate = useNavigate();
  const [grocerydata, setgrocerydata] = useState([]);
  const [search, setsearch] = useState("");
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");
  const [page, setPage] = useState(1);
  const [total, settotal] = useState(1);
  const [loading, setloading] = useState(true);

  const theme = useSelector((state) => state.theme);
  const fetchdata = async () => {
    try {
      settableLoading(true);
      const response = await axiosInstance.get(
        "/api/grocery/getgroceryinventory",
        {
          params: {
            search,
            start_date: startdate,
            end_date: enddate,
            page: page,
            limit,
          },
        }
      );
      setgrocerydata(response.data.response);
      console.log(response.data.response);
      settotal(response.data.total_items);
      setloading(false);
      settableLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
      settableLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      fetchdata();
    } else {
      // Optionally fetch data without search if search is empty
      fetchdata();
    }
  }, [search, startdate, enddate, page, limit]);

  const handleaddGrocery = () => {
    if (getrole === "Admin") {
      navigate("/addgrocerycategory");
    } else {
      navigate("/hraddgrocerycategory");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Delete this record",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axiosInstance.delete(
          `/api/grocery/deletedata/${id}`,
          {
            params: {
              logid,
              logip,
            },
          }
        );
        if (response.status === 200) {
          setgrocerydata((prev) => prev.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      }
      fetchdata();
    } catch (error) {
      Swal.fire(
        "Error!",
        "Something went wrong while deleting the data.",
        "error"
      );
      console.error("Error deleting data:", error);
    }
  };
  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/api/grocery/downloadgrocery`, {
        responseType: "blob",
        params: {
          logid,
          logip,
        },
      });

      if (!response || !response.data) {
        throw new Error("Empty response from the server.");
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "grocery.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Your grocery data file has been downloaded as an Excel sheet.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error downloading Excel file:", error);

      Swal.fire({
        icon: "error",
        title: "Download Failed!",
        text: "There was an error downloading the file. Please try again.",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleEdit = (id) => {
    if (getrole === "Admin") {
      navigate(`/editgroceryinventory/${id}`);
    } else {
      navigate(`/hreditgroceryinventory/${id}`);
    }
  };

  const handlesearch = (e) => {
    setsearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };
  const handleLimitChange = (newval) => {
    setlimit(newval);
  };
  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="upperdiv">
        <div className="row gy-3 align-items-center ">
          <div className="col-12 col-md-4">
            <input
              type="text"
              placeholder="Search by Name..."
              value={search}
              onChange={handlesearch}
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-8">
            <div className="action-controls">
              {/* First Row: Date Inputs */}
              <div className="row g-2 mb-2">
                <div className="col-12 col-md-3">
                  <input
                    type="date"
                    value={startdate}
                    onChange={(e) => setstartdate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-12 col-md-3">
                  <input
                    type="date"
                    value={enddate}
                    onChange={(e) => setenddate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-12 col-md-3">
                  <button
                    type="button"
                    id="Commonbutton"
                    className="btn w-100"
                    onClick={handleDownload}
                  >
                    Download
                  </button>
                </div>
                <div className="col-12 col-md-3">
                  <button
                    type="button"
                    id="Commonbutton"
                    className="btn w-100"
                    onClick={handleaddGrocery}
                  >
                    Add Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* -------------------------------------- */}
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="table-container">
          {!isMobile && (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#id</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Purchase Date</th>
                  {/* <th>Expiry Date</th> */}
                  <th>Used Item</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <ClipLoader
                        color="#6360FF"
                        size={50}
                        speedMultiplier={1.2}
                      />
                    </td>
                  </tr>
                ) : grocerydata.length > 0 ? (
                  grocerydata.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.category}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit_price}</td>
                      <td>{item.total_price}</td>
                      <td>
                        {item.purchase_date === "0000-00-00"
                          ? ""
                          : item.purchase_date}
                      </td>
                      {/* <td>{item.expiry_date === "0000-00-00" ? "" : item.expiry_date}</td> */}
                      <td>{item.used_item}</td>
                      <td className="actionButton">
                        <MdDelete
                          className="tableDeleteBackground"
                          onClick={() => handleDelete(item.id)}
                          style={{ cursor: "pointer", color: "red" }}
                        />
                        <MdEdit
                          className="tableEditBackground"
                          onClick={() => handleEdit(item.id)}
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            marginLeft: "10px",
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center"
                      style={{ fontWeight: "bold", fontSize: "large" }}
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Mobile Cards */}
          {isMobile && (
            <div className="card-container">
              {tableLoading ? (
                <div className="text-center" style={{ padding: "30px 0" }}>
                  <ClipLoader color="#FE7743" size={50} speedMultiplier={1.2} />
                </div>
              ) : grocerydata.length > 0 ? (
                grocerydata.map((item) => (
                  <div className="card" key={item.id}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <input type="checkbox" />
                        <span className="ms-2">#{item.id}</span>
                      </div>
                      <div className="card-actions">
                        <MdEdit
                          className="EditDeleteBackground"
                          onClick={() => handleEdit(item.id)}
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            marginRight: "5px",
                          }}
                        />
                        <MdDelete
                          className="EditDeleteBackground"
                          onClick={() => handleDelete(item.id)}
                          style={{ cursor: "pointer", color: "red" }}
                        />
                      </div>
                    </div>

                    <div className="card-content">
                      <p>
                        <strong>Category:</strong> {item.category}
                      </p>
                      <p>
                        <strong>Name:</strong> {item.name}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Unit Price:</strong> {item.unit_price}
                      </p>
                      <p>
                        <strong>Total Price:</strong> {item.total_price}
                      </p>
                      <p>
                        <strong>Purchase Date:</strong>{" "}
                        {item.purchase_date === "0000-00-00"
                          ? ""
                          : item.purchase_date}
                      </p>
                      <p>
                        <strong>Expiry Date:</strong>{" "}
                        {item.expiry_date === "0000-00-00"
                          ? ""
                          : item.expiry_date}
                      </p>
                      <p>
                        <strong>Used Item:</strong> {item.used_item}
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
                  No data available
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
  );
};

export default GroceryCategory;
