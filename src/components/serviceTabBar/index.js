import React, { useLayoutEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import styled from "styled-components";
import BookingIcon from "../../assets/images/icons/dharmshala/booking.svg";
import ServicesIcon from "../../assets/images/icons/dharmshala/booking.svg";
import "../../assets/scss/tabbar.scss";

const SevaTabBar = ({ tabs = [], setActive, active, tabBar = false }) => {
  const history = useHistory();
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const permissionsKey = permissions?.map((item) => item?.name);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredTab, setHoveredTab] = useState(null);

  useLayoutEffect(() => {
    setActive(location.pathname);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname, setActive]);

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case "bookings":
        return <img src={BookingIcon} alt="booking" className="tab-icon" />;
      case "services":
        return <img src={ServicesIcon} alt="services" className="tab-icon" />;
      default:
        return name.charAt(0);
    }
  };

  return (
    <div>
      {isMobile ? (
        <Nav
          pills={!tabBar}
          tabs={tabBar}
          className={`tab-bar ${isMobile ? "mobile" : ""}`}
          style={{
            justifyContent: permissionsKey?.includes("all")
              ? "space-between"
              : "",
            padding: !tabBar && !isMobile ? ".5rem" : "",
            gap: tabBar && permissionsKey?.includes("all") ? "0.5rem" : "1rem" || isMobile? "0rem" : "1rem",
            marginBottom: tabBar && 0,
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: isMobile ? "row" : "row",
            flexWrap: isMobile ? "nowrap" : "wrap",
            overflowX: isMobile ? "scroll" : "none",
          }}
        >
          {tabs?.map((item, index) => {
            const permissionTabs = item?.permissionKey?.some((perm) =>
              permissionsKey?.includes(perm)
            );
            const url = item?.permissionKey?.filter((perm) =>
              permissionsKey?.includes(perm)
            );

            if (permissionTabs || permissionsKey?.includes("all")) {
              return (
                <NavItem
                  key={index}
                  className={`nav-item ${isMobile ? "mobile" : ""}`}
                  onMouseEnter={() => isMobile && setHoveredTab(index)}
                  onMouseLeave={() => isMobile && setHoveredTab(null)}
                >
                  <NavLink
                    active={typeof active === 'string' && active?.includes(item?.active)}
                    onClick={() => {
                      item?.isManagment && !permissionsKey?.includes("all")
                        ? history.push(`${item?.url}/${url[0]?.split("-")[1]}`)
                        : history.push(item?.url);
                    }}
                    className={isMobile ? "mobile-link" : "desktop-link"}
                  >
                    {isMobile ? (
                      <div
                        className={`circle ${
                          hoveredTab === index
                            ? "hover"
                            : typeof active === 'string' && active?.includes(item?.active)
                            ? "active"
                            : ""
                        }`}
                      >
                        {/* {getIcon(item.name)} */}
                      </div>
                    ) : (
                      <Trans i18nKey={item?.name} />
                    )}
                    {isMobile && (
                      <div className="tab-name">
                        <Trans i18nKey={item?.name} />
                      </div>
                    )}
                  </NavLink>
                </NavItem>
              );
            } else {
              return null;
            }
          })}
        </Nav>
      ) : (
        <div className="TabsWrapper">
          <div className="d-flex flex-lg-wrap gap-3 mt-2 allTabBox">
            {tabs?.map((item, idx) => {
              const permissionTabs = item?.permissionKey?.some((perm) =>
                permissionsKey?.includes(perm)
              );
              const url = item?.permissionKey?.filter((perm) =>
                permissionsKey?.includes(perm)
              );

              if (permissionTabs || permissionsKey?.includes("all")) {
                return (
                  <div
                    key={idx}
                    className={`tabName ${
                      typeof active === 'string' && active?.includes(item?.active) ? "activeTab" : ""
                    }`}
                    onClick={() => {
                      if (active?.includes(item?.active)) return;
                      setActive(item);
                      item?.isManagment && !permissionsKey?.includes("all")
                        ? history.push(`${item?.url}/${url[0]?.split("-")[1]}`)
                        : history.push(item?.url);
                    }}
                  >
                    <Trans i18nKey={item?.name} />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
          <div>
            <hr />
          </div>
        </div>
      )}
    </div>
  );
};

export default SevaTabBar;