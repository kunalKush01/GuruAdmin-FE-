// ** React Imports
import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from "react";

// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";

// ** Third Party Components
import moment from "moment";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { NavItem, NavLink } from "reactstrap";
import logOutIcon from "../../../../assets/images/icons/dashBoard/Group 5995.svg";
import bellIcon from "../../../../assets/images/icons/dashBoard/Group 5996.svg";
import menuPanelIcon from "../../../../assets/images/icons/dashBoard/icn_MenuPanel.svg";
import confirmationIcon from "../../../../assets/images/icons/news/conformationIcon.svg";
import { authApiInstance } from "../../../../axiosApi/authApiInstans";
import { handleTrustDetail, logOut } from "../../../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import LangModel from "../langModel";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { loginPage } from "../../../../api/loginPageApi";
import { getAllNotification } from "../../../../api/notification";
import logo from "../../../../assets/images/pages/main-logo.png";
import CustomSearchBar from "../../../../components/partials/customSearchBar";
import { isSerchable } from "../../../../utility/localSerachBar";
import "../../../../assets/scss/viewCommon.scss";

const NavbarUser = (props) => {
  const history = useHistory();
  const trustDetails = useSelector((state) => state.auth.trustDetail);
  const userDetails = useSelector((state) => state.auth.userDetail);
  const refreshToken = useSelector((state) => state.auth.tokens.refreshToken);
  const searchBarValue = useSelector((state) => state.auth.LocalSearch);
  const hostname = location.hostname;

  useLayoutEffect(() => {
    if (hostname == process.env.REACT_APP_ADMIN_URL) {
      dispatch(logOut());
      localStorage.setItem("trustId", "");
    }
  }, []);

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
  const subdomainChange = process.env.REACT_APP_ADMIN_SUBDOMAIN_REPLACE_URL;

  let subDomainName;
  if (hostname !== process.env.REACT_APP_ADMIN_URL) {
    subDomainName = hostname.replace(subdomainChange, "");
  } else {
    subDomainName = hostname.replace(
      process.env.REACT_APP_GENERIC_ADMIN_SUBDOMAIN_REPLACE_URL,
      ""
    );
  }

  const loginPageQuery = useQuery([subDomainName], () =>
    loginPage(subDomainName)
  );

  const loginPageData = useMemo(
    () => loginPageQuery?.data?.result ?? {},
    dispatch(handleTrustDetail(loginPageQuery?.data?.result)),
    [loginPageQuery]
  );

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

  return (
    <Fragment>
      <div className="navbar-user-wrapper d-flex justify-content-between w-100 align-items-center">
        <div className="bookmark-wrapper d-flex align-items-center">
          <NavItem className="d-none d-lg-block">
            <NavLink to="/" className="navbar-brand">
              {/* <div className="brand-logo">
                <img src={logo} alt="logo" className="logo" />
              </div> */}
              {/* <div className="date d-none d-xl-block">
                <Trans i18nKey={"last_login"} />:{" "}
                {moment().format("DD MMM YYYY,h:mm a")}
              </div> */}
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
            searchBarState ? "display-none" : ""
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
                  <div className="notification-number">
                    {allUnReadMessage?.unSeenCount < 9
                      ? `0${allUnReadMessage?.unSeenCount}`
                      : allUnReadMessage?.unSeenCount}
                  </div>
                )}
              <img
                className={`icon ${
                  allUnReadMessage?.unSeenCount > 0 &&
                  notificationMessagePing !== "/notification"
                    ? "shake-bell"
                    : ""
                }`}
                src={bellIcon}
                onClick={() => history.push("/notification")}
              />
            </div>
            {/* <img
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
                    localStorage.setItem("trustId", "");
                  }
                });
              }}
            /> */}
          </div>
          <ul className="nav navbar-nav align-items-center ">
            <div className="d-flex align-items-center" style={{ marginRight: '26px' }}>
              <div className="nave-para">
                <div
                  className="temple-name text-end d-none d-xl-block text-truncate "
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
              <div onClick={() => history.push("/edit-profile")}>
                <UserDropdown />
              </div>
            </div>
          </ul>
        </div>
      </div>
      <LangModel
        langSelection={langSelection}
        setlangSelection={setlangSelection}
      />
    </Fragment>
  );
};
export default NavbarUser;
