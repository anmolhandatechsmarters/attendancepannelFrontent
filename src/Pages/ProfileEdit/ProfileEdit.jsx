import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import getSwalTheme from "../../utils/Swaltheme";
import { FaCamera } from "react-icons/fa";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import "./profileedit.css";
const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [logip, setIpAddress] = useState("");
  const logid = localStorage.getItem("id");
  const fileInputRef = useRef(null);
const Swal = getSwalTheme()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    city: "",
    street1: "",
    street2: "",
    password: "",
  });
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/user/getuserprofile/${id}`, {
          params: { logid, logip },
        });
        const userData = response.data[0];
        setUser(userData);
        console.log(userData);
        setImage(userData.image);
        setFormData({
          firstName: userData.first_name,
          lastName: userData.last_name,
          country: userData.country,
          state: userData.state,
          city: userData.city,
          street1: userData.street1,
          street2: userData.street2,
          password: "#####",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id, logid, logip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "country") {
      const filteredStates = statesData.states.filter(
        (state) => state.country_id === value
      );
      setOptions((prevOptions) => ({
        ...prevOptions,
        states: filteredStates,
        cities: [],
      }));
      setFormData((prevFormData) => ({ ...prevFormData, state: "", city: "" }));
    }

    if (name === "state") {
      const filteredCities = citiesData.cities.filter(
        (city) => city.state_id === value
      );
      setOptions((prevOptions) => ({
        ...prevOptions,
        cities: filteredCities,
      }));
      setFormData((prevFormData) => ({ ...prevFormData, city: "" }));
    }
  };

  //updateUser

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { value: confirm } = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the Employee details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });
    if (confirm) {
      try {
        await axiosInstance.put(`/admin/editprofileofuser/${id}`, formData, {
          params: { logid, logip },
        });
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Employee details updated successfully",
          confirmButtonText: "OK",
        });
        navigate("/dashboard");
      } catch (error) {
        console.error("Error updating Employee:", error);
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Failed to update Employee details",
          confirmButtonText: "Try Again",
        });
      }
    }
  };
  const profileImageSrc = `${import.meta.env.REACT_APP_BASE_URL}/${user?.image}`;
  if (!user) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      try {
        const formData = new FormData();
        formData.append("image", file);
        await axiosInstance.put(`/admin/upload/${user.id}`, formData, {
          params: { logid, logip },
        });
        const result = await axiosInstance.get(`/user/getuserprofile/${id}`, {
          params: { logid, logip },
        });
        setUser(result.data[0]);
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePasswordClick = async () => {
    if (!isPasswordEditable) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to edit the password?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, edit it!",
        cancelButtonText: "No, keep it hidden",
      });

      if (result.isConfirmed) {
        setIsPasswordEditable(true);
        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
      }
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <div className="profile-image-container">
        <label className="image-upload-label" onClick={handleCameraClick}>
          {image ? (
            <img
              src={profileImageSrc}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <FaCamera className="camera-icon" />
          )}
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="image-upload-input"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="row">
          <div className="form-group col-md-6">
            <label>Employee ID:</label>
            <p>{user.emp_id}</p>
          </div>
          <div className="form-group col-md-6">
            <label>Role:</label>
            <p>{user.role}</p>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label>Department:</label>
            <p>{user.department}</p>
          </div>
          <div className="form-group col-md-6">
            <label>Designation:</label>
            <p>{user.designation}</p>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group col-md-6">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label>Street 1:</label>
            <input
              type="text"
              name="street1"
              value={formData.street1}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group col-md-6">
            <label>Street 2:</label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onClick={handlePasswordClick}
            onChange={handleChange}
            placeholder="Enter Password"
            readOnly={!isPasswordEditable}
            className="form-control"
          />
        </div>

        <button type="submit" className="submit-button w-100 mt-3">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
