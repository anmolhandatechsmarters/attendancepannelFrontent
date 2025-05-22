import React, { useEffect, useState } from "react";
import "./Css/Setting.css";
import axiosInstance from "../utils/AxiosIntance";
import PasskeyRegisteration from "../utils/PasskeyRegisteration";
import { useSelector } from "react-redux";
const Setting = () => {
  const [notifications, setNotifications] = useState(false);
  const userId = localStorage.getItem("id");
  const Role = localStorage.getItem("role");
  const theme = useSelector((state) => state.theme);
  const fetchNotificationSetting = async () => {
    if (!userId) {
      console.error("User ID is missing in localStorage");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/api/notification/getnotification/${userId}`
      );

      if (response.data && response.data.allow_notification !== undefined) {
        setNotifications(response.data.allow_notification);
      }
    } catch (error) {
      console.error("Error fetching notification setting:", error);
    }
  };

  const updateNotificationSetting = async (newValue) => {
    if (!userId) {
      console.error("User ID is missing in localStorage");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/api/notification/allowNotification/${userId}`,
        {
          value: newValue ? "1" : "0",
        }
      );

      if (response.data && response.data.allow_notification !== undefined) {
        setNotifications(response.data.allow_notification);
      }
    } catch (error) {
      console.error("Error updating notification setting:", error);
      fetchNotificationSetting();
    }
  };

  const handleToggle = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await updateNotificationSetting(newValue);
  };

  useEffect(() => {
    if (userId) {
      fetchNotificationSetting();
    }
  }, [userId]);

  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <div className="setting">
        <div className="setting-container" >
          <h1>Settings</h1>
          {Role !== "Employee" && (
            <div className="setting-item">
              <span>Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={handleToggle}
                />
                <span className="slider round" />
              </label>
            </div>
          )}

          <PasskeyRegisteration />
        </div>
      </div>
    </div>
  );
};

export default Setting;
