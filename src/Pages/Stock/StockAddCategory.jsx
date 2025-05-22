import React, { useState, useEffect } from 'react';
import getSwalTheme from '../../utils/Swaltheme';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../components/utils/AxiosIntance';
import Spinner from '../../utils/Spinner';
import { useSelector } from 'react-redux';
import {motion} from "framer-motion"
import "../../scss/css/ADDDepartment&Designation.css"
const DepartmentAdd = () => {
  const [loading, setLoading] = useState(false);
    const theme = useSelector((state) => state.theme);
  const role=localStorage.getItem("role")
  const [newCategory, setNewCategory] = useState(''); 
  const [message, setMessage] = useState(''); 
  const Swal = getSwalTheme()
  const navigate = useNavigate();
const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");






  const handleAddCategory = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axiosInstance.post('/api/grocery/insertstockcategorydata', { 
        category_name: newCategory, 
        logip,logid
      });
      setNewCategory('');

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'Category added successfully!',
        confirmButtonText: 'OK',
      });

      setTimeout(() => {
        if(role==="Admin"){
        navigate("/stock_category");
        }
        else{
          navigate("/hrstock_category");
        } 
      }, 2000);
    } catch (error) {
      console.error("Error adding category:", error);
      if (error.response && error.response.data.message === 'Category already exists') {
        Swal.fire({
          icon: 'warning',
          title: 'Warning!',
          text: 'Category already exists.',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Error occurred while adding the category.',
          confirmButtonText: 'Try Again',
        });
      }
    }
  };


  if (loading) {
    return <div><Spinner /></div>;
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
        <form onSubmit={handleAddCategory} className={theme === "dark" ? "dark-theme" : "light-theme"}>
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
  );
};

export default DepartmentAdd;