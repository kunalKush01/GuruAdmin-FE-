// ** React Imports
import { Fragment, useEffect, useMemo, useState } from "react";

// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";

// ** Third Party Components
import { Sun, Moon } from "react-feather";

// ** Reactstrap Imports
import {
  NavItem,
  NavLink,
  Link,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import styled from "styled-components";
import searchIcon from "../../../../assets/images/icons/dashBoard/Group 5997.svg";
import menuPanelIcon from "../../../../assets/images/icons/dashBoard/icn_MenuPanel.svg";
import bellIcon from "../../../../assets/images/icons/dashBoard/Group 5996.svg";
import logOutIcon from "../../../../assets/images/icons/dashBoard/Group 5995.svg";
import LangModel from "../langModel";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { authApiInstance } from "../../../../axiosApi/authApiInstans";
import { logOut, setSearchbarValue } from "../../../../redux/authSlice";
import { toast } from "react-toastify";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import {
  isSerchable,
  setPlaceholderSerchbar,
} from "../../../../utility/localSerachBar";
import CustomSearchBar from "../../../../components/partials/customSearchBar";
import Swal from "sweetalert2";

const NavbarUserWarraper = styled.div`
  color: #583703 !important ;
  .brand-logo div {
    font: normal normal bold 25px/44px noto sans;
    margin-right: 80px;
    cursor: pointer;
  }
  .searchinput {
    background: #f2f2f2 !important ;
    &.sInput {
      border-end-end-radius: 0% !important ;
      border-start-end-radius: 0% !important ;
      font: normal normal 400 16px/20px noto sans;
    }
    &.sIconsBox {
      border-start-start-radius: 0% !important;
      border-end-start-radius: 0% !important;
      cursor: pointer;
    }
  }
  img {
    width: 35px;
    /* margin: 10px; */
  }
  .icon {
    margin-inline-start: 15px;
    cursor: pointer;
  }
  .navepara {
    width: max-content;
    margin: 10px;
    cursor: pointer;
  }
  .templeName {
    font: normal normal bold 16px/30px noto sans;
  }
  .date {
    font: normal normal normal 10px/5px noto sans;
  }
`;
const NavbarUser = (props) => {
  const history = useHistory();
  const trustDetails = useSelector((state) => state.auth.trustDetail);
  const refreshToken = useSelector((state) => state.auth.tokens.refreshToken);
  const searchBarValue = useSelector((state) => state.auth.LocalSearch);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const handleLogOut = async () => {
    try {
      const res = await authApiInstance.post("auth/logout", { refreshToken });
      toast.success(res.data.message);
      dispatch(logOut());
    } catch (error) {}
  };
  const [langSelection, setlangSelection] = useState(false);

  return (
    <Fragment>
      <NavbarUserWarraper className="d-flex justify-content-between w-100 align-items-center  ">
        <div className="bookmark-wrapper d-flex align-items-center">
          <NavItem className="d-none d-lg-block">
            <NavLink to="/" className="navbar-brand">
              <span className="brand-logo">
                {/* <img src={themeConfig.app.appLogoImage} alt='logo' /> */}
                <div>Logo Here</div>
              </span>
              {/* <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2> */}
            </NavLink>
          </NavItem>
        </div>
        {isSerchable() && <CustomSearchBar />}
        <div className="d-flex justify-content-end align-items-center ">
          <div className="d-flex">
            <img
              className="icon"
              onClick={() => setlangSelection(true)}
              src={menuPanelIcon}
            />
            <img
              className="icon "
              src={bellIcon}
              onClick={() => history.push("/notification")}
            />
            <img className="icon d-none d-xl-block" src={logOutIcon} onClick={handleLogOut} />
          </div>
          <ul className="nav navbar-nav align-items-center ">
            <div className="d-flex align-items-center">
              <div className="navepara">
                <div className="templeName text-end d-none d-xl-block">
                  {ConverFirstLatterToCapital(trustDetails?.name ?? "")}
                </div>
                <div className="date d-none d-xl-block">
                  <Trans i18nKey={"last_login"} />:{" "}
                  {moment().format("DD MMM YYYY,h:mm a")}
                </div>
              </div>
              <div
                onClick={
                  () => history.push("/edit-profile")
                  // Swal.fire({
                  //   icon: "error",
                  //   title: "Oops...",
                  //   text: "Edit profile is Under Development!",
                  //   showConfirmButton: false,
                  //   showCloseButton: true,
                  // })
                }
              >
                <UserDropdown />
              </div>
            </div>
          </ul>
        </div>
      </NavbarUserWarraper>
      <LangModel
        langSelection={langSelection}
        setlangSelection={setlangSelection}
      />
    </Fragment>
  );
};
export default NavbarUser;
