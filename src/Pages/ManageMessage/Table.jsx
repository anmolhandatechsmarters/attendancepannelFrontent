import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/utils/AxiosIntance";
import { MdDelete, MdEdit, MdHelp } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import getSwalTheme from "../../utils/Swaltheme";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../../utils/Spinner";
import { ClipLoader } from "react-spinners";
import useIsMobile from "../../scss/vendors/MobileSetting";
import axios from "axios";
const MessageTable = () => {
  const theme = useSelector((state) => state.theme);
  const Swal = getSwalTheme()
  const isMobile = useIsMobile();
  const [limit, setlimit] = useState(10);
  const logid = localStorage.getItem("id");
  const Role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setpage] = useState(1);

  const [messagesPerPage] = useState(10);
  const [total, settotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tableLoading, settableloading] = useState(false);
  const logip = useSelector((state) => state.ipAddress);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        settableloading(true);
        const response = await axiosInstance.get("/api/message/messagetable", {
          params: {
            search: searchTerm,
            startDate,
            endDate,
            status: statusFilter,
            page: page,
            limit,
          },
        });
        // console.log(response.data.messages);
        setMessages(response.data.messages || []);

        settotal(response.data.totalMessages);
        settableloading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
        settableloading(false);
      }
    };

    fetchMessages();
  }, [searchTerm, startDate, endDate, statusFilter, page, limit]);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > total) return;
    setpage(pageNumber);
  };

  const fetchImage = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_BASE_URL}/api/message/viewmessageimage/${id}`
      );
      const { image, bgimage } = response.data;
      Swal.fire({
        title: "Message Image",
        imageUrl: `${import.meta.env.REACT_APP_BASE_URL}/${bgimage || image}`,
        imageAlt: "Message Image",
      });
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleEdit = (id) => {
    if (Role == "Admin") {
      navigate(`/editmessage/${id}`);
    } else if (Role == "HR") {
      navigate(`/hreditmessage/${id}`);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/message/deletemessage/${id}`, {
          params: { logid, logip },
        });
        Swal.fire("Deleted!", "Your message has been deleted.", "success");

        const response = await axiosInstance.get("/api/message/messagetable", {
          params: {
            search: searchTerm,
            startDate,
            endDate,
            status: statusFilter,
            page: page,
            limit: messagesPerPage,
          },
        });

        setMessages(response.data.messages);

        settotal(response.data.totalMessages);
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error deleting the message.",
          "error"
        );
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setpage(newPage);
    }
  };
  const handleUserClick = (userList) => {
    if (userList.includes("All")) {
      Swal.fire("Users", "All", "info");
    } else {
      Swal.fire({
        title: "Users",
        text: userList.join(", "),
        icon: "info",
        confirmButtonText: "Close",
      });
    }
  };

  const handleViewClick = (viewList) => {
    if (viewList.includes("All")) {
      Swal.fire("View Users", "All", "info");
    } else {
      Swal.fire({
        title: "View Users",
        text: viewList.join(", "),
        icon: "info",
        confirmButtonText: "Close",
      });
    }
  };

  const handleDesction = (description) => {
    Swal.fire({
      title: "Description",
      text: description, // Pass the description string directly
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const formatList = (list) => {
    if (!Array.isArray(list)) return String(list ?? ""); // fallback for null, undefined
    return list.join(", ");
  };

  const truncateList = (list, maxLength = 1) => {
    if (!Array.isArray(list)) return formatList(list); // fallback case
    const truncated = list.length > maxLength ? list.slice(0, maxLength) : list;
    return formatList(truncated) + (list.length > maxLength ? " ..." : "");
  };

  if (loading) {
    return <Spinner />;
  }

  const handleAddMessage = () => {
    if (Role == "Admin") {
      navigate("/adminaddmessage");
    } else if (Role == "HR") {
      navigate("/hraddmessage");
    }
  };

  const handleLimitChange = (newval) => {
    setlimit(newval);
  };
  return (
    <>
      <div className="upperdiv">
        <div className="row gy-3 align-items-center ">
          <div className="col-12 col-md-4">
            <input
              type="text"
              placeholder="Search by Title"
              style={{ width: "100%" }}
              value={searchTerm}
              className="form-control"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-8">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-sm-6 col-md-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                  placeholder="Start Date"
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control"
                  placeholder="End Date"
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <select
                  value={statusFilter}
                  className="form-select"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  id="Commonbutton"
                  onClick={handleAddMessage}
                >
                  Add Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ========================================== */}
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="table-container">
          {!isMobile && (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#id</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>For User</th>
                  <th>View User</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <ClipLoader
                        color="#5856d6"
                        size={50}
                        speedMultiplier={1.2}
                      />
                    </td>
                  </tr>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <tr key={message.id}>
                      <td>#{message.id}</td>
                      <td>{message.title}</td>
                      <td>
                        {message.description && (
                          <>
                            {message.description.length > 10 ? (
                              <>
                                {message.description.slice(0, 10)}...
                                <MdHelp
                                  onClick={() =>
                                    handleDesction(message.description)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                  }}
                                />
                              </>
                            ) : (
                              message.description
                            )}
                          </>
                        )}
                      </td>
                      <td>
                        <FaEye
                          onClick={() => fetchImage(message.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        {message.user?.length > 0 ? (
                          <>
                            {truncateList(message.user)}
                            {message.user.length > 1 && (
                              <MdHelp
                                onClick={() => handleUserClick(message.user)}
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                              />
                            )}
                          </>
                        ) : (
                          message.user
                        )}
                      </td>
                      <td>
                        {message.view?.length > 0 ? (
                          <>
                            {truncateList(message.view)}
                            {message.view.length > 1 && (
                              <MdHelp
                                onClick={() => handleViewClick(message.view)}
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                              />
                            )}
                          </>
                        ) : (
                          message.view
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            message.status === "1"
                              ? "text-bg-success"
                              : "text-bg-danger"
                          } text-light`}
                        >
                          {message.status === "1" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {message.startDate} - {message.endDate}
                      </td>
                      <td className="actionButton">
                        <MdDelete
                          className="tableDeleteBackground"
                          onClick={() => handleDelete(message.id)}
                          style={{
                            color: "red",
                            cursor: "pointer",
                            marginRight: "5px",
                          }}
                        />
                        <MdEdit
                          className="tableEditBackground"
                          onClick={() => handleEdit(message.id)}
                          style={{ color: "blue", cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center"
                      style={{ fontWeight: "bold", fontSize: "large" }}
                    >
                      No messages found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {isMobile && (
            <div className="card-container">
              {tableLoading ? (
                <div className="text-center" style={{ padding: "30px 0" }}>
                  <ClipLoader color="#5856d6" size={50} speedMultiplier={1.2} />
                </div>
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <div className="card" key={message.id}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <input type="checkbox" />
                        <span className="ms-2">#{message.id}</span>
                      </div>
                      <div className="card-actions">
                        <MdDelete
                          className="EditDeleteBackground"
                          onClick={() => handleDelete(message.id)}
                          style={{
                            cursor: "pointer",
                            color: "red",
                            marginRight: "5px",
                          }}
                        />
                        <MdEdit
                          className="EditDeleteBackground"
                          onClick={() => handleEdit(message.id)}
                          style={{ cursor: "pointer", color: "blue" }}
                        />
                      </div>
                    </div>

                    <div className="card-content">
                      <p>
                        <strong>Title:</strong> {message.title}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {message.description?.length > 20
                          ? `${message.description.slice(0, 20)}...`
                          : message.description}
                        {message.description?.length > 20 && (
                          <MdHelp
                            onClick={() => handleDesction(message.description)}
                            style={{ cursor: "pointer", marginLeft: "5px" }}
                          />
                        )}
                      </p>
                      <p>
                        <strong>Image:</strong>{" "}
                        <FaEye
                          onClick={() => fetchImage(message.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </p>
                      <p>
                        <strong>For User:</strong> {truncateList(message.user)}
                        {message.user?.length > 1 && (
                          <MdHelp
                            onClick={() => handleUserClick(message.user)}
                            style={{ cursor: "pointer", marginLeft: "5px" }}
                          />
                        )}
                      </p>
                      <p>
                        <strong>View User:</strong> {truncateList(message.view)}
                        {message.view?.length > 1 && (
                          <MdHelp
                            onClick={() => handleViewClick(message.view)}
                            style={{ cursor: "pointer", marginLeft: "5px" }}
                          />
                        )}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {message.status === "1" ? "Active" : "Inactive"}
                      </p>
                      <p>
                        <strong>Date:</strong> {message.startDate} -{" "}
                        {message.endDate}
                      </p>
                    </div>

                    <div className="card-footer">
                      <span
                        className={`badge ${
                          message.status === "1" ? "bg-success" : "bg-danger"
                        } text-light`}
                      >
                        {message.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center"
                  style={{
                    padding: "30px 0",
                    fontWeight: "bold",
                    fontSize: "large",
                  }}
                >
                  No messages found
                </div>
              )}
            </div>
          )}

          <div className="table-footer">
            <div className="pagination">
              <span className="pagination-label">Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
              </select>

              <span className="pagination-info">
                {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
                {total}
              </span>

              <button
                className="paginationButton"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                &lt;
              </button>
              <button
                className="paginationButton"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === Math.ceil(total / limit)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageTable;
