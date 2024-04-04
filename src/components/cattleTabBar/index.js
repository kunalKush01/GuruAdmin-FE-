import { useLayoutEffect } from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

const CattleTabBar = ({ tabs = [], setActive, active, tabBar = false }) => {
  const history = useHistory();

  useLayoutEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div
    // style={{
    //   position: "fixed",
    //   width: "100%",
    //   top: "130px",
    //   zIndex: 100,
    //   background: "#ffffff",
    //   padding: "1rem 0rem",
    // }}
    >
      <Nav
        pills={!tabBar}
        tabs={tabBar}
        style={{
          backgroundColor: !tabBar && "#fff7e8",
          justifyContent: tabs?.length === 5 ? "space-between" : "",
          padding: !tabBar && ".5rem",
          gap: tabBar && "2rem",
          // width: "97%",
          marginBottom: tabBar && 0,
          // margin: "0 auto",
        }}
      >
        {tabs?.map((item, index) => (
          <NavItem key={index}>
            <NavLink
              active={active?.includes(item?.active)}
              onClick={() => history.push(item?.url)}
              style={{
                fontWeight: active?.includes(item?.active) ? 800 : 400,
                color: !active?.includes(item?.active)
                  ? "#583703"
                  : tabBar
                  ? "#583703"
                  : "",
              }}
            >
              <Trans i18nKey={item?.name} />
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </div>
  );
};

export default CattleTabBar;
