import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/utils/AxiosIntance";
import getSwalTheme from "../../utils/Swaltheme";
import Select from "react-select";
import Spinner from "../../utils/Spinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../scss/css/SingleForm.css";
const GroceryEditInventory = () => {
  const navigate = useNavigate();
  const Swal = getSwalTheme();
  const Getrole = localStorage.getItem("role");
  const theme = useSelector((state) => state.theme);
  const [loading, setloading] = useState(true);
  const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");

  const { id } = useParams();
  const [formdata, setformdata] = useState({
    name: "",
    quantity: "",
    unitprice: "",
    totalprice: "",
    useditem: "",
    purchasedate: "",
    expirydate: "",
    category: "",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function getCategoryData() {
      try {
        setloading(true);
        const response = await axiosInstance.get(
          "/api/grocery/getcategorydataforselect"
        );
        const data = response.data.response.map((item) => ({
          value: item.id,
          label: item.category_name,
        }));
        setCategoryOptions(data);
        console.log(data);
        setloading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setloading(false);
      }
    }
    // Call the function
    getCategoryData();
  }, []);

  const Fetchdatabyid = async (id) => {
    try {
      const response = await axiosInstance.get(
        `/api/grocery/getdatabyid/${id}`
      );
      const data = response.data.response;
      setformdata({
        name: data.name || "",
        quantity: data.quantity || "",
        unitprice: data.unit_price || "",
        totalprice: (data.quantity * data.unit_price).toFixed(2) || "",
        useditem: data.used_item || "",
        purchasedate: data.purchase_date || "",
        expirydate: data.expiry_date || "",
        category: data.category || "",
      });
      console.log(data);
      setSelectedCategory({
        value: data.Category.id,
        label: data.Category.category_name,
      });
      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setloading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setformdata((prevForm) => {
      const updatedForm = { ...prevForm, [id]: value };

      // Automatically calculate total price when quantity or unitprice changes
      if (id === "quantity" || id === "unitprice") {
        const quantity = parseFloat(updatedForm.quantity) || 0;
        const unitprice = parseFloat(updatedForm.unitprice) || 0;
        updatedForm.totalprice = (quantity * unitprice).toFixed(2);
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if useditem is greater than quantity
    if (parseFloat(formdata.useditem) > parseFloat(formdata.quantity)) {
      // Show error message if validation fails
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Used item cannot be greater than quantity.",
        confirmButtonText: "OK",
      });
      return; // Stop form submission
    }

    // Validate if quantity, unitprice, and total price are non-negative
    if (
      parseFloat(formdata.quantity) < 0 ||
      parseFloat(formdata.unitprice) < 0 ||
      parseFloat(formdata.totalprice) < 0
    ) {
      // Show error message if any of the values are negative
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Quantity, Unit Price, and Total Price cannot be negative.",
        confirmButtonText: "OK",
      });
      return; // Stop form submission
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the inventory data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        // If confirmed, proceed with the update
        await axiosInstance.put(
          `/api/grocery/editgrocerydata/${id}`,
          formdata,
          {
            params: {
              logid,
              logip,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Updated Successfully!",
          text: "The inventory data has been updated.",
          confirmButtonText: "OK",
        });

        if (Getrole === "Admin") {
          navigate("/grocery_category");
        } else {
          navigate("/hrgrocery_category");
        }
      } catch (error) {
        // Handle error
        Swal.fire({
          icon: "error",
          title: "Update Failed!",
          text: "An error occurred while updating the inventory.",
          confirmButtonText: "Try Again",
        });
      }
    } else {
      // Optional: Show a cancellation message
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "The inventory update was cancelled.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    Fetchdatabyid(id);
  }, [id]);

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  console.log("category", selectedCategory);

  return (
    <div className="SingleForm">
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="form-container">
          <h2 className="text-center">Edit Inventory</h2>

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Select Category</label>
                  <Select
                    classNamePrefix="react-select"
                    value={selectedCategory}
                    onChange={(opt) => {
                      setSelectedCategory(opt);
                      setForm((f) => ({
                        ...f,
                        category: opt ? opt.value : null,
                      }));
                    }}
                    options={categoryOptions}
                    placeholder="Select Category"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        padding: "4px",
                        backgroundColor: theme === "dark" ? "#2C353D" : "#fff",
                        color: theme === "dark" ? "#fff" : "#000",
                        border:
                          theme === "dark"
                            ? "1px solid #666"
                            : "1px solid #ccc",
                        zIndex: 99,
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: theme === "dark" ? "#fff" : "#000",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? theme === "dark"
                            ? "#2C353D"
                            : "#ddd"
                          : theme === "dark"
                            ? "#2C353D"
                            : "#fff",
                        color: theme === "dark" ? "#fff" : "#000",
                        "&:hover": {
                          backgroundColor:
                            theme === "dark" ? "#555" : "#f0f0f0",
                        },
                      }),
                    }}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input-field"
                    value={formdata.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    className="input-field"
                    value={formdata.quantity}
                    onChange={handleChange}
                    placeholder="Enter Quantity"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unitprice" className="form-label">
                    Unit Price
                  </label>
                  <input
                    id="unitprice"
                    type="number"
                    min="0"
                    className="input-field"
                    value={formdata.unitprice}
                    onChange={handleChange}
                    placeholder="Enter Unit Price"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="totalprice" className="form-label">
                    Total Price
                  </label>
                  <input
                    id="totalprice"
                    type="number"
                    className="input-field"
                    value={formdata.totalprice}
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="useditem" className="form-label">
                    Used Item
                  </label>
                  <input
                    id="useditem"
                    type="number"
                    min="0"
                    className="input-field"
                    value={formdata.useditem}
                    onChange={handleChange}
                    placeholder="Enter Used Item"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="purchasedate" className="form-label">
                    Purchase Date
                  </label>
                  <input
                    id="purchasedate"
                    type="date"
                    className="input-field"
                    value={formdata.purchasedate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="expirydate" className="form-label">
                    Expiry Date
                  </label>
                  <input
                    id="expirydate"
                    type="date"
                    className="input-field"
                    value={formdata.expirydate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="button-group mt-3 d-flex gap-2">
              <button type="submit" id="Commonbutton">
                Submit
              </button>
              <button
                type="button"
                id="CancelButton"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroceryEditInventory;
