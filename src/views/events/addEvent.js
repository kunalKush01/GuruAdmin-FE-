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
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { useSelector } from "react-redux";
import { authApiInstance } from "../../axiosApi/authApiInstans";
import { createEvent } from "../../api/eventApi.js";
import EventForm from "../../components/events/eventForm";

const EventWraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateEvent = async (payload) => {
  
  return createEvent(payload);
};
const schema = yup.object().shape({
  Title: yup.string().required("events_title_required"),
  Body: yup.string().required("events_desc_required"),
  DateTime: yup.mixed(),
  SelectedEvent: yup.mixed(),
});

const initialValues = {
  SelectedEvent: null,
  Id: "",
  Title: "",
  Tags:"",
  Body: "",
  DateTime: { start: new Date(), end: null },
  startTime:new Date(),
  endTime:new Date(),
};

export default function AddEvent() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get('page')
  const currentFilter = searchParams.get('filter')
  return (
    <EventWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/events?page=${currentPage}&filter=${currentFilter}`)}
          />
          <div className="addEvent">
            <Trans i18nKey={"events_AddEvent"} />
          </div>
        </div>
        <div className="addEvent">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
      </div>
      <div className="ms-3 mt-1">
        <EventForm
          handleSubmit={handleCreateEvent}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="events_AddEvent"
        />
      </div>
    </EventWraper>
  );
}
