import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../components/partials/customDropDown";
import CustomTextField from "../../components/partials/customTextField";

import he from "he";
import moment from "moment";
import { useSelector } from "react-redux";
import { addLangNoticeDetail, getNoticeDetail } from "../../api/noticeApi";
import {
  addLangProfileDetail,
  getUpdatedTrustDetail,
} from "../../api/profileApi";
import ProfileForm from "../../components/Profile/profileForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../assets/scss/viewCommon.scss";

const schema = Yup.object().shape({
  trustName: Yup.string().required("name_required"),
  trustType: Yup.mixed().required("trust_type_required"),
  trustEmail: Yup.string().email("email_invalid").required("email_required"),
  trustNumber: Yup.string()
    .min(10, "Mobile Number must be 10 digits.")
    .required("number_required"),
  about: Yup.string().required("trust_about_required"),
  name: Yup.string().required("name_required"),
  email: Yup.string().email("email_invalid").required("email_required"),
  mobileNumber: Yup.string()
    .min(10, "Mobile Number must be 10 digits.")
    .required("number_required"),
  state: Yup.mixed().required("events_state_required"),
  city: Yup.mixed().required("events_city_required"),
  location: Yup.mixed().required("events_location_required"),
  latitude: Yup.string().required("latitude_required"),
  longitude: Yup.string().required("longitude_required"),
});

export default function AddLanguageProfile() {
  const navigate = useNavigate();
  const { profileId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState("Select");

  const profileDetailQuery = useQuery(
    ["ProfileDetail", profileId, selectedLang.id],
    async () => await getUpdatedTrustDetail({ languageId: selectedLang.id })
  );

  const handleProfileLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangProfileDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    if (profileDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        profileDetailQuery?.data?.result?.languages,
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
    profileDetailQuery?.data?.result?.languages,
  ]);
  // useEffect(() => {
  //   if (availableLangOptions.length != 0) {
  //     setLangSelection(availableLangOptions[0]?.name);
  //   }
  // }, [availableLangOptions]);
  const tags = profileDetailQuery?.data?.result?.tags?.map((item) => ({
    id: item.id,
    text: item.tag,
    _id: item.id,
  }));
  const initialValues = useMemo(() => {
    const documentName = profileDetailQuery?.data?.result?.documents?.map(
      (item) => item?.name
    );
    return {
      // Id: trustDetail?.id ?? "",
      trustName: profileDetailQuery?.data?.result?.trustName ?? "",
      profileImage: profileDetailQuery?.data?.result?.profilePhoto,
      trustType: profileDetailQuery?.data?.result?.trustType ?? "",
      trustEmail: profileDetailQuery?.data?.result?.trustEmail ?? "",
      trustNumber: profileDetailQuery?.data?.result?.trustNumber ?? "",
      address: profileDetailQuery?.data?.result?.address ?? "",
      about: he?.decode(profileDetailQuery?.data?.result?.about ?? ""),
      name: profileDetailQuery?.data?.result?.name ?? "",
      email: profileDetailQuery?.data?.result?.email ?? "",
      mobileNumber: profileDetailQuery?.data?.result?.mobileNumber ?? "",
      city: profileDetailQuery?.data?.result?.city,
      state: profileDetailQuery?.data?.result?.state,
      location: profileDetailQuery?.data?.result?.location,
      longitude: profileDetailQuery?.data?.result?.longitude,
      latitude: profileDetailQuery?.data?.result?.latitude,
      trustFacilities: profileDetailQuery?.data?.result?.facilities ?? "",
      images: [],
      documents: profileDetailQuery?.data?.result?.documents ?? [],
    };
  }, [profileDetailQuery]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => navigate(`/edit-profile`)}
          />
          <div className="addProfile">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="addProfile">
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

      {!profileDetailQuery.isLoading ? (
        <div className=" mt-1">
          <ProfileForm
            editProfile
            handleSubmit={handleProfileLangUpdate}
            AddLanguage
            langSelectionValue={langSelection}
            setLoading={setLoading}
            loading={loading}
            editImage="edit"
            defaultImages={profileDetailQuery?.data?.result?.images}
            profileImageName={profileDetailQuery?.data?.result?.profileName}
            defaultDocuments={profileDetailQuery?.data?.result?.documents}
            initialValues={initialValues}
            validationSchema={schema}
            buttonLabel={"news_AddLangNews"}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
