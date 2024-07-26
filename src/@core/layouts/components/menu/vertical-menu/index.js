// ** React Imports
import { Fragment, useRef, useState } from "react";

// ** Third Party Components
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Vertical Menu Components
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import logOutIcon from "../../../../../assets/images/icons/dashBoard/Group 5995.svg";
import confirmationIcon from "../../../../../assets/images/icons/news/conformationIcon.svg";
import { authApiInstance } from "../../../../../axiosApi/authApiInstans";
import { logOut } from "../../../../../redux/authSlice";
import { subHeaderContentResponsive } from "../../../../../utility/subHeaderContent";
import VerticalMenuHeader from "./VerticalMenuHeader";
import VerticalNavMenuItems from "./VerticalNavMenuItems";

const Sidebar = (props) => {
  // ** Props
  const {
    menuCollapsed,
    routerProps,
    menu,
    currentActiveItem,
    skin,
    menuData,
  } = props;
  const verticalBarData = subHeaderContentResponsive;

  // ** States
  const [groupOpen, setGroupOpen] = useState([]);
  const [groupActive, setGroupActive] = useState([]);
  const [currentActiveGroup, setCurrentActiveGroup] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false);

  // ** Ref
  const shadowRef = useRef(null);

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    setMenuHover(true);
  };

  // ** Scroll Menu
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
            {/* Perfect Scrollbar */}
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
                <li className="nav-item " style={{ marginTop: "5rem" }}>
                  <div
                    className="d-flex align-items-center"
                    style={{ paddingLeft: "30px" }}
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
                    >
                      Logout
                    </a>
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
