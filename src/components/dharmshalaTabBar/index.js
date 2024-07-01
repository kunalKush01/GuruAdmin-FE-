import React, { useLayoutEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import BookingIcon from '../../assets/images/icons/dharmshala/booking.svg';
import BuildingIcon from '../../assets/images/icons/dharmshala/building.svg';
import DharmshalaIcon from '../../assets/images/icons/dharmshala/dharmshala.svg';
import FeedbackIcon from '../../assets/images/icons/dharmshala/feedback.svg';
import RoomTypeIcon from '../../assets/images/icons/dharmshala/roomtype.svg';
import './DharmshalaTabBar.css';

const DharmshalaTabBar = ({ tabs = [], setActive, active, tabBar = false }) => {
  const history = useHistory();
  const permissions = useSelector((state) => state.auth.userDetail?.permissions);
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
      case 'buildings':
        return <img src={BuildingIcon} alt="building" className="tab-icon" />;
      case 'dharmshalas':
        return <img src={DharmshalaIcon} alt="dharmshala" className="tab-icon" />;
      case 'bookings':
        return <img src={BookingIcon} alt="booking" className="tab-icon" />;
      case 'feedback':
        return <img src={FeedbackIcon} alt="feedback" className="tab-icon" />;
      case 'roomtype':
        return <img src={RoomTypeIcon} alt="roomtype" className="tab-icon" />;
      default:
        return name.charAt(0);
    }
  };


  return (
    <div>
      <Nav
        pills={!tabBar}
        tabs={tabBar}
        className={`tab-bar ${isMobile ? 'mobile' : ''}`}
        style={{
          justifyContent: permissionsKey?.includes("all") ? "space-between" : "",
          padding: !tabBar && !isMobile ? ".5rem" : "",
          gap: tabBar && permissionsKey?.includes("all") ? "0.5rem" : "1rem",
          marginBottom: tabBar && 0,
          display: "flex",
          flexWrap: "nowrap",
          //overflowX: isMobile ? "hidden" : "visible",
          flexDirection: isMobile ? "row" : "row",
          flexWrap: isMobile ? "nowrap" : "wrap",
        }}
      >
        {tabs?.map((item, index) => {
          const permissionTabs = item?.permissionKey?.some((perm) => permissionsKey?.includes(perm));
          const url = item?.permissionKey?.filter((perm) => permissionsKey?.includes(perm));

          if (permissionTabs || permissionsKey?.includes("all")) {
            return (
              <NavItem
                key={index}
                className={`nav-item ${isMobile ? 'mobile' : ''}`}
                onMouseEnter={() => isMobile && setHoveredTab(index)}
                onMouseLeave={() => isMobile && setHoveredTab(null)}
              >
                <NavLink
                  active={active?.includes(item?.active)}
                  onClick={() => {
                    item?.isManagment && !permissionsKey?.includes("all")
                      ? history.push(`${item?.url}/${url[0]?.split("-")[1]}`)
                      : history.push(item?.url);
                  }}
                  className={isMobile ? 'mobile-link' : 'desktop-link'}
                >
                  {isMobile ? (
                    <div className={`circle ${hoveredTab === index ? 'hover' : active?.includes(item?.active) ? 'active' : ''}`}>
                      {getIcon(item.name)}
                    </div>
                  ) : (
                    <Trans i18nKey={item?.name} />
                  )}
                  {isMobile && <div className="tab-name"><Trans i18nKey={item?.name} /></div>}
                </NavLink>
              </NavItem>
            );
          } else {
            return null;
          }
        })}
      </Nav>
    </div>
  );
};

export default DharmshalaTabBar;
