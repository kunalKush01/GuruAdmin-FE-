import he from "he";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/common.scss";
import { fetchImage } from "./downloadUploadImage";

export default function DetailPage({
  tags,
  title,
  description,
  images,
  subImages,
  image,
  startDate,
  longitude,
  latitude,
  templeName,
  langButton,
  templeLocation,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  let firstImage = image
    ? image ?? placeHolder
    : images?.length
    ? images[0]?.presignedUrl
    : placeHolder;

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [imageUrl, setImageUrl] = useState([]);
  useEffect(() => {
    if (image || images) {
      const loadImages = async () => {
        const imageArray = [];

        // If `images` is an array, use it
        if (Array.isArray(images)) {
          imageArray.push(...images);
        }

        // If `image` is a string, wrap it in an array
        if (typeof image === "string" && image.trim() !== "") {
          imageArray.push({ name: image });
        }

        // Fetch all images
        const urls = await Promise.all(
          imageArray.map(async (img) => {
            const url = await fetchImage(img.name);
            return url;
          })
        );

        setImageUrl(urls);
      };

      loadImages();
    }
  }, [image, images]);
  // useEffect(() => {
  //   if (images) {
  //     const loadImages = async () => {
  //       const urls = await Promise.all(
  //         images.map(async (image) => {
  //           const url = await fetchImage(image.name);
  //           return url;
  //         })
  //       );

  //       setImageUrl(urls);
  //     };

  //     loadImages();
  //   }
  // }, [images]);
  console.log(imageUrl);
  return (
    <div className="trustwrapper">
      <div className="window nav statusBar body "></div>
      <div>
        <div className="d-sm-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center">
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
          <div className="addTrust justify-content-between mt-sm-0"></div>
        </div>
        <Row className="my-lg-3 mt-2">
          <Col xs={12} lg={4} className="ps-3">
            {Array.isArray(imageUrl) && imageUrl.length > 1 ? (
              <Slider {...settings}>
                {imageUrl.map((item, index) => (
                  <div key={index} className="detailImage">
                    <img
                      src={item}
                      alt={`Image ${index}`}
                      className="detailImage h-100 w-100"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={imageUrl?.[0] || firstImage}
                alt="Detail"
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
            <div className="tags mt-1 d-block w-100">
              {" "}
              {tags?.length ? `#${tags?.join("#")}` : ""}
            </div>
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
            {/* <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
            {subImages?.length ?subImages?.map((item) => {
                return (
                  <div className="imageDiv">
                    <img
                      src={item?.presignedUrl}
                      className="detailImage h-100 w-100"
                    />
                  </div>
                );
              }):""}
            </div> */}
          </Col>
          <Col xs={12} lg={8} className="ps-3">
            <Row>
              <Col xs={12} lg={11} className=" px-0 ps-2 pe-2">
                <div className="detail-title">
                  {ConverFirstLatterToCapital(title ?? "")}
                </div>
                <div
                  className="detail-content mt-1 text-break"
                  dangerouslySetInnerHTML={{
                    __html: he?.decode(description ?? ""),
                  }}
                ></div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}
