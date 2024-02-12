import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createCattleInfo } from "../../../../api/cattle/cattleInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddCattleForm from "../../../../components/cattleInfo/addForm";

  const CattleAddWraper = styled.div`
    color: #583703;
    font: normal normal bold 20px/33px Noto Sans;
    .ImagesVideos {
      font: normal normal bold 15px/33px Noto Sans;
    }
    .addEvent {
      color: #583703;
      display: flex;
      align-items: center;
    }
  `;

export const cattleType = [
  {
    label: "Cow",
    value: "cow",
  },
  {
    label: "Bull",
    value: "bull",
  },
  {
    label: "Calf",
    value: "calf",
  },
  {
    label: "Other",
    value: "other",
  },
];

export const cattleSource = [
  {
    label: "Owner",
    value: "owner",
  },
  {
    label: "Gaurakshak",
    value: "gaurakshak",
  },
  {
    label: "Police",
    value: "police",
  },
  {
    label: "Other",
    value: "other",
  },
];

const AddCattle = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateCattleInfo = async (payload) => {
    return createCattleInfo(payload);
  };

  const schema = Yup.object().shape({
    tagId: Yup.string().required("cattle_tag_id_required"),
    type: Yup.mixed().required("cattle_type_required"),
    breed: Yup.string().required("cattle_breed_required"),
    age: Yup.string().required("cattle_age_required"),
    purchasePrice: Yup.string().required("cattle_purchase_price_required"),
    source: Yup.mixed().required("cattle_source_required"),
    ownerName: Yup.string().required("cattle_owner_name_required"),
    ownerMobile: Yup.string().required("expenses_mobile_required"),
    ownerId: Yup.string().required("cattle_owner_id_required"),
  });

  const initialValues = {
    tagId: "",
    motherId: "",
    type: "",
    breed: "",
    soldDate: new Date(),
    dob: new Date(),
    purchaseDate: new Date(),
    deathDate: new Date(),
    deliveryDate: new Date(),
    pregnantDate: new Date(),
    deathReason: "",
    purchasePrice: "",
    source: "",
    ownerName: "",
    ownerCountryName: "",
    ownerCountryCode: "",
    ownerMobile: "",
    ownerId: "",
    cattleImage: "",
    ownerImage: "",
    age: "",
    isDead: "NO",
    isPregnant: "NO",
    isSold: "NO",
    isMilking: "NO",
    purchaserName: "",
    purchaserCountryCode: "",
    purchaserDialCode: "",
    purchaserMobile: "",
    purchaserId: "",
    soldPrice: "",
    milkQuantity: "",
  };

  return (
    <CattleAddWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/info?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"cattle_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddCattleForm
          handleSubmit={handleCreateCattleInfo}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_add"
          cattleType={cattleType}
          cattleSource={cattleSource}
        />
      </div>
    </CattleAddWraper>
  );
};

export default AddCattle;
