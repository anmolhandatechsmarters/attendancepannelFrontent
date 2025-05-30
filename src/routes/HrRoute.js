import React from "react";
import EditLeave from "../Pages/ManageLeave/EditLeave";
// --------------------
const GroceryCategory = React.lazy(() => import("../Pages/Stock/GroceryList"));
const AddGroceryInventory = React.lazy(
  () => import("../Pages/Inventory/AddInventory")
);

const Hradduser = React.lazy(() => import("../Pages/Employee/AddEmployee"));

const Edituser = React.lazy(() => import("../Pages/Employee/EditEmployee"));

const Hrattendance = React.lazy(
  () => import("../Pages/HrUser/Attendance/Attendance")
);
// -----------------------------------------------------------------

const Hrdetail = React.lazy(() => import("../Pages/HrUser/DashBoard/Detail"));

const Hremployeeattendance = React.lazy(
  () => import("../Pages/Hr/EmployeeAttendance/Hremployeeattendance")
);
const Hrshowemployee = React.lazy(() => import("../Pages/Employee/Employee"));
const Hrviewuser = React.lazy(() => import("../Pages/ViewUser/ViewUser"));
const Hredituser = React.lazy(() => import("../Pages/Employee/EditEmployee"));
const HrDepartment = React.lazy(
  () => import("../Pages/Department/Deparatment")
);
const HrAddDepartment = React.lazy(
  () => import("../Pages/Department/AddDepartmen")
);
const HrDesignation = React.lazy(
  () => import("../Pages/Designation/Designation")
);
const HrAddDesignation = React.lazy(
  () => import("../Pages/Designation/AddDesignation")
);
const HrEditProfile = React.lazy(
  () => import("../Pages/ProfileEdit/ProfileEdit")
);

const ApproveLeaveNotification = React.lazy(
  () => import("../Pages/Notification/Admin/AdminNotification")
);
const Approvedleave = React.lazy(() => import("../Pages/ManageLeave/Table"));
const EditAttendance = React.lazy(
  () => import("../Pages/Admin/Attendance/EditAttendance")
);
const HrApplyTalbe = React.lazy(
  () => import("../Pages/HrUser/ApplyLeave/EmployeeLeave")
);
const HrApplyLeaveForm = React.lazy(
  () => import("../Pages/HrUser/ApplyLeave/ApplyLeave")
);
// const HrLeaveNotification = React.lazy(
//   () => import("../HR/Applyleave/LeaveNotification")
// );

const HrLogTable = React.lazy(() => import("../Pages/Hr/Log/HrLog"));
const HrAddAttendance = React.lazy(
  () => import("../Pages/Admin/Attendance/AddAttendance")
);
const Hraddleave = React.lazy(() => import("../Pages/ManageLeave/AddLeave"));
const HrManageTable = React.lazy(() => import("../Pages/ManageMessage/Table"));
const HrAddMessage = React.lazy(
  () => import("../Pages/ManageMessage/AddMessage")
);
const HrEditMessage = React.lazy(
  () => import("../Pages/ManageMessage/EditMessage")
);

//invenotory
const AdminInventory = React.lazy(
  () => import("../Pages/Inventory/InventoryTable")
);
const AdminCategoryTable = React.lazy(
  () => import("../Pages/Inventory/Category/Table")
);
const AdminAssignInvetory = React.lazy(
  () => import("../Pages/Inventory/Assign_Inventory")
);
const AdminAddInventory = React.lazy(
  () => import("../Pages/Inventory/AddInventory")
);
const AdminAddCategory = React.lazy(
  () => import("../Pages/Inventory/Category/AddCategory")
);
const AdminUserInventory = React.lazy(
  () => import("../Pages/Inventory/Assign_Inventory")
);
const EditInventory = React.lazy(
  () => import("../Pages/Inventory/EditInventory")
);

const EditGroceryInventory = React.lazy(
  () => import("../Pages/Inventory/EditInventory")
);

const AdminStockCategory = React.lazy(
  () => import("../Pages/Stock/StockCategory")
);
const AdminAddCategoryData = React.lazy(
  () => import("../Pages/Inventory/Category/AddCategory")
);
const AdminSetting = React.lazy(() => import("../components/Common/Setting"));

const routes = [
  {
    path: "/hredituser/:id",
    name: "Edit User",
    element: Edituser,
    exact: true,
  },
  { path: "/hrdetail", name: "Dashboard", element: Hrdetail },
  { path: "/hrAttendance", name: "My Attendance", element: Hrattendance },
  {
    path: "/hremployeeattendance",
    name: "Employee Attendance",
    element: Hremployeeattendance,
  },
  {
    path: "/hremployeeattendance/:id",
    name: "Employee Attendance",
    element: Hremployeeattendance,
  },

  { path: "/hremployeeshow", name: "Employees", element: Hrshowemployee },

  { path: "/hraddemployee", name: "Add Employee", element: Hradduser },
  { path: "/hredituser/:id", name: "Edit Emoloyee", element: Hredituser },
  { path: "/viewhruser/:id", name: "View Employee", element: Hrviewuser },
  { path: "/hrdepartment", name: "Deparatment", element: HrDepartment },
  {
    path: "/hradddepartment",
    name: "Add Department",
    element: HrAddDepartment,
  },
  { path: "/hrdesignation", name: "Designation", element: HrDesignation },
  {
    path: "/hradddesignation",
    name: "Add Designation",
    element: HrAddDesignation,
  },
  { path: "/hreditprofile/:id", name: "Edit Profile", element: HrEditProfile },
  {
    path: "/hrapproveleaveNotification",
    name: "Aprrove Leave Notification",
    element: ApproveLeaveNotification,
  },
  { path: "/hrapproveleave", name: "Approve Leave", element: Approvedleave },
  {
    path: "/hreditattendance/:id",
    name: "Edit Attendance",
    element: EditAttendance,
  },
  { path: "/hrapplyleavetable", name: "Apply Leave", element: HrApplyTalbe },
  { path: "/hrapplyleaveform", name: "Apply Form", element: HrApplyLeaveForm },
  // {
  //   path: "/hrapplyleavenotification",
  //   name: "Leave Notification",
  //   // element: HrLeaveNotification,
  // },
  { path: "/Hrlog", name: "Log", element: HrLogTable },

  {
    path: "/hraddattendance",
    name: "Add Attendance",
    element: HrAddAttendance,
  },
  { path: "/hraddleave", name: "Add Leave", element: Hraddleave },
  { path: "/hrmessagetable", name: "Manage Message", element: HrManageTable },
  { path: "/hraddmessage", name: "Add message", element: HrAddMessage },
  { path: "/hreditmessage/:id", name: "Edit Message", element: HrEditMessage },
  { path: "/hreditleave/:id", name: "Edit Leave", element: EditLeave },

  { path: "/hrinventory", name: "Inventory", element: AdminInventory },
  { path: "/hrcategory", name: "Add Category", element: AdminCategoryTable },
  {
    path: "/hrassign_inventory",
    name: "Assign Item",
    element: AdminAssignInvetory,
  },
  {
    path: "/hraddinventory",
    name: "Add Inventory",
    element: AdminAddInventory,
  },
  { path: "/hraddcategory", name: "Add Category", element: AdminAddCategory },
  {
    path: "/hruserassigninventory",
    name: "User Inventory",
    element: AdminUserInventory,
  },
  {
    path: "/hreditinventory/:id",
    name: "Edit Inventory",
    element: EditInventory,
  },
  { path: "/hrgrocery_category", name: "Stock List", element: GroceryCategory },
  {
    path: "/hraddgrocerycategory",
    name: "Add Stock Inventory",
    element: AddGroceryInventory,
  },
  {
    path: "/hreditgroceryinventory/:id",
    name: "Edit Stock Inventory",
    element: EditGroceryInventory,
  },
  {
    path: "/hrstock_category",
    name: "Stock Category",
    element: AdminStockCategory,
  },
  {
    path: "/hraddgrocerydata",
    name: "Add Stock Category",
    element: AdminAddCategoryData,
  },
  { path: "/hrsetting", name: "Admin Setting", element: AdminSetting },
];

export default routes;
