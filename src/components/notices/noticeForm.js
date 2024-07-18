import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { flatMap } from "lodash";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { getGlobalNotice } from "../../api/eventApi";
import { createNews } from "../../api/newsApi";
import { getAllTags } from "../../api/tagApi";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import AsyncSelectField from "../partials/asyncSelectField";
import { CustomDropDown } from "../partials/customDropDown";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import ImageUpload from "../partials/imageUpload";
import RichTextField from "../partials/richTextEditorField";
import '../../../src/styles/common.scss';

const FormWrapper = styled.div``;
;

export default function NoticeForm({
  plusIconDisable = false,
  buttonName = "",
  editImage,
  defaultImages,
  editThumbnail,
  AddLanguage,
  thumbnailImageName,
  handleSubmit,
  validationSchema,
  initialValues,
  langSelectionValue,
  showTimeInput,
  selectEventDisabled,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const noticeQueryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const noticeMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        noticeQueryClient.invalidateQueries(["Notices"]);
        noticeQueryClient.invalidateQueries(["NoticeDetail"]);
        setLoading(false);
        history.push("/notices");
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
    formik.setFieldValue("tagsInit", [...formik?.values?.tagsInit, tag]);
  };

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const [deletedImages, setDeletedImages] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [imageSpinner, setImageSpinner] = useState(false);
  const [imageName, setImageName] = useState(thumbnailImageName);
  const langToast = {
    toastId: "langError",
  };
  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          if (langSelectionValue === "Select") {
            toast.error("Please select a language", { ...langToast });
            return;
          }
          setShowPrompt(false);
          setLoading(true);
          noticeMutation.mutate({
            noticeId: e.Id,
            baseId: e?.SelectedNotice?.id ?? null,
            title: e.Title,
            tags: e?.tagsInit?.map((tag) => tag.text),
            deletedTags,
            body: e.Body,
            publishDate: e.DateTime,
            image: editThumbnail ? imageName : e?.image,
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
                      name="Title"
                      placeholder={t("placeHolder_title")}
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      required
                      autoFocus
                    />
                  </Col>
                  {/* <Col xs={12} md={6}>
                    <label>Tags</label>
                    <ReactTags
                      tags={formik?.values?.tagsInit}
                      suggestions={suggestions}
                      delimiters={delimiters}
                      handleDelete={(index) => handleDelete(formik, index)}
                      handleAddition={(tag) => handleAddition(formik, tag)}
                      inputFieldPosition="top"
                      allowDragDrop={false}
                      autocomplete
                      editable={false}
                      autofocus={false}
                    />
                  </Col> */}
                </Row>
                <Row>
                  <Col xs={12} className="mt-0 mt-lg-1">
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
                      <Trans i18nKey={"add_image"} />{" "}
                      <span style={{ fontSize: "13px", color: "gray" }}>
                        <Trans i18nKey={"image_size_suggestion"} />
                      </span>
                    </div>
                    <ImageUpload
                      bg_plus={thumbnailImage}
                      imageSpinner={imageSpinner}
                      imageName="NoticeImage"
                      acceptFile="image/*"
                      svgNotSupported
                      setImageSpinner={setImageSpinner}
                      editTrue="edit"
                      disabledAddLanguage={AddLanguage}
                      editedFileNameInitialValue={
                        formik?.values?.image ? formik?.values?.image : null
                      }
                      randomNumber={randomNumber}
                      fileName={(file, type) => {
                        formik.setFieldValue("image", `${file}`);
                        formik.setFieldValue("type", type);
                        setImageName(`${file}`);
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("image", "");
                        setImageName("");
                      }}
                    />
                  </Row>
                )}
              </Col>
              {!AddLanguage && (
                <Col>
                  <FormikCustomDatePicker
                    label={t("donation_select_date")}
                    name="DateTime"
                    pastDateNotAllowed
                    // showTimeInput={showTimeInput}
                  />
                </Col>
              )}
            </Row>
            <div className="btn-Published ">
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
                <Button
                  color="primary"
                  className="addNotice-btn "
                  type="submit"
                  disabled={imageSpinner}
                >
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
