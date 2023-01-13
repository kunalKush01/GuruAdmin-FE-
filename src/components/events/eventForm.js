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
import { getGlobalEvents } from "../../api/eventApi";
import FormikRangeDatePicker from "../partials/FormikRangeDatePicker";
import { useUpdateEffect } from "react-use";
import moment from "moment";
import { isDate } from "lodash";

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

export default function EventForm({
  buttonName = "",
  plusIconDisable = false,
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput = false,
  selectEventDisabled,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const eventQuerClient = useQueryClient();

  const eventMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      console.log("error=", data);
      if (!data.error) {
        eventQuerClient.invalidateQueries(["Events"]);
        eventQuerClient.invalidateQueries(["EventDetail"]);
        history.push("/events");
      }
    },
  });

  const loadOption = async () => {
    const getGlobalEventsRES = await getGlobalEvents(100);
    return getGlobalEventsRES.results;
  };

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          eventMutation.mutate({
            eventId: e.Id,
            baseId: e?.SelectedEvent?.id ?? null,
            title: e.Title,
            body: e.Body,
            startDate: e.DateTime?.start,
            endDate: e.DateTime?.end,
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
                    />
                  </Col>
                  <Col xs={6}>
                    <AsyncSelectField
                      name="SelectedEvent"
                      loadOptions={loadOption}
                      labelKey={"title"}
                      valueKey={"id"}
                      label={t("events_select_dropDown")}
                      placeholder={t("events_select_dropDown")}
                      disabled={selectEventDisabled}
                      onChange={(selectOption) => {
                        formik.setFieldValue("SelectedEvent", selectOption);

                        formik.setFieldValue(
                          "Title",
                          selectOption?.title ?? ""
                        );
                        formik.setFieldValue("Body", selectOption?.body ?? "");

                        formik.setFieldValue("DateTime", {
                          start: moment(selectOption?.startDate)
                            .utcOffset("+0530")
                            .toDate(),
                          end: moment(selectOption?.endDate)
                            .utcOffset("+0530")
                            .toDate(),
                        });
                      }}
                    />
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
              </Col>
              <Col>
                <FormikRangeDatePicker
                  label={t("donation_select_date_time")}
                  name="DateTime"
                  selectsRange
                />
              </Col>
            </Row>
            <div className="btn-Published ">
              <Button color="primary" className="addEvent-btn " type="submit">
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
