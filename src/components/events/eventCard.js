import moment from "moment";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
  CardFooter,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Row,
  Col,
} from "reactstrap";
import he from "he";
import styled from "styled-components";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import { CustomDropDown } from "../partials/customDropDown";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import { deleteNewsDetail } from "../../api/newsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import BtnPopover from "../partials/btnPopover";
const EventCardWaraper = styled.div`
  
  .card-title {
    font: normal normal bold 13px/16px Noto Sans;
  }
  .card-text {
    font: normal normal normal 12px/16px Noto Sans;
    color: #9C9C9C;
    overflow: hidden;
  }
  .card-body {
    background: #fff7e8;
  }
  .btn-outline-primary {
    border: 2px solid #ff8744 !important;
    font: normal normal bold 14px/15px Noto Sans;
    padding: 5px 10px;
    border-radius: 20px;
    margin-right: 10px;
  }
`;
function BtnContent({ newsId }) {
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
          onClick={() => history.push(`/news/add-language/${newsId}`, newsId)}
        >
          <Trans i18nKey={"news_popOver_AddLang"} />
        </Col>

        <Col
          xs={12}
          className="col-item"
          onClick={() => history.push(`/news/edit/${newsId}`, newsId)}
        >
          <Trans i18nKey={"news_popOver_Edit"} />
        </Col>

        <Col
          xs={12}
          className="col-item  "
          // onClick={() => deleteMutation.mutate(newsId)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Swal.fire("Oops...", "Something went wrong!", "error");
            Swal.fire({
              title: `<img src="${comfromationIcon}"/>`,
              html: `
                                      <h3 class="swal-heading">Delete News</h3>
                                      <p>Are you sure you want to permanently delete the selected news ?</p>
                                      `,
              showCloseButton: false,
              showCancelButton: true,
              focusConfirm: true,
              cancelButtonText: "Cancel",
              cancelButtonAriaLabel: "Cancel",

              confirmButtonText: "Confirm Delete",
              confirmButtonAriaLabel: "Confirm",
            }).then(async (result) => {
              if (result.isConfirmed) {
                deleteMutation.mutate(newsId);
              }
            });
          }}
        >
          <Trans i18nKey={"news_popOver_Delete"} />
        </Col>
      </Row>
    </BtnContentWraper>
  );
}

export default function EventCard({ data }) {
  return (
    <EventCardWaraper>
      <Card
        style={{
          width: "100%",
          borderRadius:"50px"
          
        }}
      >
        {/* <div className="position-relative imgContainer ">
          <img
            alt="Sample"
            style={{
              height: "150px",
              position: "relative",
              width: "100%",
            }}
            src="https://picsum.photos/300/200"
          />
          <div className=" position-absolute imgContent  w-100 ">
            <div className="text-end">
              {`${moment(data.publishDate).startOf("hour").fromNow()}`}
            </div>
          </div>
        </div> */}

        <CardBody>
          <Row>
            <Col xs={3}>
              <CardTitle>{data.title}</CardTitle>
            </Col>
            <Col xs={3}>
              <div className="card-text">
                Posted on {`${moment(data.publishDate).format("D MMMM YYYY ")}`}
              </div>
            </Col>
            <Col xs={3}>
              <CardText>
                <div
                  dangerouslySetInnerHTML={{
                    __html: he.decode(data.body),
                  }}
                />
              </CardText>
            </Col>
            <Col xs={3}>
              <div className="d-flex justify-content-between align-items-center">
                <img src={cardThreeDotIcon} id={`popover-${data.id}`} />
              </div>
            </Col>
          </Row>

          <div>
            {data.languages.map((item) => {
              return (
                <Button outline key={item.id} color="primary">
                  {ConverFirstLatterToCapital(item.name)}
                </Button>
              );
            })}
          </div>
        </CardBody>
      </Card>
      <BtnPopover
        target={`popover-${data.id}`}
        content={<BtnContent newsId={data.id} />}
      />
    </EventCardWaraper>
  );
}
