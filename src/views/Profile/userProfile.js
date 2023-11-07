import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import he from "he";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { getUpdatedTrustDetail, updateProfile } from "../../api/profileApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import ProfileForm from "../../components/Profile/profileForm";
import { CustomDropDown } from "../../components/partials/customDropDown";
import { ConverFirstLatterToCapital } from "../../utility/formater";
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

const schema = Yup.object().shape({
  trustName: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("name_required")
    .trim(),
  trustType: Yup.mixed().required("trust_type_required"),
  // preference: Yup.mixed().required("trust_prefenses_required"),
  trustEmail: Yup.string()
    .email("email_invalid")
    .required("email_required")
    .trim(),
  trustNumber: Yup.string().required("trust_contact_number_required"),
  // facebookLink: Yup.string().required("trust_facebookLink_required").trim(),
  about: Yup.string().required("trust_about_required").trim(),
  name: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("name_required")
    .trim(),
  email: Yup.string().email("email_invalid").required("email_required").trim(),
  mobileNumber: Yup.string().required("number_required"),
  // state: Yup.string().required("events_state_required").trim(),
  // city: Yup.string().required("events_city_required").trim(),
  location: Yup.string().required("events_location_required").trim(),
  latitude: Yup.string().required("latitude_required"),
  longitude: Yup.string().required("longitude_required"),
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
    ["ProfileModule", langSelection, selectedLang.id],
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
      // preference:profileDetail?.data?.result?.preference ?? "",
      trustEmail: profileDetail?.data?.result?.trustEmail ?? "",
      trustNumber: profileDetail?.data?.result?.trustNumber ?? "",
      trustCountryCode: profileDetail?.data?.result?.trustCountryName ?? "",
      trustDialCode: profileDetail?.data?.result?.trustCountryCode ?? "",
      facebookLink: profileDetail?.data?.result?.facebookLink ?? "",
      address: profileDetail?.data?.result?.address ?? "",
      about: he?.decode(profileDetail?.data?.result?.about ?? ""),
      name: profileDetail?.data?.result?.name ?? "",
      email: profileDetail?.data?.result?.email ?? "",
      mobileNumber: profileDetail?.data?.result?.mobileNumber ?? "",
      countryCode: profileDetail?.data?.result?.countryName ?? "",
      dialCode: profileDetail?.data?.result?.countryCode ?? "",
      city: profileDetail?.data?.result?.city,
      state: profileDetail?.data?.result?.state,
      location: profileDetail?.data?.result?.location,
      longitude: profileDetail?.data?.result?.longitude,
      latitude: profileDetail?.data?.result?.latitude,
      trustFacilities: profileDetail?.data?.result?.facilities ?? "",
      images: [],
      documents: profileDetail?.data?.result?.documents ?? [],
    };
  }, [profileDetail]);

  const langList = useSelector((state) => state.auth.availableLang);

  const [userMobileNumberState, setUserMobileNumberState] = useState("");
  const [trustMobileNumberState, setTrustMobileNumberState] = useState("");
  useEffect(() => {
    if (
      profileDetail?.data?.result?.mobileNumber &&
      profileDetail?.data?.result?.trustNumber
    ) {
      setUserMobileNumberState(
        profileDetail?.data?.result?.countryCode +
          profileDetail?.data?.result?.mobileNumber
      );
      setTrustMobileNumberState(
        profileDetail?.data?.result?.trustCountryCode +
          profileDetail?.data?.result?.trustNumber
      );
    } else {
      setUserMobileNumberState("91" + "");
      setTrustMobileNumberState("91" + "");
    }
  }, [
    profileDetail?.data?.result?.mobileNumber,
    profileDetail?.data?.result?.trustNumber,
  ]);

  return (
    <ProfileWarper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Mandir Admin | Profile</title>
      </Helmet>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex justify-content-between align-items-center ">
          {/* <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/")}
          /> */}
          <div className="addProfile">
            <Trans i18nKey={"userProfile"} />
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="addProfile">
            <div className="d-none d-sm-block">
              <Trans i18nKey={"news_InputIn"} />
            </div>
            <CustomDropDown
              ItemListArray={profileDetail?.data?.result?.languages}
              className={"ms-1"}
              defaultDropDownName={ConverFirstLatterToCapital(
                langSelection ?? ""
              )}
              handleDropDownClick={(e) =>
                setLangSelection(ConverFirstLatterToCapital(e.target.name))
              }
            />
          </div>
          {langList?.length !==
            profileDetail?.data?.result?.languages?.length && (
            <Button
              color="primary"
              className="ms-1"
              onClick={() => {
                history.push(
                  `/edit-profile/add-language/${profileDetail?.data?.result?.id}`
                );
              }}
            >
              {" "}
              Add language{" "}
            </Button>
          )}
        </div>
      </div>
      <div>
        {!profileDetail?.isFetching && (
          <ProfileForm
            editProfile
            handleSubmit={handleUpdateProfile}
            setLoading={setLoading}
            loading={loading}
            editImage="edit"
            userMobileNumberState={userMobileNumberState}
            setUserMobileNumberState={setUserMobileNumberState}
            trustMobileNumberState={trustMobileNumberState}
            setTrustMobileNumberState={setTrustMobileNumberState}
            defaultImages={profileDetail?.data?.result?.images}
            profileImageName={profileDetail?.data?.result?.profileName}
            defaultDocuments={profileDetail?.data?.result?.documents}
            initialValues={initialValues}
            validationSchema={schema}
            buttonLabel={"update_profile"}
          />
        )}
      </div>
    </ProfileWarper>
  );
}
