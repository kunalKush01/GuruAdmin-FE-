import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import { Select, TimePicker } from "antd";
import "react-time-picker/dist/TimePicker.css";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { getGlobalEvents } from "../../api/eventApi";
import { getAllEventTags, getAllTags } from "../../api/tagApi";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import { ConvertToString } from "../financeReport/reportJsonExport";
import FormikRangeDatePicker from "../partials/FormikRangeDatePicker";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import ImageUpload from "../partials/imageUpload";
import RichTextField from "../partials/richTextEditorField";
import CustomLocationField from "../partials/CustomLocationField";
import "../../assets/scss/common.scss";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { DatePicker, Image } from "antd";
import UploadImage from "../partials/uploadImage";
import { uploadFile } from "../../api/sharedStorageApi";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import { fetchImage } from "../partials/downloadUploadImage";
const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);
export default function EventForm({
  buttonName = "",
  AddLanguage,
  plusIconDisable = false,
  handleSubmit,
  editImage,
  defaultImages,
  validationSchema,
  initialValues,
  showTimeInput = false,
  selectEventDisabled,
  langSelectionValue,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const eventQueryClient = useQueryClient();
  const eventMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        eventQueryClient.invalidateQueries(["Events"]);
        eventQueryClient.invalidateQueries(["EventDates"]);
        eventQueryClient.invalidateQueries(["EventDetail"]);
        setLoading(false);
        history.push("/events");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });

  const loadOption = async (input) => {
    const getGlobalEventsRES = await getGlobalEvents({ search: input });
    return getGlobalEventsRES.results;
  };

  // tags
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(selectedLang.name);
  const tagsQuery = useQuery(
    ["tags", selectedLang.id],
    () =>
      getAllEventTags({
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
    // console.log(tags,tagToDelete);
    if (tagObj) {
      setDeletedTags((prev) => [...prev, tagObj._id]);
    }

    formik.setFieldValue("tagsInit", resetValues);
  };

  const [tagsCharLimit, setTagsCharLimit] = useState(false);

  const handleAddition = (formik, tag) => {
    formik.setFieldValue("tagsInit", [...formik.values.tagsInit, tag]);
  };

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const [deletedImages, setDeletedImages] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [imageSpinner, setImageSpinner] = useState(false);
  const [selectedTimeStart, setSelectedTimeStart] = useState(
    dayjs(new Date(), ["HH:mm"]).format("HH:mm")
  );
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("");

  const [imageOnGlobalEvent, setImageOnGlobalEvent] = useState(defaultImages);
  const [tagCharInput, setTagCharInput] = useState("");
  const langToast = {
    toastId: "langError",
  };
  const [uploadedFileUrl, setUploadedFileUrl] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (tagsCharLimit) {
            return;
          } else if (langSelectionValue === "Select") {
            toast.error("Please select a language", { ...langToast });
            return;
          }
          setShowPrompt(false);
          setLoading(true);
          const startDate = values?.DateTime?.start
            ? dayjs(values.DateTime.start).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD");

          const endDate = values?.DateTime?.end
            ? dayjs(values.DateTime.end).format("YYYY-MM-DD")
            : startDate;

          eventMutation.mutate({
            eventId: values.Id,
            baseId: values?.SelectedEvent?.id ?? null,
            title: values.Title,
            body: values.Body || "",
            tags: values?.tagsInit,
            deletedTags,
            location: values?.location,
            city: values?.city,
            state: values?.state,
            latitude: values?.longitude,
            longitude: values?.latitude,
            startTime: values.startTime,
            endTime: values.endTime,
            startDate,
            endDate,
            images: uploadedFileUrl || "",
            removedImages: deletedImages,
          });
          setDeletedTags([]);
        }}
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
                  {!AddLanguage && (
                    <Col xs={12} lg={4} md={6}>
                      <AsyncSelectField
                        name="SelectedEvent"
                        loadOptions={loadOption}
                        labelKey={"title"}
                        valueKey={"id"}
                        label={t("events_select_globle")}
                        placeholder={t("events_select_globle")}
                        disabled={selectEventDisabled}
                        defaultValue={formik.values.SelectedEvent}
                        value={formik.values.SelectedEvent}
                        onChange={(selectOption) => {
                          formik.setFieldValue("SelectedEvent", selectOption);
                          formik.setFieldValue(
                            "Title",
                            selectOption?.title ?? ""
                          );
                          formik.setFieldValue(
                            "Body",
                            ConvertToString(selectOption?.body ?? "")
                          );

                          if (
                            selectOption?.startDate &&
                            selectOption?.endDate
                          ) {
                            formik.setFieldValue("DateTime", {
                              start: dayjs(selectOption.startDate).toDate(),
                              end: dayjs(selectOption.endDate).toDate(),
                            });
                          }
                          if (selectOption?.images) {
                            const globalImage = selectOption?.images?.map(
                              (item) => item?.name
                            );
                            formik?.setFieldValue("images", [
                              ...formik.values.images,
                              ...(globalImage ?? ""),
                            ]);
                          } else if (selectOption == null) {
                            formik?.setFieldValue("images", []);
                            setImageOnGlobalEvent([]);
                          }
                          setImageOnGlobalEvent(selectOption?.images ?? []);
                        }}
                      />
                    </Col>
                  )}
                  <Col xs={12} lg={4} md={6}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      placeholder={t("placeHolder_title")}
                      name="Title"
                      required
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 128))
                      }
                      autoFocus
                    />
                  </Col>

                  {AddLanguage && (
                    <Col xs={12} lg={4} md={6}>
                      <div className="d-flex flex-column" id="tagComponent">
                        <label>Tags</label>
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
                        {tagsCharLimit && (
                          <div
                          //   style={{
                          //     height: "20px",
                          //     font: "normal normal bold 11px/33px Noto Sans",
                          //   }}
                          >
                            <div className="text-danger">hello</div>
                          </div>
                        )}
                        {formik.errors.tagsInit && (
                          <div
                          //   style={{
                          //     height: "20px",
                          //     font: "normal normal bold 11px/33px Noto Sans",
                          //   }}
                          >
                            {formik.errors.tagsInit && (
                              <div className="text-danger">
                                <Trans i18nKey={formik.errors.tagsInit} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Col>
                  )}
                  {!AddLanguage && (
                    <Col xs={12} lg={4} md={6}>
                      <div className="d-flex flex-column" id="tagComponent">
                        <label>Tags</label>
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
                          <div
                          //   style={{
                          //     height: "20px",
                          //     font: "normal normal bold 11px/33px Noto Sans",
                          //   }}
                          >
                            {formik.errors.tagsInit && (
                              <div className="text-danger">
                                <Trans i18nKey={formik.errors.tagsInit} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Col>
                  )}
                  <Col xs={12} lg={4} md={6}>
                    {!AddLanguage ? (
                      <>
                        <label>
                          <Trans i18nKey={"location"} />
                        </label>
                        *
                        <CustomLocationField
                          setFieldValue={formik.setFieldValue}
                          error={formik}
                          values={formik?.values}
                          defaultValue={{
                            location: formik.values.location,
                            city: formik.values.city,
                            state: formik.values.state,
                          }}
                        />
                        {formik.errors.location && (
                          <div
                          // style={{
                          //   height: "20px",
                          //   font: "normal normal bold 11px/33px Noto Sans",
                          // }}
                          >
                            {formik.errors.location &&
                              formik.touched.location && (
                                <div className="text-danger">
                                  <Trans i18nKey={formik.errors.location} />
                                </div>
                              )}
                          </div>
                        )}
                      </>
                    ) : (
                      <CustomTextField
                        label={t("location")}
                        name="location"
                        placeholder={t("placeHolder_location")}
                        required
                      />
                    )}
                  </Col>
                  {!AddLanguage && (
                    <>
                      <Col xs={12} lg={4} md={6} className="opacity-75">
                        <CustomTextField
                          label={t("City")}
                          placeholder={t("placeHolder_city")}
                          name="city"
                          disabled
                        />
                      </Col>
                      <Col xs={12} lg={4} md={6} className="opacity-75">
                        <CustomTextField
                          label={t("State")}
                          placeholder={t("placeHolder_state")}
                          name="state"
                          disabled
                        />
                      </Col>
                    </>
                  )}
                  {!AddLanguage && (
                    <>
                      <Col xs={12} lg={4} md={6}>
                        {/* Start Date */}
                        <label>
                          {t("select_start_date")}
                          <span className="text-danger">*</span>
                        </label>
                        <CustomDatePickerComponent
                          placeholder={t("select_start_date")}
                          style={{ width: "100%" }}
                          name="DateTime.start"
                          format="DD MMM YYYY"
                          onChange={(date) => {
                            if (date) {
                              const localDate = dayjs(date)
                                .startOf("day")
                                .toDate();
                              formik.setFieldValue("DateTime.start", localDate);

                              // If `end` is empty, set it to the same as `start`
                              if (!formik.values.DateTime?.end) {
                                formik.setFieldValue("DateTime.end", localDate);
                              }
                            } else {
                              formik.setFieldValue("DateTime.start", "");
                            }
                          }}
                          onBlur={() =>
                            formik.setFieldTouched("DateTime.start", true)
                          }
                          value={
                            formik.values.DateTime?.start
                              ? dayjs(formik.values.DateTime.start)
                              : ""
                          }
                          disabledDate={(current) =>
                            current < dayjs().startOf("day")
                          }
                        />
                        {/* Start Date Error Message */}
                        {formik.touched.DateTime?.start &&
                          formik.errors.DateTime?.start && (
                            <div className="text-danger">
                              <Trans i18nKey={formik.errors.DateTime.start} />
                            </div>
                          )}

                        {/* End Date */}
                        <label>
                          {t("select_end_date")}
                          <span className="text-danger">*</span>
                        </label>
                        <CustomDatePickerComponent
                          placeholder={t("select_end_date")}
                          style={{ width: "100%", marginTop: "5px" }}
                          name="DateTime.end"
                          format="DD MMM YYYY"
                          onChange={(date) => {
                            if (date) {
                              const localDate = dayjs(date)
                                .endOf("day")
                                .toDate();
                              formik.setFieldValue("DateTime.end", localDate);
                            } else {
                              formik.setFieldValue("DateTime.end", "");
                            }
                          }}
                          onBlur={() =>
                            formik.setFieldTouched("DateTime.end", true)
                          }
                          value={
                            formik.values.DateTime?.end
                              ? dayjs(formik.values.DateTime.end)
                              : ""
                          }
                          disabledDate={(current) => {
                            const startDate = formik.values.DateTime?.start;
                            return (
                              current < dayjs().startOf("day") ||
                              (startDate && current < dayjs(startDate))
                            );
                          }}
                        />
                        {/* End Date Error Message */}
                        {formik.touched.DateTime?.end &&
                          formik.errors.DateTime?.end && (
                            <div className="text-danger">
                              <Trans i18nKey={formik.errors.DateTime.end} />
                            </div>
                          )}
                      </Col>

                      <Col xs={12} lg={4} md={6}>
                        <label>
                          <Trans i18nKey={"start_Time"} />
                          <span className="text-danger">*</span>
                        </label>
                        <TimePicker
                          use12Hours={false}
                          format="HH:mm"
                          value={
                            formik.values.startTime
                              ? dayjs(formik.values.startTime, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            const timeString = time
                              ? time.format("HH:mm")
                              : null;
                            formik.setFieldValue("startTime", timeString);
                          }}
                          className="w-100"
                          placeholder="HH:mm"
                        />
                        {formik.errors.startTime &&
                          formik.touched.startTime && (
                            <div className="text-danger">
                              <Trans i18nKey={formik.errors.startTime} />
                            </div>
                          )}
                      </Col>

                      <Col xs={12} lg={4} md={6}>
                        <label>
                          <Trans i18nKey={"end_Time"} />
                          <span className="text-danger">*</span>
                        </label>
                        <TimePicker
                          use12Hours={false}
                          format="HH:mm"
                          value={
                            formik.values.endTime
                              ? dayjs(formik.values.endTime, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            const timeString = time
                              ? time.format("HH:mm")
                              : null;
                            formik.setFieldValue("endTime", timeString);
                          }}
                          className="w-100"
                          placeholder="HH:mm"
                        />
                        {formik.errors.endTime && formik.touched.endTime && (
                          <div className="text-danger">
                            <Trans i18nKey={formik.errors.endTime} />
                          </div>
                        )}
                      </Col>
                      {!AddLanguage &&
                        formik.values.startTime &&
                        formik.values.endTime && (
                          <Col xs={12}>
                            {formik.values.startTime ===
                            formik.values.endTime ? (
                              <div className="text-danger">
                                <Trans i18nKey={"same_time"} />
                              </div>
                            ) : formik.values.startTime >
                              formik.values.endTime ? (
                              <div className="text-danger">
                                <Trans i18nKey={"end_time_less"} />
                              </div>
                            ) : null}
                          </Col>
                        )}
                    </>
                  )}
                </Row>
                <Row>
                  <Col xs={12} className="">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="Body"
                    />
                  </Col>
                  {!AddLanguage && (
                    <Col xs={12} lg={4} md={6}>
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
                          name="EventImage"
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
                </Row>
              </Row>
              <div className="btn-Published mb-2">
                {loading ? (
                  <Button color="primary" className="add-trust-btn" disabled>
                    <Spinner size="md" />
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="addAction-btn "
                    type="submit"
                    disabled={
                      imageSpinner ||
                      (formik.values.startTime &&
                        formik.values.endTime &&
                        formik.values.startTime >= formik.values.endTime)
                    }
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
