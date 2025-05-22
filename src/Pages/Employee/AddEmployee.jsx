import { useState, useEffect, useCallback } from "react";
import countriesData from "../../scss/countries.json";
import statesData from "../../scss/states.json";
import citiesData from "../../scss/cities.json";
import getSwalTheme from "../../utils/Swaltheme";
import axiosInstance from "../../components/utils/AxiosIntance";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import "../../scss/css/MultiForm.css";
import "../../scss/css/button.css";
const Register = () => {
  const theme = useSelector((state) => state.theme);
  const Swal = getSwalTheme();

  const roles = localStorage.getItem("role");
  const defaultcountry = "101";

  const logid = localStorage.getItem("id");
  const logip = useSelector((state) => state.ipAddress);
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [getip, setgetip] = useState("");
  const [status, setStatus] = useState("1");
  const [countryCodes, setcountryCodes] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "",
    country: defaultcountry,
    state: "",
    city: "",
    street1: "",
    street2: "",
    department: "",
    designation: "",
    user_agent: navigator.userAgent,
    ip: logip,
    id: id,
    status: status,
    created_by: roles,
    aadharcard: "",
    pancard: "",
    bankaccount: "",
    confirmaccount: "",
    ifsccode: "",
    accountholder: "",
    date_of_joining: "",
    contact_no: "",
    personal_email: "",
    country_code: "91",
    middle_name: "",
    image: null,
  });

  const [options, setOptions] = useState({
    roles: ["HR", "Employee"],
    countries: [],
    states: [],
    cities: [],
  });

  const [department, setdepartment] = useState([]);
  const [designation, setdesignation] = useState([]);

  // drag and drop image
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const steps = [
    "Personal",
    "Contact",
    "Address",
    "Role",
    "KYC",
    "Bank",
    "submit",
  ];

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

    const fetchCountryCode = async () => {
      try {
        const result = await axiosInstance.get(`/admin/getphonecode`);

        setcountryCodes(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdepartment();
    fetchdesignaiton();
    fetchCountryCode();
    FetchCountryCodeById(formData.country);
  }, []);

  const FetchCountryCodeById = async (id) => {
    try {
      const result = await axiosInstance.get(`/admin/getphonecode/${id}`);
      console.log("countrycode", result.data[0].phoneCode);
      setcountryCodes(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (Array.isArray(countriesData.countries)) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        countries: countriesData.countries,
      }));
    } else {
      console.error("Countries data is not an array:", countriesData.countries);
    }

    if (Array.isArray(statesData.states)) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        states: statesData.states,
      }));
    } else {
      console.error("States data is not an array:", statesData.states);
    }

    if (Array.isArray(citiesData.cities)) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        cities: citiesData.cities,
      }));
    } else {
      console.error("Cities data is not an array:", citiesData.cities);
    }
  }, []);

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setFormData((prevFormData) => ({ ...prevFormData, status: newStatus })); // Update formData status
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    // Handle country change: Filter states based on selected country
    if (name === "country") {
      const filteredStates = statesData.states.filter(
        (state) => state.country_id === value
      );
      setOptions((prevOptions) => ({
        ...prevOptions,
        states: filteredStates,
        cities: [], // Clear cities when country is changed
      }));
      FetchCountryCodeById(value);
      setFormData((prevFormData) => ({ ...prevFormData, state: "", city: "" }));
    }

    // Handle state change: Filter cities based on selected state
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

    // Handle PAN card number change: Convert to uppercase and validate format
    if (name === "pancard") {
      const uppercasedValue = value.toUpperCase(); // Ensure uppercase
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: uppercasedValue,
      }));

      // Optionally validate PAN card format (e.g., ABCDE1234F)
      const panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (
        !panCardPattern.test(uppercasedValue) &&
        uppercasedValue.length === 10
      ) {
        // Add logic to handle invalid PAN card format, e.g., show an error message
      }
    }
    if (name === "aadharcard") {
      // Ensure the value consists only of numbers
      const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      const formattedValue = numericValue.slice(0, 12); // Limit to 12 digits

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedValue,
      }));

      // Optionally, validate Aadhar format (12 digits)
      if (formattedValue.length === 12 && !/^\d{12}$/.test(formattedValue)) {
        // Add logic to handle invalid Aadhar format, e.g., show an error message
      }
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
    // Handle IFSC code change: Convert to uppercase and validate format
    if (name === "ifsccode") {
      const uppercasedValue = value.toUpperCase(); // Ensure uppercase
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: uppercasedValue,
      }));

      // Validate IFSC code format (e.g., SBIN0001234)
      const ifscPattern = /^[A-Za-z]{4}[0-9]{7}$/;
      if (!ifscPattern.test(uppercasedValue) && uppercasedValue.length === 11) {
        // Add logic to handle invalid IFSC code format, e.g., show an error message
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      pancard,
      aadharcard,
      bankaccount,
      confirmaccount,
      ifsccode,
      date_of_joining,
    } = formData;

    if (date_of_joining) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pancard)) {
        Swal.fire({
          icon: "error",
          title: "Required Field",
          text: "Please Fill the Date of Joining",
          confirmButtonText: "OK",
        });
        return;
      }
    }
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

    if (bankaccount !== confirmaccount) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Bank account and confirm account do not match.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (ifsccode) {
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsccode)) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "IFSC code must be in the format: ABCD0123456.",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    try {
      const result = await axiosInstance.post(`/admin/adduser`, formData, {
        params: { logip },
      });

      // console.log("formdata", formData);
      const newUserId = result.data?.user?.id || result.data?.id;

      if (formData.image && newUserId) {
        const imgForm = new FormData();
        imgForm.append("image", formData.image);

        await axiosInstance.put(`/admin/upload/${newUserId}`, imgForm, {
          params: { logid, logip },
        });
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: result.data.message || "User added successfully!",
        confirmButtonText: "OK",
      });

      // console.log(result);

      setTimeout(() => {
        if (roles === "Admin") {
          navigate("/alluser");
        } else {
          navigate("/hremployeeshow");
        }
      }, 1000);
    } catch (error) {
      console.error("Error submitting form", error);

      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text:
            error.response.data.message ||
            "Error occurred while adding the user.",
          confirmButtonText: "Try Again",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Error occurred while adding the user.",
          confirmButtonText: "Try Again",
        });
      }
    }
  };
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="form-wrapper">
          <h1 className="form-title">Add User</h1>

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

          <form onSubmit={handleSubmit} className="user-form">
            {currentStep === 0 && (
              <div>
                <h2>Personal Detail</h2>
                <div className="row">
                  <div className="col">
                    <label>
                      First Name:<sup className="required">*</sup>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
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
                      Last Name:<sup className="required">*</sup>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter Last Name"
                    />
                  </div>
                </div>
                <div className="row">
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
                      required
                      placeholder="Enter Email"
                    />
                  </div>
                  <div className="col">
                    <label>
                      Password:
                      <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter Password"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="col">
                    <label>Date Of Joining</label>
                    <sup className="required">*</sup>
                    <input
                      type="Date"
                      name="date_of_joining"
                      value={formData.date_of_joining}
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className="col">
                <label>Role:<sup style={{ color: "red", marginLeft: "5px" }}>*</sup></label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a role</option>
                    {options.roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div> */}
                </div>

                <div className="row">
                  <label>Profile Image</label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      {...getRootProps()}
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.3s, border-color 0.3s",
                        width: "100%",
                        border:
                          theme === "dark"
                            ? "2px dashed #555"
                            : "2px dashed #ccc",
                        background: theme === "dark" ? "#1f1f1f" : "#f9f9f9",
                        color: theme === "dark" ? "#eee" : "#333",
                      }}
                    >
                      <input {...getInputProps()} />
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          style={{
                            display: "block",
                            border:
                              theme === "dark"
                                ? "2px solid #888"
                                : "2px solid #000",
                            maxHeight: "240px",
                            maxWidth: "100%",
                            objectFit: "contain",
                            margin: "0 auto",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "14px" }}>
                          {isDragActive
                            ? "Drop the image here..."
                            : "Drag & drop an image here, or click to select"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h2>Contact Info</h2>
                <div className="row">
                  <div className="row">
                    <div className="col">
                      <label>Contact Number</label>

                      <div style={{ display: "flex", gap: "10px" }}>
                        {/* Country Code Dropdown */}
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

                        {/* Contact Number Field */}
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
                      <label>
                        Personal Email
                        <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                      </label>
                      <input
                        type="email"
                        name="personal_email"
                        value={formData.personal_email}
                        onChange={handleChange}
                        placeholder="Personal Email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h2>Address</h2>
                <div className="row">
                  {" "}
                  <div className="row">
                    <div className="row">
                      <div className="col">
                        <label>
                          Country:
                          <sup style={{ color: "red", marginLeft: "5px" }}>
                            *
                          </sup>
                        </label>
                        <select
                          className="selectcolor"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a country</option>
                          {options.countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <label>
                          State:
                          <sup style={{ color: "red", marginLeft: "5px" }}>
                            *
                          </sup>
                        </label>
                        <select
                          className="selectcolor"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        >
                          <option value="">Select a state</option>
                          {options.states
                            .filter(
                              (state) => state.country_id === formData.country
                            )
                            .map((state) => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>
                          City:
                          <sup style={{ color: "red", marginLeft: "5px" }}>
                            *
                          </sup>
                        </label>
                        <select
                          className="selectcolor"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        >
                          <option value="">Select a city</option>
                          {options.cities
                            .filter((city) => city.state_id === formData.state)
                            .map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col">
                        <label>
                          Street 1:
                          <sup style={{ color: "red", marginLeft: "5px" }}>
                            *
                          </sup>
                        </label>
                        <input
                          type="text"
                          name="street1"
                          value={formData.street1}
                          onChange={handleChange}
                          required
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
                          placeholder="Enter Street 2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2>Role && Department</h2>
                <div className="row">
                  {" "}
                  <div className="row">
                    <div className="col">
                      <label>
                        Role:
                        <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                      </label>
                      <select
                        className="selectcolor"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a role</option>
                        {options.roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col">
                      <label>
                        Department:
                        <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                      </label>
                      <select
                        className="selectcolor"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a department</option>
                        {department.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.department_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label>
                        Designation:
                        <sup style={{ color: "red", marginLeft: "5px" }}>*</sup>
                      </label>
                      <select
                        className="selectcolor"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a designation</option>
                        {designation.map((designation) => (
                          <option key={designation.id} value={designation.id}>
                            {designation.designation_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2>KYC Details</h2>
                <div className="row">
                  {" "}
                  <div className="row">
                    <div className="col">
                      <label>Aadhar Card</label>
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
                      <label>PAN Card</label>
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
              </div>
            )}
            {currentStep === 5 && (
              <div>
                <h2>Bank Details</h2>
                <div className="row">
                  <div className="row">
                    <div className="col">
                      <label>Bank Account Number</label>
                      <input
                        type="text"
                        name="bankaccount"
                        placeholder="Enter Bank Account Number"
                        value={formData.bankaccount}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <label>Confirm Account Number</label>
                      <input
                        type="text"
                        name="confirmaccount"
                        value={formData.confirmaccount}
                        onChange={handleChange}
                        placeholder="Confirm Bank Account Number"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        name="ifsccode"
                        value={formData.ifsccode}
                        onChange={handleChange}
                        placeholder="Enter IFSC Code"
                      />
                    </div>

                    <div className="col">
                      <label>Account Holder Name</label>
                      <input
                        type="text"
                        name="accountholder"
                        placeholder="Enter Account Holder Name"
                        value={formData.accountholder}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* other detail =========== */}

                  <div className="row">
                    <div className="col">
                      <label>Show Activity</label>
                      <select
                        value={status}
                        onChange={handleStatusChange}
                        className="selectcolor"
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add more steps as needed */}

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
                <button type="submit" id="Commonbutton">
                  Add User
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
