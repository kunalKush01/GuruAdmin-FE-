import { useLayoutEffect } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const CattleTabBar = ({ tabs = [], setActive, active }) => {
  const navigate = useNavigate();
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const permissionsKey = permissions?.map((item) => item?.name);

  useLayoutEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const handleTabChange = (key) => {
    const selectedTab = tabs.find((tab) => tab.url === key);
    if (selectedTab?.isManagment && !permissionsKey?.includes("all")) {
      const url = selectedTab.permissionKey?.find((perm) =>
        permissionsKey?.includes(perm)
      );
      navigate(`${selectedTab.url}/${url?.split("-")[1]}`);
    } else {
      navigate(key);
    }
  };

  return (
    <Tabs
      activeKey={active}
      onChange={handleTabChange}
      tabBarStyle={{
        justifyContent: permissionsKey?.includes("all")
          ? "space-between"
          : "flex-start",
        // padding: ".5rem",
        // gap: permissionsKey?.includes("all") ? "2rem" : "4rem",
        //marginBottom: 0,
      }}
    >
      {tabs?.map((item, index) => {
        const permissionTabs = item?.permissionKey?.some((perm) =>
          permissionsKey?.includes(perm)
        );

        if (permissionTabs || permissionsKey?.includes("all")) {
          return (
            <TabPane
              tab={
                <span
                  style={{
                    fontWeight: active?.includes(item?.active) ? 800 : 400,
                    color: !active?.includes(item?.active)
                      ? "#583703"
                      : "#583703",
                  }}
                >
                  <Trans i18nKey={item.name} />
                </span>
              }
              key={item.url}
            />
          );
        } else {
          return null;
        }
      })}
    </Tabs>
  );
};

export default CattleTabBar;
