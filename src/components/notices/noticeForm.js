import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { flatMap } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
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
import "../../assets/scss/common.scss";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { DatePicker, Image } from "antd";
import moment from "moment";
import UploadImage from "../partials/uploadImage";
import { uploadFile } from "../../api/sharedStorageApi";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import { fetchImage } from "../partials/downloadUploadImage";
const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);
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
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
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
            image: uploadedFileUrl || "",
          });
          setDeletedTags([]);
        }}
        validationSchema={validationSchema}
      >
        {(formik) => {
          useEffect(() => {
            if (formik.values.image) {
              const loadImage = async () => {
                const url = await fetchImage(formik.values.image);
                if (url) {
                  setImageUrl(url);
                }
              };
              loadImage();
            }
          }, [formik.values.image]);
          return (
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
                <Row>
                  <Col xs={12} lg={9} md={6}>
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
                  {!AddLanguage && (
                    <Col xs={12} lg={3} md={6}>
                      <label>{t("donation_select_date")}</label>
                      <CustomDatePickerComponent
                        placeholder={t("donation_select_date")}
                        style={{ width: "100%" }}
                        name="DateTime"
                        format="DD MMM YYYY"
                        onChange={(date) => {
                          if (date) {
                            const utcDate = date
                              .startOf("day")
                              .utc()
                              .toISOString();
                            formik.setFieldValue("DateTime", utcDate);
                          } else {
                            formik.setFieldValue("DateTime", "");
                          }
                        }}
                        value={
                          formik.values["DateTime"]
                            ? moment.utc(formik.values["DateTime"])
                            : null
                        }
                        disabledDate={(current) =>
                          current < moment().startOf("day")
                        }
                      />
                    </Col>
                  )}
                  <Col xs={12} className="mt-lg-1">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="Body"
                    />
                  </Col>
                  {!AddLanguage && (
                    <Col xs={12} lg={4} md={6}>
                      <div className="ImagesVideos">
                        <Trans i18nKey={"add_image"} />{" "}
                        <span style={{ fontSize: "13px", color: "gray" }}>
                        <Trans i18nKey={"image_size_suggestion"} />
                      </span>
                      </div>
                      <UploadImage
                        required
                        uploadFileFunction={uploadFile}
                        setUploadedFileUrl={setUploadedFileUrl}
                        name="NoticeImage"
                        listType="picture"
                        maxCount={1}
                        buttonLabel={t("upload_image")}
                        initialUploadUrl={imageUrl}
                        icon={
                          <img
                            src={uploadIcon}
                            alt="Upload Icon"
                            style={{ width: 16, height: 16 }}
                          />
                        }
                      />
                    </Col>
                  )}
                </Row>
              </Row>
              <div className="btn-Published ">
                {loading ? (
                  <Button
                    color="primary"
                    className="add-trust-btn"
                    disabled
                  >
                    <Spinner size="md" />
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="addAction-btn "
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
          );
        }}
      </Formik>
    </div>
  );
}
