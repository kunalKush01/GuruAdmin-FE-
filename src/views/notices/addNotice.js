import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createNotice } from "../../api/noticeApi.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import NoticeForm from "../../components/notices/noticeForm";

const NoticeWraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNotice {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateNotice = async (payload) => {
  return createNotice(payload);
};
const schema = Yup.object().shape({
  Title: Yup
    .string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("notices_title_required")
    .trim(),
  Body: Yup.string().required("notices_desc_required").trim(),
  DateTime: Yup.string(),
  SelectedNotice: Yup.mixed(),
  // tagsInit:Yup.array().max(15 ,"tags_limit"),
});

const initialValues = {
  SelectedNotice: null,
  Id: "",
  Title: "",
  image: "",
  tagsInit: [],
  Body: "",
  DateTime: new Date(),
};

export default function AddNotice() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  return (
    <NoticeWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/notices?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addNotice">
            <Trans i18nKey={"notices_AddNotice"} />
          </div>
        </div>
        {/* <div className="addNotice">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div> */}
      </div>
      <div className="ms-sm-3 mt-1">
        <NoticeForm
          handleSubmit={handleCreateNotice}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName="notices_AddNotice"
        />
      </div>
    </NoticeWraper>
  );
}
