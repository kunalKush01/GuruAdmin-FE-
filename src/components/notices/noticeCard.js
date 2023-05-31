import moment from "moment";
import React, { useState } from "react";
import { Card, CardBody, Button, Row, Col, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
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
import { PublishNotice, deleteNoticeDetail } from "../../api/noticeApi";
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
    max-width: 400px;
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
    margin-top: 0.7rem;
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
    .card-body {
      max-height: 100%;
      padding: 1rem;
    }
  }
  @media only screen and (max-width: 600px) {
    .card-body {
      max-height: 100%;
      padding: 1rem;
    }
  }
`;
function BtnContent({
  noticeId,
  totalAvailableLanguage,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
}) {
  const { t } = useTranslation();
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
      .col-item-disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  `;

  const handleDeleteNotice = async (payload) => {
    return deleteNoticeDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteNotice,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Notices"]);
      }
    },
  });
  const langList = useSelector((state) => state.auth.availableLang);
  console.log("langList", langList);
  console.log("langList t", totalAvailableLanguage);

  return (
    <BtnContentWraper>
      <Row className="MainContainer d-block">
        {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
          <Col
            xs={12}
            className="col-item"
            onClick={() =>
              history.push(
                `/notices/edit/${noticeId}?page=${currentPage}&filter=${currentFilter}`
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
            // onClick={() => deleteMutation.mutate(noticeId)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Swal.fire("Oops...", "Something went wrong!", "error");
              Swal.fire({
                title: `<img src="${comfromationIcon}"/>`,
                html: `
                                      <h3 class="swal-heading">${t(
                                        "notices_delete"
                                      )}</h3>
                                      <p>${t("notices_sure")}</p>
                                      `,
                showCloseButton: false,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: `${t("cancel")}`,
                cancelButtonAriaLabel: `${t("cancel")}`,

                confirmButtonText: `${t("confirm")}`,
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
        ) : (
          ""
        )}
        {allPermissions?.name === "all" || subPermission?.includes(WRITE) ? (
          <Col
            xs={12}
            className={`${
              langList?.length === totalAvailableLanguage
                ? "col-item-disabled opacity-50 pb-1"
                : "col-item pb-1"
            }`}
            onClick={() =>
              langList?.length === totalAvailableLanguage
                ? ""
                : history.push(
                    `/notices/add-language/${noticeId}?page=${currentPage}&filter=${currentFilter}`
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

export default function NoticeCard({
  data,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
}) {
  const history = useHistory();
  const handlePublish = async (payload) => {
    return PublishNotice(payload);
  };
  const queryCient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: handlePublish,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Notices"]);
      }
    },
  });

  return (
    <EventCardWaraper key={data.id}>
      <div>
        <Card
          style={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "none",
            margin: "10px 10px",
          }}
        >
          <CardBody>
            <Row>
              <Col
                xs={12}
                md={2}
                onClick={() =>
                  history.push(`/notices/about/${data.id}`, data.id)
                }
                className="cursor-pointer  me-md-1 me-xl-0"
              >
                <img
                  src={data?.image || placeHolder}
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
                      <p>
                        Posted on{" "}
                        {`${moment(data?.publishDate).format("D MMMM YYYY ")}`} At {`${moment(data?.publishDate).format("hh:mm")}`} 
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div
                      className="card-text "
                      dangerouslySetInnerHTML={{
                        __html: he.decode(data?.body),
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="cardLangScroll">
                      {data?.languages?.map((item) => {
                        return (
                          <div key={item.id} className="languageButton">
                            {ConverFirstLatterToCapital(item?.name ?? "")}
                          </div>
                        );
                      })}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={2} className="">
                <div className=" h-100">
                  <div className="mt-md-1">
                    <ButtonGroup>
                      <UncontrolledDropdown>
                        <DropdownToggle color="primary" size="sm" caret>
                          <Trans i18nKey={"publish"} />
                        </DropdownToggle>
                        <DropdownMenu className="publishMenu">
                          <DropdownItem
                            className="py-0 w-100"
                            onClick={() =>
                              history.push(
                                `/notices/edit/${data?.id}?page=${currentPage}&filter=${currentFilter}`,
                                data?.id
                              )
                            }
                          >
                            <Trans i18nKey={"schedule"} />
                          </DropdownItem>
                          <DropdownItem
                            className="py-0 w-100"
                            onClick={() => publishMutation.mutate(data?.id)}
                          >
                            {data?.isPublished ? (
                              <Trans i18nKey={"unPublish"} />
                            ) : (
                              <Trans i18nKey={"publish_now"} />
                            )}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </ButtonGroup>
                  </div>
                  <div className="align-items-center d-flex justify-content-end">
                    <img
                      src={cardThreeDotIcon}
                      className="cursor-pointer"
                      width={50}
                      height={40}
                      id={`popover-${data.id}`}
                    />
                  </div>
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
            noticeId={data.id}
            currentPage={currentPage}
            currentFilter={currentFilter}
            totalAvailableLanguage={data?.languages?.length}
            subPermission={subPermission}
            allPermissions={allPermissions}
          />
        }
      />
      {/* <Card
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
            <Col
              xs={2}
              className="cursor-pointer"
              onClick={() => history.push(`/notices/about/${data.id}`, data.id)}
            >
              <img
                src={data?.image || placeHolder}
                style={{
                  width: "130px",
                  height: "100px",
                  borderRadius: "10px",
                }}
              />
            </Col>
            <Col xs={9}>
              <Row>
                <Col xs={6}>
                  <div className="card1">
                    {ConverFirstLatterToCapital(data.title)}
                  </div>
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
            noticeId={data.id}
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
