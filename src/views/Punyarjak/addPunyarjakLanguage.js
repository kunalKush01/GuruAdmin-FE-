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
import NewsForm from "../../components/news/newsForm";
import { getAllTrustPrefeces } from "../../api/profileApi";
import {
  addLangPunyarjakDetail,
  getPunyarjakDetails,
} from "../../api/punarjakApi";
import PunyarjakForm from "../../components/Punyarjak/punyarjakUserForm";

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

const schema = yup.object().shape({
  description: yup.string().required("punyarjak_desc_required").trim(),
  title: yup
    .string()
    .matches(/^[^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/g, "injection_found")
    .required("news_title_required").trim(),
    image:yup.string().required("img_required")
});

export default function AddLanguagePunyarjak() {
  const history = useHistory();
  const { punyarjakId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState('Select');
  console.log("langSelection", langSelection);

  const punyarjakDetailQuery = useQuery(
    ["punyarjakDetails", punyarjakId, selectedLang.id],
    async () =>
      await getPunyarjakDetails({ punyarjakId, languageId: selectedLang.id })
  );

  const handlePunyarjakLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangPunyarjakDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    if (punyarjakDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        punyarjakDetailQuery?.data?.result?.languages,
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
    punyarjakDetailQuery?.data?.result?.languages,
  ]);
  // useEffect(() => {
  //   if (availableLangOptions.length != 0) {
  //     setLangSelection(availableLangOptions[0]?.name);
  //   }
  // }, [availableLangOptions]);

  const initialValues = useMemo(() => {
    return {
      id: punyarjakDetailQuery?.data?.result?.id,
      title: punyarjakDetailQuery?.data?.result?.title,
      description: he.decode(
        punyarjakDetailQuery?.data?.result?.description ?? ""
      ),
      DateTime: moment(punyarjakDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
      image: punyarjakDetailQuery?.data?.result?.image,
    };
  }, [punyarjakDetailQuery]);

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/punyarjak?page=${currentPage}`)}
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

      {!punyarjakDetailQuery.isLoading ? (
        <div className="mt-1 ms-md-3">
          <PunyarjakForm
            editThumbnail
            AddLanguage
            langSelectionValue={langSelection}
            editTrue="edit"
            thumbnailImageName={punyarjakDetailQuery?.data?.result?.imageName}
            buttonName={"news_AddLangNews"}
            initialValues={initialValues}
            vailidationSchema={schema}
            handleSubmit={handlePunyarjakLangUpdate}
          />
          {/* <NewsForm
            editImage="edit"
            AddLanguage
            defaultImages={punyarjakDetailQuery?.data?.result?.images}
            trustPreference={trustPreference}
            initialValues={initialValues}
            vailidationSchema={schema}
            showTimeInput
            buttonName={"news_AddLangNews"}
            handleSubmit={handlePunyarjakLangUpdate}
          /> */}
        </div>
      ) : (
        ""
      )}
    </NewsWarper>
  );
}
