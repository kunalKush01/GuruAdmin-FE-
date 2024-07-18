import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import styled from "styled-components"; 
import Swal from "sweetalert2";
import { deleteEventDetail } from "../../api/eventApi";
import { deleteNewsDetail } from "../../api/newsApi";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import BtnPopover from "../partials/btnPopover";
import '../../../src/styles/common.scss';

;
;
function BtnContent({
  eventId,
  currentPage,
  currentFilter,
  subPermission,
  totalAvailableLanguage,
  allPermissions,
}) {
  const history = useHistory();
;
;

  const handleDeleteEvent = async (payload) => {
    return deleteEventDetail(payload);
  };
  const queryCLient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteEvent,
    onSuccess: (data) => {
      if (!data.error) {
        queryCLient.invalidateQueries(["Events"]);
        queryCLient.invalidateQueries(["EventDates"]);
      }
    },
  });
  const { t } = useTranslation();
  const langList = useSelector((state) => state.auth.availableLang);

  return (
    <div className="btncontentwraper">
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
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
            className={` ${
              langList?.length === totalAvailableLanguage
                ? "col-item-disabled opacity-50 "
                : "col-item "
            }`}
            onClick={() =>
              langList?.length === totalAvailableLanguage
                ? ""
                : history.push(
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
    </div>
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
    <div className="eventcardwrapper">
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
                lg={2}
                onClick={() =>
                  history.push(`/events/about/${data.id}`, data.id)
                }
                className="cursor-pointer me-md-1 me-xl-0 ps-0"
              >
                <div className="w-100 h-100" style={{ borderRadius: "15px" }}>
                  <img
                    src={data?.images[0]?.presignedUrl ?? placeHolder}
                    alt="Event Image"
                    className="eventImage"
                    style={{
                      width: "100%",
                      objectFit: "cover ",
                      height: "122px",
                      objectPosition: "top",
                    }}
                  />
                </div>
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
                          )}, ${data.startTime} to ${data.endTime}`}
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
                        __html: he?.decode(data.body),
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
    </div>
  );
}
