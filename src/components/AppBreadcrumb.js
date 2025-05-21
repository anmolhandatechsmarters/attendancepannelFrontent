import React from "react";
import { useLocation } from "react-router-dom";

import routes from "../routes/routes";
import EmployeeRoutes from "../routes/employeeroutes";
import HrRoutes from "../routes/HrRoute";

import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;

  // Get the combined routing array from routes, EmployeeRoutes, and HrRoutes
  const allRoutes = [...routes, ...EmployeeRoutes, ...HrRoutes];

  // Get the route name from the combined routes
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    location.split("/").reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname, allRoutes);
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        });
      return currentPathname;
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="my-0">
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            style={{ fontSize: "1.5rem" }}
            {...(breadcrumb.active
              ? { active: true }
              : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        );
      })}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
