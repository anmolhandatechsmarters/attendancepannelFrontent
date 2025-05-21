import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import getSwalTheme from "../utils/Swaltheme";
import mainlogo from "../assets/SmarterLogo.png";
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";
import { AppSidebarNav } from "./AppSidebarNav";
import getNavigation from "../_nav";

const AppSidebar = () => {
  const Swal = getSwalTheme();
  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();
      return currentTime >= expiryTime;
    } catch (e) {
      return true;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, []);

  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const role = localStorage.getItem("role");
  const [name, setName] = useState("");
  useEffect(() => {
    if (role === "Admin") {
      setName("Admin");
    } else if (role === "Employee") {
      setName("Employee");
    } else if (role === "HR") {
      setName("HR");
    }
  }, [role]);

  const navItems = getNavigation(role);
  const logo = "nav";
  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      <CSidebarHeader>
        <CSidebarBrand
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={mainlogo}
              alt="Logo"
              style={{ width: "80px", height: "63px", objectFit: "contain" }}
            />
          </div>
          {/* <h5
            className="sidebar-brand-full"
            style={{
              marginTop: "0.5rem",
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            {name} Dashboard
          </h5> */}
          <h4
            className="sidebar-brand-full"
            style={{
              marginTop: "0.5rem",
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "600",
            }}
          >
            Smarter Panel
          </h4>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: "set", sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
