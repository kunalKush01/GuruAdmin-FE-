import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createNews } from "../../api/newsApi";
import { getUpdatedTrustDetail, updateProfile } from "../../api/profileApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../components/partials/customDropDown";
import ProfileForm from "../../components/Profile/profileForm";
import { addFacility, handleProfileUpdate } from "../../redux/authSlice";
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
  const handleUpdateProfile = async (payload) => {
    const res = await updateProfile({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
    if (res.error === true) {
      setLoading(false);
    } else {
      setLoading(false);
    }
    const profileData = {
      profileImage:res?.result?.profilePhoto,
      profilePhotoPreview:"",
      name:res?.result?.name,
      trustType:res?.result?.typeId,
      EmailId:res?.result?.email,
      Contact:res?.result?.mobileNumber,
      about:res?.result?.about,
      state:res?.result?.state,
      city:res?.result?.city,
      location:res?.result?.location,
      place_id:res?.result?.place_id,
      latitude:res?.result?.latitude,
      longitude:res?.result?.latitude,
      images:res?.result?.images,
      documents:res?.result?.documents
    }
    dispatch(handleProfileUpdate(profileData));
    dispatch(addFacility(res?.result?.facilities));
    

    return res;
  };

  const initialValues = {
    Id: trustDetail?.id ?? "",
    name: trustDetail?.name ?? "",
    profileImage: trustDetail?.profilePhoto,
    profilePhotoPreview: trustDetail?.profilePhotoPreview?.preview,
    trustType: trustDetail?.trustType ?? "",
    EmailId: userDetail?.email ?? "",
    Contact: userDetail?.mobileNumber ?? "",
    about: trustDetail?.about ?? "",
    city: { districts: trustDetail?.city },
    state: { state: trustDetail?.state },
    location: {
      label: trustDetail?.location,
      value: { place_id: trustDetail?.value },
    },
    longitude: trustDetail?.longitude,
    latitude: trustDetail?.latitude,
    trustFacilities: trustDetail?.trustFacilities,
    images: [],
    Temple: trustDetail?.name ?? "",
    documents: [],
  };

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
        editImage
        defaultImages={trustDetail?.images}
        initialValues={initialValues}
        vailidationSchema={schema}
        buttonLabel={"update_profile"}
      />
    </ProfileWarper>
  );
}
