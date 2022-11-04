import { Formik } from "formik";
import React, { useState } from "react";
import CustomTextField from "../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../components/partials/customDropDown";
import arrowLeft from "../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import CustomDatePicker from "../components/partials/CustomDatePicker";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
    color: #583703;
    display: flex;
    align-items: center;
  }

  .FormikWraper {
    padding: 40px;
  }
`;
const langArray = [
  "English",
  "தமிழ்",
  "हिन्दी",
  "ನೆರಳಿನಲ್ಲೇ",
  "मराठी",
  "ગુજરાતી",
  "తెలుగు",
  "മലയാളം",
];

export default function News() {
  const schema = yup.object().shape({
    Title: yup.string().required(),
    Tags: yup.string().required(),
  });
  const { t } = useTranslation();
  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img src={arrowLeft} className="me-2" />
          <div className="addNews">
            <Trans i18nKey={"news_AddNews"} />
          </div>
        </div>
        <div className="addNews">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
      </div>

      <div className="FormikWraper ">
        <Formik
          initialValues={{ Title: "", Tags: "", RichTextField: "" }}
          validationSchema={schema}
        >
          {(formik) => (
            <>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <CustomTextField
                        label={t("news_label_Title")}
                        name="Title"
                        onChange={formik.handleChange}
                        value={formik.values.Title}
                      />
                    </Col>
                    <Col>
                      <CustomTextField
                        label={t("news_label_Tags")}
                        name="Tags"
                        onChange={formik.handleChange}
                        value={formik.values.Tags}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <RichTextField
                        // width={"600px"}
                        height="100px"
                        label={t("news_label_Description")}
                        name="RichTextField"
                        value={formik.values.RichTextField}
                        onChange={formik.handleChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <div className="ImagesVideos">Add Images/Videos</div>
                  </Row>
                </Col>
                <Col>
                  <div>Select Date</div>
                  <CustomDatePicker/>
                  
                </Col>
              </Row>
            </>
          )}
        </Formik>
      </div>
    </NewsWarper>
  );
}
