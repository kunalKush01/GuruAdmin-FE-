import { useQuery } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as yup from "yup";
import { getCollectionBoxDetail, updateCollectionBoxDetail } from "../../api/donationBoxCollectionApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationBoxForm from "../../components/DonationBox/donationBoxForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;
const schema = yup.object().shape({
  // CreatedBy: yup.string().required("news_tags_required"),
  Amount: yup.string().required("donation_box_amount_required"),
  Body: yup.string().required("donation_box_desc_required"),
  DateTime: yup.string(),
});

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

export default function EditDonationBox() {
  const history = useHistory();

  const { donationBoxId } = useParams();
  
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang= useSelector(state=>state.auth.selectLang)

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get('page')
  const currentFilter = searchParams.get('filter')

  const [langSelection, setLangSelection] = useState(ConverFirstLatterToCapital(selectedLang.name));

  const collectionBoxDetailQuery = useQuery(
    ["BoxCollectionDetail", donationBoxId, langSelection,selectedLang.id],
    async () =>
      await getCollectionBoxDetail({
        donationBoxId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  

  const handleUpdate = async (payload) => {
    return updateCollectionBoxDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };
    const initialValues = useMemo(()=>{
    return  {
       
        Id:collectionBoxDetailQuery?.data?.result?.id,
        CreatedBy: collectionBoxDetailQuery?.data?.result?.createdBy?.name,
        Body: he.decode(collectionBoxDetailQuery?.data?.result?.remarks??""),
        Amount: collectionBoxDetailQuery?.data?.result?.amount,
        DateTime: moment(collectionBoxDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
      
    };
  },[collectionBoxDetailQuery])

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/Hundi?page=${currentPage}&filter=${currentFilter}`)}
          />
          <div className="editNews">
            <Trans i18nKey={"DonationBox_EditCollectionBox"} />
          </div>
        </div>
      </div>
      <If condition={collectionBoxDetailQuery.isLoading || collectionBoxDetailQuery.isFetching} diableMemo >
        <Then>
          <Row>
            <SkeletonTheme
              baseColor="#FFF7E8"
              highlightColor="#fff"
              borderRadius={"10px"}
            >
              <Col xs={7} className="me-1">
                <Row className="my-1">
                  <Col xs={6}>
                    <Skeleton height={"36px"} />
                  </Col>
                  <Col xs={6}>
                    <Skeleton height={"36px"} />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Skeleton height={"150px"} />
                  </Col>
                </Row>
              </Col>
              <Col className="mt-1">
                <Skeleton height={"318px"} width={"270px"} />
              </Col>
            </SkeletonTheme>
          </Row>
        </Then>
        <Else>
          
          {!collectionBoxDetailQuery.isFetching&&
          <div className="ms-3 mt-1">  
            <DonationBoxForm
              buttonName={"save_changes"}
              vailidationSchema={schema}
              initialValues={initialValues}
              showTimeInput
              handleSubmit={handleUpdate}
            />
          </div>
          }
        </Else>
      </If>
    </NewsWarper>
  );
}
