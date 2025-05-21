
import{ useState, useEffect, useCallback } from 'react';
import './leaveNotification.css';
import axiosInstance from '../../../components/utils/AxiosIntance';
const LeaveNotification = () => {
  const [notificationCount, setNotificationCount] = useState("");
const fetchLeaveNotificationCount = useCallback(async () => {
  try {
      const response = await axiosInstance.get(`/admin/approveleavecountnotification`, {

      });
      setNotificationCount(response.data.count || 0); 
  } catch (error) {
      console.error("Error fetching notification count:", error);
  }
}, []);


  useEffect(() => {
   
      fetchLeaveNotificationCount();

    
  }, [fetchLeaveNotificationCount]);

  return (
    <div className='leave-notification'> 
        <p className='fs-6'>{notificationCount}</p>
    </div>
  );
};

export default LeaveNotification;
