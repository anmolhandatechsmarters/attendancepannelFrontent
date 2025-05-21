import React, { useState, useEffect } from "react";
import DefaultImage from "../../assets/default.jpeg"
import getSwalTheme from "../../utils/Swaltheme";
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilLockLocked } from "@coreui/icons";
import { cilUser,cilApplications } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import avatar8 from "../../assets/DefaultImage.jpg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosIntance";
import { useSelector } from "react-redux";
const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
const Swal = getSwalTheme()
  if (token) {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userResult = await axiosInstance.get(`/api/hr/gethrdata/${id}`);
          setUser(userResult.data.user);
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      };

      fetchData();
    }, [id, token]);
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are                          ure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    });

    if (result.isConfirmed) {
      try {


        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("islogin");
        localStorage.removeItem("asClientLogin");
        localStorage.removeItem("adminid");
        localStorage.removeItem("admintoken");
        localStorage.removeItem("expirytime");
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Logout failed:", error);
        Swal.fire({
          title: "Error!",
          text: "Logout failed. Please try again.",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const handleEditProfile = () => {
    if (role === "Admin") {
      navigate(`/editprofile/${id}`);
    } else if (role === "HR") {
      navigate(`/hreditprofile/${id}`);
    } else if (role === "Employee") {
      navigate(`/empeditprofile/${id}`);
    }
  };
//
const handleSetting=()=>{
  if (role === "Admin") {
    navigate(`/adminsetting`);
  } else if (role === "HR") {
    navigate(`/hrsetting`);
  } else if (role === "Employee") {
    navigate(`/employeesetting`);
  }
}

  const profileImageUrl =
    user && user.image
      ? `${import.meta.env.REACT_APP_BASE_URL}/${user.image}`
      : DefaultImage;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const today = new Date();
      if (today.getHours() === 23 && today.getMinutes() === 59) {
        handleLogout();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CAvatar src={profileImageUrl} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>
        <CDropdownItem onClick={handleEditProfile}>
          <CIcon icon={cilUser} className="me-2" />
          <span style={{ cursor: "pointer" }}>Edit Profile</span>
        </CDropdownItem>
        <CDropdownItem onClick={handleSetting}>
          <CIcon icon={cilApplications} className="me-2" />
          <span style={{ cursor: "pointer" }}>Setting</span>
        </CDropdownItem>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          <span style={{ cursor: "pointer" }}>Logout</span>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
