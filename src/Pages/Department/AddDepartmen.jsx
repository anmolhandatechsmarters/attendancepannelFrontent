import React, { useState, useEffect } from "react";

import getSwalTheme from "../../utils/Swaltheme";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import { motion } from "framer-motion";
import "../../scss/css/ADDDepartment&Designation.css"
import "../../scss/css/button.css"
import { useSelector } from "react-redux";
const DepartmentAdd = () => {
  const Role = localStorage.getItem("role")
  const [loading, setloading] = useState(false);
    const theme = useSelector((state) => state.theme);
    const Swal = getSwalTheme()
const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");
  const [newDepartment, setNewDepartment] = useState("");
  const navigate = useNavigate();

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/admin/adddepartment`,
        { name: newDepartment, logip, logid },
        {}
      );
      setNewDepartment("");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message || "Department added successfully!",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        if(Role == "Admin"){
        navigate("/alldepartment");}
        else if(Role == "HR"){
          navigate("/hrdepartment")
        }
      }, 2000);
    } catch (error) {
      console.error("Error adding department:", error);
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "Department already exists.",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Error occurred while adding the department.",
          confirmButtonText: "Try Again",
        });
      }
    }
  };


   useEffect(() => {
      document.body.classList.toggle("dark", theme === "dark");
    }, [theme]);


  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  
  return (
    <div id="AddDepartementDesignation" className={theme === "dark" ? "dark-theme" : "light-theme"}>
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleAddDepartment} >
        <div className="form-group">
          <label htmlFor="departmentName">Add New Department</label>
          <motion.input
            id="departmentName"
            type="text"
            placeholder="Enter Department Name"
            value={newDepartment}
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
          Add Department
        </motion.button>
        </div>
      </form>
    </motion.div>
    </div>
  );
};

export default DepartmentAdd;
