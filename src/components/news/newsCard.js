import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import he from "he";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { PublishNews, ScheduleNews, deleteNewsDetail } from "../../api/newsApi";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import {
  DELETE,
  EDIT,
  PUBLISHER,
  WRITE,
} from "../../utility/permissionsVariable";
import BtnPopover from "../partials/btnPopover";
import { CustomDropDown } from "../partials/customDropDown";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import "../../assets/scss/common.scss";
import { fetchImage } from "../partials/downloadUploadImage";

function BtnContent({
  newsId,
  currentPage,
  currentFilter,
  subPermission,
  isPublished,
  allPermissions,
  totalAvailableLanguage,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleDeleteNews = async (payload) => {
    return deleteNewsDetail(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteNews,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["News"]);
      }
    },
  });

  const langList = useSelector((state) => state.auth.availableLang);
  return (
    <div className="listviewwrapper">
      <Row className="MainContainer d-block ">
        {(allPermissions?.name === "all" ||
          subPermission?.includes(EDIT) ||
          subPermission?.includes(PUBLISHER)) &&
        !isPublished ? (
          <Col
            xs={12}
            className=" btncontentwrapper col-item"
            onClick={() =>
              navigate(
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
                title: `<img src="${confirmationIcon}"/>`,
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
                : navigate(
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
    </div>
  );
}

export default function NewsCard({
  data,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handlePublish = async (payload) => {
    return PublishNews(payload);
  };
  const handleSchedule = async (payload) => {
    return ScheduleNews(payload);
  };
  const queryClient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: handlePublish,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["News"]);
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
        queryClient.invalidateQueries(["News"]);
      }
    },
  });
  const [imageUrl, setImageUrl] = useState([]);
  useEffect(() => {
    if (data) {
      const loadImages = async () => {
        const urls = await Promise.all(
          data?.images.map(async (image) => {
            const url = await fetchImage(image.name);
            return url;
          })
        );

        setImageUrl(urls);
      };

      loadImages();
    }
  }, [data]);
  return (
    <div className="newscardwrapper">
      <Card
        style={{
          width: "100%",
          height: "390px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div className="position-relative cursor-pointer imgContainer">
          <img
            onClick={() => navigate(`/news/about/${data?.id}`, data.id)}
            alt="News Image"
            style={{
              height: "100%",
              position: "relative",
              objectFit: "cover",
              width: "100%",
              borderBottom: "1px solid rgb(255, 135, 68)",
            }}
            src={
              imageUrl
                ? imageUrl[0]
                : data?.images[0]?.presignedUrl ?? placeHolder
            }
          />
          <div className="position-absolute imgContent  w-100">
            {(allPermissions?.name === "all" ||
              subPermission?.includes(PUBLISHER)) && (
              <div className="text-end">
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
            )}
          </div>
        </div>

        <CardBody>
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/news/about/${data.id}`, data.id)}
          >
            <CardTitle>{ConverFirstLatterToCapital(data.title)}</CardTitle>

            <CardText>
              <div
                dangerouslySetInnerHTML={{
                  __html: he?.decode(data?.body ?? ""),
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
            isPublished={data?.isPublished}
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
                  schedulingMutation.mutate({
                    publishDate: e?.DateTime,
                    newsId: data?.id,
                  });
                }}
              >
                <Form>
                  <Row className="responsive-row">
                    <Col xs={8} lg={12} sm={12} className="responsive-col">
                      <FormikCustomDatePicker
                        name="DateTime"
                        width="100%"
                        pastDateNotAllowed
                        showTimeInput
                      />
                    </Col>
                  </Row>
                  <Row className="mx-auto">
                    <Col xs={12} className="mx-auto">
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
