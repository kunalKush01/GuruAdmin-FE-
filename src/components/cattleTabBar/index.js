import { useLayoutEffect } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

const CattleTabBar = ({ tabs = [], setActive, active, tabBar = false }) => {
  const history = useHistory();
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );

  const permissionsKey = permissions?.map((item) => item?.name);

  useLayoutEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div>
      <Nav
        pills={!tabBar}
        tabs={tabBar}
        style={{
          backgroundColor: !tabBar && "#fff7e8",
          justifyContent: permissionsKey?.includes("all")
            ? "space-between"
            : "",
          padding: !tabBar && ".5rem",
          gap: tabBar && permissionsKey?.includes("all") ? "2rem" : "4rem",
          marginBottom: tabBar && 0,
        }}
      >
        {tabs?.map((item, index) => {
          const permissionTabs = item?.permissionKey?.some((item) =>
            permissionsKey?.includes(item)
          );
          const url = item?.permissionKey?.filter((item) =>
            permissionsKey?.includes(item)
          );
          console.log(
            "permissionTabs",
            url[0]?.split("-")[1],
            item?.permissionKey,
            permissionsKey,
            permissionTabs
          );

          if (permissionTabs || permissionsKey?.includes("all")) {
            return (
              <NavItem key={index}>
                <NavLink
                  active={active?.includes(item?.active)}
                  onClick={() => {
                    console.log("item?.isManagment", item?.isManagment);
                    item?.isManagment
                      ? history.push(`${item?.url}/${url[0]?.split("-")[1]}`)
                      : history.push(item?.url);
                  }}
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
            );
          } else {
            return null;
          }
        })}
      </Nav>
    </div>
  );
};

export default CattleTabBar;
