import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Storage } from "aws-amplify";
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, X } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { toast } from "react-toastify";
import { Button, Col, Modal, ModalBody, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { getAllTrustPrefeces, getAllTrustType } from "../../api/profileApi";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import defaultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import pdfIcon from "../../assets/images/icons/iconPDF.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { handleProfileUpdate } from "../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import CustomLocationField from "../partials/CustomLocationField";
import { TextArea } from "../partials/CustomTextArea";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";
import RichTextField from "../partials/richTextEditorField";
import useTimeStampAndImageExtension from "../../utility/hooks/useTimeStampAndImageExtension";
import "../../assets/scss/common.scss";

export default function ProfileForm({
  handleSubmit,
  validationSchema,
  buttonLabel,
  editImage,
  AddLanguage,
  loading,
  setLoading,
  defaultDocuments,
  defaultImages,
  initialValues,
  editProfile,
  trustMobileNumber,
  userMobileNumber,
  profileImageName,
  showTimeInput,
  selectEventDisabled,
  userMobileNumberState,
  setUserMobileNumberState,
  langSelectionValue,
  trustMobileNumberState,
  setTrustMobileNumberState,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        setLoading(false);
        queryClient.invalidateQueries(["ProfileModule"]);
        if (AddLanguage) {
          history.push("/edit-profile");
        }
        !AddLanguage &&
          dispatch(
            handleProfileUpdate({
              name: data?.result?.name,
              profilePhoto: data?.result?.profilePhoto,
            })
          );
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });

  const selectedLang = useSelector((state) => state.auth.selectLang);

  const allTrustTypes = useQuery(
    ["trustTypes", selectedLang.id],
    async () =>
      await getAllTrustType({
        languageId: selectedLang.id,
      })
  );

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);
  const [deletedImages, setDeletedImages] = useState([]);

  // Trust preference
  const loadTrustPreference = useQuery(["Preference"], () =>
    getAllTrustPrefeces()
  );

  const trustPreference = useMemo(
    () => loadTrustPreference?.data?.results ?? [],
    [loadTrustPreference?.data?.results]
  );

  const [cityLoadOption, setCityLoadOption] = useState([]);

  // Facility image uploade
  const uploadeFacility = useRef();
  // doc upload
  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (initialValues?.documents?.length > 0) {
      setFiles(initialValues?.documents);
    }
  }, [initialValues]);
  const [facilitiesFiles, setFacilitiesFiles] = useState([]);
  const [facilityFormData, setFacilityFormData] = useState([]);

  const [deletedFacility, setDeletedFacility] = useState([]);
  const removeFacility = (file, formik) => {
    setDeletedFacility((prev) => [...prev, file]);
    const newFacilitiesFiles = [...facilityFormData];
    newFacilitiesFiles.splice(newFacilitiesFiles.indexOf(file), 1);
    setFacilitiesFiles(newFacilitiesFiles);
    setFacilityFormData(newFacilitiesFiles);
    formik.setFieldValue("trustFacilities", newFacilitiesFiles);
  };

  const formRef = useRef();

  const [deletedDocuments, setDeletedDocuments] = useState([]);
  const [documentSpinner, setDocumentSpinner] = useState(false);

  const handleUpload = (acceptedFiles, uploadType, formik) => {
    setDocumentSpinner(true);
    const { extension, unixTimestampSeconds } =
      useTimeStampAndImageExtension(acceptedFiles);
    Storage.put(
      `temp/${
        uploadType == "document" ? "Documents" : "FacilitiesImage"
      }_${randomNumber}_${unixTimestampSeconds}.${extension}`,
      acceptedFiles,
      {
        contentType: acceptedFiles?.type,
      }
    )
      .then((res) => {
        setDocumentSpinner(false);
        if (uploadType === "document") {
          const uploadedDocumentName = res.key.split("temp/")[1];
          setFiles([...files, { name: uploadedDocumentName }]);
          formik.setFieldValue("documents", [
            ...formik.values.documents,
            {
              name: `Documents_${randomNumber}_${unixTimestampSeconds}.${extension}`,
            },
          ]);
        } else if (uploadType === "facility") {
          formik.setFieldValue(
            "imageName",
            `FacilitiesImage_${randomNumber}_${unixTimestampSeconds}.${extension}`
          );
          formik.setFieldValue("preview", URL.createObjectURL(acceptedFiles));
          setFacilitiesFiles(
            Object.assign(acceptedFiles, {
              // preview: URL.createObjectURL(acceptedFiles),
              presignedUrl: URL.createObjectURL(acceptedFiles),
            })
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const removeDocumentFile = (file, formik) => {
    setDeletedDocuments((prev) => [...prev, file?.name]);
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
    formik.setFieldValue("documents", newFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "",
    onDrop: (acceptedFiles) => {
      handleUpload(acceptedFiles[0]);
    },
  });
  const uploadDocuments = useRef();

  // model
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [selectedTimeStart, setSelectedTimeStart] = useState("");
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("");

  const handleTimeChange = (time) => {
    setSelectedTimeStart(time);
  };
  const handleTimeChangeEnd = (time) => {
    setSelectedTimeEnd(time);
  };

  const [facilityEditData, setFacilityEditData] = useState(null);
  // facilities initial values
  const facilityIntialValues = useMemo(() => {
    return {
      id: facilityEditData?.data?.id ?? "",
      name: facilityEditData?.data?.name ?? "",
      description: facilityEditData?.data?.description ?? "",
      imageName: facilityEditData?.data?.imageName ?? "",
      preview: facilityEditData?.data?.image ?? "",
      startTime: facilityEditData?.data?.startTime ?? "",
      endTime: facilityEditData?.data?.endTime ?? "",
    };
  }, [facilityEditData]);

  useEffect(() => {
    if (initialValues?.trustFacilities?.length > 0) {
      setFacilityFormData(initialValues?.trustFacilities);
      setSelectedTimeStart(facilityIntialValues?.startTime);
      setSelectedTimeEnd(facilityIntialValues?.endTime);
    }
  }, [initialValues, facilityIntialValues]);

  // facilities validation

  const facilitiesValidation = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
      .required("name_required"),
    // image: yup.string().required("email_required"),
    description: Yup.string()
      // .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
      .required("news_desc_required"),
    // startTime: yup.mixed().required("start_time_required"),
    // endTime: yup.mixed().required("end_time_required"),
  });
  const [imageSpinner, setImageSpinner] = useState(false);
  const [profileName, setProfileName] = useState();
  useEffect(() => {
    setProfileName(profileImageName);
  }, [profileImageName]);

  const langToast = {
    toastId: "langError",
  };
  return (
    <div className="profileformwrapper FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        innerRef={formRef}
        onSubmit={(e) => {
          if (AddLanguage && langSelectionValue === "Select") {
            toast.error("Please select a language", { ...langToast });
            return;
          }
          setLoading(true);
          AddLanguage
            ? mutation.mutate({
                // profilePhoto: editProfile ? profileName : e?.profileImage,
                trustName: e?.trustName,
                // typeId: e?.trustType?.id,
                // trustEmail: e?.trustEmail,
                // trustNumber: e?.trustNumber.toString(),
                about: e?.about,
                // name: e?.name,
                // email: e?.email,
                // mobileNumber: e?.mobileNumber.toString(),
                // state: e?.state?.state,
                // city: e?.city?.districts,
                // place_id: e?.location.value.place_id,
                location: e?.location,
                address: e?.address,
                // longitude: e?.longitude.toString(),
                // latitude: e?.latitude.toString(),
                trustFacilities: facilityFormData,
                // images: e?.images,
                // removeFacility: deletedFacility,
                // removedImages: deletedImages,
                // removedDocuments: deletedDocuments,
                // documents: e?.documents?.map((item) => item?.name),
                // documents: e?.documents?.map((item) => item?.name),
                // oldPassword: e?.oldPassword,
                // newPassword: e?.newPassword,
                // confirmPassword: e?.confirmPassword,
              })
            : mutation.mutate({
                profilePhoto: editProfile ? profileName : e?.profileImage,
                trustName: e?.trustName,
                typeId: e?.trustType?.id,
                // preferenceId: e?.preference?._id,
                trustEmail: e?.trustEmail,
                trustNumber: e?.trustNumber.toString(),
                trustCountryCode: e?.trustDialCode,
                address: e?.address,
                facebookLink: e?.facebookLink,
                trustCountryName: e?.trustCountryCode,
                about: e?.about,
                name: e?.name,
                email: e?.email,
                mobileNumber: e?.mobileNumber.toString(),
                countryCode: e?.dialCode,
                countryName: e?.countryCode,
                state: e?.state,
                city: e?.city,
                location: e?.location,
                longitude: e?.longitude.toString(),
                latitude: e?.latitude.toString(),
                trustFacilities: facilityFormData,
                images: e?.images,
                removeFacility: deletedFacility,
                removedImages: deletedImages,
                removedDocuments: deletedDocuments,
                // documents: e?.documents?.map((item) => item?.name),
                documents: e?.documents?.map((item) => item?.name),
                // oldPassword: e?.oldPassword,
                // newPassword: e?.newPassword,
                // confirmPassword: e?.confirmPassword,
              });
        }}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form>
            {/* <Prompt
              when={!!Object.values(formik?.values).find((val) => !!val)}
              message={(location) =>
                `Are you sure you want to leave this page & visit ${location.pathname.replace(
                  "/",
                  ""
                )}`
              }
            /> */}
            {/* About Trust Container */}
            <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existLabel">
                  <Trans i18nKey={"about_trust"} />
                  <hr />
                </div>
              </Col>
              <Row className="">
                {!AddLanguage && (
                  <Col xs={12} lg={1} className="me-4">
                    <div className="d-flex mt-1">
                      <ImageUpload
                        bg_plus={defaultAvtar}
                        profileImage
                        acceptFile="image/*"
                        imageName="TrustProfileImage"
                        svgNotSupported
                        editTrue="edit"
                        imageSpinner={imageSpinner}
                        setImageSpinner={setImageSpinner}
                        editedFileNameInitialValue={
                          formik.values?.profileImage
                            ? formik.values?.profileImage
                            : null
                        }
                        randomNumber={randomNumber}
                        fileName={(file, type) => {
                          formik.setFieldValue("profileImage", `${file}`);
                          formik.setFieldValue("type", type);
                          setProfileName(`${file}`);
                        }}
                        removeFile={(fileName) => {
                          formik.setFieldValue("profileImage", "");
                          setProfileName("");
                        }}
                      />
                    </div>
                  </Col>
                )}
                <Col lg={10} xs={12} className="">
                  <Row>
                    <Col
                      xs={12}
                      md={6}
                      lg={4}
                      className={AddLanguage && "mb-1"}
                    >
                      <CustomTextField
                        label={t("userProfile_name")}
                        placeholder={t("placeHolder_name")}
                        name="trustName"
                        required
                        onInput={(e) =>
                          (e.target.value = e.target.value.slice(0, 256))
                        }
                        autoFocus
                      />
                    </Col>
                    {!AddLanguage && (
                      <Col xs={12} md={6} lg={4} className="">
                        <FormikCustomReactSelect
                          labelName={t("trust_trustType")}
                          name="trustType"
                          required
                          labelKey={"name"}
                          valueKey="id"
                          loadOptions={allTrustTypes?.data?.results}
                          defaultValue={formik?.values?.trustType}
                          width={"100"}
                        />
                      </Col>
                    )}
                  </Row>
                  {!AddLanguage && (
                    <Row>
                      <Col xs={12} md={6} lg={4} className="">
                        <CustomTextField
                          label={t("userProfile_email_id")}
                          name="trustEmail"
                          placeholder={t("placeHolder_email")}
                          required
                        />
                      </Col>
                      {/* {JSON.stringify(formik.values.mobileNumber)} */}
                      <Col xs={12} md={6} lg={4} className="">
                        <CustomCountryMobileNumberField
                          value={trustMobileNumberState}
                          defaultCountry={initialValues?.trustCountryCode}
                          label={t("contact_number")}
                          placeholder={t("placeHolder_phone_number")}
                          onChange={(phone, country) => {
                            setTrustMobileNumberState(phone);
                            formik.setFieldValue(
                              "trustCountryCode",
                              country?.countryCode
                            );
                            formik.setFieldValue(
                              "trustDialCode",
                              country?.dialCode
                            );
                            formik.setFieldValue(
                              "trustNumber",
                              phone?.replace(country?.dialCode, "")
                            );
                          }}
                          required
                        />
                        {/* <CustomTextField
                          label={t("userProfile_phone_number")}
                          name="trustNumber"
                          placeholder={t("placeHolder_phone_number")}
                          disabled={AddLanguage}
                          type="number"
                          required
                          pattern="[6789][0-9]{9}"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 12))
                          }
                        /> */}
                      </Col>
                    </Row>
                  )}
                  {!AddLanguage && (
                    <Row>
                      <Col
                        xs={12}
                        md={6}
                        lg={4}
                        // className={`ps-lg-3 ${formik.errors ? "mt-1" : "mt-2"}`}
                      >
                        <CustomTextField
                          label={t("trust_facebookLink")}
                          placeholder={t("placeHolder_trust_facebook")}
                          name="facebookLink"
                        />
                      </Col>
                    </Row>
                  )}
                  {/* {!AddLanguage && (
                    <Row>
                      <Col xs={12} md={6} lg={4}>
                        <FormikCustomReactSelect
                          labelName={t("trust_prefenses")}
                          name="preference"
                          required
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
                    </Row>
                  )} */}
                </Col>
              </Row>

              <Row className="">
                {/* <Col>
                  <TextArea
                    label="About Trust"
                    name="about"
                    rows="4"
                    placeholder="Enter about trust "
                    className="text-area form-control"
                  />
                </Col> */}
                <Col xs={12}>
                  <RichTextField
                    height="200px"
                    label={t("about_trusts")}
                    name="about"
                  />
                </Col>
              </Row>
            </Row>
            {/* About Trust Container */}
            {/* About user Container */}
            {!AddLanguage && (
              <Row className="mt-1">
                <Col xs={12}>
                  <div className="heading_div existLabel">
                    <Trans i18nKey={"trust_user"} />
                    <hr />
                  </div>
                </Col>
                <Row className="">
                  <Col xs={12} className="">
                    <Row>
                      <Col xs={12} md={6} lg={4} className="">
                        <CustomTextField
                          required
                          label={t("userProfile_name")}
                          placeholder={t("placeHolder_name")}
                          name="name"
                          disabled={AddLanguage}
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 30))
                          }
                          autoFocus
                        />
                      </Col>
                      <Col xs={12} md={6} lg={4} className="">
                        <CustomTextField
                          label={t("userProfile_email_id")}
                          disabled={AddLanguage}
                          name="email"
                          placeholder={t("placeHolder_email")}
                          required
                        />
                      </Col>
                      <Col xs={12} md={6} lg={4} className="">
                        <CustomCountryMobileNumberField
                          value={userMobileNumberState}
                          defaultCountry={initialValues?.countryCode}
                          label={t("userProfile_phone_number")}
                          placeholder={t("placeHolder_phone_number")}
                          onChange={(phone, country) => {
                            setUserMobileNumberState(phone);
                            formik.setFieldValue(
                              "countryCode",
                              country?.countryCode
                            );
                            formik.setFieldValue("dialCode", country?.dialCode);
                            formik.setFieldValue(
                              "mobileNumber",
                              phone?.replace(country?.dialCode, "")
                            );
                          }}
                          required
                        />
                        {/* <CustomTextField
                          label={t("userProfile_phone_number")}
                          disabled={AddLanguage}
                          placeholder={t("placeHolder_phone_number")}
                          name="mobileNumber"
                          type="number"
                          required
                          pattern="[6789][0-9]{9}"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 12))
                          }
                        /> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Row>
            )}
            {/* About user Container */}
            {/* Trust Location Container  */}
            <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existLabel">
                  <Trans i18nKey={"trust_location"} />
                  <hr />
                </div>
              </Col>
              <Row>
                <Col xs={12}>
                  {/* <Col
                    xs={12}
                    className={`ps-lg-3 ${formik.errors ? "mt-1" : "mt-2"}`}
                  > */}
                  <TextArea
                    label={t("trust_address")}
                    name="address"
                    rows="4"
                    placeholder={t("placeHolder_trust_address")}
                    className="text-area form-control"
                  />
                  {/* </Col> */}
                </Col>
                <Col md={4}>
                  {!AddLanguage ? (
                    <>
                      <label>
                        <Trans i18nKey={"location"} />*
                      </label>
                      <CustomLocationField
                        setFieldValue={formik.setFieldValue}
                        error={formik}
                        values={formik?.values}
                      />
                      {formik.errors.location && formik.touched.location ? (
                        <div style={{ fontSize: "11px", color: "red" }}>
                          <Trans i18nKey={formik.errors.location} />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <CustomTextField
                      label={t("location")}
                      placeholder={t("placeHolder_location")}
                      name="location"
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
                {/* {!AddLanguage && (
                  <Col sm={4}>
                    <CustomTextField
                      label={t("longitude")}
                      name="longitude"
                      type="text"
                      required
                      disabled
                    />
                  </Col>
                )}
                {!AddLanguage && (
                  <Col sm={4}>
                    <CustomTextField
                      label={t("latitude")}
                      name="latitude"
                      type="text"
                      disabled
                      required
                    />
                  </Col>
                )} */}
              </Row>
            </Row>
            {/* Trust Location Container  */}
            {/* Trust Facilities */}

            <Row className={`mt-1 ${AddLanguage && "paddingForm"}`}>
              <Col xs={12}>
                <div className="heading_div existLabel">
                  <Trans i18nKey={"trust_facility"} />
                  <hr />
                </div>
              </Col>
              <Row>
                <Col xs={12}>
                  {/* <div className="existLabel  ">
                    <Trans i18nKey={"userProfile_facilities"} />
                  </div> */}
                </Col>
                {/* {[...formik?.values?.trustFacilities, ...facilityFormData]?.map( */}
                {[...(formRef?.current?.values?.trustFacilities ?? [])]?.map(
                  (item, idx) => {
                    return (
                      <Col
                        lg={3}
                        md={4}
                        sm={6}
                        key={idx}
                        className="position-relative p-1 facilityCol mb-2 "
                      >
                        {!AddLanguage && (
                          <Button
                            className="removeImageButton"
                            onClick={(e) => {
                              removeFacility(item, formik);
                            }}
                          >
                            <X color="#ff8744" stroke-width="3" />
                          </Button>
                        )}
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setFacilityEditData({
                              type: "edit",
                              data: item,
                              index: idx,
                            });
                            toggle();
                          }}
                        >
                          <div className="trust_img position-relative">
                            <div className="editFacilityImageText">
                              <Trans i18nKey={"edit_image"} />
                            </div>
                            <img
                              src={
                                item?.preview
                                  ? item?.preview
                                  : item?.image
                                  ? item?.image
                                  : placeHolder
                              }
                              alt="Facility Image"
                            />
                            {/* </div> */}
                          </div>
                          <div className="py-1 px-1">
                            <div className="temple_name">
                              {ConverFirstLatterToCapital(item?.name ?? "")}
                            </div>
                            {item?.startTime && item?.endTime && (
                              <div className="temple_time">
                                Timings : {item?.startTime} to {item?.endTime}
                              </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    );
                  }
                )}
                {!AddLanguage && (
                  <Col lg={3} md={4} sm={6}>
                    <div
                      className=""
                      onClick={toggle}
                      // onClick={() => {
                      //   history.push("/facilities");
                      //   dispatch(
                      //     handleProfileUpdate({
                      //       ...formik.values,
                      //       city: formik?.values?.city?.districts,
                      //       state: formik?.values?.state?.state,
                      //       location: formik?.values?.location?.label,
                      //     })
                      //   );
                      // }}
                    >
                      <div className="p-1">
                        <div className="facility_button">
                          <Plus />
                        </div>
                        <div className="facility_add">
                          + Add More Facilities
                        </div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Row>

            {/* Trust Facilities */}
            {/* Trust  Images */}
            {!AddLanguage && (
              <Row className="mt-1 paddingForm">
                <Col xs={12}>
                  <div className="heading_div existLabel">
                    <Trans i18nKey={"trust_image_certificate"} />
                    <hr />
                  </div>
                </Col>
                <Row>
                  {/* Image Col */}
                  <Col lg={6}>
                    <Row>
                      <Col>
                        <div className="existLabel">
                          <Trans i18nKey={"images"} />
                        </div>
                        <div>
                          <ImageUpload
                            multiple
                            type={editImage}
                            imageName="TrustImage"
                            imageSpinner={imageSpinner}
                            acceptFile="image/*"
                            svgNotSupported
                            setImageSpinner={setImageSpinner}
                            bg_plus={thumbnailImage}
                            setDeletedImages={setDeletedImages}
                            editedFileNameInitialValue={
                              formik?.values?.images
                                ? formik?.values?.images
                                : null
                            }
                            defaultImages={defaultImages}
                            randomNumber={randomNumber}
                            fileName={(file, type) => {
                              formik.setFieldValue("images", [
                                ...formik?.values?.images,
                                `${file}`,
                              ]);
                              formik.setFieldValue("type", type);
                            }}
                            removeFile={(fileName) => {
                              const profileImageArray = [
                                ...formik.values.images,
                              ];
                              const updatedFiles = profileImageArray?.filter(
                                (img) => !img.includes(fileName)
                              );
                              formik.setFieldValue("images", updatedFiles);
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* Image Col */}
                  {/* Doc Col */}
                  <Col lg={6}>
                    <Row>
                      <Col xs={12}>
                        <Row className="d-flex align-items-center">
                          <Col xs={10} className="pe-0">
                            <div>
                              <label>
                                <Trans
                                  i18nKey={"userProfile_doc_certificate"}
                                />
                              </label>
                            </div>
                            <input
                              ref={uploadDocuments}
                              type={"file"}
                              name="documents"
                              accept=""
                              onChange={(e) => {
                                if (e.target.files?.length) {
                                  handleUpload(
                                    e.target.files[0],
                                    "document",
                                    formik
                                  );
                                }
                              }}
                            />
                          </Col>
                          <Col xs={2} className="align-self-end">
                            {documentSpinner ? (
                              <Spinner color="primary" />
                            ) : (
                              <Button
                                color="primary"
                                className="addAction-btn"
                                onClick={() => uploadDocuments.current.click()}
                              >
                                <Trans i18nKey={"browse"} />
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className=" row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5  gap-1 mt-2 text-break">
                      {[...formik.values.documents]?.map((item, idx) => {
                        return (
                          <Col
                            className="pdfDiv position-relative cursor-pointer"
                            key={idx}
                          >
                            <Button
                              className="removePDFButton"
                              onClick={() => {
                                uploadDocuments.current.value = "";
                                removeDocumentFile(item, formik);
                              }}
                            >
                              <X color="#ff8744" stroke-width="3" />
                            </Button>
                            {item?.presignedUrl !== "" && item?.presignedUrl ? (
                              <a href={item?.presignedUrl} target="_blank">
                                <div className="">
                                  <img src={pdfIcon} width={50} />
                                </div>
                              </a>
                            ) : (
                              <div className="">
                                <img src={pdfIcon} width={50} />
                              </div>
                            )}

                            <div className="docFileName">{item?.name}</div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                  {/* Doc Col */}
                </Row>
              </Row>
            )}
            {/* Trust Images */}
            {/* Trust Password Container */}
            {/* <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existLabel">
                  CHANGE PASSWORD
                  <hr />
                </div>
              </Col>
              <Row>
                <Col lg={4}>
                  <label>
                    <Trans i18nKey={"user_password_old"} />
                    {`*`}
                  </label>
                  <InputPasswordToggle
                    className="input-group-merge login-password"
                    name="oldPassword"
                    inputClassName=""
                    id="login-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    iconClassName="d-none"
                    hideIcon={
                      <img
                        className="signInIconsIserAdminPassword"
                        src={passwordEyeIcon}
                      />
                    }
                    showIcon={
                      <img
                        className="signInIconsIserAdminPassword"
                        src={passwordEyeIcon}
                      />
                    }
                  />
                </Col>
                <Col lg={4}>
                  <label>
                    <Trans i18nKey={"user_password_new"} />
                    {`*`}
                  </label>
                  <InputPasswordToggle
                    className="input-group-merge login-password"
                    name="newPassword"
                    inputClassName=""
                    id="login-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    iconClassName="d-none"
                    hideIcon={
                      <img
                        className="signInIconsIserAdminPassword"
                        src={passwordEyeIcon}
                      />
                    }
                    showIcon={
                      <img
                        className="signInIconsIserAdminPassword"
                        src={passwordEyeIcon}
                      />
                    }
                  />
                </Col>
                <Col lg={4}>
                  <label>
                    <Trans i18nKey={"user_password_confirm"} />
                    {`*`}
                  </label>
                  <InputPasswordToggle
                    className="input-group-merge login-password"
                    name="confirmPassword"
                    inputClassName=""
                    id="login-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    iconClassName="d-none"
                    hideIcon={
                      <img
                        className="signInIconsIserAdminPassword"
                        src={passwordEyeIcon}
                      />
                    }
                    showIcon={
                      <img
                        className="signInIconsIserAdminPassword"
                        src={passwordEyeIcon}
                      />
                    }
                  />
                </Col>
              </Row>
            </Row> */}
            {/* Trust Password Container */}

            <div className="btn-Published d-flex justify-content-center">
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
                  disabled={imageSpinner}
                  color="primary"
                  className="addAction-btn"
                  type="submit"
                >
                  <span>
                    <Trans i18nKey={buttonLabel} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        isOpen={modal}
        toggle={toggle}
        onClosed={() => setFacilityEditData(null)}
      >
        {/* <ModalHeader toggle={toggle}>Modal title</ModalHeader> */}
        <ModalBody>
          <div className="profileformwrapper">
            <Formik
              initialValues={facilityIntialValues}
              onSubmit={(values) => {
                if (facilityEditData?.type === "edit") {
                  facilityFormData.splice(facilityEditData?.index, 1, values);
                } else {
                  setFacilityFormData([...facilityFormData, values]);
                  formRef?.current?.setFieldValue("trustFacilities", [
                    ...formRef?.current?.values?.trustFacilities,
                    values,
                  ]);
                }

                toggle();
                setFacilityEditData(null);
              }}
              validationSchema={facilitiesValidation}
            >
              {(formik) => {
                return (
                  <Form>
                    <Row>
                      <Col md={12} className="mb-1">
                        <CustomTextField
                          label="Facility Name"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 30))
                          }
                          placeholder="Enter name"
                          name="name"
                        />
                      </Col>
                      <Col md={12}>
                        <label>Upload Image</label>
                        <div className="d-flex justify-content-between">
                          <input
                            ref={uploadeFacility}
                            type={"file"}
                            // label={t("apna_mandir_upload_background")}
                            disabled={AddLanguage}
                            name="imageName"
                            accept="image/*"
                            // placeholder={t("apna_mandir_upload_background_here")}
                            onChange={(e) => {
                              if (e.target.files[0]?.type?.includes("svg")) {
                                toast.error("File type SVG is not supported.");
                                formik?.setFieldValue("imageName", "");
                              } else {
                                handleUpload(
                                  e.target.files[0],
                                  "facility",
                                  formik
                                );
                              }
                            }}
                          />
                          {documentSpinner ? (
                            <Spinner color="primary" />
                          ) : (
                            <Button
                              className="upload_btn"
                              color="primary"
                              onClick={() => uploadeFacility.current.click()}
                            >
                              Browse
                            </Button>
                          )}
                        </div>
                      </Col>
                      <Col
                        xs={12}
                        className={
                          facilityEditData?.type === "edit" &&
                          formik.values.imageName !== ""
                            ? "d-block"
                            : "d-none"
                        }
                      >
                        <div className="d-flex align-items-center ">
                          <div className="currentFile me-1">
                            Current File : {formik.values.imageName}
                          </div>
                          {facilityEditData?.type === "edit" &&
                            !AddLanguage && (
                              <div
                                onClick={() => {
                                  formik.setFieldValue("imageName", "");
                                  uploadeFacility.current.value = "";
                                }}
                                className="cursor-pointer mt-1"
                              >
                                <X color="#ff8744" stroke-width="3" />
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col xs={12}>
                        <TextArea
                          label="Description"
                          name="description"
                          rows="4"
                          placeholder="Enter description"
                          className="text-area form-control"
                        />
                      </Col>
                      <Col sm={12} md={8}>
                        <Row>
                          <Col sm={6}>
                            <label>
                              <Trans i18nKey={"start_Time"} />
                            </label>
                            <TimePicker
                              onChange={(e) => {
                                handleTimeChange(e);
                                formik.setFieldValue("startTime", e);
                              }}
                              name="startTime"
                              value={selectedTimeStart}
                              disableClock={true}
                              clearIcon={null}
                              format="HH:mm"
                              placeholder="HH:mm"
                            />
                            {/* {formik.errors.startTime &&
                              formik.touched.startTime && (
                                <div
                                  style={{
                                    height: "20px",
                                    font: "normal normal bold 11px/33px Noto Sans",
                                  }}
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
                              )} */}
                          </Col>
                          <Col sm={6}>
                            <label>
                              <Trans i18nKey={"end_Time"} />
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
                            {/* {formik.errors.endTime &&
                              formik.touched.endTime && (
                                <div
                                  style={{
                                    height: "20px",
                                    font: "normal normal bold 11px/33px Noto Sans",
                                  }}
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
                              )} */}
                          </Col>
                          {/* {formik?.values?.startTime ===
                            formik?.values?.endTime &&
                          formik?.values?.startTime !== "" &&
                          formik?.values?.endTime !== "" ? (
                            <div
                              className="text-danger"
                              style={{
                                height: "20px",
                                font: "normal normal bold 11px/20px Noto Sans",
                              }}
                            >
                              <Trans i18nKey={"same_time"} />
                            </div>
                          ) : selectedTimeStart > selectedTimeEnd &&
                            formik?.values?.endTime !== "" ? (
                            <div
                              className="text-danger"
                              style={{
                                height: "20px",
                                font: "normal normal bold 11px/20px Noto Sans",
                              }}
                            >
                              <Trans i18nKey={"end_time_less"} />
                            </div>
                          ) : (
                            ""
                          )} */}
                        </Row>
                      </Col>
                      <div className="mt-3">
                        <Button
                          className="bg_submit"
                          color="primary"
                          type="submit"
                          disabled={
                            documentSpinner ||
                            (selectedTimeStart !== "" &&
                              selectedTimeEnd !== "" &&
                              selectedTimeStart === selectedTimeEnd) ||
                            selectedTimeStart > selectedTimeEnd
                          }
                        >
                          Add Facility
                        </Button>
                      </div>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
