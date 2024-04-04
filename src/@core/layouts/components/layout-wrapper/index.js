// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import {
  handleContentWidth,
  handleMenuCollapsed,
  handleMenuHidden,
} from "@store/layout";
import { useDispatch, useSelector } from "react-redux";

// ** Styles
import "animate.css/animate.css";
import CattleTabBar from "../../../../components/cattleTabBar";
import { cattleHeader } from "../../../../utility/subHeaderContent/cattleHeader";

const LayoutWrapper = (props) => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } =
    props;

  // ** Store Vars
  const dispatch = useDispatch();
  const [active, setActive] = useState(location.pathname);
  const store = useSelector((state) => state);

  const navbarStore = store.navbar;
  const contentWidth = store.layout.contentWidth;

  //** Vars
  const Tag = layout === "HorizontalLayout" && !appLayout ? "div" : Fragment;

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth("full"));
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed));
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(!routeMeta.menuHidden));
      }
    }
  };

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth));
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed));
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden));
      }
    }
    return () => cleanUp();
  }, []);

  return (
    <div
      className={classnames("app-content content overflow-hidden", {
        [wrapperClass]: wrapperClass,
        "show-overlay": navbarStore.query.length,
      })}
    >
      {location.pathname.startsWith("/cattle") && (
        <CattleTabBar
          tabs={cattleHeader}
          active={active}
          setActive={setActive}
        />
      )}

      <div className="content-overlay"></div>
      <div className="header-navbar-shadow" />
      <div
        className={classnames({
          "content-wrapper": !appLayout,
          "content-area-wrapper": appLayout,
          "container-xxl p-0": contentWidth === "boxed",
          [`animate__animated animate__${transition}`]:
            transition !== "none" && transition.length,
        })}
      >
        <Tag
          /*eslint-disable */
          {...(layout === "HorizontalLayout" && !appLayout
            ? { className: classnames({ "content-body": !appLayout }) }
            : {})}
          /*eslint-enable */
        >
          {children}
        </Tag>
      </div>
    </div>
  );
};

export default LayoutWrapper;
