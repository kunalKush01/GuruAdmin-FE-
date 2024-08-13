import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import TimePicker from "react-time-picker";
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
          eventMutation.mutate({
            eventId: e.Id,
            baseId: e?.SelectedEvent?.id ?? null,
            title: e.Title,
            tags: e?.tagsInit?.map((tag) => tag.text),
            deletedTags,
            location: e?.location,
            city: e?.city,
            state: e?.state,
            latitude: e?.longitude,
            longitude: e?.latitude,
            startTime: moment(e?.startTime, ["HH:mm"]).format("HH:mm"),
            endTime: e?.endTime,
            body: e.Body,
            startDate: moment(e?.DateTime?.start).format("YYYY-MM-DD"),
            endDate: e?.DateTime?.end
              ? moment(e?.DateTime?.end).format("YYYY-MM-DD")
              : moment(e?.DateTime?.start).format("YYYY-MM-DD"),
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
                  {!AddLanguage && (
                    <Col xs={12} md={6}>
                      <AsyncSelectField
                        name="SelectedEvent"
                        loadOptions={loadOption}
                        labelKey={"title"}
                        valueKey={"id"}
                        label={t("events_select_globle")}
                        placeholder={t("events_select_globle")}
                        disabled={selectEventDisabled}
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
                  <Col xs={12} md={6}>
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
                    <Col xs={12} md={6}>
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
                </Row>
                <Row>
                  <Col xs={12} className="">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="Body"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
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
                      <Col xs={12} md={4} className="opacity-75">
                        <CustomTextField
                          label={t("City")}
                          placeholder={t("placeHolder_city")}
                          name="city"
                          disabled
                        />
                      </Col>
                      <Col xs={12} md={4} className="opacity-75">
                        <CustomTextField
                          label={t("State")}
                          placeholder={t("placeHolder_state")}
                          name="state"
                          disabled
                        />
                      </Col>
                    </>
                  )}
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
                        acceptFile="image/*"
                        imageName="EventImage"
                        svgNotSupported
                        disabledAddLanguage={AddLanguage}
                        imageSpinner={imageSpinner}
                        setImageSpinner={setImageSpinner}
                        bg_plus={thumbnailImage}
                        setDeletedImages={setDeletedImages}
                        editedFileNameInitialValue={
                          formik?.values?.images ? formik?.values?.images : null
                        }
                        defaultImages={imageOnGlobalEvent}
                        randomNumber={randomNumber}
                        fileName={(file, type) => {
                          formik.setFieldValue("images", [
                            ...formik?.values?.images,
                            `${file}`,
                          ]);
                          formik.setFieldValue("type", type);
                        }}
                        removeFile={(fileName) => {
                          const newFiles = [...formik.values.images];

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
              {!AddLanguage && (
                <Col xs="4" className="">
                  <Row>
                    <Col xs="10">
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

                    <Col>
                      <FormikRangeDatePicker
                        label={t("donation_select_date_time")}
                        name="DateTime"
                        pastDateNotAllowed
                        selectsRange
                      />
                      <div
                      // style={{
                      //   height: "20px",
                      //   font: "normal normal bold 11px/33px Noto Sans",
                      // }}
                      >
                        {formik.errors.DateTime && formik.touched.DateTime && (
                          <div className="text-danger">
                            <Trans i18nKey={formik.errors.DateTime?.end} />
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col xs="10">
                      <Row>
                        <Col xs="6" md="5">
                          {!AddLanguage && (
                            <>
                              <label>
                                <Trans i18nKey={"start_Time"} />*
                              </label>
                              <TimePicker
                                onChange={(e) => {
                                  handleTimeChange(e);
                                  formik.setFieldValue("startTime", e);
                                }}
                                name="startTime"
                                value={
                                  selectedTimeStart ?? formik.values.startTime
                                }
                                disableClock={true}
                                clearIcon={null}
                                format="HH:mm"
                                placeholder="HH:mm"
                              />
                              {formik.errors.startTime &&
                                formik.touched.startTime && (
                                  <div
                                  // style={{
                                  //   height: "20px",
                                  //   font: "normal normal bold 11px/33px Noto Sans",
                                  // }}
                                  >
                                    {formik.errors.startTime &&
                                      formik.touched.startTime && (
                                        <div className="text-danger">
                                          <Trans
                                            i18nKey={formik.errors.startTime}
                                          />
                                        </div>
                                      )}
                                  </div>
                                )}
                            </>
                          )}
                        </Col>
                        <Col xs="6" md="5" className="">
                          {!AddLanguage && (
                            <>
                              <label>
                                <Trans i18nKey={"end_Time"} />*
                              </label>
                              <TimePicker
                                onChange={(e) => {
                                  handleTimeChangeEnd(e);
                                  formik.setFieldValue("endTime", e);
                                }}
                                name="endTime"
                                value={selectedTimeEnd}
                                disableClock={true}
                                clearIcon={null}
                                format="HH:mm"
                                placeholder="HH:mm"
                              />
                              {formik.errors.endTime &&
                                formik.touched.endTime && (
                                  <div
                                  // style={{
                                  //   height: "20px",
                                  //   font: "normal normal bold 11px/33px Noto Sans",
                                  // }}
                                  >
                                    {formik.errors.endTime &&
                                      formik.touched.endTime && (
                                        <div className="text-danger">
                                          <Trans
                                            i18nKey={formik.errors.endTime}
                                          />
                                        </div>
                                      )}
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
                                // style={{
                                //   height: "20px",
                                //   font: "normal normal bold 11px/20px Noto Sans",
                                // }}
                              >
                                {/* <Trans i18nKey={"same_time"} /> */}
                                <Trans i18nKey={"same_time"} />
                              </div>
                            ) : selectedTimeStart > selectedTimeEnd &&
                              formik?.values?.endTime !== "" ? (
                              <div
                                className="text-danger"
                                // style={{
                                //   height: "20px",
                                //   font: "normal normal bold 11px/20px Noto Sans",
                                // }}
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
                      </Row>
                    </Col>
                  </Row>
                </Col>
              )}
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
        )}
      </Formik>
    </div>
  );
}
