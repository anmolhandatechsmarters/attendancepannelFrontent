import React, { useEffect, useState } from "react";
import { MdHelp } from "react-icons/md";
import getSwalTheme from "../../../utils/Swaltheme";
import { useNavigate } from "react-router-dom";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import axiosInstance from "../../../components/utils/AxiosIntance";
import Spinner from "../../../utils/Spinner";
import { ClipLoader } from "react-spinners";
import useIsMobile from "../../../scss/vendors/MobileSetting";
import { useSelector } from "react-redux";
const convertTo12HourFormat = (time) => {
  if (!time) {
    return "N/A";
  }

  const [hours, minutes, seconds] = time.split(":");

  if (hours === undefined || minutes === undefined || seconds === undefined) {
    return "N/A";
  }

  const parsedHours = parseInt(hours, 10);
  const modifier = parsedHours >= 12 ? "PM" : "AM";
  const normalizedHours = parsedHours % 12 || 12;

  const formattedTime = `${normalizedHours}:${minutes}:${seconds} ${modifier}`;

  return formattedTime;
};
const ShowAllUser = () => {
  const navigate = useNavigate();
   const isMobile = useIsMobile();
  const theme = useSelector((state) => state.theme);
  const [log, setLog] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ column: "id", order: "desc" });
  const [selectedLogs, setSelectedLogs] = useState([]);
  const limit = 10;
  const Swal =getSwalTheme()
  const [loading, setloading] = useState(true);
  const [tableloading, settableloading] = useState(false);
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    setStartDate(
      new Date(currentYear, currentMonth, 2).toISOString().split("T")[0]
    );

    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    setEndDate(
      new Date(currentYear, currentMonth, lastDay).toISOString().split("T")[0]
    );
  }, []);

  const getrole = localStorage.getItem("role");

  useEffect(() => {
    const fetchAllLogs = async () => {
      try {
        settableloading(true);
        const result = await axiosInstance.get(`/admin/logs`, {
          params: {
            page,
            limit,
            search,
            sortBy: sort.column,
            sortOrder: sort.order,
            startDate,
            endDate,
            getrole,
          },
        });
        setLog(result.data.logs);
        setTotal(result.data.total);
        settableloading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
        settableloading(false);
      }
    };
    fetchAllLogs();
  }, [page, limit, search, sort, startDate, endDate]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setPage(1);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const handleSorting = (column) => {
    setSort((prevSort) => ({
      column,
      order:
        prevSort.column === column && prevSort.order === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const handleDeleteLog = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/logdelete/${id}`, {});
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your log has been deleted.",
          confirmButtonText: "OK",
        });
        refreshLogs();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error deleting the log.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleMultipleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });

    if (confirm.isConfirmed) {
      try {
        await Promise.all(
          selectedLogs.map((id) =>
            axiosInstance.delete(`/admin/logdelete/${id}`, {})
          )
        );
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Selected logs have been deleted.",
          confirmButtonText: "OK",
        });
        setSelectedLogs([]);
        refreshLogs();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error deleting the logs.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const refreshLogs = async () => {
    const result = await axiosInstance.get(`/admin/logs`, {
      params: {
        page,
        limit,
        search,
        sortBy: sort.column,
        sortOrder: sort.order,
        startDate,
        endDate,
      },
    });
    setLog(result.data.logs);
    setTotal(result.data.total);
  };

  const handleSelectLog = (id) => {
    setSelectedLogs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleViewUser = (userid) => {
    navigate(`/viewhruser/${userid}`);
  };

  const handleShowComment = (comment) => {
    Swal.fire({
      title: "Data",
      text: comment,
      icon: "info",
      confirmButtonText: "Close",
    });
  };


    if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <>
     <div className="upperdiv">
        <div className="row gy-3 align-items-center ">
          <div className="col-12 col-md-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              style={{ width: "100%" }}
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-8">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end actions mb-0">
              <div className="col-12 col-md-4">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className=" form-control"
                />
              </div>
              <div className="col-12 col-md-4">
                <input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>


      </div>

      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        <div className="table-container">
          {!isMobile && (
            <table className="modern-table">
              <thead>
                <tr>
                 
                  <th onClick={() => handleSorting("id")}>
                    #ID{" "}
                    <span>
                      {sort.column === "id" ? (
                        sort.order === "asc" ? (
                          <FcAlphabeticalSortingAz />
                        ) : (
                          <FcAlphabeticalSortingZa />
                        )
                      ) : (
                        <FcAlphabeticalSortingAz />
                      )}
                    </span>
                  </th>
                  <th onClick={() => handleSorting("user_id")}>User ID</th>
                  <th>API</th>
                  <th>Message</th>
                  {/* <th>Data</th> */}
                  <th>IP</th>
                  <th onClick={() => handleSorting("date")}>
                    Date{" "}
                    <span>
                      {sort.column === "date" ? (
                        sort.order === "asc" ? (
                          <FcAlphabeticalSortingAz />
                        ) : (
                          <FcAlphabeticalSortingZa />
                        )
                      ) : (
                        <FcAlphabeticalSortingAz />
                      )}
                    </span>
                  </th>
               
                </tr>
              </thead>
              <tbody>
                {tableloading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <ClipLoader
                        color="#5856d6"
                        size={50}
                        speedMultiplier={1.2}
                      />
                    </td>
                  </tr>
                ) : log.length > 0 ? (
                  log.map((userlog) => (
                    <tr key={userlog.id}>
    
                      <td
                        className="viewuserbyfield"
                        onClick={() => handleViewUser(userlog.user_id)}
                      >
                       #{userlog.id}
                      </td>
                      <td
                        className="viewuserbyfield"
                        onClick={() => handleViewUser(userlog.user_id)}
                      >
                        {userlog.user_id}
                      </td>
                      <td>{userlog.api}</td>
                      <td>{userlog.message}</td>
                      {/* <td>
                        {userlog.data && userlog.data.length > 0 ? (
                          <span
                            title={userlog.data}
                            onClick={() => handleShowComment(userlog.data)}
                            style={{ cursor: "pointer" }}
                          >
                            <MdHelp />
                          </span>
                        ) : (
                          "-"
                        )}
                      </td> */}
                      <td>{userlog.ip}</td>
                      <td>{new Date(userlog.date).toLocaleDateString()}</td>
           
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center fw-bold fs-5">
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Mobile View */}
          {isMobile && (
            <div className="card-container">
              {tableloading ? (
                <div className="text-center py-4">
                  <ClipLoader color="#5856d6" size={50} speedMultiplier={1.2} />
                </div>
              ) : log.length > 0 ? (
                log.map((userlog) => (
                  <div className="card" key={userlog.id}>
                    <div className="card-header d-flex justify-content-between">
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(userlog.id)}
                          onChange={() => handleSelectLog(userlog.id)}
                        />
                        <span className="ms-2">#{userlog.id}</span>
                      </div>
                      <div>
                        <MdDelete
                          className="tableDeleteBackground"
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDeleteLog(userlog.id)}
                        />
                      </div>
                    </div>

                    <div className="card-content">
                      <p>
                        <strong>User ID:</strong> {userlog.user_id}
                      </p>
                      <p>
                        <strong>API:</strong> {userlog.api}
                      </p>
                      <p>
                        <strong>Message:</strong> {userlog.message}
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        {userlog.data && userlog.data.length > 0 ? (
                          <span
                            title={userlog.data}
                            onClick={() => handleShowComment(userlog.data)}
                            style={{ cursor: "pointer" }}
                          >
                            <MdHelp />
                          </span>
                        ) : (
                          "-"
                        )}
                      </p>
                      <p>
                        <strong>IP:</strong> {userlog.ip}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(userlog.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 fw-bold fs-5">
                  No logs found
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
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

export default ShowAllUser;
