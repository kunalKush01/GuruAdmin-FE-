import he from "he";
import moment from "moment";
import React, { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import placeHolder from "../../assets/images/placeholderImages/ad-place.png";

const TrustWarapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addTrust {
    color: #583703;
    display: flex;
    align-items: center;
  }

  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addTrust-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .trustContent {
    margin-bottom: 5rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/5px noto sans;
  }
  .btn-outline-primary {
    border: 2px solid #ff8744 !important;
    font: normal normal bold 14px/15px Noto Sans;
    padding: 5px 10px;
    border-radius: 20px;
    margin-right: 10px;
  }
  .about-temple-name {
    font: normal normal bold 18px/33px Noto Sans;
  }
  .long-let_tude {
    font: normal normal normal 15px/33px Noto Sans;
  }
  .clockImage {
    width: 15px;
    margin-right: 5px;
  }
  .postDate {
    font: normal normal bold 10px/15px Noto sans;
  }
  .detail-title {
    font: normal normal bold 23px/43px Noto Sans;
  }
  .detail-content {
    font: normal normal normal 17px/28px Noto Sans;
  }
  .detailImage {
    width: 100%;
    height: 350px;
    border-radius: 10px;
  }
  .imageDiv{
    width: 35%;
    height: 150px;
  }
  .tags {
    word-break: break-all;
    font: normal normal normal 14px/25px Noto Sans;
  }
  //  media query
  @media only screen and (max-width: 578px) {
  }
`;

export default function DetailPage({
  tags,
  title,
  description,
  images,
  image,
  startDate,
  longitude,
  latitude,
  templeName,
  langButton,
  templeLocation,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  
  return (
    <TrustWarapper>
      <div className="window nav statusBar body "></div>
      <div>
        <div className="d-sm-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mt-2 mt-sm-0">
            <img
              src={arrowLeft}
              className="me-2 cursor-pointer"
              onClick={() => history.goBack()}
            />
            <div className="addTrust">
              <div className="">
                <div>
                  <Trans i18nKey={"About"} />
                </div>
                <div className="filterPeriod lh-base">
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="addTrust justify-content-between mt-2 mt-sm-0"></div>
        </div>
        <Row className="my-lg-3">
          <Col xs={12} lg={4} className="">
            {images ? (
              <img
                src={
                  images === undefined
                    ? placeHolder
                    : images[0]?.presignedUrl
                    ? images[0]?.presignedUrl
                    : placeHolder
                }
                className="detailImage"
              />
            ) : (
              <img
                src={image === undefined || image === "" ? placeHolder : image}
                className="detailImage"
              />
            )}
            <div className="d-flex justify-content-between mt-1">
              <div className="about-temple-name">{templeName ?? ""}</div>
              <div className="d-flex justify-content-between long-let_tude">
                <div className="me-1"> {longitude ?? ""}</div>
                <div>{latitude ?? ""}</div>
              </div>
            </div>
            <div className="mt-1">
              {langButton?.map((item) => (
                <Button outline color="primary" key={item?.id}>
                  {ConverFirstLatterToCapital(item.name)}
                </Button>
              ))}
            </div>
            <div className="tags mt-1 d-block w-100">#{tags?.join("#")}</div>
            <div className="d-flex justify-content-between align-items-center mt-1">
              <div className="postDate">
                <img
                  src={cardClockIcon}
                  className="clockImage"
                  style={{ verticalAlign: "bottom" }}
                />
                {`Posted on ${moment(startDate).format("DD MMMM YYYY ")}`}
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
              {images?.map((item) => {
                return (<div className="imageDiv">
                  <img src={item?.presignedUrl} className="detailImage h-100 w-100" />
                </div>)
              })}
            </div>
          </Col>
          <Col xs={12} lg={8} className="">
            <Row>
              <Col xs={12} lg={11} className=" px-0 ps-lg-2 pe-lg-2">
                <div className="detail-title">
                  {ConverFirstLatterToCapital(title ?? "")}
                </div>
                <div
                  className="detail-content mt-1"
                  dangerouslySetInnerHTML={{
                    __html: he.decode(description ?? ""),
                  }}
                ></div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </TrustWarapper>
  );
}
