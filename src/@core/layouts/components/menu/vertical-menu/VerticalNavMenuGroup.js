// ** React Imports
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

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

  const permissions = useSelector((state) => state.auth.userDetail?.permissions);
  const trustType = useSelector((state) => state.auth.trustDetail?.typeId?.name);
  const hasDharmshalaAccess = useSelector((state) => state.auth.trustDetail?.hasDharmshala);

  const checkPermission = (item) => {
    const permissionsKey = permissions?.map((perm) => perm?.name);
    const hasAllPermission = permissionsKey?.includes("all");
    const hasItemPermission = permissionsKey?.includes(item?.name);
    const hasCattleItemPermission = item?.innerPermissions?.some((perm) =>
      permissionsKey?.includes(perm)
    );
    const isGaushala =
      item?.isCattle?.toLowerCase() === trustType?.toLowerCase();

    const isDharmshalaItem = item?.name === "dharmshala/dashboard";
    if (isDharmshalaItem && !hasDharmshalaAccess) {
      return false;
    }

    return (
      (hasAllPermission && isGaushala) ||
      (hasCattleItemPermission && isGaushala) ||
      (hasItemPermission && isGaushala) ||
      (hasAllPermission && item?.name !== "cattles_management") ||
      (hasItemPermission && item?.name !== "cattles_management")
    );
  };

  if (!checkPermission(item)) {
    return null;
  }

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
        <Trans i18nKey={item.customLabel || item.name} />
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
