import axios from "axios";


const getAccessToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const getRefreshToken = () => localStorage.getItem("token");
const setAccessToken = (token) => localStorage.setItem("token", token);
const setRefreshToken = (token) => localStorage.setItem("gftoken", token);


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshtoken");
  localStorage.removeItem("id")
  localStorage.removeItem("role")
  localStorage.removeItem("expirytime");
  window.location.href = "/login";
};

// Function to refresh the access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }
    const response = await axios.get(`${import.meta.env.REACT_APP_BASE_URL}/api/token`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.data.accessToken) {
      const decodedToken = JSON.parse(
        atob(response.data.accessToken.split(".")[1])
      );
      const tokenExpiryTime = decodedToken.exp * 1000; 
      localStorage.setItem("expirytime", tokenExpiryTime);
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } else {
      return null;
    }
  } catch (error) {
    // console.error("Error refreshing token:", error);
    handleLogout();
    return null;
  }
};


const monitorTokenExpiry = () => {
  const tokenExpiryTime = localStorage.getItem("expirytime");
  if (tokenExpiryTime) {
    const remainingTime = tokenExpiryTime - Date.now();
    // console.log("Remaining token expiry time:", remainingTime);
    if (remainingTime <= 0) {
      // console.log("Token expired. Logging out...");
      handleLogout();
    } else {
      // Set timeout to log out when token expires
      setTimeout(() => {
        // console.log("Token expired. Logging out...");
        handleLogout();
      }, remainingTime);
    }
  }
};


monitorTokenExpiry();


const axiosInstance = axios.create({
  baseURL: `${import.meta.env.REACT_APP_BASE_URL}`,
});

// Function to get user ID from localStorage
const getLocalStorageUserId = () => {
  return localStorage.getItem("id");
};

// Axios request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    const localStorageUserId = getLocalStorageUserId();

    if (token) {
      const tokenExpiryTime = localStorage.getItem("expirytime");
      if (tokenExpiryTime) {
        const remainingTime = tokenExpiryTime - Date.now();
        // console.log("Remaining time for token expiry:", remainingTime);
        if (remainingTime <= 2 * 60 * 1000) {
          // If token is about to expire in 2 minutes, refresh it
          const newToken = await refreshAccessToken();
          if (newToken) {
            config.headers["Authorization"] = `Bearer ${newToken}`;
          } else {
            return Promise.reject("Session expired");
          }
        } else {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }

    if (localStorageUserId) {
      config.headers["X-User-Id"] = localStorageUserId;
    }

    // Set content type based on request data
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.accessToken) {
      const decodedToken = JSON.parse(
        atob(response.data.accessToken.split(".")[1])
      );
      const tokenExpiryTime = decodedToken.exp * 1000; // Set new token expiry time
      localStorage.setItem("expirytime", tokenExpiryTime);
      setAccessToken(response.data.accessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
