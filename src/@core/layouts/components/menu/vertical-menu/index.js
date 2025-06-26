import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import logOutIcon from "../../../../../assets/images/icons/dashBoard/Group 5995.svg";
import confirmationIcon from "../../../../../assets/images/icons/news/conformationIcon.svg";
import { authApiInstance } from "../../../../../axiosApi/authApiInstans";
import { logOut } from "../../../../../redux/authSlice";
import { subHeaderContentResponsive } from "../../../../../utility/subHeaderContent";
//import VerticalMenuHeader from "./VerticalMenuHeader";
import VerticalNavMenuItems from "./VerticalNavMenuItems";
import logo from "../../../../../assets/images/pages/main-logo.png";
import "../../../../../assets/scss/viewCommon.scss";
import { Menu, theme } from "antd";
import { MessageContext } from "../../../../../utility/context/MessageContext";
import "../../../../../assets/scss/viewCommon.scss";
import "../../../../../assets/scss/variables/_variables.scss";

const Sidebar = (props) => {
  const {
    menuCollapsed,
    routerProps,
    menu,
    currentActiveItem,
    skin,
    menuData,
  } = props;
  const verticalBarData = subHeaderContentResponsive;

  const [groupOpen, setGroupOpen] = useState([]);
  const [groupActive, setGroupActive] = useState([]);
  const [currentActiveGroup, setCurrentActiveGroup] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [menuHover, setMenuHover] = useState(false);
  const { t, i18n } = useTranslation();

  const shadowRef = useRef(null);

  const onMouseEnter = () => {
    setMenuHover(true);
  };

  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.add("d-block");
      }
    } else {
      if (shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.remove("d-block");
      }
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refreshToken = useSelector((state) => state.auth.tokens.refreshToken);
  const userDetails = useSelector((state) => state.auth.userDetail);
  const { isLogged } = useSelector((state) => state.auth);
  const layoutStore = useSelector((state) => state.layout);

  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const trustType = useSelector(
    (state) => state.auth.trustDetail?.typeId?.name
  );

  const hasDharmshalaAccess = useSelector(
    (state) => state.auth.trustDetail?.hasDharmshala
  );

  const hasServiceAccess = useSelector(
    (state) => state.auth.trustDetail?.isSevaEnabled
  );

  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(location.pathname);
  const [openKeys, setOpenKeys] = useState([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isMounted, setIsMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const contentWidth = layoutStore.contentWidth;
  const isHidden = layoutStore.menuHidden;

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, history]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Ensure the active state is updated based on the current location
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length > 1) {
      setActive(`/${pathParts[1]}`);
    } else {
      setActive(location.pathname);
    }
  }, [location.pathname]);

  const permissionsKey = permissions?.map((item) => item?.name);

  const getMenuItem = (item) => {
    const hasAllPermission = permissionsKey?.includes("all");
    const hasItemPermission = permissionsKey?.includes(item?.name);
    const hasCattleItemPermission = item?.innerPermissions?.some((perm) =>
      permissionsKey?.includes(perm)
    );

    const hasChildPermission = item?.children?.some(
      (child) =>
        permissionsKey?.includes(child?.name) ||
        child?.innerPermissions?.some((perm) => permissionsKey?.includes(perm))
    );

    const isGaushala =
      (item?.isCattle?.toLowerCase() || item?.name?.toLowerCase()) ===
      trustType?.toLowerCase();

    const isDharmshalaItem = item?.name === "dharmshala/dashboard";
    const isServiceItem = item?.name === "service-booking";
    if (isDharmshalaItem && !hasDharmshalaAccess) {
      return null;
    }

    if (isServiceItem && !hasServiceAccess) {
      return null;
    }

    if (
      ((item?.name === "gaushala" && item?.customLabel === "Pashu Breed") ||
        (item?.name === "gaushala" &&
          item?.customLabel === "Pashu Category")) &&
      !isGaushala
    ) {
      return null;
    }
    if (item?.name === "cattles_management" && !isGaushala) {
      return null; // Exclude "cattles_management" menu item entirely
    }

    const shouldShowItem =
      hasAllPermission ||
      (hasItemPermission && isGaushala) ||
      (hasChildPermission && isGaushala) ||
      (hasItemPermission &&
        !isServiceItem &&
        item?.name !== "cattles_management") ||
      (hasChildPermission &&
        !isServiceItem &&
        item?.name !== "cattles_management") ||
      (isServiceItem &&
        hasServiceAccess &&
        (hasItemPermission || hasChildPermission));

    if (shouldShowItem) {
      const isActive = active.startsWith(item.url);
      const isHovered = hoveredItem === item.name;
      const children = item.children
        ? hasAllPermission
          ? item.children.map(getMenuItem)
          : item.children.map(getMenuItem).filter((child) => child !== null)
        : undefined;

      if (
        hasAllPermission ||
        children?.length > 0 ||
        hasItemPermission ||
        hasChildPermission
      ) {
        return {
          key: item.url,
          icon: (
            <img
              src={isActive || isHovered ? item.activeIcon : item.icon}
              alt={item.name}
              style={{ width: "16px", height: "16px" }}
            />
          ),
          label: <Trans i18nKey={item.customLabel || item.name} />,
          children: children,
          onClick: () => {
            if (!item.children) {
              navigate(item.url);
            }
          },
        };
      }
    }
    return null;
  };
  const handleLogOut = async () => {
    try {
      const res = await authApiInstance.post("auth/logout", { refreshToken });
      toast.success(res.data.message);
      dispatch(logOut());
      navigate("/login");
    } catch (error) {}
  };
  if (!isMounted) return null;
  const handleMenuOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Fragment>
      <div
        className={classnames(
          "main-menu menu-fixed menu-accordion menu-shadow",
          {
            expanded: menuHover || menuCollapsed === false,
            "menu-light": skin !== "semi-dark" && skin !== "dark",
            "menu-dark": skin === "semi-dark" || skin === "dark",
          }
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        {menu ? (
          menu
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            {/* <VerticalMenuHeader
              setGroupOpen={setGroupOpen}
              menuHover={menuHover}
              {...props}
            /> */}
            {/* Vertical Menu Header Shadow */}
            <div className="shadow-bottom" ref={shadowRef}></div>
            <PerfectScrollbar
              className="main-menu-content"
              options={{ wheelPropagation: false }}
              onScrollY={(container) => scrollMenu(container)}
            >
              <ul className="navigation navigation-main">
                <div className="brand-logo">
                  <a href="/dashboard">
                    <img src={logo} alt="logo" className="logo" />
                  </a>
                </div>
                <div className="menu-container">
                <Menu
                  mode="inline"
                  selectedKeys={[active]}
                  openKeys={openKeys}
                  onOpenChange={handleMenuOpenChange}
                  items={subHeaderContentResponsive
                    .map(getMenuItem)
                    .filter(Boolean)}
                  style={{ borderRight: 0, paddingLeft: "7px" }}
                  inlineCollapsed={collapsed}
                />
                </div>
                <li className="nav-item" style={{ marginTop: "5rem" }}>
                  <div
                    className="d-flex align-items-center"
                    style={{ paddingLeft: "20px", paddingRight: "20px" }}
                  >
                    <img src={logOutIcon} width={25} height={25} />
                    <a
                      onClick={() => {
                        Swal.fire({
                          title: `<img src="${confirmationIcon}"/>`,
                          html: `
                            <h3 class="swal-heading mt-1">${t(
                              "logout_msg"
                            )}</h3>
                          `,
                          showCloseButton: false,
                          showCancelButton: true,
                          focusConfirm: true,
                          cancelButtonText: ` ${t("no")}`,
                          cancelButtonAriaLabel: ` ${t("cencel")}`,
                          confirmButtonText: ` ${t("yes")}`,
                          confirmButtonAriaLabel: "Confirm",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            handleLogOut();
                          }
                        });
                      }}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                    >
                      Logout
                    </a>
                  </div>
                  <div
                    className="last-login"
                    style={{
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      marginTop: "10px",
                      wordWrap: "break-word",
                    }}
                  >
                    <strong>Last Login:</strong>
                    <br />
                    {moment(userDetails?.lastLogin).format(
                      "DD MMM YYYY, h:mm a"
                    )}
                  </div>
                </li>
              </ul>
            </PerfectScrollbar>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Sidebar;
