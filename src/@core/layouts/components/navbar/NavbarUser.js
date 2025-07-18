// ** React Imports
import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from "react";

// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";

// ** Third Party Components
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NavItem, NavLink } from "reactstrap";
import bellIcon from "../../../../assets/images/icons/dashBoard/Group 5996.svg";
import menuPanelIcon from "../../../../assets/images/icons/dashBoard/icn_MenuPanel.svg";
import { authApiInstance } from "../../../../axiosApi/authApiInstans";
import { handleTrustDetail, logOut } from "../../../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import internetIcon from "../../../../assets/images/icons/internet.svg";
import LangModel from "../langModel";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loginPage } from "../../../../api/loginPageApi";
import { getAllNotification } from "../../../../api/notification";
import "../../../../assets/scss/viewCommon.scss";
import CustomSearchBar from "../../../../components/partials/customSearchBar";
import { isSerchable } from "../../../../utility/localSerachBar";

const NavbarUser = (props) => {
  const navigate = useNavigate();
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
      <div
        className="navbar-user-wrapper d-flex justify-content-between w-100 align-items-center"
        style={{ flex: 1 }}
      >
        {process.env.REACT_APP_ENVIRONMENT !== "production" && (
          <div className="dev-flag">
            {process.env.REACT_APP_ENVIRONMENT.charAt(0).toUpperCase() +
              process.env.REACT_APP_ENVIRONMENT.slice(1)}{" "}
            Environment
          </div>
        )}

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
          style={{ marginLeft: "auto" }}
        >
          <div className="d-flex">
            <img
              className="icon"
              onClick={() => {
                const currentUrl = window.location.hostname;
                const protocol = window.location.protocol;
                const port = window.location.port;
                // Combine them into a full URL
                let fullUrl = protocol + "//" + currentUrl;
                let newUrl = fullUrl.replace("admin.", "");
                if (port) {
                  // If a port is specified, include it in the URL
                  newUrl += ":" + port;
                }

                window.open(newUrl, "_blank");
              }}
              src={internetIcon}
              style={{ width: "18px" }}
              title="Open Website"
            />
            <img
              className="icon"
              onClick={() => setlangSelection(true)}
              src={menuPanelIcon}
              title="Change Language"
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
                onClick={() => navigate("/notification")}
              />
            </div>
          </div>
          <ul className="nav navbar-nav align-items-center">
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "4px" }}
            >
              <div className="nave-para">
                <div
                  className="temple-name text-end d-none d-xl-block text-truncate"
                  style={{ maxWidth: "130px" }}
                  title={trustDetails?.name}
                >
                  {ConverFirstLatterToCapital(trustDetails?.name ?? "")}
                </div>
                <div
                  className="text-end d-none d-xl-block text-truncate"
                  style={{ fontSize: "15px", lineHeight: "16px" }}
                  title={userDetails?.name}
                >
                  {ConverFirstLatterToCapital(userDetails?.name ?? "")}
                </div>
              </div>
              <div onClick={() => navigate("/edit-profile")}>
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
