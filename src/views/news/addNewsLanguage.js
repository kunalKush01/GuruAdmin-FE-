import { useQuery } from "@tanstack/react-query";
import he from "he";
import _ from "lodash";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { addLangNewsDetail, getNewsDetail } from "../../api/newsApi";
import { getAllTrustPrefeces } from "../../api/profileApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import NewsForm from "../../components/news/newsForm";
import { CustomDropDown } from "../../components/partials/customDropDown";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = Yup.object().shape({
  Title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("news_title_required")
    .trim(),
  // Tags: Yup.string().required("news_tags_required"),
  Body: Yup.string().required("news_desc_required").trim(),
  PublishedBy: Yup.string().required("news_publish_required"),
  DateTime: Yup.string(),
  // tagsInit:Yup.array().max(15 ,"tags_limit"),
  preference: Yup.array()
    .min(1, "trust_prefenses_required")
    .required("trust_prefenses_required"),
});

export default function AddLanguageNews() {
  const history = useHistory();
  const { newsId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState("Select");

  const newsDetailQuery = useQuery(
    ["NewsDetail", newsId, selectedLang.id],
    async () => await getNewsDetail({ newsId, languageId: selectedLang.id })
  );

  const handleNewsLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangNewsDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    if (newsDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        newsDetailQuery?.data?.result?.languages,
        "id"
      );
      if (_.isEqual(option, langArray)) {
        return [];
      }

      return option;
    }
    return [];
  };

  const availableLangOptions = useMemo(getAvailLangOption, [
    langArray,
    newsDetailQuery?.data?.result?.languages,
  ]);
  // useEffect(() => {
  //   if (availableLangOptions.length != 0) {
  //     setLangSelection(availableLangOptions[0]?.name);
  //   }
  // }, [availableLangOptions]);
  const tags = newsDetailQuery?.data?.result?.tags?.map((item) => ({
    id: item.id,
    text: item.tag,
    _id: item.id,
  }));

  // Trust preference
  const loadTrustPreference = useQuery(["Preference"], () =>
    getAllTrustPrefeces()
  );

  const trustPreference = useMemo(
    () => loadTrustPreference?.data?.results ?? [],
    [loadTrustPreference?.data?.results]
  );

  const initialValues = useMemo(() => {
    return {
      Id: newsDetailQuery?.data?.result?.id,
      Title: newsDetailQuery?.data?.result?.title,
      tagsInit: tags,
      images: [],
      preference: newsDetailQuery?.data?.result?.preference ?? [],
      Body: he?.decode(newsDetailQuery?.data?.result?.body ?? ""),
      PublishedBy: newsDetailQuery?.data?.result?.publishedBy,
      DateTime: moment(newsDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
    };
  }, [newsDetailQuery]);

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/news?page=${currentPage}&filter=${currentFilter}`)
            }
          />
          <div className="editNews">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editNews">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={availableLangOptions}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(
              langSelection ?? ""
            )}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      {!newsDetailQuery.isLoading ? (
        <div className="mt-1 ms-md-3">
          <NewsForm
            editImage="edit"
            AddLanguage
            defaultImages={newsDetailQuery?.data?.result?.images}
            trustPreference={trustPreference}
            langSelectionValue={langSelection}
            initialValues={initialValues}
            validationSchema={schema}
            showTimeInput
            buttonName={"news_AddLangNews"}
            handleSubmit={handleNewsLangUpdate}
          />
        </div>
      ) : (
        ""
      )}
    </NewsWarper>
  );
}
