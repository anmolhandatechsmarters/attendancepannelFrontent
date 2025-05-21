import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import getSwalTheme from "../../utils/Swaltheme";
import axiosInstance from "../../components/utils/AxiosIntance";
import Spinner from "../../utils/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
const EditMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const Swal = getSwalTheme()
  const theme = useSelector((state) => state.theme);
  const [loading, setloading] = useState(true);
  const logid = localStorage.getItem("id");
  const [logip, setIpAddress] = useState("");
  const Role = localStorage.getItem("role");
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("1");
  const [layout, setLayout] = useState("default");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get("/api/message/viewoption");
        const fetchedOptions = response.data.map((option) => ({
          value: option.value,
          label: option.label,
        }));
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch options. Please try again later.",
        });
      } finally {
        setloading(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_BASE_URL}/api/message/fetchmessage/${id}`
        );
        const {
          title,
          description,
          startDate,
          endDate,
          status,
          selectedOptions,
        } = response.data;

        setTitle(title || "");
        setDescription(description || "");
        setStartDate(startDate);
        setEndDate(endDate);
        setStatus(status);

        const optionsToSet = selectedOptions || [];
        setSelectedOptions(
          optionsToSet.map((option) => ({ value: option, label: option }))
        );
      } catch (error) {
        console.error("Error fetching message:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch message data. Please try again later.",
        });
      }
    };

    fetchMessageData();
  }, [id]);

  const handleSelectChange = (selected) => {
    if (selected.some((option) => option.value === "all")) {
      setSelectedOptions([{ value: "all", label: "All" }]);
    } else {
      setSelectedOptions(selected);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "The start date cannot be later than the end date.",
      });
      return;
    }

    let selectedUserIds = selectedOptions.some(
      (option) => option.value === "all"
    )
      ? ["all"]
      : selectedOptions.map((option) => String(option.value));

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("status", status);

    selectedUserIds.forEach((option) => {
      formData.append("selectedOptions[]", option);
    });

    if (layout === "default" && image) {
      formData.append("image", image);
    } else if (layout === "custom" && bgImage) {
      formData.append("bgimage", bgImage);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.REACT_APP_BASE_URL}/api/message/geteditmessage/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: { logip, logid },
        }
      );
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Message updated successfully.",
      });
      if (Role == "Admin") {
        navigate("/managemessage");
      } else if (Role == "HR") {
        navigate("/hrmessagetable");
      }
    } catch (error) {
      console.error("Error updating data:", error);
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

  const handleCancel = () => {};
  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="SingleForm">
          <div className="form-container">
            <h2 className="text-center">Edit Message</h2>

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
                      <label htmlFor="title">Edit Title:</label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Edit Title"
                        required
                        className={
                          theme === "dark"
                            ? "input-field dark-theme"
                            : "input-field light-theme"
                        }
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label htmlFor="image">Upload New Image:</label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
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
                      <label htmlFor="description">Edit Description:</label>
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
                    <label htmlFor="bg-image">
                      Upload New Background Image:
                    </label>
                    <input
                      type="file"
                      id="bg-image"
                      accept="image/*"
                      onChange={(e) => setBgImage(e.target.files[0])}
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
                            ? "#444"
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
                  Update Message
                </button>
                <button type="button"  id="CancelButton" onClick={() => navigate(-1)}>
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

export default EditMessage;
