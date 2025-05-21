import React, { useState, useEffect } from "react";
import axios from "axios";
import getSwalTheme from "../../../utils/Swaltheme";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
import "../../../scss/css/ADDDepartment&Designation.css";
import { useSelector } from "react-redux";

const DepartmentAdd = () => {
  const theme = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(true);
  const [logip, setIpAddress] = useState("");
  const [newCategory, setNewCategory] = useState(""); // Renamed to 'newCategory' for consistency
  const [message, setMessage] = useState(""); // Optional: to display success/error messages
  const navigate = useNavigate();
  const Swal = getSwalTheme();
  const role = localStorage.getItem("role");

  const logid = localStorage.getItem("id");
  useEffect(() => {
    // Fetch the IP address to send with the request
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIpAddress();
  }, []);

  useEffect(() => {
    const theme =
      localStorage.getItem("coreui-free-react-admin-template-theme") || "light";
    document.body.classList.toggle("dark", theme === "dark");
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/api/inventory/insertcategory",
        {
          category_name: newCategory, // Using 'newCategory' instead of 'newDepartment'
          logip,
          logid,
        }
      );
      setNewCategory(""); // Reset the input field after successful submission

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message || "Category added successfully!",
        confirmButtonText: "OK",
      });

      // Redirect to another page (e.g., category list page)
      setTimeout(() => {
        if (role === "Admin") {
          navigate("/category");
        } else {
          navigate("/hrcategory");
        } // Navigate to the category list page after adding
      }, 2000);
    } catch (error) {
      console.error("Error adding category:", error);
      if (
        error.response &&
        error.response.data.message === "Category already exists"
      ) {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "Category already exists.",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Error occurred while adding the category.",
          confirmButtonText: "Try Again",
        });
      }
    }
  };

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);
  // Show loading spinner while fetching the IP address
  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div
      id="AddDepartementDesignation"
      className={theme === "dark" ? "dark-theme" : "light-theme"}
    >
      <motion.div
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleAddCategory}>
          <div className="form-group">
            <label htmlFor="departmentName">Add New Category</label>
            <motion.input
              id="categoryName"
              type="text"
              placeholder="Enter Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              className="form-input"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div className="buttonCenter">
            <motion.button
              type="submit"
              className="add-button"
              id="Commonbutton"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Add Category
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>

    // ===================================

    // ====================================================================
  );
};

export default DepartmentAdd;
