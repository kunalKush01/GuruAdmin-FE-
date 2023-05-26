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
import BtnPopover from "../partials/btnPopover";
import { CustomDropDown } from "../partials/customDropDown";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { deleteNewsDetail } from "../../api/newsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import { useSelector } from "react-redux";

const NewsCardWaraper = styled.div`
  .imgContainer {
    background-color:#fff7e8;
    img {
      border-radius: 10px 10px 0px 0px;
    }
  }
  .card-title {
    font: normal normal bold 13px/16px Noto Sans;
    margin-bottom: 10px !important;
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
    top: 80%;
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
`;
function BtnContent({
  newsId,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
  totalAvailableLanguage
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
      .col-item-disabled{
        cursor: not-allowed;
        opacity:0.5;
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
      <Row className="MainContainer d-block">
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
            className={`${langList?.length === totalAvailableLanguage ? "col-item-disabled opacity-50 pb-1" : "col-item pb-1"}`}
            onClick={() =>
              langList?.length === totalAvailableLanguage ? "" :
              history.push(
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

  return (
    <NewsCardWaraper>
      <Card
        style={{
          width: "100%",
          height:"337px",
          borderRadiuis:"10px",
          overflow:"hidden"
        }}
      >
        <div
          className="position-relative cursor-pointer imgContainer "
          onClick={() => history.push(`/news/about/${data.id}`, data.id)}
        >
          <img
            alt="News Image"
            style={{
              height: "150px",
              position: "relative",
              width: "100%",
            }}
            src={data?.images[0]?.presignedUrl ?? placeHolder}
          />
          {/* <div className=" position-absolute imgContent  w-100 ">
            <div className="text-end">
              {`${moment(data.publishDate).startOf("hour").fromNow()}`}
            </div>
          </div> */}
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
            {data.languages.map((item) => {
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
                {`Posted on ${moment(data.publishDate).format("D MMMM YYYY ")}`}
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
    </NewsCardWaraper>
  );
}
