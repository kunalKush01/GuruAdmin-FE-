import InputPasswordToggle from "@components/input-password-toggle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Storage } from "aws-amplify";
import { Form, Formik } from "formik";
import React, { useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus } from "react-feather";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { getAllCityState, getAllTrustType } from "../../api/profileApi";
import defaultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import { handleProfileUpdate } from "../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { TextArea } from "../partials/CustomTextArea";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";
import pdfIcon from "../../assets/images/icons/iconPDF.svg";

const ProfileFormWaraper = styled.div`
  .existlabel {
    margin-bottom: 10px;
    font: normal normal bold 15px/33px Noto Sans;
  }
  .FormikWraper {
    padding: 40px;
  }
  .Upload-btn {
    padding: 8px 32px;
    font: normal normal bold 15px/20px noto sans;
  }
  .thumbnail_image {
    cursor: pointer;
  }
  .imagesBox {
    margin: 10px;
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/5px noto sans;
  }
  .facility_button {
    width: 60%;
    /* height: 170px; */
    border: 1px solid #9c9c9c;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    padding: 2rem 2rem;
  }
  .facility_button svg {
    width: 100px;
    height: 100px;
    color: #9c9c9c !important;
  }
  .facility_add {
    font: normal normal 800 13px/45px Noto Sans;
    /* color: #583703; */
    text-decoration: none;
  }
  .heading_div hr {
    border: 3px solid #583703;
    opacity: 1;
    margin: 0;
    border-radius: 10px;
  }

  /* map css */
  .css-yk16xz-control {
    border: none;
    background-color: #fff7e8 !important;
    ::focus {
      background-color: #fff7e8 !important;
    }
  }
  .css-1pahdxg-control {
    border: none;
    background-color: #fff7e8 !important;
    box-shadow: none;
    :hover {
      border: none !important;
    }
  }
  .css-1wa3eu0-placeholder {
    display: none;
  }
  .css-1wy0on6 {
    display: none;
  }
  label {
    /* margin-bottom: 0px; */
    font: normal normal bold 15px/33px Noto Sans;
  }
  input {
    color: #583703 !important;
    border: none !important;
    height: 36px;
    width: 100%;
    padding-top: 9px;
    padding-left: 5px;
    /* text-align: center; */
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
  }
  input[type="file"]::file-selector-button {
    display: none;
  }
  /* PAssword  */
  .input-group-merge {
    background-color: #fff7e8 !important;
  }
  .login-password > input {
    color: #583703 !important;
    padding-left: 2px;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 20px;
    ::placeholder {
      color: transparent;
    }
  }
  .signInIconsIserAdminPassword {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    cursor: pointer;
  }
  .input-group-text {
    background-color: #fff7e8 !important;
    border-bottom: 0 !important;
  }
  .trust_img {
    overflow: hidden;
    height: 163px;
  }
  .trust_img img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
  }
  .pdfDiv {
    width: 18%;
    text-align: center;
    font: normal normal bold 13px/20px Noto Sans;
  }
`;

export default function ProfileForm({
  handleSubmit,
  vailidationSchema,
  buttonLabel,
  editImage,
  defaultImages,
  initialValues,
  editProfile,
  profileImageName,
  showTimeInput,
  selectEventDisabled,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["Trust"]);
        setLoading(false);
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

  const facilityData = useSelector(
    (state) => state?.auth?.trustDetail?.trustFacilities
  );
  console.log("facilityData", facilityData);
  // City State
  const loadStateQuery = useQuery(["state"], () => getAllCityState());

  const loadStates = useMemo(
    () => loadStateQuery?.data?.results ?? [],
    [loadStateQuery?.data?.results]
  );
  const [cityLoadOption, setCityLoadOption] = useState([]);

  // doc upload
  const [files, setFiles] = useState([]);
  const [deletedDocuments, setDeletedDocuments] = useState([]);
  console.log("deletedDocuments", deletedDocuments);
  const handleUpload = (acceptedFiles) => {
    Storage.put(`temp/${randomNumber}_${acceptedFiles?.name}`, acceptedFiles, {
      contentType: acceptedFiles?.type,
    })
      .then((res) => {
        const uploadedDocumentName = res.key.split("temp/")[1];
        console.log("res");
        setFiles([...files, uploadedDocumentName]);
      })
      .catch((err) => console.log(err));
  };

  const removeFile = (file,formik) => {
    setDeletedDocuments((prev) => [...prev, file]);
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
  return (
    <ProfileFormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          setLoading(true);
          console.log("Trust Add=", e);
          mutation.mutate({
            profilePhoto: editProfile ? profileImageName : e?.profileImage,
            name: e?.name,
            typeId: e?.trustType?.id,
            email: e?.EmailId,
            contact: e?.Contact,
            about: e?.about,
            state: e?.State?.state,
            city: e?.City?.districts,
            place_id: e?.location.value.place_id,
            location: e?.location.label,
            longitude: e?.longitude.toString(),
            latitude: e?.latitude.toString(),
            trustFacilities: facilityData,
            images: e?.images,
            removedImages: deletedImages,
            removedDocuments: deletedDocuments,
            documents: e?.documents,
            oldPassword: e?.oldPassword,
            newPassword: e?.newPassword,
            confirmPassword: e?.confirmPassword,
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            {/* About Trust Container */}
            <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existlabel">
                  ABOUT TRUST
                  <hr />
                </div>
              </Col>
              <Row className="">
                <Col xs={1} className="me-4">
                  <div className="d-flex mt-1">
                    <ImageUpload
                      bg_plus={defaultAvtar}
                      profileImage
                      editTrue="edit"
                      editedFileNameInitialValue={
                        formik.values.profileImage
                          ? formik.values.profileImage
                          : null
                      }
                      randomNumber={randomNumber}
                      fileName={(file, type) => {
                        formik.setFieldValue(
                          "profileImage",
                          `${randomNumber}_${file}`
                        );
                        formik.setFieldValue("type", type);
                        profileImageName = `${randomNumber}_${file}`;
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("profileImage", "");
                        profileImageName = "";
                      }}
                    />
                  </div>
                </Col>
                <Col xs={10} className="">
                  <Row>
                    <Col xs={6} lg={4} className="">
                      <CustomTextField
                        label={t("userProfile_name")}
                        name="name"
                        autoFocus
                      />
                    </Col>
                    <Col xs={6} lg={4} className="">
                      <FormikCustomReactSelect
                        labelName={t("trust_trustType")}
                        name={"trustType"}
                        labelKey={"name"}
                        valueKey="id"
                        loadOptions={allTrustTypes?.data?.results}
                        defaultValue={formik?.values?.trustType}
                        width={"100"}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} lg={4} className="">
                      <CustomTextField
                        label={t("userProfile_email_id")}
                        name="EmailId"
                      />
                    </Col>
                    <Col xs={6} lg={4} className="">
                      <CustomTextField
                        label={t("userProfile_phone_number")}
                        name="Contact"
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="">
                <Col>
                  <TextArea
                    label="About Trust"
                    name="about"
                    rows="4"
                    placeholder="Enter about trust "
                    className="text-area form-control"
                  />
                </Col>
              </Row>
            </Row>
            {/* About Trust Container */}
            {/* Trust Location Container  */}
            <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existlabel">
                  TRUST LOCATION
                  <hr />
                </div>
              </Col>
              <Row>
                <Col md={4}>
                  <FormikCustomReactSelect
                    labelName={"State"}
                    loadOptions={loadStates?.map((item) => {
                      return {
                        ...item,
                        state: ConverFirstLatterToCapital(item?.state),
                      };
                    })}
                    name={"state"}
                    defaultValue={
                      formik.values?.state
                        ? { state: formik.values?.state }
                        : ""
                    }
                    labelKey={"state"}
                    valueKey={"state"}
                    width={"100"}
                    onChange={(data) => {
                      formik.setFieldValue("state", data);
                      setCityLoadOption(data?.districts);
                    }}
                    disabled={loadStates === 0}
                  />
                </Col>
                <Col md={4}>
                  <FormikCustomReactSelect
                    labelName={"City"}
                    loadOptions={cityLoadOption?.map((item) => {
                      return {
                        ...item,
                        districts: ConverFirstLatterToCapital(item),
                      };
                    })}
                    name={"city"}
                    defaultValue={
                      formik.values?.city
                        ? { districts: formik.values?.city }
                        : ""
                    }
                    labelKey={"districts"}
                    valueKey={"id"}
                    disabled={cityLoadOption?.length === 0}
                    width
                  />
                </Col>
                <Col md={4}>
                  <label>Location</label>
                  <GooglePlacesAutocomplete
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    selectProps={{
                      value: formik.values.location,
                      onChange: (e) => {
                        // setValue(e);
                        formik.setFieldValue("location", e);
                        geocodeByAddress(e.label)
                          .then((results) => getLatLng(results[0]))
                          .then(({ lat, lng }) => {
                            formik.setFieldValue("longitude", lng);
                            formik.setFieldValue("latitude", lat);
                          });
                      },
                      styles: {
                        input: (provided) => ({
                          ...provided,
                          color: "#583703 !important",
                          font: "normal normal normal 13px/20px Noto Sans",
                          borderRadius: "20px",
                        }),
                        option: (provided) => ({
                          ...provided,
                          font: "normal normal normal 13px/20px Noto Sans",
                          color: "#583703 !important",
                          background: " #fff7e8",
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "#FF8744",
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "#583703 !important",
                          font: "normal normal normal 13px/20px Noto Sans",
                        }),
                      },
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <CustomTextField
                    label="Longitude"
                    name="longitude"
                    type="text"
                    disabled
                  />
                </Col>
                <Col sm={4}>
                  <CustomTextField
                    label="Latitude"
                    name="latitude"
                    type="text"
                    disabled
                  />
                </Col>
              </Row>
            </Row>
            {/* Trust Location Container  */}
            {/* Trust Facilities */}
            <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existlabel">
                  TRUST FACILITIES
                  <hr />
                </div>
              </Col>
              <Row>
                <Col xs={12}>
                  <div className="existlabel  ">
                    <Trans i18nKey={"userProfile_facilities"} />
                  </div>
                </Col>
                {formik?.values?.trustFacilities?.map((item, idx) => {
                  return (
                    <Col lg={3} md={4} sm={6} key={idx}>
                      <div className="">
                        <div className="trust_img">
                          <img
                            src={item?.facilityImagePreview?.preview}
                            alt=""
                          />
                        </div>
                        <div className="py-1">
                          <div className="temple_name">{item?.name}</div>
                          <div className="temple_time">
                            Timings : {item?.startTime} to {item?.endTime}
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
                <Col lg={3} md={4} sm={6}>
                  <div
                    className=""
                    onClick={() => {
                      history.push("/facilities");
                      dispatch(handleProfileUpdate(formik.values));
                    }}
                  >
                    <div>
                      <div className="facility_button">
                        <Plus />
                      </div>
                      <div className="facility_add">+ Add More Facilities</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>
            {/* Trust Facilities */}
            {/* Trust  Images */}
            <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existlabel">
                  TRUST IMAGES AND CERTIFICATES
                  <hr />
                </div>
              </Col>
              <Row>
                {/* Image Col */}
                <Col lg={6}>
                  <Row>
                    <Col>
                      <div className="existlabel">
                        <Trans i18nKey={"images"} />
                      </div>
                      <div>
                        <ImageUpload
                          multiple
                          type={editImage}
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
                              `${randomNumber}_${file}`,
                            ]);
                            formik.setFieldValue("type", type);
                          }}
                          removeFile={(fileName) => {
                            const newFiles = [...formik.values.images];
                            // newFiles.splice(index, 1);
                            const updatedFiles = newFiles.filter(
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
                              <Trans i18nKey={"userProfile_doc_certificate"} />
                            </label>
                          </div>
                          <input
                            ref={uploadDocuments}
                            type={"file"}
                            name="documents"
                            accept=".pdf"
                            onChange={(e) => {
                              handleUpload(e.target.files[0]);
                              // handleUpload(e.target.files[0]).then((e)=>formik.setFieldValue('documents',e.target.files[0].name));
                              formik.setFieldValue("documents", [
                                ...formik.values.documents,
                                `${randomNumber}_${e.target?.files[0]?.name}`,
                              ]);
                            }}
                          />
                        </Col>
                        <Col xs={2} className="pt-1">
                          <Button
                            color="primary"
                            className="addEvent-btn"
                            onClick={() => uploadDocuments.current.click()}
                          >
                            <Trans i18nKey={"browse"} />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {files?.map((item) => (
                      <div className="pdfDiv">
                        <div>
                          <Button
                            onClick={() => {
                              removeFile(item,formik);
                            }}
                          >
                            Remove
                          </Button>
                          <img src={pdfIcon} width={50} />
                        </div>
                        <div className="docFileName">{item}</div>
                      </div>
                    ))}
                  </div>
                </Col>
                {/* Doc Col */}
              </Row>
            </Row>
            {/* Trust Images */}
            {/* Trust Password Container */}
            <Row className="mt-1">
              <Col xs={12}>
                <div className="heading_div existlabel">
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
            </Row>
            {/* Trust Password Container */}

            <div className="btn-Published d-flex justify-content-center mt-3 mb-3">
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
                <Button color="primary" className="addEvent-btn" type="submit">
                  <span>
                    <Trans i18nKey={buttonLabel} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </ProfileFormWaraper>
  );
}
