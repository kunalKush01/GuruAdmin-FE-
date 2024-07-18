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
import * as Yup from "yup";
import { getPunyarjakDetails, updatePunyarjak } from "../../api/punarjakApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import PunyarjakForm from "../../components/Punyarjak/punyarjakUserForm";
import { CustomDropDown } from "../../components/partials/customDropDown";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import '../../styles/viewCommon.scss';
;
const schema = Yup.object().shape({
  description: Yup.string().required("punyarjak_desc_required").trim(),
  title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("news_title_required")
    .trim(),
  image: Yup.string().required("img_required"),
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
    () =>
      getPunyarjakDetails({
        punyarjakId: punyarjakId,
        languageId: getLangId(langArray, langSelection, selectedLang.id),
      })
  );

  const handlePunyarjakUpdate = async (payload) => {
    return updatePunyarjak({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const initialValues = useMemo(() => {
    return {
      id: punyarjakDetailQuery?.data?.result?.id,
      title: punyarjakDetailQuery?.data?.result?.title,
      description: he?.decode(
        punyarjakDetailQuery?.data?.result?.description ?? ""
      ),
      DateTime: moment(punyarjakDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
      image: punyarjakDetailQuery?.data?.result?.image,
    };
  }, [punyarjakDetailQuery]);

  return (
    <div className="punyarjakwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() => history.push(`/punyarjak?page=${currentPage}`)}
          />
          <div className="editPunyarjak">
            <Trans i18nKey={"edit_punyarjak"} />
          </div>
        </div>
        <div className="editPunyarjak">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={punyarjakDetailQuery?.data?.result?.languages}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(
              langSelection ?? ""
            )}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target?.name))
            }
            // disabled
          />
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
            <div className="ms-sm-3 mt-1 ms-1">
              <PunyarjakForm
                editThumbnail
                editTrue="edit"
                thumbnailImageName={
                  punyarjakDetailQuery?.data?.result?.imageName
                }
                buttonName={"edit_punyarjak"}
                initialValues={initialValues}
                validationSchema={schema}
                handleSubmit={handlePunyarjakUpdate}
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
}
