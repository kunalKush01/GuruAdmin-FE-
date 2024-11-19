import React, { useEffect, useState } from "react";
import { findAllUsersByNumber } from "../../api/findUser";
import AddUserDrawerForm from "../donation/addUserDrawerForm";
import { Trans, useTranslation } from "react-i18next";
import { createSubscribedUser } from "../../api/subscribedUser";
import * as Yup from "yup";
import { Image, message, Upload } from "antd";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import uploadIc from "../../assets/images/icons/file-upload.svg";
import { Button as AntdButton } from "antd";
import { deleteFile, downloadFile, uploadFile } from "../../api/sharedStorageApi";
import { Col, Row } from "reactstrap";

function GuestDetailsSection({
  formik,
  getCommitmentMobile,
  payDonation,
  countryFlag,
  isEditing,
  ...props
}) {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState(getCommitmentMobile ?? "");
  const [noUserFound, setNoUserFound] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleCreateUser = async (payload) => {
    return createSubscribedUser(payload);
  };
  const handleDataLoad = (val) => {
    setDataLoad(val);
  };
  const schema = Yup.object().shape({
    mobile: Yup.string().required("users_mobile_required"),
    email: Yup.string()
      .email("email_invalid")
      .required("users_email_required")
      .trim(),
    name: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "user_only_letters"
      )
      .required("users_title_required")
      .trim(),
    pincode: Yup.string().when("searchType", {
      is: "isPincode",
      then: Yup.string().max(6, "Pincode not found"),
      otherwise: Yup.string(),
    }),
  });

  useEffect(() => {
    const Mobile = formik?.values?.Mobile?.toString();
    if (Mobile?.length === 10) {
      const results = async () => {
        try {
          const res = await findAllUsersByNumber({
            mobileNumber: Mobile,
          });
          if (res.result) {
            formik.setFieldValue("SelectedUser", res.result);
            setNoUserFound(false);
          } else {
            setNoUserFound(true);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setNoUserFound(true);
        }
      };
      results();
    } else if (Mobile?.length !== 10) {
      formik.setFieldValue("SelectedUser", "");
      setNoUserFound(false);
    }
  }, [formik?.values?.Mobile]);
  console.log(formik?.values?.SelectedUser)
  useEffect(() => {
    const user = formik?.values?.SelectedUser;
    if (user?.id) {
      formik.setFieldValue("Mobile", user?.mobileNumber);
      formik.setFieldValue("countryCode", user?.countryName);
      formik.setFieldValue("dialCode", user?.countryCode);
      formik.setFieldValue("guestname", user?.name);
      formik.setFieldValue("email", user?.email);
      formik.setFieldValue("donarName", user?.name);

      const addressParts = [];
      if (user?.addLine1) addressParts.push(user.addLine1);
      if (user?.addLine2) addressParts.push(user.addLine2);
      if (user?.city) addressParts.push(user.city);
      if (user?.district) addressParts.push(user.district);
      if (user?.state) addressParts.push(user.state);
      if (user?.country) addressParts.push(user.country);
      if (user?.pin) addressParts.push(user.pin);
      if (user?.address) addressParts.push(user.address);

      const fullAddress = addressParts.filter(Boolean).join(", ");
      formik.setFieldValue("address", fullAddress);

      setPhoneNumber(user?.countryCode + user?.mobileNumber);
      return;
    }
  }, [formik?.values?.SelectedUser]);

  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleUpload = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    if (options.event) {
      options.event.preventDefault();
      options.event.stopPropagation();
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await uploadFile(formData);

      if (response?.status && response?.data?.result?.result?.value) {
        onSuccess(response, file);
        message.success(`${file.name} file uploaded successfully.`);
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: URL.createObjectURL(file),
            response: response,
          },
        ]);
        formik.setFieldValue("imagePath", response.data.result.filePath);
      } else {
        throw new Error("Invalid response structure from server");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      onError({ error });
      message.error(
        `${file.name} file upload failed. ${
          error.message || "Please try again."
        }`
      );
    } finally {
      setUploading(false);
    }
  };
  const handleRemove = async (file) => {
    try {
      const filePath =
        file.response?.data?.result?.result?.value || formik.values.imagePath;
      if (filePath) {
        await deleteFile(filePath);
        message.success("File removed successfully");
      }
      setFileList([]);
      formik.setFieldValue("imagePath", "");
    } catch (error) {
      console.error("Error removing file:", error);
      message.error("Failed to remove file");
    }
  };

  const handleDownload = async () => {
    try {
      if (formik.values.imagePath) {
        const blob = await downloadFile(formik.values.imagePath);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = formik.values.imagePath.split("/").pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("Failed to download file");
    }
  };
  const [previewOpen, setPreviewOpen] = useState(false);

  const uploadProps = {
    name: "file",
    customRequest: handleUpload,
    onRemove: handleRemove,
    fileList: fileList,
    accept: "image/*",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const idTypeOptions = [
    { value: "aadhar", label: "Aadhar Card" },
    { value: "pan", label: "PAN Card" },
    { value: "voter", label: "Voter ID Card" },
    { value: "driving", label: "Driving License" },
    { value: "other", label: "Other" },
  ];
  const handleInitialFile = async () => {
    try {
      // Download the file
      const blob = await downloadFile(formik.values.imagePath);

      // Create a File object from the blob
      const fileName = formik.values.imagePath.split("/").pop();
      const file = new File([blob], fileName, { type: blob.type });

      // Create a dummy response object to match Upload component's expectations
      const dummyResponse = {
        data: {
          result: {
            filePath: formik.values.imagePath,
            result: { value: formik.values.imagePath },
          },
        },
      };

      setFileList([
        {
          uid: "-1",
          name: fileName,
          status: "done",
          url: URL.createObjectURL(blob),
          response: dummyResponse,
        },
      ]);
    } catch (error) {
      console.error("Error loading initial file:", error);
      message.error("Failed to load ID card image");
    }
  };

  useEffect(() => {
    if (isEditing && formik.values.imagePath) {
      handleInitialFile();
    }
  }, [isEditing, formik.values.imagePath]);
  return (
    <div className="guest-container-add-booking">
      <div className="guest-header">
        <div className="guest-title">Guest Details</div>
      </div>
      <Row className="paddingForm">
        <Col xs={12}>
          <Row>
            <Col
              xs={12}
              sm={6}
              lg={4}
              md={6}
              className="pb-1 custom-margin-top"
            >
              <Row>
                <Col xs={12} className="align-self-center">
                  <CustomCountryMobileNumberField
                    value={`${formik.values.SelectedUser?.countryCode || ""}${
                      formik.values.SelectedUser?.mobileNumber || ""
                    }`}
                    disabled={payDonation}
                    defaultCountry={countryFlag}
                    label={t("dashboard_Recent_DonorNumber")}
                    placeholder={t("placeHolder_mobile_number")}
                    onChange={(phone, country) => {
                      setPhoneNumber(phone);
                      formik.setFieldValue(
                        "countryCode",
                        country?.countryCode || ""
                      );
                      formik.setFieldValue("dialCode", country?.dialCode || "");
                      if (
                        typeof phone === "string" &&
                        typeof country?.dialCode === "string"
                      ) {
                        formik.setFieldValue(
                          "Mobile",
                          phone.replace(country.dialCode, "")
                        );
                      } else {
                        formik.setFieldValue("Mobile", "");
                      }
                    }}
                    required
                    onBlur={formik.handleBlur}
                  />
                  {noUserFound && (
                    <div className="addUser">
                      {" "}
                      <Trans i18nKey={"add_user_donation"} />{" "}
                      <span className="cursor-pointer" onClick={showDrawer}>
                        <Trans i18nKey={"add_user"} />
                      </span>
                    </div>
                  )}
                  <AddUserDrawerForm
                    onClose={onClose}
                    open={open}
                    handleSubmit={handleCreateUser}
                    addDonationUser
                    initialValues={{
                      name: "",
                      countryCode: "India",
                      dialCode: "91",
                      email: "",
                      pincode: "",
                      searchType: "isPincode",
                      panNum: "",
                      addLine1: "",
                      addLine2: "",
                      city: "",
                      district: "",
                      state: "",
                      country: "",
                      pin: "",
                    }}
                    validationSchema={schema}
                    buttonName={"add_user"}
                    getNumber={phoneNumber}
                    onSuccess={handleDataLoad}
                  />
                  {formik.errors.Mobile && formik.touched.Mobile && (
                    <div className="text-danger">
                      <Trans i18nKey={formik.errors.Mobile} />
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={4} md={6} className="pb-1">
              <CustomTextField
                required
                label={t("Guest Name")}
                placeholder={t("Guest Name")}
                name="guestname"
                value={formik.values.guestname}
                onChange={formik.handleChange}
                onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
              />
            </Col>
            <Col xs={12} sm={6} lg={4} md={6} className="pb-1">
              <CustomTextField
                label={t("dashboard_Recent_DonorName")}
                placeholder={t("placeHolder_donar_name")}
                name="donarName"
                value={formik.values.donarName}
                onChange={(e) => {
                  formik.setFieldValue(
                    "donarName",
                    e.target.value.slice(0, 30)
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} lg={4} md={6} className="pb-1">
              <CustomTextField
                label={t("Email")}
                placeholder={t("placeHolder_email")}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
              />
            </Col>

            <Col xs={12} sm={6} lg={8} md={8} className="a pb-1">
              <CustomTextField
                type="address"
                label={t("Address")}
                placeholder={t("Address")}
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} lg={4} className="pb-2">
              <FormikCustomReactSelect
                required
                name="idType"
                labelName={t("ID Type")}
                placeholder={t("Id Type")}
                options={idTypeOptions}
                width={"100"}
                value={
                  idTypeOptions.find(
                    (option) => option.value === formik.values.idType
                  ) || null
                }
                onChange={(selectedOption) =>
                  formik.setFieldValue(
                    "idType",
                    selectedOption ? selectedOption.value : ""
                  )
                }
              />
            </Col>
            <Col xs={12} sm={6} lg={4} className="pb-1">
              <CustomTextField
                required
                label={t("Id Number")}
                placeholder={t("Id Number")}
                name="idNumber"
                value={formik.values.idNumber}
                onChange={formik.handleChange}
                onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
              />
            </Col>
            <Col xs={12} sm={6} lg={4} className="pb-1 upload-id">
              <Upload
                name="file"
                className="uploadIdCard"
                listType="picture"
                {...uploadProps}
                style={{ width: "100%" }}
                onPreview={handlePreview}
              >
                <AntdButton
                  icon={
                    <img
                      src={uploadIc}
                      alt="Upload Icon"
                      style={{ width: 16, height: 16 }}
                    />
                  }
                  style={{ width: "100%" }}
                >
                  {t("upload_id_card")}
                </AntdButton>
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default GuestDetailsSection;
