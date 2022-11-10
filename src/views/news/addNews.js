import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import CustomDatePicker from "../../components/partials/CustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";

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
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;

    font: normal normal bold 13px/5px noto sans;
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
const handleCreateNews = async (payload) => {
  await createNews(payload);
};
const schema = yup.object().shape({
  Title: yup.string().required("news_title_required"),
  Tags: yup.string().required("news_tags_required"),
  RichTextField: yup.string().required("news_desc_required"),
  Published: yup.string().required("news_publish_required"),
  DateTime: yup.string(),
});
export default function AddNews() {
  const history = useHistory();
  const { t } = useTranslation();
  const newsQuerClient = useQueryClient();

  const newsMutation = useMutation({
    mutationFn: handleCreateNews,
    onSuccess: () => {
      newsQuerClient.invalidateQueries(["News"]);
      history.push("/news")
    },
  });
  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/news")}
          />
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

      <div className="FormikWraper">
        <Formik
          initialValues={{
            Title: "",
            Tags: "",
            RichTextField: "",
            Published: "",
            DateTime: new Date(),
          }}
          onSubmit={(e) =>
            newsMutation.mutate({
              title: e.Title,
              tags: e.Tags,
              body: e.RichTextField,
              publishDate: e.DateTime,
              publishedBy: e.Published,
              imageUrl: "http://newsImage123.co",
            })
          }
          validationSchema={schema}
        >
          {(formik) => (
            <Form>
              <Row>
                <Col xs={7}>
                  <Row>
                    <Col>
                      <CustomTextField
                        label={t("news_label_Title")}
                        name="Title"
                      />
                    </Col>
                    <Col>
                      <CustomTextField
                        label={t("news_label_Tags")}
                        name="Tags"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <RichTextField
                        height="100px"
                        label={t("news_label_Description")}
                        name="RichTextField"
                      />
                    </Col>
                  </Row>
                  {/* <Row>
                        <div className="ImagesVideos">
                          <Trans i18nKey={"news_label_ImageVedio"} />
                        </div>
                        <div></div>
                      </Row> */}
                  <Row>
                    <Col xs={6}>
                      <CustomTextField
                        label={t("news_label_Published")}
                        name="Published"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <CustomDatePicker name="DateTime" showTimeInput />
                </Col>
              </Row>
              <div className="btn-Published ">
                <Button color="primary" type="submit">
                  <Trans i18nKey={"news_button_Publish"} />
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </NewsWarper>
  );
}
