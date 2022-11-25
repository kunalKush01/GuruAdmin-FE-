// ** React Imports
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
// ** Horizontal Menu Components
import HorizontalNavMenuItems from "./HorizontalNavMenuItems";
import { useTranslation, Trans } from "react-i18next";
import BtnPopover from "../../../../../components/partials/btnPopover";
import { Col, Row } from "reactstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../../../../assets/images/icons/news/conformationIcon.svg";

const SubHeaderWarraper = styled.div`
  font: normal normal bold 15px/20px noto sans;
  cursor: pointer;
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
      :hover {
        background-color: #ff8744;
        color: #fff;
      }
    }
  `;

  const handleDeleteNews = async (payload) => {
    return deleteNewsDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteNews,
    onSuccess: (data) => {
      if (!data.error) {
        console.log("invaldating");
        queryCient.invalidateQueries(["News"]);
      }
    },
  });

  return (
    <BtnContentWraper>
      <Row className="MainContainer">
        <Col
          xs={12}
          className="col-item"
          onClick={() => {
            setClosePopover(false)
            history.push(`/configuration/categories`)}}
        >
          <Trans i18nKey={"category"} />
        </Col>

        <Col
          xs={12}
          className="col-item"
          onClick={() => history.push(`/configuration/users`)}
        >
          <Trans i18nKey={"user"} />
        </Col>
        <Col
          xs={12}
          className="col-item"
          onClick={() => history.push(`/configuration/reportDispute`)}
        >
          <Trans i18nKey={"report_Dispute"} />
        </Col>
      </Row>
    </BtnContentWraper>
  );
}

const HorizontalMenu = ({ menuData, currentActiveItem, routerProps }) => {
  const history = useHistory();
const [closePopover,setClosePopover] = useState(true) 
useEffect(()=>{
  setClosePopover(true)
},[closePopover])
  return (
    <div className="navbar-container w-100 main-menu-content">
      <ul
        className="nav navbar-nav justify-content-between  "
        id="main-menu-navigation"
      >
        {menuData.map((item, idx) => {
          return (
            
              <SubHeaderWarraper
                id={item.name}
                onClick={() => {
                  item.url != "/configuration" ? (history.push(item.url)) : "";
                }}
                key={idx}
                className="text-light   "
              >
                <Trans i18nKey={item.name} />
              {item.name === "configuration" &&closePopover && (
                <BtnPopover target={item.name}  content={<BtnContent setClosePopover={setClosePopover} />} />
              )}
              </SubHeaderWarraper>
            
          );
        })}
      </ul>
    </div>
  );
};

export default HorizontalMenu;
