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
import {
  addLangPunyarjakDetail,
  getPunyarjakDetails,
} from "../../api/punarjakApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import PunyarjakForm from "../../components/Punyarjak/punyarjakUserForm";
import { CustomDropDown } from "../../components/partials/customDropDown";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import '../../styles/viewCommon.scss';
;

const schema = Yup.object().shape({
  description: Yup.string().required("punyarjak_desc_required").trim(),
  title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("news_title_required")
    .trim(),
  image: Yup.string().required("img_required"),
});

export default function AddLanguagePunyarjak() {
  const history = useHistory();
  const { punyarjakId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState("Select");

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
      description: he?.decode(
        punyarjakDetailQuery?.data?.result?.description ?? ""
      ),
      DateTime: moment(punyarjakDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
      image: punyarjakDetailQuery?.data?.result?.image,
    };
  }, [punyarjakDetailQuery]);

  return (
    <div className="punyarjakwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/punyarjak?page=${currentPage}`)}
          />
          <div className="addPunyarjak">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="addPunyarjak">
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
            validationSchema={schema}
            handleSubmit={handlePunyarjakLangUpdate}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
