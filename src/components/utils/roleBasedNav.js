//This File is Help To Role Base SideNav bar Show
export const filterNavByRole = (navItems, userRole) => {
    return navItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    }).map(item => {
      if (item.items) {
        return {
          ...item,
          items: filterNavByRole(item.items, userRole),
        };
      }
      return item;
    });
  };
