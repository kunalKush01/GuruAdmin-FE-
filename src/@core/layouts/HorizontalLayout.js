import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu, Button, theme, ConfigProvider } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Trans } from "react-i18next";

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
import smallLogo from "../../assets/images/pages/main-logo.png";
import UserDropdown from "./components/navbar/";

const { Header, Sider, Content } = Layout;

const SiderLayout = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state.auth);
  const layoutStore = useSelector((state) => state.layout);
  const permissions = useSelector((state) => state.auth.userDetail?.permissions);
  const trustType = useSelector((state) => state.auth.trustDetail?.typeId?.name);

  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(location.pathname);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { skin, setSkin } = useSkin();
  const [isRtl] = useRTL();
  const { navbarType, setNavbarType } = useNavbarType();
  const { footerType, setFooterType } = useFooterType();
  const { navbarColor, setNavbarColor } = useNavbarColor();

  const [isMounted, setIsMounted] = useState(false);

  const contentWidth = layoutStore.contentWidth;
  const isHidden = layoutStore.menuHidden;

  const setContentWidth = (val) => dispatch(handleContentWidth(val));
  const setIsHidden = (val) => dispatch(handleMenuHidden(val));

  useEffect(() => {
    !isLogged && history.push("/login");
  }, [isLogged, history]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    console.log('Active path:', location.pathname);
    setActive(location.pathname);
  }, [location.pathname]);

  const {
    children,
    navbar,
    customizer,
    setLastLayout,
    setLayout,
    transition,
    setTransition,
    themeConfig,
  } = props;

  const permissionsKey = permissions?.map((item) => item?.name);

  const getMenuItem = (item) => {
    const hasAllPermission = permissionsKey?.includes("all");
    const hasItemPermission = permissionsKey?.includes(item?.name);
    const hasCattleItemPermission = item?.innerPermissions?.some(
      (perm) => permissionsKey?.includes(perm)
    );
    const isGaushala = item?.isCattle?.toLowerCase() === trustType?.toLowerCase();

    if (
      (hasAllPermission && isGaushala) ||
      (hasCattleItemPermission && isGaushala) ||
      (hasItemPermission && isGaushala) ||
      (hasAllPermission && item?.name !== "cattles_management") ||
      (hasItemPermission && item?.name !== "cattles_management")
    ) {
      return {
        key: item.name,
        icon: item.icon ? (
          <img
            src={item.icon}
            alt={item.name}
            style={{ width: "16px", height: "16px" }}
          />
        ) : null,
        label: (
          <div
            onClick={() => {
              !item.children && history.push(item.name);
            }}
            className={`menu-item-label ${
              active?.startsWith(item.activeTab) ? "active-tab" : ""
            }`}
          >
            <Trans i18nKey={item.name} />
          </div>
        ),
        children: item.children ? item.children.map(getMenuItem) : undefined,
      };
    }
    return null;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: 'var(--primary-color)',
            itemSelectedColor: 'white',
          },
        },
      }}
    >
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} className="custom-sider">
          <div className="logo-container" style={{ padding: "16px 16px 16px 24px", textAlign: "left" }}>
            <img
              src={collapsed ? smallLogo : bigLogo}
              alt="Logo"
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: collapsed ? "32px" : "64px",
              }}
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={[active.split('/')[1] || '']}
            items={subHeaderContentResponsive.map(getMenuItem).filter(Boolean)}
            style={{ paddingLeft: 0 }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              {navbar ? navbar : <UserDropdown />}
            </div>
          </Header>
          <Content
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 64px)',
              background: 'FAFAFA',
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
      {customizer && (
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
          setLastLayout={setLastLayout}
          setLayout={setLayout}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          contentWidth={contentWidth}
          setContentWidth={setContentWidth}
          transition={transition}
          setTransition={setTransition}
          themeConfig={themeConfig}
        />
      )}
    </ConfigProvider>
  );
};

export default SiderLayout;