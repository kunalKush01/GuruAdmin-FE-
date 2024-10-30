import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import he from "he";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteNewsDetail } from "../../api/newsApi";
import {
  PublishNotice,
  ScheduleNotice,
  deleteNoticeDetail,
} from "../../api/noticeApi";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import BtnPopover from "../partials/btnPopover";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import "../../assets/scss/common.scss";
import { fetchImage } from "../partials/downloadUploadImage";

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
  const handleDeleteNotice = async (payload) => {
    return deleteNoticeDetail(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteNotice,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["Notices"]);
      }
    },
  });
  const langList = useSelector((state) => state.auth.availableLang);

  return (
    <div className="btncontentwrapper">
      <Row className="MainContainer d-block ">
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
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
                ? "col-item-disabled opacity-50 "
                : "col-item "
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
    </div>
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
  const { t } = useTranslation();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const handlePublish = async (payload) => {
    return PublishNotice(payload);
  };
  const handleSchedule = async (payload) => {
    return ScheduleNotice(payload);
  };
  const queryClient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: handlePublish,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["Notices"]);
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
        queryClient.invalidateQueries(["Notices"]);
      }
    },
  });
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    if (data) {
      const loadImage = async () => {
        const url = await fetchImage(data?.imageName);
        if (url) {
          setImageUrl(url);
        }
      };
      loadImage();
    }
  }, [data]);
  return (
    <div className="noticecardwrapper" key={data.id}>
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
                <div className="w-100 h-100">
                  <img
                    src={imageUrl ? imageUrl : data?.image ?? placeHolder}
                    alt="Notice Image"
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      objectFit: "cover",
                      height: "122px",
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
                      <p>
                        Posted on{" "}
                        {`${moment(data?.publishDate).format("D MMMM YYYY ")}`}{" "}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div
                      className="card-text "
                      dangerouslySetInnerHTML={{
                        __html: he?.decode(data?.body),
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
                          {data?.isPublished ? (
                            <Trans i18nKey={"published"} />
                          ) : (
                            <Trans i18nKey={"publish"} />
                          )}
                        </DropdownToggle>
                        <DropdownMenu className="publishMenu">
                          <DropdownItem
                            className="py-0 w-100"
                            onClick={() => {
                              data?.isPublished
                                ? Swal.fire({
                                    html: `<h3>${t(
                                      "already_publish_notice"
                                    )}</h3>`,
                                    icon: "info",
                                    showConfirmButton: false,
                                    showCloseButton: false,
                                    showCancelButton: false,
                                    focusConfirm: false,
                                    timer: 1000,
                                  })
                                : toggle();
                            }}
                            // () =>
                            // history.push(
                            //   `/news/edit/${data?.id}?page=${currentPage}&filter=${currentFilter}`,
                            //   data?.id
                            // )
                          >
                            {data?.isScheduled ? (
                              <Trans i18nKey={"reSchedule"} />
                            ) : (
                              <Trans i18nKey={"schedule"} />
                            )}
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
                        __html: he?.decode(data.body),
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
      <Modal isOpen={modal} centered toggle={toggle}>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Formik
                initialValues={{ DateTime: new Date() }}
                onSubmit={(e) => {
                  schedulingMutation.mutate({
                    publishDate: e?.DateTime,
                    noticeId: data?.id,
                  });
                }}
              >
                <Form>
                  <Row className="justify-content-center">
                    <Col xs={8}>
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
    </div>
  );
}
