import React, { useState, useEffect } from 'react';
import getSwalTheme from '../../utils/Swaltheme';
import "./Css/AddStockCategory.css"
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../components/utils/AxiosIntance';
import Spinner from '../../views/notifications/ForgetPasswordlogin/Spinner';

const DepartmentAdd = () => {
  const [loading, setLoading] = useState(false);
  const role=localStorage.getItem("role")
  const [newCategory, setNewCategory] = useState(''); 
  const [message, setMessage] = useState(''); 
  const Swal = getSwalTheme()
  const navigate = useNavigate();
const logip = useSelector((state) => state.ipAddress);
  const logid = localStorage.getItem("id");




  useEffect(() => {
    const theme = localStorage.getItem('coreui-free-react-admin-template-theme') || 'light';
    document.body.classList.toggle('dark', theme === 'dark');
  }, []);


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
    <div className="departmentadd-admin">
      <div className="form-container">
        <form onSubmit={handleAddCategory} className="department-form">
          <div className="form-group">
            <label htmlFor="categoryName">Add New Category</label>
            <input
              id="categoryName"
              type="text"
              placeholder="Enter Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="add-button">Add</button>
        </form>
      </div>
    </div>
  );
};

export default DepartmentAdd;