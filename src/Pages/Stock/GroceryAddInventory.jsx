import React, { useEffect, useState } from "react";
import getSwalTheme from "../../utils/Swaltheme";
import axiosInstance from "../../components/utils/AxiosIntance";
import Select from "react-select";
import Spinner from "../../utils/Spinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../scss/css/SingleForm.css";
import "../../scss/css/button.css";
const GroceryAddInventory = () => {
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const Swal = getSwalTheme();
  const Getrole = localStorage.getItem("role");

  const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unitprice: "",
    totalprice: "",
    purchasedate: "",
    expirydate: "",
    category: null,
    logip,
    logid,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const darkmode = localStorage.getItem(
      "coreui-free-react-admin-template-theme"
    );
    setIsDarkMode(darkmode === "dark");
  }, []);

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
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setloading(false);
      }
    }
    getCategoryData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.quantity || !form.unitprice || !form.category) {
        Swal.fire({
          title: "Field Error",
          text: "Please fill all required fields.",
          icon: "error",
        });
        return;
      }

      if (form.quantity < 0 || form.unitprice < 0) {
        Swal.fire({
          title: "Invalid Input",
          text: "Quantity and Unit Price cannot be negative.",
          icon: "error",
        });
        return;
      }

      const response = await axiosInstance.post(
        "/api/grocery/insertgrocerydata",
        form
      );

      Swal.fire({
        title: "Success",
        text: "Grocery inventory added successfully!",
        icon: "success",
      });

      setForm({
        name: "",
        quantity: "",
        unitprice: "",
        totalprice: "",
        purchasedate: "",
        expirydate: "",
        category: null,
      });
      setSelectedCategory(null);

      if (Getrole === "Admin") {
        navigate("/grocery_category");
      } else {
        navigate("/hrgrocery_category");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [id]: value };

      if (id === "quantity" || id === "unitprice") {
        const quantity = parseFloat(updatedForm.quantity) || 0;
        const unitprice = parseFloat(updatedForm.unitprice) || 0;
        updatedForm.totalprice = (quantity * unitprice).toFixed(2);
      }

      return updatedForm;
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="SingleForm">
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="form-container">
          <h2 className="text-center">Add Grocery Inventory</h2>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Select Category</label>
                  <Select
                    classNamePrefix="react-select"
                    value={selectedCategory}
                    onChange={(opt) => {
                      setSelectedCategory(opt);
                      setForm((f) => ({ ...f, category: opt?.value || null }));
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
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    className="input-field"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="row" style={{ padding: "20px  0px" }}>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    className="input-field"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Enter Quantity"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="unitprice">Unit Price</label>
                  <input
                    id="unitprice"
                    type="number"
                    min="0"
                    className="input-field"
                    value={form.unitprice}
                    onChange={handleChange}
                    placeholder="Enter Unit Price"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="totalprice">Total Price</label>
                  <input
                    id="totalprice"
                    type="number"
                    className="input-field"
                    value={form.totalprice}
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="purchasedate">Purchase Date</label>
                  <input
                    id="purchasedate"
                    type="date"
                    className="input-field"
                    value={form.purchasedate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="expirydate">Expiry Date</label>
                  <input
                    id="expirydate"
                    type="date"
                    className="input-field"
                    value={form.expirydate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" id="Commonbutton">
                Add Inventory
              </button>
              <button type="button" id="CancelButton" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroceryAddInventory;
