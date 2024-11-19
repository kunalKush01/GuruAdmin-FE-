import React, { useEffect, useState } from "react";
import { findAllUsersByNumber } from "../../api/findUser";
import AddUserDrawerForm from "../donation/addUserDrawerForm";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { createSubscribedUser } from "../../api/subscribedUser";
import * as Yup from "yup";

function GuestDetailsSection({ formik, ...props }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [phoneNumber, setPhoneNumber] = useState(getCommitmentMobile ?? "");
  const [noUserFound, setNoUserFound] = useState(false);
  const [open, setOpen] = useState(false);
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
    formik.setFieldValue("Mobile", "");
    formik.setFieldValue("countryCode", "");
    formik.setFieldValue("dialCode", "");
    formik.setFieldValue("guestname", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("donarName", "");
    formik.setFieldValue("address", "");
  }, [formik?.values?.SelectedUser]);

  return (
    <div className="guest-payment">
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
                        formik.setFieldValue(
                          "dialCode",
                          country?.dialCode || ""
                        );
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
                        countryCode: "in",
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
                  onInput={(e) =>
                    (e.target.value = e.target.value.slice(0, 30))
                  }
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
                  onInput={(e) =>
                    (e.target.value = e.target.value.slice(0, 30))
                  }
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
                  onInput={(e) =>
                    (e.target.value = e.target.value.slice(0, 30))
                  }
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
    </div>
  );
}

export default GuestDetailsSection;
