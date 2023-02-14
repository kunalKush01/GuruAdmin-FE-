import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelector } from "react-redux";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import he from "he";
import EventForm from "../../components/events/eventForm";
import { addLangEventDetail, getEventDetail } from "../../api/eventApi";

const EventWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = yup.object().shape({
  Title: yup.string().required("events_title_required"),
  Body: yup.string().required("events_desc_required"),
  DateTime: yup.string(),
});

export default function AddLanguageEvent() {
  const history = useHistory();
  const { eventId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const eventDetailQuery = useQuery(
    ["EventDetail", eventId, langSelection, selectedLang.id],
    async () => await getEventDetail({ eventId, languageId: selectedLang.id })
  );

  const handleEventLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangEventDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    if (eventDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        eventDetailQuery?.data?.result?.languages,
        "id"
      );
      if (_.isEqual(option, langArray)) {
        return [];
      }

      return option;
    }
    return [];
  };

  const availableLangOptions = getAvailLangOption();
  console.log("availableLangOptions=", availableLangOptions);

  useEffect(() => {
    if (availableLangOptions.length != 0) {
      setLangSelection(availableLangOptions[0]?.name);
    }
  }, [availableLangOptions]);

  const initialValues = useMemo(() => {
    return {
      Id: eventDetailQuery?.data?.result?.id,
      Title: eventDetailQuery?.data?.result?.title,
      Tags: eventDetailQuery?.data?.result?.tags,
      Body: he.decode(eventDetailQuery?.data?.result?.body ?? ""),
      PublishedBy: eventDetailQuery?.data?.result?.publishedBy,
      DaDateTime: {
        start: moment(eventDetailQuery?.data?.result?.startDate)
          .utcOffset("+0530")
          .toDate(),
        end: moment(eventDetailQuery?.data?.result?.endDate)
          .utcOffset("+0530")
          .toDate(),
      },
      startTime:eventDetailQuery?.data?.result?.startTime,
      endTime:eventDetailQuery?.data?.result?.endTime,
    };
  }, [eventDetailQuery]);

  return (
    <EventWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/events")}
          />
          <div className="editEvent">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editEvent">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={availableLangOptions}
            className={"ms-1"}
            defaultDropDownName={langSelection}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      {!eventDetailQuery.isLoading ? (
        <EventForm
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          handleSubmit={handleEventLangUpdate}
          buttonName={"news_AddLangNews"}
        />
      ) : (
        ""
      )}
    </EventWarper>
  );
}
