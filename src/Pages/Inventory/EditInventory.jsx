import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import getSwalTheme from "../../utils/Swaltheme";
import Spinner from "../../utils/Spinner";
import axiosInstance from "../../../src/components/utils/AxiosIntance";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import "../../scss/css/SingleForm.css"
const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const Swal = getSwalTheme();
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
  const [logip, setIpAddress] = useState("");

  const logid = localStorage.getItem("id");
  const getrole = localStorage.getItem("role");

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(res.data.ip);
      } catch (err) {
        console.error("IP fetch failed", err);
      }
    };
    fetchIpAddress();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/inventory/getcategorydataselect"
        );
        const options = res.data.data.map((item) => ({
          value: item.id,
          label: item.category_name,
        }));
        setCategoryOptions(options);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/inventory/geteditInventoryData/${id}`
        );
        const data = res.data.data;
        setTitle(data.name);
        setDescription(data.description);
        setStartDate(data.purchase_date);
        setEndDate(data.expiry_date);
        setQuantity(data.quantity);
        setBrandName(data.brand_name);
        setSelectedCategory({
          value: data.Category.id,
          label: data.Category.category_name,
        });
      } catch (err) {
        Swal.fire("Error", "Failed to load inventory data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [id]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      Swal.fire("Error", "Please select a category.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("category", selectedCategory.value);
    formData.append("purchase_date", startDate);
    formData.append("expiry_date", endDate);
    formData.append("brand_name", brandName);
    formData.append("quantity", parseInt(quantity));

    images.forEach((image) => {
      formData.append("product_images", image);
    });

    try {
      const res = await axiosInstance.put(
        `/api/inventory/editInventoryData/${id}`,
        formData,
        {
          params: { logid, logip },
        }
      );

      if (res.status === 200) {
        Swal.fire("Success", "Inventory item updated successfully.", "success");
        navigate(getrole === "Admin" ? "/inventory" : "/hrinventory");
      } else {
        Swal.fire("Error", "Failed to update inventory item.", "error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire("Error", "Failed to update inventory item.", "error");
    }
  };

  const handleCancel = () => {
    navigate(getrole === "Admin" ? "/inventory" : "/hrinventory");
  };

  if (loading) return <Spinner />;

  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <motion.div
      
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="SingleForm">
          <div className="form-container">
            <h2 className="text-center">Edit Inventory</h2>
            <form onSubmit={handleSubmit}>
              {/* Category and Title */}
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
                        zIndex: 999,
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: theme === "dark" ? "#fff" : "#000",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? theme === "dark"
                            ? "#666"
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
                  <label htmlFor="title">Name:</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Name"
                    className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                    required
                  />
                </div>
              </div>

              {/* Quantity and Brand */}
              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                    placeholder="Enter Quantity"
                    required
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label htmlFor="brand-name">Brand Name:</label>
                  <input
                    type="text"
                    id="brand-name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                    placeholder="Enter Brand Name"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="row">
                <div className="col-md-12 form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                    placeholder="Enter Description"
                    required
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Images and Dates */}
              <div className="row">
                <div className="col-md-4 form-group">
                  <label htmlFor="images">Upload Images:</label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                  />
                </div>

                <div className="col-md-4 form-group">
                  <label htmlFor="start-date">Purchase Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                  />
                </div>

                <div className="col-md-4 form-group">
                  <label htmlFor="end-date">Expiry Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`input-field ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="button-group">
                <button type="submit" id="Commonbutton">
                  Update Inventory
                </button>
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

export default EditInventory;
