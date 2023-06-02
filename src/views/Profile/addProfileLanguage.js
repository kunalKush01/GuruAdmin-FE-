import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelector } from "react-redux";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import he from "he";
import NoticeForm from "../../components/notices/noticeForm";
import { addLangNoticeDetail, getNoticeDetail } from "../../api/noticeApi";
import {
  addLangProfileDetail,
  getUpdatedTrustDetail,
} from "../../api/profileApi";
import ProfileForm from "../../components/Profile/profileForm";

const ProfileWaraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editNotice {
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

export default function AddLanguageProfile() {
  const history = useHistory();
  const { profileId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

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
  useEffect(() => {
    if (availableLangOptions.length != 0) {
      setLangSelection(availableLangOptions[0]?.name);
    }
  }, [availableLangOptions]);
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
      about: he.decode(profileDetailQuery?.data?.result?.about ?? ""),
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
    <ProfileWaraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/edit-profile`
              )
            }
          />
          <div className="editNotice">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editNotice">
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
            setLoading={setLoading}
            loading={loading}
            editImage="edit"
            defaultImages={profileDetailQuery?.data?.result?.images}
            profileImageName={profileDetailQuery?.data?.result?.profileName}
            defaultDocuments={profileDetailQuery?.data?.result?.documents}
            initialValues={initialValues}
            vailidationSchema={schema}
            buttonLabel={"news_AddLangNews"}
          />
        </div>
      ) : (
        ""
      )}
    </ProfileWaraper>
  );
}
