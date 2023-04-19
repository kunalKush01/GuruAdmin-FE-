import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createPunyarjak } from "../../api/punarjakApi.js";
import { createSubscribedUser } from "../../api/subscribedUser.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import PunyarjakForm from "../../components/Punyarjak/punyarjakUserForm.js";
import SubscribedUserForm from "../../components/subscribedUser/subscribedUserForm.js";

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

const handleCreatePunyarjak = async (payload) => {
  return createPunyarjak(payload);
};
const schema = yup.object().shape({
  description:yup.string().required("punyarjak_desc_required"),
  name: yup
    .string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "User name only contain alphabets ."
    )
    .required("users_title_required"),
    file:yup.string().required("img_required"),
});

export default function AddPunyarjak() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  
  const initialValues = {
    name: "",
    description:"",
    file: "",
  };

  return (
    <NoticeWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() => history.push(`/punyarjak?page=${currentPage}`)}
          />
          <div className="addNotice">
            <Trans i18nKey={"add_punyarjak"} />
          </div>
        </div>
        {/* <div className="addNotice">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div> */}
      </div>

      <div className="ms-sm-3 mt-1 ms-1">
        <PunyarjakForm
          handleSubmit={handleCreatePunyarjak}
          initialValues={initialValues}
          vailidationSchema={schema}
          buttonName={"add_punyarjak"}
        />
      </div>
    </NoticeWraper>
  );
}
