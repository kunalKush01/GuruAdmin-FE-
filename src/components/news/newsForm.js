import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import { getAllTags } from "../../api/tagApi";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
//import ImageUpload from "../partials/imageUpload2";
import { DatePicker, Select } from "antd";
import moment from "moment";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { uploadFile } from "../../api/sharedStorageApi";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import "../../assets/scss/common.scss";
import { fetchImage } from "../partials/downloadUploadImage";
import RichTextField from "../partials/richTextEditorField";
import UploadImage from "../partials/uploadImage";
const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);
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
    const tagToDelete = formik.values.tagsInit[i];

    // Find the tag object from the tags array to get its ID
    const tagObj = tags.find((tag) => tag.tag === tagToDelete);

    // const fgg = formik.values.tagsInit.filter((_, index) => index === i);

    if (tagObj) {
      setDeletedTags((prev) => [...prev, tagObj._id]);
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
  const [uploadedFileUrl, setUploadedFileUrl] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  return (
    <div
      className="formwrapper FormikWrapper"
      style={{ position: "absolute", zIndex: "-10000" }}
    >
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
            tags: e?.tagsInit,
            deletedTags,
            body: e.Body,
            publishDate: e?.DateTime,
            publishedBy: e.PublishedBy,
            images: uploadedFileUrl || "",
            removedImages: deletedImages,
          });
          setDeletedTags([]);
        }}
        validationSchema={validationSchema}
      >
        {(formik) => {
          useEffect(() => {
            if (formik.values.images && formik.values.images.length > 0) {
              const loadImages = async () => {
                const urls = await Promise.all(
                  formik.values.images.map(async (image) => {
                    const url = await fetchImage(image.name);
                    return url;
                  })
                );

                setImageUrl(urls);
              };

              loadImages();
            }
          }, [formik.values.images]);

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
                  <Col xs={12} lg={4} md={6}>
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
                  <Col xs={12} lg={4} md={6}>
                    <div className="d-flex flex-column" id="tagComponent">
                      <label>Tags<span className="text-danger">*</span></label>
                      <Select
                        mode="tags"
                        value={formik.values.tagsInit}
                        placeholder={t("placeHolder_tags")}
                        onSearch={(value) => {
                          if (value.length <= 20) {
                            setTagCharInput(value);
                          }
                        }}
                        onChange={(selectedTags) => {
                          const currentTags = formik.values.tagsInit;
                          const newTags = selectedTags.filter(
                            (tag) => !currentTags.includes(tag)
                          );
                          const removedTags = currentTags.filter(
                            (tag) => !selectedTags.includes(tag)
                          );

                          newTags.forEach((tag) => {
                            handleAddition(formik, tag);
                          });

                          removedTags.forEach((tag) => {
                            const index = currentTags.indexOf(tag);
                            if (index > -1) {
                              handleDelete(formik, index);
                            }
                          });

                          setTagCharInput("");
                        }}
                        options={tags.map((item) => ({
                          value: item?.tag,
                          label: item?.tag,
                        }))}
                      />
                      {formik.errors.tagsInit && (
                        <div>
                          {formik.errors.tagsInit && (
                            <div className="text-danger">
                              <Trans i18nKey={formik.errors.tagsInit} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Col>
                  {!AddLanguage && (
                    <Col xs={12} lg={4} md={6} className="">
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
                <Row>
                  {!AddLanguage && (
                    <Col xs={12} lg={6} md={6}>
                      <div className="ImagesVideos">
                        <Trans i18nKey={"news_label_ImageVedio"} />{" "}
                        <span style={{ fontSize: "13px", color: "gray" }}>
                          <Trans i18nKey={"image_size_suggestion"} />
                        </span>
                      </div>
                      <div>
                        <UploadImage
                          required
                          uploadFileFunction={uploadFile}
                          setUploadedFileUrl={setUploadedFileUrl}
                          name="NewsImage"
                          listType="picture"
                          buttonLabel={t("upload_image")}
                          initialUploadUrl={imageUrl}
                          isMultiple={true}
                          icon={
                            <img
                              src={uploadIcon}
                              alt="Upload Icon"
                              style={{ width: 16, height: 16 }}
                            />
                          }
                        />
                      </div>
                    </Col>
                  )}
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
                  <Col xs={12} lg={3} md={6} className="opacity-75">
                    <CustomTextField
                      label={t("news_label_Published")}
                      name="PublishedBy"
                      disabled
                    />
                  </Col>
                </Row>
              </Row>
              <div className="btn-Published mb-0">
                {loading ? (
                  <Button color="primary" className="add-trust-btn" disabled>
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
          );
        }}
      </Formik>
    </div>
  );
}
