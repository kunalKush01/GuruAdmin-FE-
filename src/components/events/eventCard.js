import moment from "moment";
import React, { useState } from "react";
import { Card, CardBody, Button, Row, Col } from "reactstrap";
import he from "he";
import styled from "styled-components";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { deleteNewsDetail } from "../../api/newsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import BtnPopover from "../partials/btnPopover";
import { deleteEventDetail } from "../../api/eventApi";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import { useSelector } from "react-redux";

const EventCardWaraper = styled.div`
 .card1 {
    font: normal normal bold 13px/16px Noto Sans;
    margin-bottom: 0.5rem !important;
  }
  .card-text {
    font: normal normal normal 12px/16px Noto Sans;
    max-height: 18px;
    max-width: 350px;
    overflow: hidden;
    /* text-overflow: ellipsis; */
    text-align: start;
    white-space: nowrap;
    /* margin-bottom: 0.5rem !important; */
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
    max-height: 122px;
  }
  .cardLangScroll {
    display: flex;
    /* background-color: red; */
    margin-top:.7rem;
    min-width: 230px;
    overflow-x: scroll !important;
    ::-webkit-scrollbar {
      width: 10px;
      display: block;
    }
  }
  .btn-outline-primary {
    border: 2px solid #ff8744 !important;
    font: normal normal bold 14px/15px Noto Sans;
    padding: 5px 10px;
    border-radius: 20px;
    margin-right: 10px;
  }
  @media only screen and (max-width: 1200px) {
    .card-body{
      max-height: 100%;
      padding: 1rem;
    }
  }
  @media only screen and (max-width: 600px) {
    .card-body{
      max-height: 100%;
      padding: 1rem;
    }
}
`;
function BtnContent({
  eventId,
  currentPage,
  currentFilter,
  subPermission,
  totalAvailableLanguage,
  allPermissions,
}) {
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
      .col-item-disabled{
        cursor: not-allowed;
        opacity:0.5;
      }
    }
  `;

  const handleDeleteEvent = async (payload) => {
    return deleteEventDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteEvent,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Events"]);
        queryCient.invalidateQueries(["EventDates"]);
      }
    },
  });
  const { t } = useTranslation();
  const langList = useSelector((state) => state.auth.availableLang);
  return (
    <BtnContentWraper>
      <Row className="MainContainer d-block ">
        {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
          <Col
            xs={12}
            className="col-item"
            onClick={() =>
              history.push(
                `/events/edit/${eventId}?page=${currentPage}&filter=${currentFilter}`
              )
            }
          >
            <Trans i18nKey={"news_popOver_Edit"} />
          </Col>
        ) : (
          ""
        )}
        {allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
          <Col
            xs={12}
            className="col-item  "
            // onClick={() => deleteMutation.mutate(eventId)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Swal.fire("Oops...", "Something went wrong!", "error");
              Swal.fire({
                title: `<img src="${comfromationIcon}"/>`,
                html: `
                                      <h3 class="swal-heading">${t(
                                        "events_delete"
                                      )}</h3>
                                      <p>${t("events_sure")}</p>
                                      `,
                showCloseButton: false,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: ` ${t("cancel")}`,
                cancelButtonAriaLabel: ` ${t("cancel")}`,

                confirmButtonText: ` ${t("confirm")}`,
                confirmButtonAriaLabel: "Confirm",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  deleteMutation.mutate(eventId);
                }
              });
            }}
          >
            <Trans i18nKey={"news_popOver_Delete"} />
          </Col>
        ) : (
          ""
        )}
        {allPermissions?.name === "all" || subPermission?.includes(WRITE) ? (
          <Col
            xs={12}
            className={` ${langList?.length === totalAvailableLanguage ? "col-item-disabled opacity-50 " : "col-item "}`}
            onClick={() =>
              langList?.length === totalAvailableLanguage ? "" :
              history.push(
                `/events/add-language/${eventId}?page=${currentPage}&filter=${currentFilter}`
              )
            }
          >
            <Trans i18nKey={"news_popOver_AddLang"} />
          </Col>
        ) : (
          ""
        )}
      </Row>
    </BtnContentWraper>
  );
}

export default function EventCard({
  data,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
}) {
  const history = useHistory();
  return (
    <EventCardWaraper>
      <div>
        <Card
          style={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "none",
            margin: "10px 10px   ",
          }}
        >
          <CardBody>
            <Row>
              <Col
                xs={12}
                md={2}
                onClick={() =>
                  history.push(`/events/about/${data.id}`, data.id)
                }
                className="cursor-pointer  me-md-1 me-xl-0"
              >
                <img
                  src={data?.images[0]?.presignedUrl ?? placeHolder}
                  alt="Event Image"
                  style={{
                    width: "130px",
                    height: "122px",
                    borderRadius: "10px",
                  }}
                />
              </Col>
              <Col className="py-1" xs={12} lg={8}>
                <Row>
                  <Col lg={6}>
                    <div className="card1">
                      {ConverFirstLatterToCapital(data?.title)}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="card-Date">
                    {moment(data?.startDate).format("DD MMM YYYY") ===
                      moment(data?.endDate).format("DD MMM YYYY") ? (
                        <p>
                          {`${moment(data.startDate).format("DD MMM YYYY")} ,${
                            data.startTime
                          } to ${data.endTime}`}
                        </p>
                      ) : (
                        <p>
                          {`${moment(data.startDate).format(
                            "DD MMM YYYY"
                          )} to ${moment(data.endDate).format(
                            "DD MMM YYYY"
                          )} ,${data.startTime} to ${data.endTime}`}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div
                      className="card-text"
                      dangerouslySetInnerHTML={{
                        __html: he.decode(data.body),
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className=" mt-1 cardLangScroll">
                      {data?.languages?.map((item) => {
                        return (
                          <div key={item.id} className="languageButton">
                            {ConverFirstLatterToCapital(item.name)}
                          </div>
                        );
                      })}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} lg={2}>
                <div className="align-items-center d-flex justify-content-end h-100">
                  <img
                    src={cardThreeDotIcon}
                    className="cursor-pointer"
                    width={50}
                    height={40}
                    id={`popover-${data.id}`}
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
      <BtnPopover
        target={`popover-${data.id}`}
        content={
          <BtnContent
            eventId={data.id}
            totalAvailableLanguage={data?.languages?.length}
            currentPage={currentPage}
            subPermission={subPermission}
            allPermissions={allPermissions}
            currentFilter={currentFilter}
          />
        }
      />
      {/* <Card
        style={{
          width: "100%",
          borderRadius: "20px",
          boxShadow: "none",
          margin: "10px 10px   ",
        }}
      >
        <CardBody>
          <Row className="align-items-center">
            <Col
              xs={2}
              onClick={() => history.push(`/events/about/${data.id}`, data.id)}
              className="cursor-pointer"
            >
              <img
                src={data?.images[0]?.presignedUrl || placeHolder}
                style={{
                  width: "130px",
                  height: "100px",
                  borderRadius: "10px",
                }}
              />
            </Col>
            <Col xs={9}>
              <div
                onClick={() =>
                  history.push(`/events/about/${data.id}`, data.id)
                }
                className="cursor-pointer"
              >
                <Row>
                  <Col xs={6}>
                    <div className="card1">
                      {ConverFirstLatterToCapital(data.title)}
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="card-Date">
                      <p>
                        {`${moment(data.startDate).format(
                          "DD MMM YYYY"
                        )} to ${moment(data.endDate).format("DD MMM YYYY")} ,${
                          data.startTime
                        } to ${data.endTime}`}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col>
                  <Col xs={12}>
                    <div
                      className="card-text"
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
                <img
                  src={cardThreeDotIcon}
                  className="cursor-pointer"
                  id={`popover-${data.id}`}
                />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <BtnPopover
        target={`popover-${data.id}`}
        content={
          <BtnContent
            eventId={data.id}
            currentPage={currentPage}
            currentFilter={currentFilter}
            subPermission={subPermission}
            allPermissions={allPermissions}
          />
        }
      /> */}
    </EventCardWaraper>
  );
}
