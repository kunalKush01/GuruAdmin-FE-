// ** React Imports
import { useEffect } from "react";

// ** Icons Imports
import { Circle, Disc, X } from "react-feather";
import styled from "styled-components";
import logo from "../../../../../assets/images/pages/main-logo.png";

const NavbarImageLogoWrapper = styled.div`
  .logo {
    width: 125px !important;
    height: 35px !important;
    object-fit: contain !important;
    object-position: center !important;
  }
`;

// ** Config

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto d-flex align-items-center">
          {/* <NavLink to="/" className="navbar-brand"> */}
          <NavbarImageLogoWrapper>
            <div className="brand-logo">
              <img src={logo} alt="logo" className="logo" />
            </div>
          </NavbarImageLogoWrapper>
          {/* </NavLink> */}
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
