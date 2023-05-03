import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { getUpdatedTrustDetail, updateProfile } from "../../api/profileApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../components/partials/customDropDown";
import ProfileForm from "../../components/Profile/profileForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import he from "he";
import { Helmet } from "react-helmet";
const ProfileWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addProfile {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = yup.object().shape({
  trustName: yup.string().required("name_required"),
  trustType: yup.mixed().required("trust_type_required"),
  trustEmail: yup.string().email("email_invalid").required("email_required"),
  trustNumber: yup
    .string()
    .min(10, "Mobile Number must be 10 digits.")
    .required("number_required"),
  about: yup.string().required("trust_about_required"),
  name: yup.string().required("name_required"),
  email: yup.string().email("email_invalid").required("email_required"),
  mobileNumber: yup
    .string()
    .min(10, "Mobile Number must be 10 digits.")
    .required("number_required"),
  state: yup.mixed().required("events_state_required"),
  city: yup.mixed().required("events_city_required"),
  location: yup.mixed().required("events_location_required"),
  latitude: yup.string().required("latitude_required"),
  longitude: yup.string().required("longitude_required"),
});

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

  const dispatch = useDispatch();

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );
  const [loading, setLoading] = useState(false);

  const profileDetail = useQuery(
    ["", langSelection, selectedLang.id],
    async () =>
      getUpdatedTrustDetail({
        languageId: getLangId(langArray, langSelection),
      })
  );
  const handleUpdateProfile = async (payload) => {
    return updateProfile({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };
// console.log("files Api -----> ",profileDetail?.data?.result?.documents);
  const initialValues = useMemo(() => {
    const documentName = profileDetail?.data?.result?.documents?.map(
      (item) => item?.name
    );
    return {
      // Id: trustDetail?.id ?? "",
      trustName: profileDetail?.data?.result?.trustName ?? "",
      profileImage: profileDetail?.data?.result?.profilePhoto,
      trustType: profileDetail?.data?.result?.trustType ?? "",
      trustEmail: profileDetail?.data?.result?.trustEmail ?? "",
      trustNumber: profileDetail?.data?.result?.trustNumber ?? "",
      about: he.decode(profileDetail?.data?.result?.about ?? ""),
      name: profileDetail?.data?.result?.name ?? "",
      email: profileDetail?.data?.result?.email ?? "",
      mobileNumber: profileDetail?.data?.result?.mobileNumber ?? "",
      city: profileDetail?.data?.result?.state
        ? { districts: profileDetail?.data?.result?.city }
        : null,
      state: profileDetail?.data?.result?.state
        ? { state: profileDetail?.data?.result?.state }
        : null,
      location: profileDetail?.data?.result?.location
        ? {
            label: profileDetail?.data?.result?.location,
            value: { place_id: profileDetail?.data?.result?.place_id },
          }
        : null,
      longitude: profileDetail?.data?.result?.longitude,
      latitude: profileDetail?.data?.result?.latitude,
      trustFacilities: profileDetail?.data?.result?.facilities ?? "",
      images: [],
      documents: profileDetail?.data?.result?.documents ?? [],
    };
  }, [profileDetail]);

  return (
    <ProfileWarper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Mandir Admin | Profile</title>
      </Helmet>
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
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
      </div>
      <ProfileForm
        editProfile
        handleSubmit={handleUpdateProfile}
        setLoading={setLoading}
        loading={loading}
        editImage="edit"
        defaultImages={profileDetail?.data?.result?.images}
        profileImageName={profileDetail?.data?.result?.profileName}
        defaultDocuments={profileDetail?.data?.result?.documents}
        initialValues={initialValues}
        vailidationSchema={schema}
        buttonLabel={"update_profile"}
      />
    </ProfileWarper>
  );
}
