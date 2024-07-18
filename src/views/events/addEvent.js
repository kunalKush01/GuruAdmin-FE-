import moment from "moment";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createEvent } from "../../api/eventApi.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import EventForm from "../../components/events/eventForm";

import '../../styles/viewCommon.scss';
;

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
    start: Yup.string().required("events_startDate_required"),
    // end: Yup.mixed().required("events_endDate_required"),
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
  DateTime: { start: new Date(), end: null },
  startTime: moment(new Date(), ["HH:mm"]).format("HH:mm"),
  endTime: "23:59",
};

export default function AddEvent() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  return (
    <div className="eventwraper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/events?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"events_AddEvent"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
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
