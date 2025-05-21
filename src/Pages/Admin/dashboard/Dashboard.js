import React, { useEffect, useState } from "react";
import "./Dashobard.css";
import ActiveUser from "../../../assets/myimages/check.png";
import TotalUser from "../../../assets/myimages/group.png";
import axiosInstance from "../../../components/utils/AxiosIntance";
import ShowMessage from "../../../utils/Messagebox/ShowMessage";
import Spinner from "../../../utils/Spinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [alluser, setAllUser] = useState(0);
  const [activeuser, setActiveUser] = useState(0);
  const [counttodaypresent, settodaypresent] = useState(0);
  const [countapproveleave, setcountapproveleave] = useState(0);
  const [remotework, setremotework] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setloading] = useState(true);
  const theme = useSelector((state) => state.theme);
  const isLogin = localStorage.getItem("islogin") === "true";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const totalUsers = await axiosInstance.get(`/user/totaluser`);
        setAllUser(totalUsers.data);
        const activeUsers = await axiosInstance.get(`/user/allactiveuser`);
        setActiveUser(activeUsers.data);
        const todaypresent = await axiosInstance.get(
          `/admin/counttodaypresent`
        );
        settodaypresent(todaypresent.data.count);
        const countApprovedLeaves = await axiosInstance.get(
          `/admin/countapproveleave`
        );
        setcountapproveleave(countApprovedLeaves.data.count);
        // console.log(countApprovedLeaves.data.count);

        setMessageContent("Data fetched successfully!");
        setShowMessage(true);
      } catch (error) {
        console.log("Error fetching data:", error);
        setMessageContent("Failed to fetch data.");
        setShowMessage(true);
      } finally {
        setloading(false);
      }
    };

    const showMessageData = async () => {
      if (!isLogin) return;

      try {
        const response = await axiosInstance.get(
          `/api/message/showmessage/${localStorage.getItem("id")}`
        );
        if (response.data.length > 0) {
          setMessageContent(response.data[0].message);
          setShowMessage(true);
        }
      } catch (error) {
        // console.error("Error fetching messages:", error);
      }
    };

    fetchUserData();
    showMessageData();
  }, [isLogin]);

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.2, // Delay each card animation
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="dashboard-container">
          {!isLogin && showMessage && (
            <ShowMessage
              message={messageContent}
              onClose={() => setShowMessage(false)}
            />
          )}

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <img
                src={ActiveUser}
                alt="Active Users"
                className="dashboard-image"
              />
              <div className="dashboard-info">
                <div className="dashboard-user-number">{activeuser}</div>
                <div className="dashboard-label">Total Active Employees</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <img src={TotalUser} alt="Present" className="dashboard-image" />
              <div className="dashboard-info">
                <div className="dashboard-user-number">{counttodaypresent}</div>
                <div className="dashboard-label">Today Present Employees</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <img src={TotalUser} alt="Leave" className="dashboard-image" />
              <div className="dashboard-info">
                <div className="dashboard-user-number">{countapproveleave}</div>
                <div className="dashboard-label">Today Leave</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <img
                src={TotalUser}
                alt="Remote Work"
                className="dashboard-image"
              />
              <div className="dashboard-info">
                <div className="dashboard-user-number">{remotework}</div>
                <div className="dashboard-label">Remote Work</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
