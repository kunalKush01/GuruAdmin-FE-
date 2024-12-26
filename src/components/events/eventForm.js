import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import { TimePicker } from 'antd';
import "react-time-picker/dist/TimePicker.css";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { getGlobalEvents } from "../../api/eventApi";
import { getAllTags } from "../../api/tagApi";
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

  const [tagsCharLimit, setTagsCharLimit] = useState(false);

  const handleAddition = (formik, tag) => {
    formik.setFieldValue("tagsInit", [...formik.values.tagsInit, tag]);
  };

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const [deletedImages, setDeletedImages] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [imageSpinner, setImageSpinner] = useState(false);
  const [selectedTimeStart, setSelectedTimeStart] = useState(
    moment(new Date(), ["HH:mm"]).format("HH:mm")
  );
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("");

  useEffect(() => {
    setSelectedTimeEnd(initialValues?.endTime);
    setSelectedTimeStart(initialValues?.startTime);
  }, [initialValues]);

  const handleTimeChange = (time) => {
    setSelectedTimeStart(moment(time, ["HH:mm"]).format("HH:mm"));
  };
  const handleTimeChangeEnd = (time) => {
    setSelectedTimeEnd(moment(time, ["HH:mm"]).format("HH:mm"));
  };

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
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          if (tagsCharLimit) {
            return;
          } else if (langSelectionValue === "Select") {
            toast.error("Please select a language", { ...langToast });
            return;
          }
          setShowPrompt(false);
          setLoading(true);
          const startDate = e?.DateTime?.start 
          ? moment(e.DateTime.start).format("YYYY-MM-DD") 
          : moment().format("YYYY-MM-DD");
          
        const endDate = e?.DateTime?.end 
          ? moment(e.DateTime.end).format("YYYY-MM-DD")
          : startDate;
        
          eventMutation.mutate({
            eventId: e.Id,
            baseId: e?.SelectedEvent?.id ?? null,
            title: e.Title,
             body: e.Body || "",
            tags: e?.tagsInit?.map((tag) => tag.text),
            deletedTags,
            location: e?.location,
            city: e?.city,
            state: e?.state,
            latitude: e?.longitude,
            longitude: e?.latitude,
            startTime: moment(e?.startTime, ["HH:mm"]).format("HH:mm"),
            endTime: e?.endTime,
            startDate,
            endDate, 
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
                        defaultValue={formik.values.SelectedEvent} // Add this line
                        value={formik.values.SelectedEvent} // Add this line
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

                          formik.setFieldValue("DateTime", {
                            start: moment(selectOption?.startDate).toDate(),
                            end: moment(selectOption?.endDate)
                              .utcOffset("+0530")
                              .toDate(),
                          });
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
                          setSelectedTimeEnd(selectOption?.endTime ?? "23:59");
                          setSelectedTimeStart(
                            selectOption?.startTime ??
                              moment(new Date(), ["HH:mm"]).format("HH:mm")
                          );
                          formik.setFieldValue(
                            "startTime",
                            selectOption?.startTime ??
                              moment(new Date(), ["HH:mm"]).format("HH:mm")
                          );
                          formik.setFieldValue(
                            "endTime",
                            selectOption?.endTime ?? "23:59"
                          );
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
                      <label>Tags</label>
                      <ReactTags
                        placeholder={t("placeHolder_tags")}
                        tags={formik.values.tagsInit}
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
                    </Col>
                  )}
                  {!AddLanguage && (
                    <Col xs={12} lg={4} md={6}>
                      <label>Tags</label>
                      <ReactTags
                        placeholder={t("placeHolder_tags")}
                        tags={formik.values.tagsInit}
                        suggestions={suggestions}
                        inputValue={tagCharInput}
                        allowAdditionFromPaste={false}
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
                            state: formik.values.state
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
                        <label>{t("select_dates")}</label>
                        <CustomDatePickerComponent
                          placeholder={t("select_start_date")}
                          style={{ width: "100%" }}
                          name="DateTime"
                          format="DD MMM YYYY"
                          onChange={(date) => {
                            if (date) {
                              const localDate = moment(date);
                              const startOfDay = localDate.startOf('day');
                              
                              formik.setFieldValue("DateTime", {
                                ...formik.values.DateTime,
                                start: startOfDay.toDate()
                              });
                              if (!formik.values.DateTime?.end) {
                                formik.setFieldValue("DateTime", {
                                  start: startOfDay.toDate(),
                                  end: startOfDay.toDate()
                                });
                              }
                            } else {
                              formik.setFieldValue("DateTime", {
                                ...formik.values.DateTime,
                                start: null
                              });
                            }
                          }}
                          value={formik.values.DateTime?.start ? moment(formik.values.DateTime.start) : null}
                          disabledDate={(current) => current < moment().startOf("day")}
                        />
                        <CustomDatePickerComponent
                          placeholder={t("select_end_date")}
                          style={{ width: "100%", marginTop:"20px" }}
                          name="endDate"
                          format="DD MMM YYYY"
                          onChange={(date) => {
                            if (date) {
                              const localDate = moment(date);   
                              const endOfDay = localDate.endOf('day');
                              formik.setFieldValue("DateTime", {
                                ...formik.values.DateTime,
                                end: endOfDay.toDate()
                              });
                            } else {
                              formik.setFieldValue("DateTime", {
                                ...formik.values.DateTime,
                                end: null
                              });
                            }
                          }}
                          value={formik.values.DateTime?.end ? moment(formik.values.DateTime.end) : null}
                          disabledDate={(current) => {
                            const startDate = formik.values.DateTime?.start;
                            return current < moment().startOf("day") || 
                                  (startDate && current < moment(startDate));
                          }}
                        />
                        <div
                        // style={{
                        //   height: "20px",
                        //   font: "normal normal bold 11px/33px Noto Sans",
                        // }}
                        >
                          {formik.errors.DateTime && formik.touched.DateTime && (
                             <div className="text-danger">
                             {formik.errors.DateTime.start && <div><Trans i18nKey={formik.errors.DateTime.start} /></div>}
                             {formik.errors.DateTime.end && <div><Trans i18nKey={formik.errors.DateTime.end} /></div>}
                           </div>
                         )}
                        </div>
                      </Col>
                      <Col xs={12} lg={4} md={6}>
                        {!AddLanguage && (
                          <>
                            <label>
                              <Trans i18nKey={"start_Time"} />*
                            </label>
                            <TimePicker
                              use12Hours={false}
                              format="HH:mm"
                              value={selectedTimeStart ? moment(selectedTimeStart, 'HH:mm') : null}
                              onChange={(time) => {
                                const timeString = time ? time.format('HH:mm') : null;
                                handleTimeChange(timeString);
                                formik.setFieldValue('startTime', timeString);
                              }}
                              className="w-100"
                              placeholder="HH:mm"
                            />
                            {formik.errors.startTime && formik.touched.startTime && (
                            <div className="text-danger">
                              <Trans i18nKey={formik.errors.startTime} />
                            </div>
                          )}
                          </>
                        )}
                      </Col>
                      <Col xs={12} lg={4} md={6}>
                        {!AddLanguage && (
                          <>
                            <label>
                              <Trans i18nKey={"end_Time"} />*
                            </label>
                            <TimePicker
                              use12Hours={false}
                              format="HH:mm"
                              value={selectedTimeEnd ? moment(selectedTimeEnd, 'HH:mm') : null}
                              onChange={(time) => {
                                const timeString = time ? time.format('HH:mm') : null;
                                handleTimeChangeEnd(timeString);
                                formik.setFieldValue('endTime', timeString);
                              }}
                              className="w-100"
                              placeholder="HH:mm"
                            />
                            {formik.errors.endTime && formik.touched.endTime && (
                              <div className="text-danger">
                                <Trans i18nKey={formik.errors.endTime} />
                              </div>
                            )}
                          </>
                        )}
                      </Col>
                      {!AddLanguage ? (
                        formik?.values?.DateTime?.end === null ||
                        moment(formik?.values?.DateTime?.start).format(
                          "dd-mm-yy"
                        ) ===
                          moment(formik?.values?.DateTime?.end).format(
                            "dd-mm-yy"
                          ) ? (
                          formik?.values?.startTime ===
                            formik?.values?.endTime &&
                          formik?.values?.startTime !== "" &&
                          formik?.values?.endTime !== "" ? (
                            <div
                              className="text-danger"
                            >
                              <Trans i18nKey={"same_time"} />
                            </div>
                          ) : selectedTimeStart > selectedTimeEnd &&
                            formik?.values?.endTime !== "" ? (
                            <div
                              className="text-danger"
                            >
                              <Trans i18nKey={"end_time_less"} />
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )
                      ) : (
                        ""
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
                    disabled={
                      imageSpinner ||
                      (moment(formik?.values?.DateTime?.start).format(
                        "dd-mm-yy"
                      ) ===
                        moment(formik?.values?.DateTime?.end).format(
                          "dd-mm-yy"
                        ) &&
                        selectedTimeStart > selectedTimeEnd)
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
