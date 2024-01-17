import { useLayoutEffect } from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

const CattleTabBar = ({ tabs = [], setActive, active }) => {
  const history = useHistory();

  useLayoutEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div>
      <Nav
        pills
        style={{
          backgroundColor: "#fff7e8",
          justifyContent: "space-between",
          padding: ".5rem",
        }}
      >
        {tabs?.map((item, index) => (
          <NavItem key={index}>
            <NavLink
              active={active?.includes(item?.url)}
              onClick={() => history.push(item?.url)}
              style={{
                fontWeight: active?.includes(item?.url) && 800,
                color: !active?.includes(item?.url) && "#583703",
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
