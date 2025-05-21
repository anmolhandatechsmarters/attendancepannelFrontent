import{ useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import getSwalTheme from "../../utils/Swaltheme";
import Spinner from "../../utils/Spinner";

import axiosInstance from "../../../src/components/utils/AxiosIntance";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion"
import "../../scss/css/SingleForm.css"
import { useSelector } from "react-redux";
const AddInventory = () => {
  const theme = useSelector((state) => state.theme);
  const Swal = getSwalTheme()
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

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

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const darkmode = localStorage.getItem(
      "coreui-free-react-admin-template-theme"
    );
    setIsDarkMode(darkmode === "dark");
  }, []);

  useEffect(() => {
    // Fetch categories for the Select dropdown
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/inventory/getcategorydataselect"
        );
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.category_name,
        }));
        setCategoryOptions(data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Handle multiple file selection
    setImages(selectedFiles);
  };


  const handleCancel=()=>{

  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate category selection
    if (!selectedCategory) {
      Swal.fire("Error", "Please select a category.", "error");
      return;
    }

    // Validate quantity
    if (quantity < 0) {
      Swal.fire("Error", "Quantity cannot be negative.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("category", selectedCategory.value);
    formData.append("purchase_date", startDate);
    formData.append("expiry_date", endDate);
    formData.append("brand_name", brandName);
    formData.append("quantity", quantity);
    formData.append("logip", logip);
    formData.append("logid", logid);

    // Append multiple images
    images.forEach((image) => {
      formData.append("product_images", image);
    });

    try {
      const response = await axiosInstance.post(
        "/api/inventory/postinventorydata",
        formData
      );
      Swal.fire("Success", "Inventory item added successfully.", "success");

      // Navigate to the appropriate inventory page based on the role
      if (role === "Admin") {
        navigate("/inventory");
      } else {
        navigate("/hrinventory");
      }
    } catch (error) {
      console.error("Error submitting inventory:", error);
      Swal.fire("Error", "Failed to add inventory item.", "error");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <motion.div
        className="employee-leave"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="SingleForm">
          <div className="form-container">
            <h2 className="text-center">Add Inventory</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label>Select Category:</label>
                  <Select
                    classNamePrefix="react-select"
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categoryOptions}
                    placeholder="Select Category"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        padding:"4px",
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

                <div className="col-md-6 form-group">
                  <label htmlFor="name-addinventory">Name:</label>
                  <input
                    type="text"
                    id="name-addinventory"
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Name"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="0"
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter Quantity"
                    required
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label htmlFor="brand-name">Brand Name:</label>
                  <input
                    type="text"
                    id="brand-name"
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter Brand Name"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    rows="4"
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter Description"
                    required
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 form-group">
                  <label htmlFor="images">Upload Images:</label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                    onChange={handleImageChange}
                  />
                </div>

                <div className="col-md-4 form-group">
                  <label htmlFor="start-date">Purchase Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="col-md-4 form-group">
                  <label htmlFor="end-date">Expiry Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>


              <div className="button-group">
                <button type="submit" id="Commonbutton">Add Inventory</button>
                <button type="button" id="CancelButton" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddInventory;
