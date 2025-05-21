import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../components/utils/AxiosIntance";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchLeaveNotificationCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/approveleavecountnotification`
      );
      setNotificationCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  }, []);

  // Optional: Auto-refresh every 30 seconds
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;
    fetchLeaveNotificationCount();
    const interval = setInterval(fetchLeaveNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [fetchLeaveNotificationCount]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        refreshNotificationCount: fetchLeaveNotificationCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
