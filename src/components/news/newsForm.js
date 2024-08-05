import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { add } from "lodash";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { createNews } from "../../api/newsApi";
import { getAllTags } from "../../api/tagApi";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { CustomDropDown } from "../partials/customDropDown";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";
import RichTextField from "../partials/richTextEditorField";
import "../../assets/scss/common.scss";

export default function NewsForm({
  plusIconDisable = false,
  handleSubmit,
  editImage,
  defaultImages,
  AddLanguage,
  validationSchema,
  initialValues,
  trustPreference,
  langSelectionValue,
  showTimeInput,
  buttonName,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const newsQueryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const newsMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        newsQueryClient.invalidateQueries(["News"]);
        newsQueryClient.invalidateQueries(["NewsDetail"]);
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

  const [tagCharInput, setTagCharInput] = useState("");
  const langToast = {
    toastId: "langError",
  };
  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          if (langSelectionValue === "Select") {
            toast.error("Please select a language", { ...langToast });
            return;
          }
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
        validationSchema={validationSchema}
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
                        (e.target.value = e.target.value.slice(0, 256))
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
                      allowAdditionFromPaste={false}
                      inputValue={tagCharInput}
                      handleInputChange={(e) => {
                        setTagCharInput(e.slice(0, 20));
                      }}
                      delimiters={delimiters}
                      handleDelete={(index) => handleDelete(formik, index)}
                      handleAddition={(tag) => {
                        handleAddition(formik, tag);
                        setTagCharInput("");
                      }}
                      inputFieldPosition="top"
                      allowDragDrop={false}
                      autocomplete
                      editable={false}
                      autofocus={false}
                    />
                    {formik.errors.tagsInit && (
                      <div
                      // style={{
                      //   height: "20px",
                      //   font: "normal normal bold 11px/33px Noto Sans",
                      // }}
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
                    <Col
                      xs={12}
                      md={6}
                      className=""
                      style={{ paddingTop: "8px" }}
                    >
                      <FormikCustomReactSelect
                        labelName={t("trust_prefenses")}
                        multiple
                        name="preference"
                        onChange={(e) => {
                          e?.map((item) => item.name);
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
                      <Trans i18nKey={"news_label_ImageVedio"} />{" "}
                      <span style={{ fontSize: "13px", color: "gray" }}>
                        <Trans i18nKey={"image_size_suggestion"} />
                      </span>
                    </div>
                    <div>
                      <ImageUpload
                        multiple
                        type={editImage}
                        imageSpinner={imageSpinner}
                        imageName="NewsImage"
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
                            `${file}`,
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
                        // showTimeInput={showTimeInput}
                      />
                    </Col>
                  )}
                  <Row>
                    <Col xs={7} className="opacity-75">
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
            <div className="btn-Published mb-0">
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
    </div>
  );
}
