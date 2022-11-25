import moment from "moment";
import React, { useState } from "react";
import { Card, CardBody, Button, Row, Col } from "reactstrap";
import he from "he";
import styled from "styled-components";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import { deleteNewsDetail } from "../../api/newsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import BtnPopover from "../partials/btnPopover";
const EventCardWaraper = styled.div`
  .card1 {
    font: normal normal bold 13px/16px Noto Sans;
    margin-bottom: none !important;
  }
  .card-text {
    font: normal normal normal 12px/16px Noto Sans;
    max-height: 18px;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: start;
    white-space: nowrap;
  }
  .card-Date {
    font: normal normal normal 12px/16px Noto Sans;
    color: #9c9c9c;
    max-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: start;
    white-space: nowrap;
    p {
      margin: 0;
    }
  }
  .card-body {
    background: #fff7e8;
    border-radius: 10px;
    padding: 0px;
  }
  .btn-outline-primary {
    border: 2px solid #ff8744 !important;
    font: normal normal bold 14px/15px Noto Sans;
    padding: 5px 10px;
    border-radius: 20px;
    margin-right: 10px;
  }
`;
function BtnContent({ noticeId }) {
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
          onClick={() => history.push(`/notices/add-language/${noticeId}`)}
        >
          <Trans i18nKey={"news_popOver_AddLang"} />
        </Col>

        <Col
          xs={12}
          className="col-item"
          onClick={() => history.push(`/notices/edit/${noticeId}`)}
        >
          <Trans i18nKey={"news_popOver_Edit"} />
        </Col>

        <Col
          xs={12}
          className="col-item  "
          // onClick={() => deleteMutation.mutate(noticeId)}
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
                deleteMutation.mutate(noticeId);
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

export default function NoticeCard({ data }) {
  return (
    <EventCardWaraper key={data.id} >
      <Card
      key={data.id}
        style={{
          width: "100%",
          borderRadius: "20px",
          boxShadow: "none",
          margin: "10px 10px   ",
        }}
      >
        <CardBody>
          <Row className="align-items-center">
            <Col xs={2}>
              <img
                src="https://picsum.photos/300/200"
                style={{ width: "100%", height: "100%", borderRadius: "10px" }}
              />
            </Col>
            <Col xs={9}>
              <Row>
                <Col xs={6}>
                  <div className="card1">{data.title}</div>
                </Col>
                <Col xs={6}>
                  <div className="card-Date">
                    <p>
                      Posted on{" "}
                      {`${moment(data.publishDate).format("D MMMM YYYY ")}`}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Col xs={12}>
                    <div
                      className="card-text "
                      dangerouslySetInnerHTML={{
                        __html: he.decode(data.body),
                      }}
                    />
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div>
                    {data.languages.map((item) => {
                      return (
                        <Button outline key={item.id} color="primary">
                          {ConverFirstLatterToCapital(item.name)}
                        </Button>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={1}>
              <div className="d-flex justify-content-between align-items-center">
                <img src={cardThreeDotIcon} id={`popover-${data.id}`} />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <BtnPopover
        target={`popover-${data.id}`}
        content={<BtnContent noticeId={data.id} />}
      />
    </EventCardWaraper>
  );
}
