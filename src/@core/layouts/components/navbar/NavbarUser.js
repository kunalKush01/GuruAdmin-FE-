// ** React Imports
import { Fragment, useEffect, useMemo, useState } from "react";

// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";

// ** Third Party Components
import { Moon, Sun } from "react-feather";

// ** Reactstrap Imports
import moment from "moment";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Input,
  InputGroup,
  InputGroupText,
  Link,
  NavItem,
  NavLink,
} from "reactstrap";
import styled from "styled-components";
import logOutIcon from "../../../../assets/images/icons/dashBoard/Group 5995.svg";
import bellIcon from "../../../../assets/images/icons/dashBoard/Group 5996.svg";
import searchIcon from "../../../../assets/images/icons/dashBoard/Group 5997.svg";
import menuPanelIcon from "../../../../assets/images/icons/dashBoard/icn_MenuPanel.svg";
import confirmationIcon from "../../../../assets/images/icons/news/conformationIcon.svg";
import { authApiInstance } from "../../../../axiosApi/authApiInstans";
import {
  handleTrustDetail,
  logOut,
  setSearchbarValue,
} from "../../../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import LangModel from "../langModel";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { loginPage } from "../../../../api/loginPageApi";
import {
  getAllNotification,
  readNotification,
} from "../../../../api/notification";
import logo from "../../../../assets/images/pages/main-logo.svg";
import CustomSearchBar from "../../../../components/partials/customSearchBar";
import {
  isSerchable,
  setPlaceholderSerchbar,
} from "../../../../utility/localSerachBar";

const NavbarUserWarraper = styled.div`
  color: #583703 !important ;
  .brand-logo div {
    font: normal normal bold 25px/44px noto sans;
    margin-right: 80px;
    cursor: pointer;
  }
  .searchinput {
    background: #f2f2f2 !important ;
    &.sInput {
      border-end-end-radius: 0% !important ;
      border-start-end-radius: 0% !important ;
      font: normal normal 400 16px/20px noto sans;
    }
    &.sIconsBox {
      border-start-start-radius: 0% !important;
      border-end-start-radius: 0% !important;
      cursor: pointer;
    }
  }
  img {
    width: 35px;
    /* margin: 10px; */
  }
  .icon {
    margin-inline-start: 15px;
    cursor: pointer;
  }
  .navepara {
    width: max-content;
    margin: 10px;
    cursor: pointer;
  }
  .templeName {
    font: normal normal bold 16px/30px noto sans;
  }
  .date {
    font: normal normal normal 10px/20px noto sans;
  }
  .notificationNumber {
    background: red;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    align-items: center;
    display: flex;
    justify-content: center;
    color: #ffffff;
    font-size: 10px;
    font-weight: 900;
    position: absolute;
    right: 0;
    bottom: 20px;
    left: 35px;
  }
  .shakeBell {
    animation: ring 4s 0.7s ease-in-out infinite;
    transform-origin: 50% 4px;
  }

  .logo {
    width: 150px;
    height: 35px;
    object-fit: cover;
    object-position: center;
  }

  @keyframes ring {
    0% {
      transform: rotate(0);
    }
    1% {
      transform: rotate(30deg);
    }
    3% {
      transform: rotate(-28deg);
    }
    5% {
      transform: rotate(34deg);
    }
    7% {
      transform: rotate(-32deg);
    }
    9% {
      transform: rotate(30deg);
    }
    11% {
      transform: rotate(-28deg);
    }
    13% {
      transform: rotate(26deg);
    }
    15% {
      transform: rotate(-24deg);
    }
    17% {
      transform: rotate(22deg);
    }
    19% {
      transform: rotate(-20deg);
    }
    21% {
      transform: rotate(18deg);
    }
    23% {
      transform: rotate(-16deg);
    }
    25% {
      transform: rotate(14deg);
    }
    27% {
      transform: rotate(-12deg);
    }
    29% {
      transform: rotate(10deg);
    }
    31% {
      transform: rotate(-8deg);
    }
    33% {
      transform: rotate(6deg);
    }
    35% {
      transform: rotate(-4deg);
    }
    37% {
      transform: rotate(2deg);
    }
    39% {
      transform: rotate(-1deg);
    }
    41% {
      transform: rotate(1deg);
    }

    43% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(0);
    }
  }
  @media only screen and (max-width: 576px) {
    .displayBlock {
      display: block !important;
    }
    .displayNone {
      display: none !important;
    }
  }
`;
const NavbarUser = (props) => {
  const history = useHistory();
  const trustDetails = useSelector((state) => state.auth.trustDetail);
  const userDetails = useSelector((state) => state.auth.userDetail);
  const refreshToken = useSelector((state) => state.auth.tokens.refreshToken);
  const searchBarValue = useSelector((state) => state.auth.LocalSearch);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const handleLogOut = async () => {
    try {
      const res = await authApiInstance.post("auth/logout", { refreshToken });
      toast.success(res.data.message);
      dispatch(logOut());
    } catch (error) {}
  };
  const [langSelection, setlangSelection] = useState(false);

  const [searchBarState, setSearchBarState] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const notificationQuery = useQuery(
    ["notificationMessagePing", pagination.page],
    async () =>
      await getAllNotification({
        ...pagination,
      })
  );
  const allUnReadMessage = useMemo(
    () => notificationQuery?.data ?? [],
    [notificationQuery]
  );
  const notificationInvalidateQuery = useQueryClient();

  const [notificationMessagePing, setNotificationMessagePing] = useState(
    allUnReadMessage?.unSeenCount ?? 0
  );
  useEffect(() => {
    if (location.pathname === "/notification") {
      setTimeout(() => {
        notificationInvalidateQuery.invalidateQueries([
          "notificationMessagePing",
        ]);
        setNotificationMessagePing(0);
      }, 1000);
    }
  }, [allUnReadMessage, location?.pathname]);

  const subdomainChange = process.env.REACT_APP_ADMIN_SUBDOMAIN_REPLACE_URL;
  
  // const subDomainName = location.hostname.replace(subdomainChange, "");
  const subDomainName = location.hostname.replace("-dev.localhost", "");

  const loginPageQuery = useQuery([subDomainName], () =>
    loginPage(subDomainName)
  );

  const loginPageData = useMemo(
    () => loginPageQuery?.data?.result,
    dispatch(handleTrustDetail(loginPageQuery?.data?.result))[loginPageQuery]
  );

  return (
    <Fragment>
      <NavbarUserWarraper className="d-flex justify-content-between w-100 align-items-center  ">
        <div className="bookmark-wrapper d-flex align-items-center">
          <NavItem className="d-none d-lg-block">
            <NavLink to="/" className="navbar-brand">
              <div className="brand-logo">
                <img src={logo} alt="logo" className="logo" />
                {/* <div><img /></div> */}
              </div>
              <div className="date d-none d-xl-block">
                <Trans i18nKey={"last_login"} />:{" "}
                {moment().format("DD MMM YYYY,h:mm a")}
              </div>
              {/* <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2> */}
            </NavLink>
          </NavItem>
        </div>
        {isSerchable() && (
          <CustomSearchBar
            setSearchBarState={setSearchBarState}
            searchBarState={searchBarState}
          />
        )}
        <div
          className={`d-flex justify-content-end align-items-center ${
            searchBarState ? "displayNone" : ""
          }`}
        >
          <div className="d-flex">
            <img
              className="icon"
              onClick={() => setlangSelection(true)}
              src={menuPanelIcon}
            />
            <div className="position-relative">
              {allUnReadMessage?.unSeenCount > 0 &&
                notificationMessagePing !== "/notification" && (
                  <div className="notificationNumber">
                    {allUnReadMessage?.unSeenCount < 9
                      ? `0${allUnReadMessage?.unSeenCount}`
                      : allUnReadMessage?.unSeenCount}
                  </div>
                )}
              <img
                className={`icon ${
                  allUnReadMessage?.unSeenCount > 0 &&
                  notificationMessagePing !== "/notification"
                    ? "shakeBell"
                    : ""
                }`}
                src={bellIcon}
                onClick={() => history.push("/notification")}
              />
            </div>
            {/* <img className="icon d-none d-xl-block" src={logOutIcon} onClick={handleLogOut} /> */}
            <img
              className="icon d-none d-xl-block"
              src={logOutIcon}
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
            />
          </div>
          <ul className="nav navbar-nav align-items-center ">
            <div className="d-flex align-items-center">
              <div className="navepara">
                <div
                  className="templeName text-end d-none d-xl-block text-truncate "
                  style={{ maxWidth: "130px" }}
                  title={trustDetails?.name}
                >
                  {ConverFirstLatterToCapital(trustDetails?.name ?? "")}
                </div>
                <div
                  className="text-end d-none d-xl-block text-truncate "
                  style={{ fontSize: "15px", lineHeight: "16px" }}
                  title={userDetails?.name}
                >
                  {ConverFirstLatterToCapital(userDetails?.name ?? "")}
                </div>
              </div>
              <div
                onClick={
                  () => history.push("/edit-profile")
                  // Swal.fire({
                  //   icon: "info",
                  //   title: "Oops...",
                  //   text: "Edit profile is Under Development!",
                  //   showConfirmButton: false,
                  //   showCloseButton: true,
                  // })
                }
              >
                <UserDropdown />
              </div>
            </div>
          </ul>
        </div>
      </NavbarUserWarraper>
      <LangModel
        langSelection={langSelection}
        setlangSelection={setlangSelection}
      />
    </Fragment>
  );
};
export default NavbarUser;
