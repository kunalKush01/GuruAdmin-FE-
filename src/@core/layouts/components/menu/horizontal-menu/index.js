// ** React Imports
import { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ** Horizontal Menu Components
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import Swal from "sweetalert2";
import confirmationIcon from "../../../../../assets/images/icons/news/conformationIcon.svg";
import BtnPopover from "../../../../../components/partials/btnPopover";
import HorizontalNavMenuItems from "./HorizontalNavMenuItems";
import "../../../../../assets/scss/viewCommon.scss";

function BtnContent({ setClosePopover, permissionsKey }) {
  const navigate = useNavigate();
  const trustType = useSelector(
    (state) => state?.auth?.trustDetail?.typeId?.name
  );

  return (
    <div className="btn-content-wrapper">
      <Row className="main-container d-block px-1">
        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            navigate(`/configuration/categories`);
          }}
        >
          <Trans i18nKey={"category"} />
        </Col>
        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            navigate(`/configuration/masters`);
          }}
        >
          <Trans i18nKey={"masters"} />
        </Col>
        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            navigate(`/configuration/custom-fields`);
          }}
        >
          <Trans i18nKey={"custom_field"} />
        </Col>

        {trustType == "Gaushala" && (
          <Col
            xs={12}
            className="col-item"
            onClick={() => {
              setClosePopover(false);
              navigate(`/configuration/cattle-breed`);
            }}
          >
            <Trans i18nKey={"cattles"} /> <Trans i18nKey={"cattle_breed"} />
          </Col>
        )}

        {trustType == "Gaushala" && (
          <Col
            xs={12}
            className="col-item"
            onClick={() => {
              setClosePopover(false);
              navigate(`/configuration/cattle-category`);
            }}
          >
            <Trans i18nKey={"cattles"} /> <Trans i18nKey={"category"} />
          </Col>
        )}

        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            navigate(`/configuration/users`);
          }}
        >
          <Trans i18nKey={"user"} />
        </Col>
        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false);
            navigate(`/configuration/reportDispute`);
          }}
        >
          <Trans i18nKey={"report_Dispute"} />
        </Col>
      </Row>
    </div>
  );
}

const MenuItem = ({
  item,
  history,
  active,
  closePopover,
  setClosePopover,
  permissionsKey,
}) => {
  return (
    <div className="sub-header-wrapper">
      <div
        id={item.name}
        onClick={() => {
          item.url != "/configuration" ? navigate(item.url) : "";
        }}
        className={`text-light ${
          active?.startsWith(item.activeTab) ? "active-tab" : ""
        }`}
      >
        <Trans i18nKey={item.name} />
      </div>
      {item.name === "configuration" && closePopover && (
        <BtnPopover
          target={item.name}
          content={
            <BtnContent
              setClosePopover={setClosePopover}
              permissionsKey={permissionsKey}
            />
          }
        />
      )}
    </div>
  );
};

const HorizontalMenu = ({ menuData, currentActiveItem, routerProps }) => {
  const navigate = useNavigate();
  const [closePopover, setClosePopover] = useState(true);
  useEffect(() => {
    setClosePopover(true);
  }, [closePopover]);

  const location = useLocation();
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );

  const trustType = useSelector(
    (state) => state.auth.trustDetail?.typeId?.name
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
            const hasAllPermission = permissionsKey?.includes("all");
            const hasItemPermission = permissionsKey?.includes(item?.name);
            const hasCattleItemPermission = item?.innerPermissions?.some(
              (item) => permissionsKey?.includes(item)
            );
            const isGaushala =
              item?.isCattle?.toLowerCase() == trustType?.toLowerCase();

            if (
              (hasAllPermission && isGaushala) ||
              (hasCattleItemPermission && isGaushala) ||
              (hasItemPermission && isGaushala)
            ) {
              return (
                <MenuItem
                  key={idx}
                  item={item}
                  history={history}
                  active={active}
                  closePopover={closePopover}
                  setClosePopover={setClosePopover}
                  permissionsKey={permissionsKey}
                />
              );
            }

            if (
              (hasAllPermission && item?.name !== "cattles_management") ||
              (hasItemPermission && item?.name !== "cattles_management")
            ) {
              return (
                <MenuItem
                  key={idx}
                  item={item}
                  history={history}
                  active={active}
                  closePopover={closePopover}
                  permissionsKey={permissionsKey}
                  setClosePopover={setClosePopover}
                />
              );
            }

            return null;
          })}
        </ul>
      </div>
    </>
  );
};

export default HorizontalMenu;
