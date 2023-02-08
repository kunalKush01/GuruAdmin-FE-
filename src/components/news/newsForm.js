import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import {ConverFirstLatterToCapital} from "../../utility/formater";

const FormWaraper = styled.div`
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

export default function NewsForm({
  plusIconDisable = false,
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
  buttonName,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const newsQuerClient = useQueryClient();

  const newsMutation = useMutation({
    mutationFn: handleSubmit,

    onSuccess: (data) => {
      console.log("error=", data);
      if ( !data.error) {
        newsQuerClient.invalidateQueries(["News"])
        newsQuerClient.invalidateQueries(["NewsDetail"])
        history.push("/news");
      }
    },
  });
  return (
    <FormWaraper className="FormikWraper">
      <Formik
      // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) =>
          newsMutation.mutate({
            newsId: e.Id,
            title: e.Title,
            tags: e.Tags,
            body: e.Body,
            publishDate: e.DateTime,
            publishedBy: e.PublishedBy,
            imageUrl: "http://newsImage123.co",
          })
        }
        validationSchema={vailidationSchema}
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
                      autoFocus
                    />
                  </Col>
                  <Col>
                    <CustomTextField label={t("news_label_Tags")} name="Tags" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="mt-lg-1">
                    <RichTextField
                      height="100px"
                      label={t("news_label_Description")}
                      name="Body"
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
                      name="PublishedBy"
                      disabled
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <FormikCustomDatePicker
                  label={t("donation_select_date_time")}
                  name="DateTime"
                  showTimeInput={showTimeInput}
                />
              </Col>
            </Row>
            <div className="btn-Published mb-2">
              <Button color="primary" type="submit"> 
              {plusIconDisable && (
                  <span>
                    <Plus className="me-1" size={15} strokeWidth={4} />
                  </span>
                )}
                <span>
                  <Trans i18nKey={`${buttonName}`} />
                </span>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWaraper>
  );
}
