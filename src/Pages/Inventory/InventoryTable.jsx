import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/utils/AxiosIntance";
import { MdEdit, MdHelp, MdDelete } from "react-icons/md"; // Import MdHelp icon
import getSwalTheme from "../../utils/Swaltheme";
import { useSelector } from "react-redux";
import Spinner from "../../utils/Spinner";
import { ClipLoader } from "react-spinners";
import useIsMobile from "../../scss/vendors/MobileSetting";
import "../../scss/css/HeaderDiv.css";
import "../../scss/css/button.css";
import "../../scss/css/table.css";
const InventoryTable = () => {
  const navigation = useNavigate();
  const isMobile = useIsMobile();
  const role = localStorage.getItem("role");
  const theme = useSelector((state) => state.theme);
  const Swal = getSwalTheme();
  const [limit, setlimit] = useState(10);
  const [inventory, setInventory] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setpage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setloading] = useState(true);
  const [tableLoading, settableLoading] = useState(false);
  //Fetch logid and logip
  const [logip, setIpAddress] = useState("");
  const logid = localStorage.getItem("id");

  const fetchInventoryData = async () => {
    try {
      settableLoading(true);
      const response = await axiosInstance.get(
        "/api/inventory/getinventorydata",
        {
          params: {
            search: searchTerm,
            category: selectedCategory || "",
            start_date: startDate,
            end_date: endDate,
            page,
            limit,
          },
        }
      );
      setInventory(response.data.data);
      setTotalItems(response.data.total_items);
      console.log(response.data.total_pages);
      setloading(false);
      settableLoading(false);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setloading(false);
      settableLoading(false);
    }
  };

  const ip = useSelector((state) => state.ipAddress);
  useEffect(() => {
    if (ip) {
      setIpAddress(ip);
    }
  }, [ip]);

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/inventory/getcategorydataselect"
      );
      const data = response.data.data.map((item) => ({
        value: item.id,
        label: item.category_name,
      }));
      console.log(response.data);
      const noneOption = { value: "", label: "None" };
      setCategoryOptions([noneOption, ...data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    fetchCategory();
  }, [searchTerm, selectedCategory, startDate, endDate, page, limit]);

  const handleAddInventory = () => {
    if (role === "Admin") {
      navigation("/addinventory");
    } else {
      navigation("/hraddinventory");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setpage(1); // Reset to the first page when searching
  };

  const handleLimitChange = (newval) => {
    setlimit(newval);
  };

  const showDescription = (description) => {
    Swal.fire({
      title: "Full Description",
      text: description,
      icon: "info",
      confirmButtonText: "Close",
    });
  };
  const handlePageChange = (newPage) => {
    console.log("hello");
    if (newPage > 0 && newPage <= Math.ceil(totalItems / limit)) {
      setpage(newPage);
    }
  };

  const handleDeleteInventory = async (id) => {
    // Show a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the inventory item. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true, // Reversed order of buttons
    });

    if (result.isConfirmed) {
      try {
        // Make the API call to delete the item from the backend
        await axiosInstance.delete(`/api/inventory/deleteinventory/${id}`, {
          params: {
            logid,
            logip,
          },
        });

        // Show success message
        Swal.fire(
          "Deleted!",
          "The inventory item has been deleted successfully.",
          "success"
        );

        fetchInventoryData();
      } catch (error) {
        console.error("Error deleting inventory item:", error);
        // Show error message
        Swal.fire("Error!", "Failed to delete the inventory item.", "error");
      }
    }
  };

  const handleEditInventory = (id) => {
    if (role === "Admin") {
      navigation(`/editinventory/${id}`);
    } else {
      navigation(`/hreditinventory/${id}`);
    }
  };

  if (loading) {
    return (
      <div>
        <>
          <Spinner />
        </>
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
              style={{ width: "100%" }}
              value={searchTerm}
              onChange={handleSearch}
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-8">
            <div className="action-controls">
              <div className="row g-2 align-items-center">
                <div className="col-12 col-md-6">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    id="Commonbutton"
                    onClick={handleAddInventory}
                  >
                    Add Inventory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ----------------------------------------------- */}
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="table-container">
          {!isMobile && (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#id</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Purchase Date</th>
                  {/* <th>Expiry Date</th> */}
                  <th>Brand Name</th>
                  <th>Assign Item</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <ClipLoader
                        color="#5856d6"
                        size={50}
                        speedMultiplier={1.2}
                      />
                    </td>
                  </tr>
                ) : inventory.length > 0 ? (
                  inventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.category}</td>
                      <td>{item.name}</td>
                      <td>
                        {item.description?.length > 20 ? (
                          <>
                            {item.description.slice(0, 20)}...
                            <MdHelp
                              style={{
                                marginLeft: "5px",
                                cursor: "pointer",
                                color: "#007bff",
                              }}
                              onClick={() => showDescription(item.description)}
                            />
                          </>
                        ) : (
                          item.description
                        )}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        {item.purchase_date === "0000-00-00"
                          ? ""
                          : item.purchase_date}
                      </td>
                      {/* <td>
                        {item.expiry_date === "0000-00-00"
                          ? ""
                          : item.expiry_date}
                      </td> */}
                      <td>{item.brand_name}</td>
                      <td>{item.asign_item}</td>
                      <td style={{ gap: "10px" }}>
                        <MdDelete
                          className="tableDeleteBackground"
                          color="red"
                          onClick={() => handleDeleteInventory(item.id)}
                        />
                        <MdEdit
                          className="tableEditBackground "
                          style={{ marginLeft: "5px" }}
                          color="blue"
                          onClick={() => handleEditInventory(item.id)}
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
                      No records found
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
              ) : inventory.length > 0 ? (
                inventory.map((item) => (
                  <div className="card" key={item.id}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <input type="checkbox" />
                        <span className="ms-2">#{item.id}</span>
                      </div>
                      <div className="card-actions">
                        <MdDelete
                          className="tableDeleteBackground"
                          onClick={() => handleDeleteInventory(item.id)}
                          style={{
                            cursor: "pointer",
                            color: "red",
                            marginRight: "5px",
                          }}
                        />
                        <MdEdit
                          className="tableEditBackground"
                          onClick={() => handleEditInventory(item.id)}
                          style={{ cursor: "pointer", color: "blue" }}
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
                        <strong>Description:</strong>{" "}
                        {item.description?.length > 40
                          ? `${item.description.slice(0, 40)}...`
                          : item.description}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Purchase Date:</strong> {item.purchase_date}
                      </p>
                      <p>
                        <strong>Expiry Date:</strong> {item.expiry_date}
                      </p>
                      <p>
                        <strong>Brand Name:</strong> {item.brand_name}
                      </p>
                      <p>
                        <strong>Assign Item:</strong> {item.asign_item}
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
                  No records found
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
                {(page - 1) * limit + 1}-{Math.min(page * limit, totalItems)} of{" "}
                {totalItems}
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
                disabled={page === Math.ceil(totalItems / limit)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
    </>
  );
};

export default InventoryTable;
