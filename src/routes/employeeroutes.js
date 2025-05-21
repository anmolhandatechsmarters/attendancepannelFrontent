import React from "react";
import Detailemployee from "../Pages/HrUser/DashBoard/Detail";
import EmployeeProfileEdit from "../Pages/ProfileEdit/ProfileEdit";
// import LeaveNotification from "../Users/Leave/LeaveNotification";

const EmployeeAttendance = React.lazy(
  () => import("../Pages/HrUser/Attendance/Attendance")
);

const AdminSetting = React.lazy(() => import("../components/Common/Setting"));
const EmployeeLeave = React.lazy(() => import("../Pages/HrUser/ApplyLeave/EmployeeLeave"));
const EmployeeApplyLeave = React.lazy(
  () => import("../Pages/HrUser/ApplyLeave/ApplyLeave")
);

const routes = [
  { path: "/employeedetail", name: "Detail", element: Detailemployee },
  {
    path: "/employeeAttendance",
    name: "Employee Attendance",
    element: EmployeeAttendance,
  },
  {
    path: "/empeditprofile/:id",
    name: "Edit Profile",
    element: EmployeeProfileEdit,
  },
  { path: "/employeeleave", name: "Employee Leave", element: EmployeeLeave },
  {
    path: "/employeeapplyleave",
    name: "Apply Leave",
    element: EmployeeApplyLeave,
  },
  // {
  //   path: "/employeeleaveNotificaton",
  //   name: "Leave Notificaiton",
  //   element: LeaveNotification,
  // },
  { path: "/employeesetting", name: "Admin Settubg", element: AdminSetting },
];

export default routes;
