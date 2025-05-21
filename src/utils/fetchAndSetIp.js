import axios from "axios";
import store from "../store"; // adjust path

export const fetchAndSetIp = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    store.dispatch({
      type: "setIpAddress",
      ipAddress: response.data.ip,
    });
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
};
