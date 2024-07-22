import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createNews } from "../../api/newsApi";
import { getUpdatedTrustDetail, updateProfile } from "../../api/profileApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import ProfileForm from "../../components/Profile/profileForm";
import { CustomDropDown } from "../../components/partials/customDropDown";
import { addFacility, handleProfileUpdate } from "../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../../assets/scss/viewCommon.scss";
const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

export default function AddProfile() {
  const trustDetail = useSelector((sate) => sate.auth.trustDetail);
  const userDetail = useSelector((state) => state.auth.userDetail);
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );
  const handleUpdateProfile = async (payload) => {
    const res = await updateProfile({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
    dispatch(handleProfileUpdate(res));
    dispatch(addFacility(res));
    return res;
  };

  return (
    <div className="addviewwrapper">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/")}
          />
          <div className="addProfile">
            <Trans i18nKey={"userProfile"} />
          </div>
        </div>
        <div className="addProfile">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
      </div>
      <ProfileForm />
    </div>
  );
}
