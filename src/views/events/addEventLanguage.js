import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLangNewsDetail,
  createNews,
  getNewsDetail,
  updateNewsDetail,
} from "../../api/newsApi";
import { useSelector } from "react-redux";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import he from "he";
import EventForm from "../../components/events/eventForm";

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
  const eventDetailQuery = useQuery(
    ["EventDetail", eventId],
    async () => await getNewsDetail({ eventId })
  );
  const [langSelection, setLangSelection] = useState();

  const handleEventLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangNewsDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    const option = _.differenceBy(
      langArray,
      eventDetailQuery?.data?.result?.languages,
      "id"
    );
    return option;
  };

  const availableLangOptions = useMemo(getAvailLangOption, [
    langArray,
    eventDetailQuery?.data?.result?.languages,
  ]);
  useEffect(() => {
    if (Array.isArray(availableLangOptions)) {
      setLangSelection(
        ConverFirstLatterToCapital(availableLangOptions[0].name)
      );
    }
  }, [availableLangOptions]);

  const initialValues = {
    Id: eventDetailQuery?.data?.result?.id,
    Title: eventDetailQuery?.data?.result?.title,
    Tags: eventDetailQuery?.data?.result?.tags,
    Body: he.decode(eventDetailQuery?.data?.result?.body ?? ""),
    PublishedBy: eventDetailQuery?.data?.result?.publishedBy,
    DateTime: moment(eventDetailQuery?.data?.result?.publishDate)
      .utcOffset("+0530")
      .toDate(),
  };

  return (
    <EventWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/news")}
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
        />
      ) : (
        ""
      )}
    </EventWarper>
  );
}
