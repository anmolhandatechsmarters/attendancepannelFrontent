import React from "react";

const Dashboard = React.lazy(
  () => import("../Pages/Admin/dashboard/Dashboard")
);
const Employees = React.lazy(() => import("../Pages/Employee/Employee"));
import Attendance from "../Pages/Admin/Attendance/Attendance";
import Department from "../Pages/Department/Deparatment";
import Designation from "../Pages/Designation/Designation";
const log = React.lazy(() => import("../Pages/Admin/Log/Table"));
import MessageTable from "../Pages/ManageMessage/Table";
const AdminInventory = React.lazy(
  () => import("../Pages/Inventory/InventoryTable")
);

const AdminAssignInvetory = React.lazy(
  () => import("../Pages/Inventory/Assign_Inventory")
);

const AdminCategoryTable = React.lazy(
  () => import("../Pages/Inventory/Category/Table")
);

const AdminAddInventory = React.lazy(
  () => import("../Pages/Inventory/AddInventory")
);
const GroceryList = React.lazy(() => import("../Pages/Stock/GroceryList"));

const AdminStockCategory = React.lazy(
  () => import("../Pages/Stock/StockCategory")
);

const AddUser = React.lazy(() => import("../Pages/Employee/AddEmployee"));
const Edituser = React.lazy(() => import("../Pages/Employee/EditEmployee"));

const DepartmentAdd = React.lazy(
  () => import("../Pages/Department/AddDepartmen")
);
const DesignationAdd = React.lazy(
  () => import("../Pages/Designation/AddDesignation")
);

const AdminAddAttendance = React.lazy(
  () => import("../Pages/Admin/Attendance/AddAttendance")
);

const EditAttendace = React.lazy(
  () => import("../Pages/Admin/Attendance/EditAttendance")
);

import editLeave from "../Pages/ManageLeave/EditLeave";
const AdminAddLeave = React.lazy(() => import("../Pages/ManageLeave/AddLeave"));
const AdminApproveLeave = React.lazy(
  () => import("../Pages/ManageLeave/Table")
);

const AddMessage = React.lazy(
  () => import("../Pages/ManageMessage/AddMessage")
);

const EditMessage = React.lazy(
  () => import("../Pages/ManageMessage/EditMessage")
);

const AdminAddCategory = React.lazy(
  () => import("../Pages/Inventory/Category/AddCategory")
);

const AdminUserInventory = React.lazy(
  () => import("../Pages/Inventory/Assign_Inventory")
);
// ---------------------------------------

import EditProfile from "../Pages/ProfileEdit/ProfileEdit";

import ViewUser from "../Pages/ViewUser/ViewUser";

const AdminApproveLeaveNotification = React.lazy(
  () => import("../Pages/Notification/Admin/AdminNotification")
);

const EditInventory = React.lazy(
  () => import("../Pages/Inventory/EditInventory")
);

const AddGroceryInventory = React.lazy(
  () => import("../Pages/Stock/GroceryAddInventory")
);
const EditGroceryInventory = React.lazy(
  () => import("../Pages/Stock/GroceryEditInventory")
);

const AdminAddCategoryData = React.lazy(
  () => import("../Pages/Stock/StockAddCategory")
);

const AdminSetting = React.lazy(() => import("../components/Common/Setting"));

const routes = [
  { path: "/viewuser/:id", name: "ViewUser", element: ViewUser },
  { path: "/editmessage/:id", name: "Edit Message", element: EditMessage },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/edituser/:id", name: "edituser", element: Edituser, exact: true },
  { path: "/adduser", name: "AddUser", element: AddUser, exact: true },
  { path: "/alluser", name: "Employees", element: Employees, exact: true },
  { path: "/attendance", name: "Attendance", element: Attendance },
  { path: "/attendance/:id", name: "Attendance", element: Attendance },
  { path: "/adminlog", name: "Log", element: log },
  { path: "/alldepartment", name: "Department", element: Department },
  { path: "/adddepartment", name: "Add Department", element: DepartmentAdd },
  { path: "/adddesignation", name: "Add Designation", element: DesignationAdd },
  { path: "/alldesignation", name: "Designation", element: Designation },

  //EditProfile   //TestEditUser
  { path: "/editprofile/:id", name: "Editprofile", element: EditProfile },

  {
    path: "/editattendace/:id",
    name: "Edit Attendance",
    element: EditAttendace,
  },
  {
    path: "/adminapproveleave",
    name: "Manage Leave",
    element: AdminApproveLeave,
  },
  {
    path: "/adminapproveleavenotification",
    name: "Leave Notification",
    element: AdminApproveLeaveNotification,
  },
  { path: "/adminaddleave", name: "Add Leave", element: AdminAddLeave },
  {
    path: "/addadminattendance",
    name: "Add Attendance",
    element: AdminAddAttendance,
  },
  { path: "/adminaddmessage", name: "Add Message", element: AddMessage },
  { path: "/managemessage", name: " Manage Message", element: MessageTable },
  { path: "/geteditleave/:id", name: "Edit leave", element: editLeave },

  { path: "/inventory", name: "Inventory", element: AdminInventory },
  {
    path: "/category",
    name: "Inventory Category",
    element: AdminCategoryTable,
  },
  {
    path: "/assign_inventory",
    name: "Assign Inventory",
    element: AdminAssignInvetory,
  },
  {
    path: "/addinventory",
    name: "Add Inventory",
    element: AdminAddInventory,
  },
  { path: "/addcategory", name: "Add Category", element: AdminAddCategory },
  {
    path: "/userassigninventory",
    name: "User Inventory",
    element: AdminUserInventory,
  },
  {
    path: "/editinventory/:id",
    name: "Edit Inventory",
    element: EditInventory,
  },
  { path: "/grocery_category", name: "Stock List", element: GroceryList },
  {
    path: "/addgrocerycategory",
    name: "Add Stock Inventory",
    element: AddGroceryInventory,
  },
  {
    path: "/editgroceryinventory/:id",
    name: "Edit Stock Inventory",
    element: EditGroceryInventory,
  },
  {
    path: "/stock_category",
    name: "Stock Category",
    element: AdminStockCategory,
  },
  {
    path: "/addgrocerydata",
    name: "Add Stock Category",
    element: AdminAddCategoryData,
  },

  { path: "/adminsetting", name: "Admin Settubg", element: AdminSetting },
];

export default routes;
