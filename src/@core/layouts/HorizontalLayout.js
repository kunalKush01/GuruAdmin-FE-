import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu, Button, theme, ConfigProvider } from "antd";
import { Trans, useTranslation } from "react-i18next";
import moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import logOutIcon from "../../assets/images/icons/dashBoard/Group 5995.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import menuFoldOutlined from "../../assets/images/icons/menu-collapsed.svg";
import menuUnFoldOutlined from "../../assets/images/icons/menu-expand.svg";
import { authApiInstance } from "../../axiosApi/authApiInstans";
import { handleTrustDetail, logOut } from "../../redux/authSlice";

import { handleContentWidth, handleMenuHidden } from "@store/layout";
import Customizer from "@components/customizer";
import { useFooterType } from "@hooks/useFooterType";
import { useNavbarColor } from "@hooks/useNavbarColor";
import { useNavbarType } from "@hooks/useNavbarType";
import { useRTL } from "@hooks/useRTL";
import { useSkin } from "@hooks/useSkin";

import { subHeaderContentResponsive } from "../../utility/subHeaderContent";
import "../../assets/scss/viewCommon.scss";
import "../../assets/scss/variables/_variables.scss";

import bigLogo from "../../assets/images/pages/main-logo.png";
import smallLogo from "../../assets/images/pages/main-logo-small.png";
import UserDropdown from "./components/navbar/";

const { Header, Sider, Content } = Layout;

const SiderLayout = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state.auth);
  const layoutStore = useSelector((state) => state.layout);
  const refreshToken = useSelector((state) => state.auth.tokens.refreshToken);

  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const trustType = useSelector(
    (state) => state.auth.trustDetail?.typeId?.name
  );

  const hasDharmshalaAccess = useSelector(
    (state) => state.auth.trustDetail?.hasDharmshala
  );

  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(location.pathname);
  const [openKeys, setOpenKeys] = useState([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { skin, setSkin } = useSkin();
  const [isRtl] = useRTL();
  const { navbarType, setNavbarType } = useNavbarType();
  const { footerType, setFooterType } = useFooterType();
  const { navbarColor, setNavbarColor } = useNavbarColor();

  const [isMounted, setIsMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const contentWidth = layoutStore.contentWidth;
  const isHidden = layoutStore.menuHidden;

  const setContentWidth = (val) => dispatch(handleContentWidth(val));
  const setIsHidden = (val) => dispatch(handleMenuHidden(val));

  const { t } = useTranslation();

  useEffect(() => {
    if (!isLogged) {
      history.push("/login");
    }
  }, [isLogged, history]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Ensure the active state is updated based on the current location
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length > 1) {
      setActive(`/${pathParts[1]}`);
    } else {
      setActive(location.pathname);
    }
  }, [location.pathname]);

  const permissionsKey = permissions?.map((item) => item?.name);

  const getMenuItem = (item) => {
    const hasAllPermission = permissionsKey?.includes("all");
    const hasItemPermission = permissionsKey?.includes(item?.name);
    const hasCattleItemPermission = item?.innerPermissions?.some((perm) =>
      permissionsKey?.includes(perm)
    );
    const isGaushala =
      item?.isCattle?.toLowerCase() === trustType?.toLowerCase();

      const isDharmshalaItem = item?.name === "dharmshala/dashboard";
      if (isDharmshalaItem && !hasDharmshalaAccess) {
      return null;
      }

    if (
      (hasAllPermission && isGaushala) ||
      (hasCattleItemPermission && isGaushala) ||
      (hasItemPermission && isGaushala) ||
      (hasAllPermission && item?.name !== "cattles_management") ||
      (hasItemPermission && item?.name !== "cattles_management")
    ) {
      const isActive = active.startsWith(item.url);
      const isHovered = hoveredItem === item.name;
      const children = item.children
        ? item.children.map(getMenuItem)
        : undefined;

      return {
        key: item.url,
        icon: (
          <img
            src={isActive || isHovered ? item.activeIcon : item.icon}
            alt={item.name}
            style={{ width: "16px", height: "16px" }}
          />
        ),
        label: <Trans i18nKey={item.customLabel || item.name} />,
        children: children,
        onClick: () => {
          if (!item.children) {
            history.push(item.url);
          }
        },
      };
    }
    return null;
  };

  const handleLogOut = async () => {
    try {
      const res = await authApiInstance.post("auth/logout", { refreshToken });
      toast.success(res.data.message);
      dispatch(logOut());
      localStorage.setItem("trustId", "");
      history.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const confirmLogout = () => {
    Swal.fire({
      title: `<img src="${confirmationIcon}"/>`,
      html: `<h3 class="swal-heading mt-1">${t("logout_msg")}</h3>`,
      showCancelButton: true,
      focusConfirm: true,
      cancelButtonText: ` ${t("no")}`,
      confirmButtonText: ` ${t("yes")}`,
      confirmButtonAriaLabel: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogOut();
      }
    });
  };

  if (!isMounted) return null;

  const handleMenuOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: "var(--primary-color)",
            itemSelectedColor: "white",
          },
        },
      }}
    >
      <Layout className="sider-layout">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="custom-sider"
          width={200}
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "fixed",
            left: 0,
          }}
        >
          <div className="sider-content">
            <div className="logo-container">
              <a href="/dashboard">
                <img
                  src={collapsed ? smallLogo : bigLogo}
                  alt="Logo"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: collapsed ? "56px" : "64px",
                    marginLeft: collapsed ? "50%" : "9px",
                    transform: collapsed ? "translateX(-50%)" : "none",
                  }}
                />
              </a>
            </div>
            <div className="menu-container">
              <Menu
                mode="inline"
                selectedKeys={[active]}
                openKeys={openKeys}
                onOpenChange={handleMenuOpenChange}
                items={subHeaderContentResponsive
                  .map(getMenuItem)
                  .filter(Boolean)}
                style={{ borderRight: 0, paddingLeft: "7px" }}
                inlineCollapsed={collapsed}
              />
            </div>
            <div className="sider-footer">
              <Menu
                mode="inline"
                selectable={false}
                style={{ borderTop: "1px solid #f0f0f0", paddingLeft: "7px" }}
                inlineCollapsed={collapsed}
              >
                <Menu.Item
                  key="Logout"
                  icon={
                    <img
                      src={logOutIcon}
                      alt="Logout"
                      style={{ width: "16px", height: "16px" }}
                    />
                  }
                  onClick={confirmLogout}
                  style={{ padding: collapsed ? "0" : "0 16px" }}
                >
                  {!collapsed && <Trans i18nKey="Logout" />}
                </Menu.Item>
              </Menu>
              {!collapsed && (
                <div className="last-login">
                  <div>
                    <Trans i18nKey={"last_login"} />
                  </div>
                  <div>{moment().format("DD MMM YYYY, h:mm a")}</div>
                </div>
              )}
            </div>
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="text"
              icon={
                collapsed ? (
                  <img
                    src={menuUnFoldOutlined}
                    alt="Menu Unfold Icon"
                    style={{ width: "22px" }}
                  />
                ) : (
                  <img
                    src={menuFoldOutlined}
                    alt="Menu fold Icon"
                    style={{ width: "22px" }}
                  />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              {props.navbar ? props.navbar : <UserDropdown />}
            </div>
          </Header>
          <Content
            style={{
              padding: 24,
              minHeight: "calc(100vh - 64px)",
              background: "FAFAFA",
              borderRadius: borderRadiusLG,
              overflow: "auto",
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
      {props.customizer && (
        <Customizer
          skin={skin}
          setSkin={setSkin}
          footerType={footerType}
          setFooterType={setFooterType}
          navbarType={navbarType}
          setNavbarType={setNavbarType}
          navbarColor={navbarColor}
          setNavbarColor={setNavbarColor}
          isRtl={isRtl}
          layout={props.layout}
          setLastLayout={props.setLastLayout}
          setLayout={props.setLayout}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          contentWidth={contentWidth}
          setContentWidth={setContentWidth}
          transition={props.transition}
          setTransition={props.setTransition}
          themeConfig={props.themeConfig}
        />
      )}
    </ConfigProvider>
  );
};

export default SiderLayout;
