import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import './custom-sidebar.css'
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { CBadge, CNavLink, CSidebarNav, CNavGroup } from "@coreui/react";

export const AppSidebarNav = ({ items }) => {
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item;
    const Component = component;
    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={<div className="nav-group-header">{navLink(name, icon)}</div>}
        {...rest}
      >
        {items?.map((subItem, subIndex) =>
          subItem.items
            ? navGroup(subItem, subIndex)
            : navItem(subItem, subIndex, true)
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
