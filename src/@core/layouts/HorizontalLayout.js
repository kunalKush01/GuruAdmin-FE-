// ** React Imports
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { handleMenuHidden, handleContentWidth } from "@store/layout";

// ** Third Party Components
import classnames from "classnames";
import { ArrowUp } from "react-feather";

// ** Reactstrap Imports
import { Navbar, NavItem, Button, Input } from "reactstrap";

// ** Configs
import themeConfig from "@configs/themeConfig";

// ** Custom Components
import Customizer from "@components/customizer";
import ScrollToTop from "@components/scrolltop";
import NavbarComponent from "./components/navbar";
import FooterComponent from "./components/footer";
import MenuComponent from "./components/menu/horizontal-menu";

// ** Custom Hooks
import { useRTL } from "@hooks/useRTL";
import { useSkin } from "@hooks/useSkin";
import { useNavbarType } from "@hooks/useNavbarType";
import { useFooterType } from "@hooks/useFooterType";
import { useNavbarColor } from "@hooks/useNavbarColor";

// ** Styles
import "@styles/base/core/menu/menu-types/horizontal-menu.scss";
import { subHeaderContent } from "../../utility/subHeaderContent";
const HorizontalLayout = (props) => {
  const history = useHistory() 
  const {isLogged} = useSelector(state=>state.auth)
  
  useEffect(()=>{
    !isLogged&& history.push("/login")
  },[isLogged])
  // ** Props
  const {
    children,
    navbar,
    menuData,
    footer,
    menu,
    currentActiveItem,
    routerProps,
    setLastLayout,
  } = props;

  // ** Hooks
  const { skin, setSkin } = useSkin();
  const [isRtl, setIsRtl] = useRTL();
  const { navbarType, setNavbarType } = useNavbarType();
  const { footerType, setFooterType } = useFooterType();
  const { navbarColor, setNavbarColor } = useNavbarColor();

  // ** States
  const [isMounted, setIsMounted] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // ** Store Vars
  const dispatch = useDispatch();
  const layoutStore = useSelector((state) => state.layout);

  // ** Vars
  const contentWidth = layoutStore.contentWidth;
  const isHidden = layoutStore.menuHidden;

  // ** Handles Content Width
  const setContentWidth = (val) => dispatch(handleContentWidth(val));

  // ** Handles Content Width
  const setIsHidden = (val) => dispatch(handleMenuHidden(val));

  // ** UseEffect Cleanup
  const cleanup = () => {
    setIsMounted(false);
    setNavbarScrolled(false);
  };

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true);
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 65 && navbarScrolled === false) {
        setNavbarScrolled(true);
      }
      if (window.pageYOffset < 65) {
        setNavbarScrolled(false);
      }
    });
    return () => cleanup();
  }, []);

  // ** Vars
  const footerClasses = {
    static: "footer-static",
    sticky: "footer-fixed",
    hidden: "footer-hidden",
  };

  const navbarWrapperClasses = {
    floating: "navbar-floating",
    sticky: "navbar-sticky",
    static: "navbar-static",
  };

  const navbarClasses = {
    floating:
      contentWidth === "boxed" ? "floating-nav container-xxl" : "floating-nav",
    sticky: "fixed-top",
  };

  const bgColorCondition =
    navbarColor !== "" && navbarColor !== "light" && navbarColor !== "white";

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={classnames(
        `wrapper horizontal-layout horizontal-menu ${
          navbarWrapperClasses[navbarType] || "navbar-floating"
        } ${footerClasses[footerType] || "footer-static"} menu-expanded`
      )}
      {...(isHidden ? { "data-col": "1-column" } : {})}
    >
      <Navbar
        expand="lg"
        container={false}
        style={{ background: "#fff" }}
        className={classnames(
          "header-navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center   ",
          {
            "navbar-scrolled": navbarScrolled,
          }
        )}
      >
        <div className="navbar-container d-flex content">
          {navbar ? navbar : <NavbarComponent skin={skin} setSkin={setSkin} />}
        </div>
      </Navbar>
      {!isHidden ? (
        <div className="horizontal-menu-wrapper">
          <Navbar
            tag="div"
            expand="sm"
            style={{ background: "#FF8744",top:"85px" }}
            light={skin !== "dark"}
            dark={skin === "dark" || bgColorCondition}
            className={classnames(
              `p-1 navbar-horizontal navbar-shadow menu-border`,
              {
                [navbarClasses[navbarType]]: navbarType !== "static",
                "floating-nav":
                  (!navbarClasses[navbarType] && navbarType !== "static") ||
                  navbarType === "floating",
              }
            )}
          >
            {menu ? (
              menu
            ) : (
              <MenuComponent
                menuData={subHeaderContent}
                routerProps={routerProps}
                currentActiveItem={currentActiveItem}
              />
            )}
          </Navbar>
        </div>
      ) : null}

      {children}
      {themeConfig.layout.customizer === true ? (
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
          setIsRtl={setIsRtl}
          layout={props.layout}
          setLastLayout={setLastLayout}
          setLayout={props.setLayout}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          contentWidth={contentWidth}
          setContentWidth={setContentWidth}
          transition={props.transition}
          setTransition={props.setTransition}
          themeConfig={themeConfig}
        />
      ) : null}
      <footer
        className={classnames(
          `footer footer-light ${footerClasses[footerType] || "footer-static"}`,
          {
            "d-none": footerType === "hidden",
          }
        )}
      >
        {!footer ? (
          footer
        ) : (
          <FooterComponent
            footerType={footerType}
            footerClasses={footerClasses}
          />
        )}
      </footer>

      {themeConfig.layout.scrollTop === true ? (
        <div className="scroll-to-top">
          <ScrollToTop showOffset={300} className="scroll-top d-block">
            <Button className="btn-icon" color="primary">
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}
    </div>
  );
};
export default HorizontalLayout;
