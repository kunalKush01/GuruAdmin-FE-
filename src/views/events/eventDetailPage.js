import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getEventDetail } from "../../api/eventApi";
import DetailPage from "../../components/partials/customDetailpage";

const EventDetailPage = () => {
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const { t } = useTranslation();
  const history = useHistory();
  const { eventId } = useParams();
  const getLangId = (langArray, langSelection) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection?.toLowerCase()) {
        languageId = Item.id;
      }
    });
    return languageId;
  };
  const langArray = useSelector((state) => state.auth.availableLang);

  const [langSelection, setLangSelection] = useState(selectedLang.name);
  const eventDetailQuery = useQuery(
    ["EventDetail", eventId, selectedLang.id],
    async () =>
      getEventDetail({
        eventId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  const tags = eventDetailQuery?.data?.result?.tags?.map((item) => item?.tag);
  return (
    <>
      <DetailPage tags={tags}
      title={eventDetailQuery?.data?.result?.title}
      latitude={eventDetailQuery?.data?.result?.latitude}
      longitude={eventDetailQuery?.data?.result?.longitude}
      startDate={eventDetailQuery?.data?.result?.startDate}
        description={eventDetailQuery?.data?.result?.body}
        langButton={eventDetailQuery?.data?.result?.languages}
      />
    </>
  );
};

export default EventDetailPage;
