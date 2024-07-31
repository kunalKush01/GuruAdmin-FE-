// ** React Imports
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// ** Third Party Components
import classnames from "classnames";

// ** Reactstrap Imports
import { Collapse, Badge } from "reactstrap";

// ** Vertical Menu Items Component
import VerticalNavMenuItems from "./VerticalNavMenuItems";

// ** Utils
import { hasActiveChild, removeChildren } from "@layouts/utils";
import { Trans } from "react-i18next";

const VerticalNavMenuGroup = ({
  item,
  menuHover,
  activeItem,
  parentItem,
  routerProps,
  menuCollapsed,
  currentActiveItem,
  setActiveItem,
  ...rest
}) => {
  // ** Hooks
  const location = useLocation();

  // ** State to manage the open groups
  const [openGroups, setOpenGroups] = useState([]);

  // ** Current URL
  const currentURL = location.pathname;

  // ** Toggle Open Group
  const toggleOpenGroup = (item) => {
    setOpenGroups((prevOpenGroups) => {
      if (prevOpenGroups.includes(item.id)) {
        return prevOpenGroups.filter((groupId) => groupId !== item.id);
      } else {
        return [...prevOpenGroups, item.id];
      }
    });
  };

  // ** On Group Item Click
  const onCollapseClick = (e, item) => {
    toggleOpenGroup(item);
    e.preventDefault();
  };

  // ** Checks URL & updates active item
  useEffect(() => {
    if (hasActiveChild(item, currentURL)) {
      if (!openGroups.includes(item.id)) {
        setOpenGroups((prevOpenGroups) => [...prevOpenGroups, item.id]);
      }
    } else {
      setOpenGroups((prevOpenGroups) =>
        prevOpenGroups.filter((groupId) => groupId !== item.id)
      );
    }
  }, [location]);

  // ** Returns condition to add open class
  const isOpen = openGroups.includes(item.id);

  return (
    <li
      className={classnames("nav-item has-sub", {
        open: isOpen,
        "menu-collapsed-open": isOpen,
        "sidebar-group-active": isOpen,
      })}
    >
      <Link
        className="d-flex align-items-center"
        to="#"
        onClick={(e) => onCollapseClick(e, item)}
      >
        <img
          src={item.icon}
          height={20}
          width={20}
          style={{ marginLeft: "0px", marginRight: "10px" }}
        />
        <span className="menu-title text-truncate">
          <Trans i18nKey={item?.name} />
        </span>
        {item.badge && item.badgeText ? (
          <Badge className="ms-auto me-1" color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </Link>

      {/* Render Child Recursively Through VerticalNavMenuItems Component */}
      <ul className="menu-content">
        <Collapse isOpen={isOpen}>
          <VerticalNavMenuItems
            {...rest}
            items={item.children}
            parentItem={item}
            menuCollapsed={menuCollapsed}
            menuHover={menuHover}
            routerProps={routerProps}
            currentActiveItem={currentActiveItem}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        </Collapse>
      </ul>
    </li>
  );
};

export default VerticalNavMenuGroup;
