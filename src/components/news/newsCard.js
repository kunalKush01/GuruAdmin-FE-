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
  ButtonGroup,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import he from "he";
import styled from "styled-components";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import BtnPopover from "../partials/btnPopover";
import { CustomDropDown } from "../partials/customDropDown";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { PublishNews, ScheduleNews, deleteNewsDetail } from "../../api/newsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import { useSelector } from "react-redux";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { Form, Formik } from "formik";

const NewsCardWaraper = styled.div`
  .imgContainer {
    background-color: #fff7e8;
    border-bottom: 1px solid rgb(255, 135, 68);
    img {
      border-radius: 10px 10px 0px 0px;
    }
  }
  .card-title {
    font: normal normal bold 13px/16px Noto Sans;
    margin-bottom: 10px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card-text {
    font: normal normal normal 12px/16px Noto Sans;
    height: 50px;
    overflow: hidden;
  }
  .card-body {
    background: #fff7e8;
    padding: 10px;
  }
  .btn-outline-primary {
    border: 2px solid #ff8744 !important;
    font: normal normal bold 14px/15px Noto Sans;
    padding: 5px 10px;
    border-radius: 20px;
    margin-right: 10px;
  }

  .card-footer {
    font: normal normal bold 10px/15px Noto sans;
    border: none !important;
    padding: 16px 0px 10px 0px;
    div > div > img {
      width: 15px;
      margin-right: 5px;
    }
    img {
      width: 30px;
    }
  }
  .imgContent {
    top: 5%;
    color: #fff;
    padding: 0px 5px;
    font: normal normal bold 12px/30px noto sans;
  }
  div.cardLangScroll {
    /* height: 45px; */
    display: flex;
    min-width: 230px;
    overflow-x: scroll !important;
    ::-webkit-scrollbar {
      width: 10px;
      display: block;
    }
  }
  .publishMenu {
    background-color: #fff7e8;
  }
  img{
 
 color: #583703;
 font: 15px Noto Sans;
 }
`;
function BtnContent({
  newsId,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
  totalAvailableLanguage,
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

  const handleDeleteNews = async (payload) => {
    return deleteNewsDetail(payload);
  };

  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteNews,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["News"]);
      }
    },
  });

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
                `/news/edit/${newsId}?page=${currentPage}&filter=${currentFilter}`,
                newsId
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
            // onClick={() => deleteMutation.mutate(newsId)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Swal.fire("Oops...", "Something went wrong!", "error");
              Swal.fire({
                title: `<img src="${comfromationIcon}"/>`,
                html: `
                                      <h3 class="swal-heading">${t(
                                        "news_delete"
                                      )}</h3>
                                      <p>${t("news_sure")}</p>
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
                  deleteMutation.mutate(newsId);
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
                ? "col-item-disabled opacity-50 "
                : "col-item "
            }`}
            onClick={() =>
              langList?.length === totalAvailableLanguage
                ? ""
                : history.push(
                    `/news/add-language/${newsId}?page=${currentPage}&filter=${currentFilter}`,
                    newsId
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

export default function NewsCard({
  data,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
}) {
  const history = useHistory();
  const { t } = useTranslation();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handlePublish = async (payload) => {
    return PublishNews(payload);
  };
  const handleSchedule = async (payload) => {
    return ScheduleNews(payload);
  };
  const queryCient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: handlePublish,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["News"]);
      }
    },
  });
  const schedulingMutation = useMutation({
    mutationFn: handleSchedule,
    onSuccess: (data) => {
      if (!data.error) {
        setTimeout(() => {
          toggle();
        }, 500);
        queryCient.invalidateQueries(["News"]);
      }
    },
  });
  return (
    <NewsCardWaraper>
      <Card
        style={{
          width: "100%",
          height: "337px",
          borderRadiuis: "10px",
          overflow: "hidden",
        }}
      >
        <div className="position-relative cursor-pointer imgContainer ">
          <img
            onClick={() => history.push(`/news/about/${data?.id}`, data.id)}
            alt="News Image"
            style={{
              height: "150px",
              position: "relative",
              width: "100%",
              borderBottom: "1px solid rgb(255, 135, 68)",
            }}
            src={data?.images[0]?.presignedUrl ?? placeHolder}
          />
          <div className=" position-absolute imgContent  w-100 ">
            <div className="text-end">
              <ButtonGroup>
                <UncontrolledDropdown>
                  <DropdownToggle color="primary" size="sm" caret>
                    <Trans i18nKey={"publish"} />
                  </DropdownToggle>
                  <DropdownMenu className="publishMenu">
                    <DropdownItem
                      className="py-0 w-100"
                      onClick={() => {
                        data?.isPublished
                          ? Swal.fire({
                              // title: "News is already published",
                              html: `<h3>${t("already_publish")}</h3>`,
                              icon: "info",
                              showConfirmButton: false,
                              showCloseButton: false,
                              showCancelButton: false,
                              focusConfirm: false,
                              timer: 1500,
                            })
                          : toggle();
                      }}
                      // () =>
                      // history.push(
                      //   `/news/edit/${data?.id}?page=${currentPage}&filter=${currentFilter}`,
                      //   data?.id
                      // )
                    >
                      <Trans i18nKey={"schedule"} />
                    </DropdownItem>
                    <DropdownItem
                      className="py-0 w-100"
                      onClick={() => publishMutation.mutate(data.id)}
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
              {/* <Button
                color="primary"
                size="sm"
                onClick={() => publishMutation.mutate(data.id)}
              >
                {data?.isPublished ? (
                  <Trans i18nKey={"unPublish"} />
                ) : (
                  <Trans i18nKey={"publish"} />
                )}
              </Button> */}
            </div>
          </div>
        </div>

        <CardBody>
          <div
            className="cursor-pointer"
            onClick={() => history.push(`/news/about/${data.id}`, data.id)}
          >
            <CardTitle>{ConverFirstLatterToCapital(data.title)}</CardTitle>

            <CardText>
              <div
                dangerouslySetInnerHTML={{
                  __html: he.decode(data?.body ?? ""),
                }}
              />
            </CardText>
          </div>
          <div className="cardLangScroll">
            {data?.languages?.map((item) => {
              return (
                <div key={item.id} className="languageButton">
                  {ConverFirstLatterToCapital(item.name)}
                </div>
              );
            })}
          </div>
          <CardFooter>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <img src={cardClockIcon} style={{ verticalAlign: "bottom" }} />
                {`Posted on ${moment(data?.publishDate).format(
                  "D MMMM YYYY "
                )}`}
              </div>
              <img
                src={cardThreeDotIcon}
                className="cursor-pointer"
                id={`popover-${data.id}`}
              />
            </div>
          </CardFooter>
        </CardBody>
      </Card>
      <BtnPopover
        target={`popover-${data.id}`}
        content={
          <BtnContent
            newsId={data.id}
            currentPage={currentPage}
            totalAvailableLanguage={data?.languages?.length}
            currentFilter={currentFilter}
            subPermission={subPermission}
            allPermissions={allPermissions}
          />
        }
      />
      <Modal isOpen={modal} centered toggle={toggle}>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Formik
                initialValues={{ DateTime: new Date() }}
                onSubmit={(e) => {
                  console.log("e schedule", e);
                  schedulingMutation.mutate({
                    publishDate: e?.DateTime,
                    newsId: data?.id,
                  });
                }}
              >
                <Form>
                  <Row className="justify-content-center">
                    <Col xs={8} className="">
                      <FormikCustomDatePicker
                        name="DateTime"
                        width="100%"
                        pastDateNotAllowed
                        showTimeInput
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} className="mt-2">
                      <Button type="submit" color="primary" size="sm">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Formik>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </NewsCardWaraper>
  );
}
