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
import AsyncSelectField from "../partials/asyncSelectField";
import { getGlobalNotice } from "../../api/eventApi";

const FormWaraper = styled.div`
  .existlabel {
    margin-bottom: 10px;
    font: normal normal bold 15px/33px Noto Sans;
  }
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNotice-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .noticeContent {
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

export default function NoticeForm({
  plusIconDisable=false,
  buttonName="",
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
  selectEventDisabled,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const noticeQuerClient = useQueryClient();

  const noticeMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        noticeQuerClient.invalidateQueries(["Notices"])
        noticeQuerClient.invalidateQueries(["NoticeDetail"])
        history.push("/notices");
      }
    },
  });

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          console.log("formSubmitDaqta=", e);
          noticeMutation.mutate({
            noticeId: e.Id,
            baseId: e?.SelectedNotice?.id ?? null,
            title: e.Title,
            body: e.Body,
            publishDate: e.DateTime,
            imageUrl: ["http://newsImage123.co"],
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={7}>
                <Row>
                  <Col xs={12}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      name="Title"
                    />
                  </Col>
                  {/* <Col xs={6}>
                    <AsyncSelectField
                      name="SelectedEvent"
                      loadOptions={loadOption}
                      labelKey={"title"}
                      valueKey={"id"}
                      label={t("Notice_select_dropDown")}
                      placeholder={t("Notice_select_dropDown")}
                      disabled={selectEventDisabled}
                    />
                  </Col> */}
                </Row>
                <Row>
                  <Col xs={12}>
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
              </Col>
              <Col>
                <FormikCustomDatePicker
                  name="DateTime"
                  showTimeInput={showTimeInput}
                />
              </Col>
            </Row>
            <div className="btn-Published ">
              <Button color="primary" className="addNotice-btn " type="submit">
                {!plusIconDisable&&<span>
                  <Plus className="me-1" size={15} strokeWidth={4} />
                </span>}
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
