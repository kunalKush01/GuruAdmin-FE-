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
  name: yup.string().required("name_required"),
  EmailId: yup.string().email("email_invalid").required("email_required"),
  Contact: yup
    .number()
    .typeError("number_type")
    .positive("cant_start_minus")
    .integer("number_in_point")
    .min(8)
    .required("number_required"),
  // documents: yup.string().required("doc_required"),
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

  const initialValues = useMemo(() => {
    const documentName = profileDetail?.data?.result?.documents?.map(
      (item) => item?.name
    );

    return {
      // Id: trustDetail?.id ?? "",
      name: profileDetail?.data?.result?.name ?? "",
      profileImage: profileDetail?.data?.result?.profilePhoto,
      trustType: profileDetail?.data?.result?.trustType ?? "",
      EmailId: profileDetail?.data?.result?.email ?? "",
      Contact: profileDetail?.data?.result?.mobileNumber ?? "",
      about: profileDetail?.data?.result?.about ?? "",
      city: { districts: profileDetail?.data?.result?.city },
      state: { state: profileDetail?.data?.result?.state },
      location: {
        label: profileDetail?.data?.result?.location,
        value: { place_id: profileDetail?.data?.result?.place_id },
      },
      longitude: profileDetail?.data?.result?.longitude,
      latitude: profileDetail?.data?.result?.latitude,
      trustFacilities: profileDetail?.data?.result?.facilities ?? "",
      images: [],
      documents: documentName ?? [],
    };
  }, [profileDetail]);

  return (
    <ProfileWarper>
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
      <ProfileForm
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
