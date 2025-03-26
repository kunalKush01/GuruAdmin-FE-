import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Swal from "sweetalert2";
import { X } from "react-feather";
import "../../../assets/scss/common.scss";
import {
  createDonationBoxCustomFields,
  createDonationCustomFields,
  createExpensesCustomFields,
  createPledgeCustomFields,
} from "../../../api/customFieldsApi";
import {
  getAllMastersWithoutPagination,
  getMasterDataById,
} from "../../../api/masterApi";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const AddCustomField = ({ activeTab, trustId, isOpen, toggle, onSuccess }) => {
  const { t } = useTranslation();
  const initialFormData = {
    fieldName: "",
    fieldType: "String",
    isRequired: false,
    value: "",
    master: "",
    masterData: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [validationMessages, setValidationMessages] = useState({});
  const masterQuery = useQuery(
    ["Masters"],
    () => getAllMastersWithoutPagination(),
    {
      keepPreviousData: true,
    }
  );

  const masterItem = useMemo(
    () => masterQuery?.data?.masterNames ?? [],
    [masterQuery]
  );

  const masterDataQuery = useQuery(
    ["Masters-Data", formData.master !== "" ? formData.master : ""],
    () => getMasterDataById(formData.master !== "" ? formData.master : ""),

    {
      keepPreviousData: true,
    }
  );

  const masterDataItem = useMemo(
    () => masterDataQuery?.data ?? [],
    [masterDataQuery, activeTab]
  );
  useEffect(() => {
    setFormData(initialFormData);
    setValidationMessages({});
  }, [activeTab]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleInputBlur = (field) => {
    if (field.isRequired && !formData[field.name]) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field.name]: "Required",
      }));
    } else {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field.name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const messages = {};

    if (formData.isRequired && !formData.fieldName) {
      messages.fieldName = "Required";
      valid = false;
    }

    setValidationMessages(messages);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      console.error("Form validation failed.");
      return;
    }

    const payload = {
      trustId,
      masterId: formData.master,
      masterSchema: formData.masterData,
      customFields: [
        {
          fieldName: formData.fieldName,
          fieldType: formData.fieldType,
          isRequired: formData.isRequired,
          value: formData.value,
        },
      ],
    };
    if (activeTab == "Donation") {
      createDonationCustomFields(payload)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Custom field added successfully.",
          });
          onSuccess(true);
          setFormData(initialFormData);
          toggle();
        })
        .catch((error) => {
          onSuccess(false);
          console.error("Error adding custom field:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add custom field.",
          });
        });
    } else if (activeTab == "Pledge") {
      createPledgeCustomFields(payload)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Custom field added successfully.",
          });
          onSuccess(true);
          setFormData(initialFormData);
          toggle();
        })
        .catch((error) => {
          onSuccess(false);
          console.error("Error adding custom field:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add custom field.",
          });
        });
    } else if (activeTab == "Donation Box") {
      createDonationBoxCustomFields(payload)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Custom field added successfully.",
          });
          onSuccess(true);
          setFormData(initialFormData);
          toggle();
        })
        .catch((error) => {
          onSuccess(false);
          console.error("Error adding custom field:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add custom field.",
          });
        });
    } else if (activeTab == "Expenses") {
      createExpensesCustomFields(payload)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Custom field added successfully.",
          });
          onSuccess(true);
          setFormData(initialFormData);
          toggle();
        })
        .catch((error) => {
          onSuccess(false);
          console.error("Error adding custom field:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add custom field.",
          });
        });
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered id="addCustomFieldForm">
      <ModalHeader toggle={toggle}>
        {t("Add_New_Custom_Field")}{" "}
        <div>
          <X
            className="cancleIcon"
            onClick={toggle}
            size={15}
            strokeWidth={4}
            style={{ marginRight: "5px" }}
          />
        </div>
      </ModalHeader>
      <ModalBody>
        <Form>
          <div className="row">
            <FormGroup className="col-md-12">
              <Label
                for="fieldName"
                style={{ fontSize: "13px", fontWeight: "500" }}
              >
                {t("Field_Name")}
                <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                placeholder={t("enter_text_here")}
                name="fieldName"
                id="fieldName"
                value={formData.fieldName}
                onChange={handleChange}
                onBlur={() =>
                  handleInputBlur({ name: "fieldName", isRequired: true })
                }
              />
              {validationMessages.fieldName && (
                <div style={{ color: "#ff8744", fontSize: "12px" }}>
                  {validationMessages.fieldName}
                </div>
              )}
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup className="col-md-6 col-sm-12">
              <Label
                for="fieldType"
                style={{ fontSize: "13px", fontWeight: "500" }}
              >
                {t("Field_Type")}
              </Label>
              <Input
                type="select"
                name="fieldType"
                id="fieldType"
                value={formData.fieldType}
                onChange={handleChange}
              >
                <option value="String">{t("String")}</option>
                <option value="Number">{t("Number")}</option>
                <option value="Boolean">{t("Boolean")}</option>
                <option value="Date">{t("date")}</option>
              </Input>
            </FormGroup>
            <FormGroup className="col-md-6 col-sm-12">
              <Label
                for="value"
                style={{ fontSize: "13px", fontWeight: "500" }}
              >
                {t("Value")}
              </Label>
              {formData.fieldType === "Boolean" ? (
                <Input
                  type="select"
                  name="value"
                  id="value"
                  value={formData.value}
                  onChange={handleChange}
                >
                  <option value="true">{t("True")}</option>
                  <option value="false">{t("False")}</option>
                </Input>
              ) : (
                <Input
                  type="text"
                  name="value"
                  id="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder={t("enter_text_here")}
                />
              )}
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup className="col-md-6 col-sm-12">
              <Label
                for="master"
                style={{ fontSize: "13px", fontWeight: "500" }}
              >
                {t("Master_List")}
              </Label>
              <Input
                type="select"
                name="master"
                id="master"
                value={formData.master}
                onChange={handleChange}
              >
                <option value="">{t("select_option")}</option>
                {masterItem &&
                  masterItem.map((item) => {
                    return <option value={item.id}>{item.name}</option>;
                  })}
              </Input>
            </FormGroup>
            <FormGroup className="col-md-6 col-sm-12">
              <Label
                for="masterData"
                style={{ fontSize: "13px", fontWeight: "500" }}
              >
                {t("Master_Data_List")}
              </Label>
              <Input
                type="select"
                name="masterData"
                id="masterData"
                value={formData.masterData}
                onChange={handleChange}
              >
                <option value="">{t("select_option")}</option>
                {masterItem &&
                  masterDataItem &&
                  Object.values(masterDataItem?.schema || {}).map(
                    (item, index) => {
                      return (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      );
                    }
                  )}
              </Input>
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup className="col-md-6 col-sm-12">
              <Label
                for="isRequired"
                style={{ fontSize: "13px", fontWeight: "500" }}
              >
                {t("Is_Required")}
              </Label>
              <Input
                type="checkbox"
                name="isRequired"
                id="isRequired"
                checked={formData.isRequired}
                onChange={handleChange}
              />
            </FormGroup>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button id="submit" onClick={handleSubmit}>
          {t("Submit")}
        </Button>
        <Button
          id="cancel"
          onClick={() => {
            toggle();
            setValidationMessages({});
          }}
        >
          {t("Cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddCustomField;
