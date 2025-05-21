import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import getSwalTheme from "../../utils/Swaltheme";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import "../../scss/css/SingleForm.css";
const AddMessage = () => {
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const Swal = getSwalTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("1");
  const [allUserIds, setAllUserIds] = useState([]);
  const [layout, setLayout] = useState("default");
  const [bgImage, setBgImage] = useState(null);
  const [loading, setloading] = useState(true);
  const Role = localStorage.getItem("role");

  const logid = localStorage.getItem("id");
  const [logip, setIpAddress] = useState("");
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      } finally {
        setloading(false);
      }
    };
    fetchIpAddress();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get("/api/message/viewoption2");
        const fetchedOptions = response.data.map((option) => ({
          value: option.value,
          label: option.label,
        }));
        setOptions(fetchedOptions);
        const userIds = response.data.map((option) => option.value);
        setAllUserIds(userIds);
      } catch (error) {
        console.error("Error fetching options:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch options. Please try again later.",
        });
      }
    };

    fetchOptions();
  }, []);

  const handleCancel = () => {};
  const handleSelectChange = (selected) => {
    if (selected.some((option) => option.value === "all")) {
      setSelectedOptions([{ value: "all", label: "All" }]);
    } else {
      setSelectedOptions(selected);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Date validation
    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "The start date cannot be later than the end date.",
      });
      return;
    }

    // Image validation
    if (layout === "default" && !image) {
      Swal.fire({
        icon: "error",
        title: "No Image Selected",
        text: "Please upload an image before submitting.",
      });
      return;
    } else if (layout === "custom" && !bgImage) {
      Swal.fire({
        icon: "error",
        title: "No Background Image Selected",
        text: "Please upload a background image before submitting.",
      });
      return;
    }

    // Determine selected user IDs
    let selectedUserIds = [];
    if (selectedOptions.some((option) => option.value === "all")) {
      selectedUserIds = ["all"];
    } else {
      selectedUserIds = selectedOptions.map((option) => String(option.value)); // Ensure IDs are strings
    }

    const dataToSend = {
      title,
      description,
      startDate,
      endDate,
      selectedOptions: selectedUserIds, // Only IDs
      status,
    };

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("status", status);

      // Append selected options as separate entries
      selectedUserIds.forEach((option) => {
        formData.append("selectedOptions[]", option); // Use [] to indicate array
      });

      // Append image based on layout
      if (layout === "default" && image) {
        formData.append("image", image);
      } else if (layout === "custom" && bgImage) {
        formData.append("bgimage", bgImage);
      }

      // Send request
      const response = await axios.post(
        `${import.meta.env.REACT_APP_BASE_URL}/api/message/submitmessage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            logid,
            logip,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Message submitted successfully.",
      });
      if (Role == "Admin") {
        navigate("/managemessage");
      } else if (Role == "HR") {
        navigate("/hrmessagetable");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="SingleForm">
          <div className="form-container">
            <h2 className="text-center">Add Message</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label>Select Layout:</label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                  >
                    <option value="default">Default Layout</option>
                    <option value="custom">Custom Layout</option>
                  </select>
                </div>
              </div>

              {layout === "default" && (
                <>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label htmlFor="title">Add Title:</label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add Title"
                        required
                        className={
                          theme === "dark"
                            ? "input-field dark-theme"
                            : "input-field light-theme"
                        }
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label htmlFor="image">Upload Image:</label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                        className={
                          theme === "dark"
                            ? "input-field dark-theme"
                            : "input-field light-theme"
                        }
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 form-group">
                      <label htmlFor="description">Add Description:</label>
                      <textarea
                        id="description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className={
                          theme === "dark"
                            ? "input-field dark-theme"
                            : "input-field light-theme"
                        }
                        placeholder="Describe your message"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </>
              )}

              {layout === "custom" && (
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="bg-image">Upload Background Image:</label>
                    <input
                      type="file"
                      id="bg-image"
                      accept="image/*"
                      onChange={(e) => setBgImage(e.target.files[0])}
                      required
                      className={
                        theme === "dark"
                          ? "input-field dark-theme"
                          : "input-field light-theme"
                      }
                    />
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="start-date">Select Start Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label htmlFor="end-date">Select End Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 form-group">
                  <label htmlFor="options">Select Options:</label>
                  <Select
                    id="SelectOption"
                    options={[{ value: "all", label: "All" }, ...options]}
                    onChange={handleSelectChange}
                    isMulti
                    value={selectedOptions}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: theme === "dark" ? "#2C353D" : "#fff",
                        color: theme === "dark" ? "#fff" : "#000",
                        border:
                          theme === "dark"
                            ? "1px solid #666"
                            : "1px solid #ccc",
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
                            theme === "dark" ? "black" : "#f0f0f0",
                        },
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className={
                      theme === "dark"
                        ? "input-field dark-theme"
                        : "input-field light-theme"
                    }
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" id="Commonbutton">
                  Add Message
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

export default AddMessage;
