import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createUser } from "../../../api/userApi.js";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import UserForm from "../../../components/users/userForm.js";

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
  return createUser(payload);
};
const schema = yup.object().shape({
  name: yup.string().required("notices_desc_required"),
  mobile: yup.string().required("notices_desc_required"),
  email: yup.string().required("notices_desc_required"),

});

export default function AddCategory() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  

  return (
    <NoticeWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/configuration/users")}
          />
          <div className="addNotice">
            <Trans i18nKey={"users_AddUser"} />
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

     
        <UserForm
          // loadOptions={masterloadOptionQuery?.data?.results}
          // placeholder={masterloadOptionQuery?.data?.results[0].name ?? "All"}
          // CategoryFormName={"MasterCategory"}
          handleSubmit={handleCreateUser}
          initialValues={{
            name: "",
            mobile: "",
            email: "",
          }}
          vailidationSchema={schema}
          buttonName={"users_AddUser"}
        />
      
    </NoticeWraper>
  );
}
