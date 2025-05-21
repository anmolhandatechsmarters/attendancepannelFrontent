import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import getSwalTheme from "../utils/Swaltheme";
import { useNotification } from "../utils/NotificationContext";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilContrast, cilMenu, cilMoon, cilSun, cilBell } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import { useNavigate } from "react-router-dom";
//App header Start Here
const AppHeader = () => {
  const navigate = useNavigate();
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes("paneltheme");
  const dispatch = useDispatch();
  const { notificationCount } = useNotification();
  const Role = localStorage.getItem("role");
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [countNotification, setNotificationCount] = useState(0);
  const Swal = getSwalTheme();
  const fetchLeaveNotificationCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/approveleavecountnotification`,
        {}
      );
      setNotificationCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  }, []);
  useEffect(() => {
    document.addEventListener("scroll", () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0
        );
    });
  }, []);

  const handleMoveNotification = () => {
    if (Role == "Admin") {
      navigate("/adminapproveleavenotification");
    } else if (Role == "HR") {
      navigate("/hrapproveleaveNotification");
    }
  };
  //get light mode in localStorage
  const handlethemechangelight = () => {
    // window.location.reload();
    setColorMode("light");
    localStorage.setItem("paneltheme", "light");
    document.body.classList.remove("dark");
    dispatch({ type: "set", theme: "light" });
  };
  const handlethemechangedark = () => {
    // window.location.reload();
    setColorMode("dark");
    localStorage.setItem("paneltheme", "dark");
    document.body.classList.add("dark");
    dispatch({ type: "set", theme: "dark" });
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
      const expiryTime = decoded.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = Date.now();
      return currentTime >= expiryTime;
    } catch (e) {
      return true; // If token is malformed or invalid, consider it expired
    }
  };

  const logout = async () => {
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

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token && isTokenExpired(token)) {
  //     logout();
  //   }
  // }, []);

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom" fluid>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <CHeaderToggler
            onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
            style={{ padding: "0.5rem", cursor: "pointer" }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          <AppBreadcrumb />
        </div>

        <CHeaderNav className="d-none d-md-flex"></CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {Role !== "Employee" && (
            <CNavItem>
              <CNavLink
                onClick={handleMoveNotification}
                style={{ position: "relative", display: "inline-block" }}
              >
                <CIcon icon={cilBell} size="lg" />
                {notificationCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "10px",
                      lineHeight: "1",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </CNavLink>
            </CNavItem>
          )}

          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === "auto" ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === "light"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={handlethemechangelight}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "dark"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={handlethemechangedark}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CContainer className="px-4" fluid></CContainer> */}
    </CHeader>
  );
};
export default AppHeader;
