// ** React Imports
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
// ** Horizontal Menu Components
import HorizontalNavMenuItems from "./HorizontalNavMenuItems";
import { useTranslation, Trans } from "react-i18next";
import BtnPopover from "../../../../../components/partials/btnPopover";
import { Col, Row } from "reactstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../../../../assets/images/icons/news/conformationIcon.svg";
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";

const SubHeaderWarraper = styled.div`
  font: normal normal normal 15px/20px noto sans;
  cursor: pointer;

  .navTabs {
    color: white !important;
  }

  .activeTab {
    font-weight: 900;
    opacity: 100%;
  }
`;

function BtnContent({ setClosePopover }) {
  const history = useHistory();
  const BtnContentWraper = styled.div`
    color: #583703;
    font: normal normal normal 15px/20px noto sans;
    .MainContainer {
    }
    .col-item {
      cursor: pointer;
      margin-top: 0.3rem;
      :hover {
        background-color: #ff8744;
        color: #fff;
      }
    }
  `;

  return (
    <BtnContentWraper>
      <Row className="MainContainer d-block px-1">
        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            history.push(`/configuration/categories`);
          }}
        >
          <Trans i18nKey={"category"} />
        </Col>

        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            history.push(`/configuration/users`);
          }}
        >
          <Trans i18nKey={"user"} />
        </Col>
        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            history.push(`/configuration/reportDispute`);
          }}
        >
          <Trans i18nKey={"report_Dispute"} />
        </Col>
      </Row>
    </BtnContentWraper>
  );
}

const HorizontalMenu = ({ menuData, currentActiveItem, routerProps }) => {

  
  const history = useHistory();
  const [closePopover, setClosePopover] = useState(true);
  useEffect(() => {
    setClosePopover(true);
  }, [closePopover]);

  const location = useLocation();
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const [active, setActive] = useState();
  const permissionsKey = permissions?.map((item) => item?.name);


  useLayoutEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div className="navbar-container w-100 main-menu-content">
      <ul
        className={`nav navbar-nav ${permissionsKey?.length >= 10 || permissionsKey?.length === 1 ? "justify-content-between" : "gap-5"}  `}
        id="main-menu-navigation"
      >
        {menuData.map((item, idx) => {
          if (
            permissionsKey?.includes("all") ||
            permissionsKey?.includes(item?.name)
          ) {
          return (
            <SubHeaderWarraper key={idx}>
              <div
                id={item.name}
                onClick={() => {
                  item.url != "/configuration" ? history.push(item.url) : "";
                  //  setActive(item)
                }}
                key={idx}
                className={`text-light ${
                  active?.includes(item.url) ? "activeTab" : ""
                } `}
              >
                <Trans i18nKey={item.name} />
              </div>
              {item.name === "configuration" && closePopover && (
                <BtnPopover
                  target={item.name}
                  content={<BtnContent setClosePopover={setClosePopover} />}
                />
              )}
            </SubHeaderWarraper>
          );} else {
            return null;
          }
        })}
      </ul>
    </div>
  );
};

export default HorizontalMenu;
