import React, { useEffect } from "react";
import CIcon from "@coreui/icons-react";
import {
  cilDrop,
  cilGraph,
  cilPencil,
  cilSitemap,
  cilInstitution,
  cilSpeedometer,
  cilChart,
  cilHome,
  cilUser,
  cilScreenDesktop,
  cilExternalLink,
  cilPuzzle,
  cilChartLine,
  cilCog,
  cilGift,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";

// import LeaveNotification from "./HR/view/LeaveNotification/LeaveNotification";
// import AdminLeaveNotification from "./views/Mycomonponets/AdminLeaveNotification/LeaveNotification";

const adminNav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Employees",
    to: "/alluser",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Department",
    to: "/alldepartment",
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Designation",
    to: "/alldesignation",
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Attendance",
    to: "/attendance",
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Manage Leave",
    to: "/adminapproveleave",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    // badge: {
    //   color: "danger",
    //   text: <AdminLeaveNotification />,
    // },
  },

  {
    component: CNavItem,
    name: "Log",
    to: "/adminlog",
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Manage Message",
    to: "/managemessage",
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: "Inventory",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Category",
        to: "/category",
        icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Inventory",
        to: "/inventory",
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Assign Inventory",
        to: "/assign_inventory",
        icon: <CIcon icon={cilScreenDesktop} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Stock Manager",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "List",
        to: "/grocery_category",
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Category",
        to: "/stock_category",
        icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
      },
    ],
  },
];

const userNav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/employeedetail",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Attendance",
    to: "/employeeAttendance",
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Apply Leave",
    to: "/employeeleave",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
];

const hrNav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/hrdetail",
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "My Attendance",
    to: "/hrAttendance",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Apply Leave",
    to: "/hrapplyleavetable",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Department",
    to: "/hrdepartment",
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Designation",
    to: "/hrdesignation",
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Employees",
    to: "/hremployeeshow",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Manage Leave",
    to: "/hrapproveleave",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    // badge: {
    //   color: "danger",
    //   text: <LeaveNotification />,
    // },
  },

  {
    component: CNavItem,
    name: "Employees Attendance",
    to: "/hremployeeattendance",
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Manage Message",
    to: "/hrmessagetable",
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Log",
    to: "/Hrlog",
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Inventory",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Inventory Category",
        to: "/hrcategory",
        icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Inventory",
        to: "/hrinventory",
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Assign Inventory",
        to: "/hrassign_inventory",
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Stock Manager",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "List",
        to: "/hrgrocery_category",
        icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Category",
        to: "/hrstock_category",
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ],
  },
];

const getNavigation = (role) => {
  switch (role) {
    case "Admin":
      return adminNav;
    case "Employee":
      return userNav;
    case "HR":
      return hrNav;
    default:
      return [];
  }
};

export default getNavigation;
