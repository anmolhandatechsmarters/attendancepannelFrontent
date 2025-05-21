import React, { useEffect, useState } from "react";
import { AppContent, AppSidebar, AppHeader } from "../components/index";
import { useNavigate, useLocation } from "react-router-dom";
import "./DefaultLayout.css";
import axiosInstance from "../components/utils/AxiosIntance";
import getSwalTheme from "../utils/Swaltheme";
const DefaultLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const Swal = getSwalTheme();
  
  const role = localStorage.getItem("role")
  const token = localStorage.getItem("token");
const [returnlogin, setreturnLogin] = useState(false);

  useEffect(() => {
    const returnLoginbutton = localStorage.getItem("asClientLogin");
    if (returnLoginbutton) {
      if (returnLoginbutton === "true" || role !== "Admin") {
        setreturnLogin(true);
      }
    }
  }, []);


    const routes = [
    "/edituser/:id",
    "/viewuser/:id",
    "/editprofile/:id",
    "/attendance/:id",
    "/",
    "/login",
    "/forgetpassword",
    "/user/employee",
    "/user/hr",
    "/user/admin",
    "/dashboard",
    "/Confirmforgetpassword",
    "/adduser",
    "/alluser",
    "/attendance",
    "/graphuser",
    "/adminlog",
    "/hrdetail",
    "/hreditleave/:id",
    "/alldepartment",
    "/adddepartment",
    "/adddesignation",
    "/employeedetail",
    "/hrDetail",
    "/employeeAttendance",
    ,
    "/hrattendance",
    "/hrdetail",
    "/hremployeeattendance",
    "/hremployeeattendance/:id",
    "/hrdashboard",
    "/hremployeeshow",
    "/hraddemployee",
    "/editmessage/:id",
    "/hredituser/:id",
    "/viewhruser/:id",
    "/hrdepartment",
    "/alldesignation",
    "/hradddepartment",
    "/hrdesignation",
    "/hradddesignation",
    "/hrAttendance",
    "/employeeleave",
    "/hrapproveleave",
    "/hrapproveleaveNotification",
    "/geteditleave/:id",
    "/employeeapplyleave",
    "/employeeleaveNotification",
    "/managemessage",
    "/hreditattendance/:id",
    "/editattendace/:id",
    "/empeditprofile/:id",
    "/employeeleaveNotificaton",
    "/hrapplyleavetable",
    "/hrapplyleaveform",
    "/hrapplyleavenotification",
    "/adminapproveleave",
    "/hraddleave",
    "/adminapproveleavenotification",
    "/hreditprofile/:id",
    "/adminaddleave",
    "/Hrlog",
    "/addadminattendance",
    "/hraddattendance",
    "/adminaddmessage",
    "/editmessage/:id",
    "/hrmessagetable",
    "/hraddmessage",
    "/hreditmessage/:id",
    "/confirmpassword",
    "/inventory",
    "/addcategory",
    "/assign_inventory",
    "/addinventory",
    "/category",
    "/userassigninventory",
    "/editinventory/:id",
    "/grocery_category",
    "/addgrocerycategory",
    "/editgroceryinventory/:id",
    "/stock_category",
    "/addgrocerydata",

    // hr invenotry route
    "/hrinventory",
    "/hrcategory",
    "/hrassign_inventory",
    "/hraddinventory",
    "/hraddcategory",
    "hruserassigninventory",
    "/hreditinventory/:id",
    "/hrgrocery_category",
    "/hraddgrocerycategory",
    "/hreditgroceryinventory/:id",
    "/hrstock_category",
    "/hraddgrocerydata",

    //common
    "/adminsetting",
    "/hrsetting",
    "/employeesetting",
    "/test",
  ];
  const handleReturnAdminLogin = async () => {
    const Adminid = localStorage.getItem("adminid");
    const admintoken = localStorage.getItem("admintoken");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "To login As Admin",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Login",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.get(
          `/admin/loginasClient/${Adminid}`,
          {
            params: {
              admintoken: admintoken,
            },
          }
        );

        const user = response.data.user; // Handle the user data here
        if (response.data.user) {
          localStorage.setItem("id", user.id);
          localStorage.setItem("role", user.roleDetails.role);
          localStorage.setItem("token", user.token);
          localStorage.removeItem("admintoken");
          localStorage.removeItem("asClientLogin");
          localStorage.removeItem("admintoken");
          navigate("/dashboard");
          window.location.reload();
        }
      } catch (error) {
        // Handle error response
        console.error("Error logging in as admin:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while logging in as Admin.",
          icon: "error",
        });
      }
    }
  };

  


  useEffect(() => {
    const isValidRoute = routes.some((route) => {
      const regex = new RegExp(`^${route.replace(/:[^\s]+/g, "([\\w-]+)")}$`);
      return regex.test(location.pathname);
    });

    if (!isValidRoute) {
      navigate("/404");
    }
  }, [location.pathname, navigate, routes]);

  if (!token) {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <div className="ReturnToAdminButtonContainer">
          {returnlogin ? (
            <button
              className="ReturnToAdminButton"
              onClick={handleReturnAdminLogin}
            >
              Return To Admin
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
