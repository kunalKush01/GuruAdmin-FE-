import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as yup from "yup";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { getPunyarjakDetails, updatePunyarjak } from "../../api/punarjakApi";
import PunyarjakForm from "../../components/Punyarjak/punyarjakUserForm";
import he from 'he'
const PunyarjakWarapper = styled.div`
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
  description:yup.string().required("punyarjak_desc_required"),
  name: yup
    .string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "User name only contain alphabets ."
    )
    .required("users_title_required"),
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

export default function EditSubAdmin() {
  const history = useHistory();
  const { punyarjakId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(selectedLang.name);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const punyarjakDetailQuery = useQuery(
    ["punyarjakDetails", punyarjakId, langSelection],
    () => getPunyarjakDetails(punyarjakId)
  );

  const handlePunyarjakUpdate = async (payload) => {
    return updatePunyarjak({
      ...payload,
    });
  };

  const initialValues = useMemo(() => {
    return {
      id: punyarjakDetailQuery?.data?.result?.id,
      name: punyarjakDetailQuery?.data?.result?.name,
      description:he.decode(punyarjakDetailQuery?.data?.result?.description ?? ""),
      file: punyarjakDetailQuery?.data?.result?.profilePhoto,
    };
  }, [punyarjakDetailQuery]);

  return (
    <PunyarjakWarapper>
      <div className="d-flex mt-sm-0 mt-2 justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() => history.push(`/punyarjak?page=${currentPage}`)}
          />
          <div className="editNotice">
            <Trans i18nKey={"edit_punyarjak"} />
          </div>
        </div>
      </div>

      <If
        disableMemo
        condition={
          punyarjakDetailQuery.isLoading || punyarjakDetailQuery.isFetching
        }
      >
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
          {!!punyarjakDetailQuery?.data?.result && (
            <PunyarjakForm
              editProfile
              editTrue="edit"
              profileImageName={punyarjakDetailQuery?.data?.result?.profileName}
              buttonName={"edit_punyarjak"}
              initialValues={initialValues}
              vailidationSchema={schema}
              handleSubmit={handlePunyarjakUpdate}
            />
          )}
        </Else>
      </If>
    </PunyarjakWarapper>
  );
}
