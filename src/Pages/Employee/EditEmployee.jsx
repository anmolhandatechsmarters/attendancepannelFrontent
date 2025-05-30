import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getSwalTheme from "../../utils/Swaltheme";
import axiosInstance from "../../components/utils/AxiosIntance";
import { useDropzone } from "react-dropzone";
import Spinner from "../../utils/Spinner";
import { useSelector } from "react-redux";
import "../../scss/css/MultiForm.css";
import "../../scss/css/button.css";
const EditUser = () => {
  const Swal = getSwalTheme();

  const theme = useSelector((state) => state.theme);
  const logip = useSelector((state) => state.ipAddress);
  const userRole = localStorage.getItem("role");
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    empid: "",
    role: "",
    country: "",
    state: "",
    city: "",
    street1: "",
    street2: "",
    status: "",
    department: "",
    designation: "",
    aadharcard: "",
    pancard: "",
    bankaccount: "",
    accountholder: "",
    ifsccode: "",
    roledetail: "",
    date_of_joining: "",
    contact_no: "",
    personal_email: "",
    country_code: "",
    middle_name: "",
    password: "",
    image: null,
  });
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [department, setdepartment] = useState([]);
  const [designation, setdesignation] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setloading] = useState(true);
  const [countryCodes, setcountryCodes] = useState([]);
  const [options, setOptions] = useState({
    roles: ["HR", "Employee"],
    countries: [],
    states: [],
    cities: [],
  });

  const logid = localStorage.getItem("id");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/admin/getuser/${id}`);
        const userData = response.data;
        setUser(userData);

        if (userData.countryDetails.id) {
          await FetchCountryCodeById(userData.countryDetails.id);
          setFormData((prev) => ({
            ...prev,
            country_code: countryCodes[0]?.phoneCode || "",
          }));
        }
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          empid: userData.emp_id,
          role: userData.roleDetails.role,
          country: userData.countryDetails.id,
          state: userData.stateDetails.id,
          city: userData.city,
          street1: userData.street1,
          street2: userData.street2,
          status: userData.status,
          department: userData.department_id,
          designation: userData.designation_id,
          accountholder: userData.account_holder_name,
          aadharcard: userData.aadharcard,
          pancard: userData.pancard,
          bankaccount: userData.bankaccount,
          ifsccode: userData.ifsc_code,
          roledetail: userData.roleDetails.role,
          date_of_joining: userData.date_of_joining,
          contact_no: userData.contact_no,
          personal_email: userData.personal_email,
          middle_name: userData.middle_name,
          password: "#####",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setloading(false);
      }
    };

    const fetchdepartment = async () => {
      try {
        const result = await axiosInstance.get(`/admin/getadmindepartment`, {});
        setdepartment(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchdesignaiton = async () => {
      try {
        const result = await axiosInstance.get(
          `/admin/getadmindesignation`,
          {}
        );
        setdesignation(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get("/admin/country");
        setOptions((prev) => ({
          ...prev,
          countries: response.data,
        }));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    const fetchCountryCode = async () => {
      try {
        const result = await axiosInstance.get(`/admin/getphonecode`);
        setcountryCodes(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCountryCode();
    fetchdepartment();
    fetchdesignaiton();
    fetchCountries();

    fetchUser();
  }, [id]);

  const FetchCountryCodeById = async (id) => {
    try {
      const result = await axiosInstance.get(`/admin/getphonecode/${id}`);
      setcountryCodes(result.data);
      setFormData((prev) => ({
        ...prev,
        country_code: result.data[0].phoneCode,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "pancard" || name === "ifsccode" ? value.toUpperCase() : value,
    }));

    if (name === "country") {
      // Fetch phone codes for the selected country
      await FetchCountryCodeById(value);

      setFormData((prevFormData) => ({
        ...prevFormData,
        state: "",
        city: "",
        // Don't set country_code here - we'll do it after fetching
      }));
    }

    if (name === "state") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        city: "",
      }));
    }

    if (name === "contact_no") {
      // Allow only numeric characters
      const numericValue = value.replace(/[^0-9]/g, "");

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
      }));
      return; // Prevent further execution for this field
    }
  };

  const steps = ["Personal", "Address", "Role", "KYC", "Bank", "submit"];

  const [currentStep, setCurrentStep] = useState(0);
  const onDrop = useCallback(
    (acceptedFiles) => {
      const imageFile = acceptedFiles[0];
      if (imageFile && imageFile.type.startsWith("image/")) {
        setFormData((prev) => ({
          ...prev,
          image: imageFile,
        }));
      }
    },
    [setFormData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  useEffect(() => {
    const fetchStates = async () => {
      if (formData.country) {
        try {
          const response = await axiosInstance.get(
            `/admin/state/${formData.country}`
          );
          setOptions((prev) => ({
            ...prev,
            states: response.data,
          }));
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      } else {
        setOptions((prev) => ({ ...prev, states: [] }));
      }
    };

    fetchStates();
  }, [formData.country]);

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.state) {
        try {
          const response = await axiosInstance.get(
            `/admin/city/${formData.state}`
          );
          setOptions((prev) => ({
            ...prev,
            cities: response.data,
          }));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      } else {
        setOptions((prev) => ({ ...prev, cities: [] }));
      }
    };

    fetchCities();
  }, [formData.state]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const { pancard, aadharcard, bankaccount, ifsccode } = formData;
    if (pancard) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pancard)) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Invalid PAN card format. It should be in the format: ABCDE1234F.",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // Aadhaar card validation: 12 digits only
    if (aadharcard) {
      const adhaarRegex = /^\d{12}$/;
      if (!adhaarRegex.test(aadharcard)) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Aadhaar card must be a 12-digit number.",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // Bank account validation: Numbers only
    if (bankaccount) {
      const bankAccountRegex = /^\d+$/;
      if (!bankAccountRegex.test(bankaccount)) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Bank account must be a numeric value.",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // Confirm account validation: Check if both match

    // IFSC code validation (Optional)
    if (ifsccode) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifsccode)) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "IFSC code must be in the format: ABCD0123456.",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // Show confirmation alert before submitting the update
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
        const response = await axiosInstance.put(
          `/admin/testupdateuser/${id}`,
          formData,
          {
            params: { logid, logip },
          }
        );

        const newUserId = response.data?.user?.id || response.data?.id;

        if (formData.image && newUserId) {
          const imgForm = new FormData();
          imgForm.append("image", formData.image);

          await axiosInstance.put(`/admin/upload/${newUserId}`, imgForm, {
            params: { logid, logip },
          });
        }

        // Success alert
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: response.data.message || "Employee details updated successfully",
          confirmButtonText: "OK",
        });

        setTimeout(() => {
          if (userRole === "Admin") {
            navigate("/allemployee");
          } else {
            navigate("/hremployeeshow");
          }
        }, 1000);
      } catch (error) {
        console.error("Error updating user:", error);

        // Error alert for email already exists
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.message.includes("Email is already in use.")
        ) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: error.response.data.message || "Email already exists.",
            confirmButtonText: "Try Again",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Failed to update Employee details",
            confirmButtonText: "Try Again",
          });
        }
      }
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

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setFormData((prevFormData) => ({ ...prevFormData, status: newStatus }));
  };

  if (loading) {
    return <Spinner />;
  }
  const profileImageUrl = `${import.meta.env.REACT_APP_BASE_URL}/${user.image}`;

  return (
    <>
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="form-wrapper">
          <div className="step-progress">
            <div className="step-bar" />
            <div className="step-items">
              {steps.map((step, index) => (
                <div className="step-item" key={index}>
                  <div
                    className={`step-circle ${index <= currentStep ? "active" : ""}`}
                  >
                    {index + 1}
                  </div>
                  <div className="step-label">{step}</div>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-connector ${index < currentStep ? "active" : ""}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* ---- */}
          <form onSubmit={handleSubmit} className="user-form">
            {currentStep === 0 && (
              <div>
                <h2 className="mb-4">Personal Detail</h2>

                <div className="row">
                  <div className="col">
                    <label>
                      First Name:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                    />
                  </div>
                  <div className="col">
                    <label>Middle Name:</label>
                    <input
                      type="text"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleChange}
                      placeholder="Enter Middle Name"
                    />
                  </div>
                  <div className="col">
                    <label>
                      Last Name:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <label>
                      Email:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                    />
                  </div>
                  <div className="col">
                    <label>
                      Password:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onClick={handlePasswordClick}
                      onChange={handleChange}
                      placeholder="Enter Password"
                      readOnly={!isPasswordEditable}
                    />
                  </div>
                  <div className="col">
                    <label>Employee Id:</label>
                    <input
                      type="text"
                      name="empId"
                      value={formData.empid}
                      onChange={handleChange}
                      placeholder="Enter Employee Id"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <label>Date Of Joining:</label>
                    <input
                      type="date"
                      name="date_of_joining"
                      value={formData.date_of_joining}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <label>Contact Number:</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <select
                        name="country_code"
                        value={formData.country_code}
                        onChange={handleChange}
                        style={{ maxWidth: "100px" }}
                      >
                        {countryCodes.map((item, index) => (
                          <option key={index} value={item.id}>
                            +{item.phoneCode}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="contact_no"
                        value={formData.contact_no}
                        onChange={handleChange}
                        pattern="^[0-9]{7,15}$"
                        inputMode="numeric"
                        placeholder="Contact Number"
                        maxLength="15"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label>Personal Email:</label>
                    <input
                      type="email"
                      name="personal_email"
                      value={formData.personal_email}
                      onChange={handleChange}
                      placeholder="Enter Personal Email"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <label>Profile Image:</label>
                    <div
                      {...getRootProps()}
                      style={{
                        border: `2px dashed ${theme === "dark"  ? "#555" : "#ccc"}`,
                        padding: "24px",
                        textAlign: "center",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.3s, border-color 0.3s",
                        width: "100%",
                      }}
                    >
                      <input {...getInputProps()} />
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          style={{
                            display: "block",
                            maxHeight: "240px",
                            maxWidth: "100%",
                            objectFit: "contain",
                            margin: "0 auto",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <p
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {isDragActive
                            ? "Drop the image here..."
                            : "Drag & drop an image here, or click to select"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <label>Show Activity</label>
                    <select value={status} onChange={handleStatusChange}>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h2 className="mb-4">Address</h2>

                <div className="row">
                  {/* Country */}
                  <div className="col">
                    <label>
                      Country:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select a country</option>
                      {options.countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="col">
                    <label>
                      State:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="">Select a state</option>
                      {options.states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="col">
                    <label>
                      City:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option value="">Select a city</option>
                      {options.cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>Street 1:</label>
                      <input
                        type="text"
                        name="street1"
                        value={formData.street1}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter Street 1"
                      />
                    </div>
                    <div className="col">
                      <label>Street 2:</label>
                      <input
                        type="text"
                        name="street2"
                        value={formData.street2}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter Street 2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="mb-4">Role & Department</h2>

                <div className="row">
                  {/* Role */}
                  <div className="col">
                    <label>
                      Role:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="">Select a role</option>
                      {options.roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div className="col">
                    <label>
                      Department:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select a department</option>
                      {department.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Designation */}
                  <div className="col">
                    <label>
                      Designation:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    >
                      <option value="">Select a designation</option>
                      {designation.map((desig) => (
                        <option key={desig.id} value={desig.id}>
                          {desig.designation_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="mb-4">KYC Details</h2>
                <div className="row">
                  <div className="col">
                    <label>
                      Aadhar Card
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="aadharcard"
                      value={formData.aadharcard}
                      onChange={handleChange}
                      maxLength="12"
                      placeholder="Enter Aadhar Card Number"
                      title="Aadhar Card Must be a 12 digit valid number"
                    />
                  </div>

                  <div className="col">
                    <label>
                      PAN Card
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="pancard"
                      value={formData.pancard}
                      onChange={handleChange}
                      minLength="10"
                      maxLength="10"
                      placeholder="Enter PAN Card Number"
                      title="PAN card should be in the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="mb-4">Bank Details</h2>
                <div className="row">
                  <div className="col">
                    <label>
                      Bank Account Number
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="bankaccount"
                      placeholder="Enter Bank Account Number"
                      value={formData.bankaccount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <label>
                      IFSC Code
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="ifsccode"
                      value={formData.ifsccode}
                      onChange={handleChange}
                      placeholder="Enter IFSC Code"
                    />
                  </div>

                  <div className="col">
                    <label>
                      Account Holder Name
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name="accountholder"
                      placeholder="Enter Account Holder Name"
                      value={formData.accountholder}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="button-container">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  id="Commonbutton"
                >
                  Back
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                   id="Commonbutton"
                >
                  Next
                </button>
              ) : (
                <button type="submit"   id="Commonbutton">Edit User</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ------------------------------------------------------------------------------------- */}
    </>
  );
};

export default EditUser;
