import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../../components/partials/customDropDown";
import { ConverFirstLatterToCapital } from "../../../utility/formater";

import {
  getAllMasterCategories,
  getSubCategoryDetail,
  updateCategoryDetail,
} from "../../../api/categoryApi";
import CategoryForm from "../../../components/categories/categoryForm";

const CategoryEditWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  // .ImagesVideos {
  //   font: normal normal bold 15px/33px Noto Sans;
  // }
  .editCategory {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = Yup.object().shape({
  MasterCategory: Yup.mixed().required("categories_category_required"),
  SubCategory: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("categories_sub_category_required")
    .trim(),
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

export default function EditCategory() {
  const history = useHistory();
  const { subCategoryId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );
  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );
  const subCategoryDetailQuery = useQuery(
    ["SubCategoryDetail", subCategoryId, langSelection],
    async () =>
      getSubCategoryDetail({
        categoryId: subCategoryId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  const handleCategoryUpdate = async (payload) => {
    return updateCategoryDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
      categoryId: subCategoryId,
    });
  };

  return (
    <CategoryEditWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/configuration/categories?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="editCategory">
            <Trans i18nKey={"categories_EditCategory"} />
          </div>
        </div>
        <div className="editCategory">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={
              subCategoryDetailQuery?.data?.result?.languages ?? []
            }
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

      <If
        disableMemo
        condition={
          masterloadOptionQuery.isLoading || masterloadOptionQuery.isFetching
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
          {!masterloadOptionQuery?.isLoading &&
            !subCategoryDetailQuery.isLoading && (
              <div className="ms-sm-3 mt-1">
                <CategoryForm
                  editDisableCategory
                  loadOptions={masterloadOptionQuery?.data?.results}
                  CategoryFormName={"MasterCategory"}
                  handleSubmit={handleCategoryUpdate}
                  initialValues={{
                    Id: subCategoryDetailQuery?.data?.id,
                    MasterCategory:
                      subCategoryDetailQuery?.data?.result?.masterCategory,
                    SubCategory: subCategoryDetailQuery.data.result.name,
                  }}
                  buttonName={"save_changes"}
                  validationSchema={schema}
                />
              </div>
            )}
        </Else>
      </If>
    </CategoryEditWrapper>
  );
}
