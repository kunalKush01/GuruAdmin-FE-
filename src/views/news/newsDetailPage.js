import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getNewsDetail } from "../../api/newsApi";
import DetailPage from "../../components/partials/customDetailpage";

const NewsDetailPage = () => {
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const { newsId } = useParams();
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
  const newsDetailQuery = useQuery(
    ["EventDetail", newsId, selectedLang.id],
    async () =>
      getNewsDetail({
        newsId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  const tags = newsDetailQuery?.data?.result?.tags?.map((item) => item?.tag);

  let subImages = [];
  newsDetailQuery?.data?.result?.images?.length > 1
    ? (subImages = [
        ...subImages,
        ...newsDetailQuery?.data?.result?.images,
      ])
    : [];
  subImages.splice(0, 1);
  return (
    <>
      <DetailPage
        tags={tags}
        title={newsDetailQuery?.data?.result?.title}
        latitude={newsDetailQuery?.data?.result?.latitude}
        longitude={newsDetailQuery?.data?.result?.longitude}
        startDate={newsDetailQuery?.data?.result?.publishDate}
        description={newsDetailQuery?.data?.result?.body}
        images={newsDetailQuery?.data?.result?.images}
        subImages={subImages}
        langButton={newsDetailQuery?.data?.result?.languages}
      />
    </>
  );
};

export default NewsDetailPage;
