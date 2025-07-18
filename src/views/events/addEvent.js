import moment from "moment";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createEvent } from "../../api/eventApi.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import EventForm from "../../components/events/eventForm";

import "../../assets/scss/viewCommon.scss";

const handleCreateEvent = async (payload) => {
  return createEvent(payload);
};
const schema = Yup.object().shape({
  Title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("events_title_required")
    .trim(),
  // tagsInit:Yup.array().max(15 ,"tags_limit"),
  Body: Yup.string().required("events_desc_required").trim(),
  DateTime: Yup.object().shape({
    start: Yup.string()
      .nullable()
      .required("events_startDate_required"), // Ensures it's required but can be null initially
    end: Yup.string()
      .nullable()
      .required("events_endDate_required"),
  }),
  startTime: Yup.mixed().required("events_startTime_required"),
  endTime: Yup.mixed().required("events_endTime_required"),
  SelectedEvent: Yup.mixed(),
  location: Yup.mixed().required("events_location_required"),
});

const initialValues = {
  SelectedEvent: null,
  Id: "",
  Title: "",
  images: [],
  tagsInit: [],
  Body: "",
  location: "",
  city: "",
  state: "",
  latitude: "",
  longitude: "",
  DateTime: {
    start: "",
    end: "",
  },
  startTime: "",
  endTime: "",
};

export default function AddEvent() {
  const navigate = useNavigate();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              navigate(
                `/events?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"events_AddEvent"} />
          </div>
        </div>
      </div>
      <div className="mt-1">
        <EventForm
          handleSubmit={handleCreateEvent}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName="events_AddEvent"
        />
      </div>
    </div>
  );
}
