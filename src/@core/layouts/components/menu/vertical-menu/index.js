import React, { Fragment, useRef, useState } from "react";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import logOutIcon from "../../../../../assets/images/icons/dashBoard/Group 5995.svg";
import confirmationIcon from "../../../../../assets/images/icons/news/conformationIcon.svg";
import { authApiInstance } from "../../../../../axiosApi/authApiInstans";
import { logOut } from "../../../../../redux/authSlice";
import { subHeaderContentResponsive } from "../../../../../utility/subHeaderContent";
import VerticalMenuHeader from "./VerticalMenuHeader";
import VerticalNavMenuItems from "./VerticalNavMenuItems";

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
  const history = useHistory();
  const refreshToken = useSelector((state) => state.auth.tokens.refreshToken);
  const userDetails = useSelector((state) => state.auth.userDetail);

  const handleLogOut = async () => {
    try {
      const res = await authApiInstance.post("auth/logout", { refreshToken });
      toast.success(res.data.message);
      dispatch(logOut());
      history.push("/login");
    } catch (error) {}
  };

  const { t, i18n } = useTranslation();

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
                <VerticalNavMenuItems
                  items={verticalBarData}
                  menuData={verticalBarData}
                  menuHover={menuHover}
                  groupOpen={groupOpen}
                  activeItem={activeItem}
                  groupActive={groupActive}
                  currentActiveGroup={currentActiveGroup}
                  routerProps={routerProps}
                  setGroupOpen={setGroupOpen}
                  menuCollapsed={menuCollapsed}
                  setActiveItem={setActiveItem}
                  setGroupActive={setGroupActive}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                  currentActiveItem={currentActiveItem}
                />
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
                            <h3 class="swal-heading mt-1">${t("logout_msg")}</h3>
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
                      wordWrap: "break-word"
                    }}
                  >
                    <strong>Last Login:</strong><br />
                    {moment(userDetails?.lastLogin).format("DD MMM YYYY, h:mm a")}
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
