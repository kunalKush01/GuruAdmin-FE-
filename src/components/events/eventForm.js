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

  label {
    /* margin-bottom: 0px; */
    font: normal normal bold 15px/33px Noto Sans;
  }


  /* input tags  css start */
  .ReactTags__tagInput {
    color: #583703 !important;
    height: 36px;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
}
.ReactTags__tagInput input.ReactTags__tagInputField{
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
    outline: none;
    width: 100%;
    height: inherit;
    padding-left: .5rem;
    ::placeholder{
        color:#fff7e8 ;
    }
}
/* added tags  */
.ReactTags__selected{
  width: 413.88px;
  display: flex;
  overflow-x:scroll !important;
    ::-webkit-scrollbar{
      width:10px;
       display: block;
    }
}

/* Styles for suggestions */
.ReactTags__suggestions {
  position: absolute;
}
.ReactTags__suggestions ul {
  list-style-type: none;
  box-shadow: 0.05em 0.01em 0.5em rgba(0, 0, 0, 0.2);
  background-color: #fff7e8 !important;
  width: 200px;
}
.ReactTags__suggestions li {
  border-bottom: 1px solid #ddd;
  padding: 5px 10px;
  margin: 0;
}
.ReactTags__suggestions li mark {
  text-decoration: underline;
  background: none;
  font-weight: 600;
}
/* .ReactTags__suggestions ul li.ReactTags__activeSuggestion {
  background: #b7cfe0;
  cursor: pointer;
} */
  .ReactTags__selected span.ReactTags__tag {
    padding: 4px 10px;
    font: normal normal bold 13px/20px Noto Sans;
    border-radius: 10px;
    border: 2px solid #583703;
    display: flex;
    margin-left: 3px;
    align-items: center;
    margin-top: 0.5rem;
}
.ReactTags__remove {
    font-size: 20px;
    font-weight: 900;
    border: none;
    vertical-align: middle;
    line-height: 0px;
    cursor: pointer;
}
/* input tags  css start */
  //  media query
  
  @media only screen and (max-width: 1280px ) and (min-width: 886px) {
    .ReactTags__selected {
      width: 324.91px !important;
    }
  }
  @media only screen and (max-width: 885px) and (min-width:769px) {
    .ReactTags__selected{
      width: 209.41px !important;
    }
  }
  @media only screen and (max-width: 768px) and (min-width: 320px) {
    .thumbnail_image {
      width: 100px;
      height: 100px;
    }
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
        eventQuerClient.invalidateQueries(["EventDates"]);
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
            tags:e?.Tags,
            startTime:e?.startTime,
            endTime:e?.endTime,
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
                      autoFocus
                    />
                  </Col>
                  <Col xs={6}>
                    <AsyncSelectField
                      // minHeight={"50px"}
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
              <Col xs="4" className="">
                <Row>
                  <Col xs="10">
                    <CustomTextField label={t("Tags")} name="Tags" />
                  </Col>
                  
                  <Col>
                    <FormikRangeDatePicker
                      label={t("donation_select_date_time")}
                      name="DateTime"
                      selectsRange
                    />
                  </Col>
                  <Col xs="10">
                    <Row className="">
                      <Col lg="6">
                      <CustomTextField
                          label={t("Start")}
                          // value={latitude}
                          type="time"
                          name="startTime"
                           required
                        />
                      </Col>
                      <Col lg="6">
                      <CustomTextField
                          label={t("End")}
                          // value={latitude}
                          type="time"
                          name="endTime"
                           required
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published mb-2">
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
