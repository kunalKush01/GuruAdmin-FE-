// ** React Imports
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
// ** Horizontal Menu Components
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import Swal from "sweetalert2";
import confirmationIcon from "../../../../../assets/images/icons/news/conformationIcon.svg";
import BtnPopover from "../../../../../components/partials/btnPopover";
import HorizontalNavMenuItems from "./HorizontalNavMenuItems";

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
function BtnContent({ setClosePopover }) {
  const history = useHistory();

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

        {/* <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            history.push(`/configuration/cattle-breed`);
          }}
        >
          <Trans i18nKey={"cattles"} /> <Trans i18nKey={"cattle_breed"} />
        </Col>

        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            history.push(`/configuration/cattle-category`);
          }}
        >
          <Trans i18nKey={"cattles"} /> <Trans i18nKey={"category"} />
        </Col> */}

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
    <>
      <div className="navbar-container w-100 main-menu-content">
        <ul
          className={`nav navbar-nav ${
            permissionsKey?.length >= 10 || permissionsKey?.length === 1
              ? "justify-content-between"
              : "gap-5"
          }  `}
          id="main-menu-navigation"
        >
          {menuData.map((item, idx) => {
            if (
              permissionsKey?.includes("all") ||
              permissionsKey?.includes(item?.name)
            ) {
              return (
                <div key={idx}>
                  <SubHeaderWarraper>
                    <div
                      id={item.name}
                      onClick={() => {
                        item.url != "/configuration"
                          ? history.push(item.url)
                          : "";
                        //  setActive(item)
                      }}
                      key={idx}
                      className={`text-light ${
                        active?.startsWith(item.activeTab) ? "activeTab" : ""
                      } `}
                    >
                      <Trans i18nKey={item.name} />
                    </div>
                    {item.name === "configuration" && closePopover && (
                      <BtnPopover
                        target={item.name}
                        content={
                          <BtnContent setClosePopover={setClosePopover} />
                        }
                      />
                    )}
                  </SubHeaderWarraper>
                </div>
              );
            } else {
              return null;
            }
          })}
        </ul>
      </div>
    </>
  );
};

export default HorizontalMenu;
