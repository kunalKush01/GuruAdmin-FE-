import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createSubscribedUser } from "../../api/subscribedUser.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
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

const handleCreateUser = async (payload) => {
  return createSubscribedUser(payload);
};
const schema = Yup.object().shape({
  // name: Yup.string().required("users_title_required"),
  mobile: Yup.string().required("users_mobile_required"),
  email: Yup.string()
    .email("email_invalid")
    .required("users_email_required")
    .trim(),
  name: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "user_only_letters"
    )
    .required("users_title_required")
    .trim(),
});

export default function AddSubscribedUser() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const redirectTo = searchParams.get("redirect");

  return (
    <NoticeWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() =>
              history.push(
                `/${redirectTo}/add?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}`
              )
            }
          />
          <div className="addNotice">
            <Trans i18nKey={"add_user"} />
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

      <div className="ms-3 mt-1">
        <SubscribedUserForm
          // loadOptions={masterloadOptionQuery?.data?.results}
          // placeholder={masterloadOptionQuery?.data?.results[0].name ?? "All"}
          // CategoryFormName={"MasterCategory"}
          handleSubmit={handleCreateUser}
          addDonationUser
          initialValues={{
            name: "",
            mobile: "",
            countryCode: "in",
            dialCode: "91",
            email: "",
          }}
          validationSchema={schema}
          buttonName={"add_user"}
        />
      </div>
    </NoticeWraper>
  );
}
