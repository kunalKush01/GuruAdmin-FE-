import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row, Spinner } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { useSelector } from "react-redux";
import { WithContext as ReactTags } from "react-tag-input";
import { getAllTags } from "../../api/tagApi";
import ImageUpload from "../partials/imageUpload";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import { Prompt } from "react-router-dom";
import { add } from "lodash";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import Swal from "sweetalert2";

const FormWaraper = styled.div`
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/5px noto sans;
  }

  label {
    /* margin-bottom: 0px; */
    font: normal normal bold 15px/33px Noto Sans;
  }

  /* input tags  css start */
  .ReactTags__tagInput {
    color: #583703 !important;
    height: 36px;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
  }
  .ReactTags__tagInput input.ReactTags__tagInputField {
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
    outline: none;
    width: 100%;
    height: inherit;
    padding-left: 0.5rem;
    ::placeholder {
      color: #fff7e8;
    }
  }
  .ReactTags__tagInput input.ReactTags__tagInputField::placeholder {
  color: #583703 !important;
  font: normal normal bold 13px/20px Noto Sans;
  opacity: 60%;
}
  /* added tags  */
  .ReactTags__selected {
    width: 100%;
    display: flex;
    overflow-x: scroll !important;
    ::-webkit-scrollbar {
      height: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #c9c6c5 !important;
      border-radius: 25px;
      width: 10px !important;
    }
  }
  .ReactTags__tag {
    margin-bottom: 0.5rem;
  }

  /* Styles for suggestions */
  .ReactTags__suggestions {
    position: absolute;
  }
  .ReactTags__suggestions ul {
    list-style-type: none;
    box-shadow: 0.05em 0.01em 0.5em rgba(0, 0, 0, 0.2);
    background-color: #fff7e8 !important;
    width: 200px;
  }
  .ReactTags__suggestions li {
    border-bottom: 1px solid #ddd;
    padding: 5px 10px;
    margin: 0;
  }
  .ReactTags__suggestions li mark {
    text-decoration: underline;
    background: none;
    font-weight: 600;
  }
  /* .ReactTags__suggestions ul li.ReactTags__activeSuggestion {
  background: #b7cfe0;
  cursor: pointer;
} */
  .ReactTags__selected span.ReactTags__tag {
    padding: 4px 10px;
    font: normal normal bold 13px/20px Noto Sans;
    border-radius: 10px;
    border: 2px solid #583703;
    display: flex;
    margin-left: 3px;
    align-items: center;
    margin-top: 0.5rem;
  }
  .ReactTags__remove {
    font-size: 20px;
    font-weight: 900;
    border: none;
    vertical-align: middle;
    line-height: 0px;
    cursor: pointer;
  }
  /* input tags  css start */
  //  media query
  @media only screen and (max-width: 768px) and (min-width: 320px) {
    .thumbnail_image {
      width: 100px;
      height: 100px;
    }
  }
`;

export default function NewsForm({
  plusIconDisable = false,
  handleSubmit,
  editImage,
  defaultImages,
  AddLanguage,
  vailidationSchema,
  initialValues,
  trustPreference,

  showTimeInput,
  buttonName,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const newsQuerClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const newsMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        newsQuerClient.invalidateQueries(["News"]);
        newsQuerClient.invalidateQueries(["NewsDetail"]);
        setLoading(false);
        history.push("/news");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });

  // tags
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(selectedLang.name);
  const tagsQuery = useQuery(
    ["tags", selectedLang.id],
    () =>
      getAllTags({
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );

  // tags
  const tags = useMemo(() => tagsQuery?.data?.results ?? [], [tagsQuery]);
  const suggestions = tags.map((item) => {
    return {
      id: item?.tag,
      text: item?.tag,
    };
  });
  const [deletedTags, setDeletedTags] = useState([]);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDelete = (formik, i) => {
    const resetValues = formik.values.tagsInit.filter(
      (_, index) => index !== i
    );

    const fgg = formik.values.tagsInit.filter((_, index) => index === i);

    if (fgg[0]?._id) {
      setDeletedTags((prev) => [...prev, fgg[0]?._id]);
    }

    formik.setFieldValue("tagsInit", resetValues);
  };

  const handleAddition = (formik, tag) => {
    formik.setFieldValue("tagsInit", [...formik.values.tagsInit, tag]);
  };

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const [deletedImages, setDeletedImages] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [imageSpinner, setImageSpinner] = useState(false);

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          newsMutation.mutate({
            newsId: e.Id,
            preferenceIds: e?.preference?.map((pantId) => pantId?._id),
            title: e.Title,
            tags: e?.tagsInit?.map((tag) => tag.text),
            deletedTags,
            body: e.Body,
            publishDate: e?.DateTime,
            publishedBy: e.PublishedBy,
            images: e?.images,
            removedImages: deletedImages,
          });
          setDeletedTags([]);
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            {showPrompt && (
              <Prompt
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )}
            <Row className="paddingForm">
              <Col xs={12} md={7}>
                <Row>
                  <Col xs={12} md={6}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      placeholder={t("placeHolder_title")}
                      name="Title"
                      required
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      autoFocus
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <label>Tags</label>
                    <ReactTags
                      tags={formik.values.tagsInit}
                      placeholder={t("placeHolder_tags")}
                      suggestions={suggestions}
                      handleInputChange={(e) => {
                        if (e?.length > 20) {
                          Swal.fire({
                            icon: "info",
                            text: `${t("tagsChar_limit")}`,
                            showConfirmButton: false,
                          });
                          return;
                        }
                      }}
                      delimiters={delimiters}
                      handleDelete={(index) => handleDelete(formik, index)}
                      handleAddition={(tag) => handleAddition(formik, tag)}
                      inputFieldPosition="top"
                      allowDragDrop={false}
                      autocomplete
                      editable={false}
                      autofocus={false}
                    />
                    {formik.errors.tagsInit && (
                      <div
                        style={{
                          height: "20px",
                          font: "normal normal bold 11px/33px Noto Sans",
                        }}
                      >
                        {formik.errors.tagsInit && (
                          <div className="text-danger">
                            <Trans i18nKey={formik.errors.tagsInit} />
                          </div>
                        )}
                      </div>
                    )}
                  </Col>
                  {!AddLanguage && (
                    <Col xs={12} md={6} className="mt-lg-1">
                      <FormikCustomReactSelect
                        labelName={t("trust_prefenses")}
                        multiple
                        name="preference"
                        onChange={(e) => {
                          e?.map((item) => item.name);
                          console.log("e pre", e);
                          formik.setFieldValue("preference", e);
                        }}
                        labelKey={"name"}
                        valueKey="_id"
                        loadOptions={trustPreference?.map((item) => {
                          return {
                            ...item,
                            name: ConverFirstLatterToCapital(item?.name),
                          };
                        })}
                        defaultValue={formik?.values?.preference}
                        width={"100"}
                      />
                    </Col>
                  )}
                </Row>
                <Row>
                  <Col xs={12} className="mt-lg-1">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="Body"
                    />
                  </Col>
                </Row>
                {!AddLanguage && (
                  <Row>
                    <div className="ImagesVideos">
                      <Trans i18nKey={"news_label_ImageVedio"} />
                    </div>
                    <div>
                      <ImageUpload
                        multiple
                        type={editImage}
                        imageSpinner={imageSpinner}
                        acceptFile="image/*"
                        svgNotSupported
                        setImageSpinner={setImageSpinner}
                        bg_plus={thumbnailImage}
                        disabledAddLanguage={AddLanguage}
                        setDeletedImages={setDeletedImages}
                        editedFileNameInitialValue={
                          formik?.values?.images ? formik?.values?.images : null
                        }
                        defaultImages={defaultImages}
                        randomNumber={randomNumber}
                        fileName={(file, type) => {
                          formik.setFieldValue("images", [
                            ...formik.values.images,
                            `${randomNumber}_${file}`,
                          ]);
                          formik.setFieldValue("type", type);
                        }}
                        removeFile={(fileName) => {
                          const newFiles = [...formik?.values?.images];
                          // newFiles.splice(index, 1);
                          const updatedFiles = newFiles.filter(
                            (img) => !img.includes(fileName)
                          );
                          formik.setFieldValue("images", updatedFiles);
                        }}
                      />
                    </div>
                  </Row>
                )}
              </Col>
              <Col>
                <Row>
                  {!AddLanguage && (
                    <Col xs={12}>
                      <FormikCustomDatePicker
                        label={t("donation_select_date")}
                        name="DateTime"
                        pastDateNotAllowed
                        showTimeInput={showTimeInput}
                      />
                    </Col>
                  )}
                  <Row>
                    <Col xs={7}>
                      <CustomTextField
                        label={t("news_label_Published")}
                        name="PublishedBy"
                        disabled
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published mb-2">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "5px 40px",
                    opacity: "100%",
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button color="primary" type="submit" disabled={imageSpinner}>
                  {plusIconDisable && (
                    <span>
                      <Plus className="me-1" size={15} strokeWidth={4} />
                    </span>
                  )}
                  <span>
                    <Trans i18nKey={`${buttonName}`} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </FormWaraper>
  );
}
