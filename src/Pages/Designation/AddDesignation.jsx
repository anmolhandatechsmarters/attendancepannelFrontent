import React, { useState, useEffect } from "react";
import axios from "axios";
import getSwalTheme from "../../utils/Swaltheme";
import { useSelector } from "react-redux";
import "../../scss/css/ADDDepartment&Designation.css";
import "../../scss/css/button.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import { motion } from "framer-motion";
const AddDesignation = () => {
  const Swal = getSwalTheme();
  const [loading, setloading] = useState(false);
  const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");
  const [newDesignation, setNewDepartment] = useState("");
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const Role = localStorage.getItem("role");

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/admin/adddesignation`,
        { name: newDesignation, logip, logid },
        {}
      );
      setNewDepartment("");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message || "Designation added successfully!",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        console.log(Role);
        if (Role == "Admin") {
          navigate("/alldesignation");
        } else if (Role == "HR") {
          navigate("/hrdesignation");
        }
      }, 2000);
    } catch (error) {
      console.error("Error adding designation:", error);
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "Designation already exists.",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Error occurred while adding the designation.",
          confirmButtonText: "Try Again",
        });
      }
    }
  };

  if (loading) {
    return <Spinner />;
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
        <div className="form-container">
          <form onSubmit={handleAddDepartment} className="department-form">
            <div className="form-group">
              <label htmlFor="departmentName">Add New Designation</label>
              <motion.input
                id="departmentName"
                type="text"
                placeholder="Enter Designation Name"
                value={newDesignation}
                onChange={(e) => setNewDepartment(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div className="buttonCenter">
              <motion.button
                type="submit"
                id="Commonbutton"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Designation
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddDesignation;
