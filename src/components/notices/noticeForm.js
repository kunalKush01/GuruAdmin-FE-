import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row, Spinner } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import AsyncSelectField from "../partials/asyncSelectField";
import { getGlobalNotice } from "../../api/eventApi";
import { flatMap } from "lodash";

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
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
  selectEventDisabled,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const noticeQuerClient = useQueryClient();
const [loading , setLoading] = useState(false)
  const noticeMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        noticeQuerClient.invalidateQueries(["Notices"]);
        noticeQuerClient.invalidateQueries(["NoticeDetail"]);
        setLoading(false)
        history.push("/notices");
      }else if(data.error){
        setLoading(false)
      }
    },
  });

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          setLoading(true);
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
                  <Col xs={6}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      name="Title"
                      required
                      autoFocus
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="mt-0 mt-lg-1">
                    <RichTextField
                      height="100px"
                      label={t("news_label_Description")}
                      name="Body"
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
            <div className="btn-Published ">
            {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "5px 40px",
                    opacity: "100%",
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button color="primary" className="addNotice-btn " type="submit">
                {plusIconDisable && (
                  <span>
                    <Plus className="me-1" size={15} strokeWidth={4} />
                  </span>
                )}
                <span>
                  <Trans i18nKey={`${buttonName}`} />
                </span>
              </Button>
              )}
              
            </div>
          </Form>
        )}
      </Formik>
    </FormWaraper>
  );
}
