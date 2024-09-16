import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import moment from "moment";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { updateMembersById } from "../../api/membershipApi";
import { useQueryClient } from "@tanstack/react-query";

const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);

function FamilyModalForm({
  isModalVisible,
  setIsModalVisible,
  mode,
  familyInfo,
  memberResultData,
  id,
  currentFamilyInfo,
}) {
  const { t } = useTranslation();
  const { Option } = Select;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const relationOptions = [
    "Brother",
    "Sister",
    "Wife",
    "Husband",
    "Father",
    "Mother",
  ];

  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  // const customRequest = ({ file, onSuccess, onError }) => {
  //   setUploadedFileUrl(file);
  //   setTimeout(() => {
  //     onSuccess("ok");
  //   }, 1000);
  // };

  const customRequest = ({ file, onSuccess, onError }) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const fileDataUrl = reader.result;

      setUploadedFileUrl(fileDataUrl);

      onSuccess(fileDataUrl);
    };

    reader.onerror = () => {
      console.error("Error reading file");
      onError(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  };

  const modalTitle =
    mode === "add" ? t("member_family_form") : t("edit_family_member");

  useEffect(() => {
    if (mode === "edit" && currentFamilyInfo) {
      form.setFieldsValue({
        name: currentFamilyInfo?.name || "",
        dateOfBirth: currentFamilyInfo?.dateOfBirth
          ? moment(currentFamilyInfo?.dateOfBirth, "DD MMM YYYY")
          : null,
        anniversary: currentFamilyInfo?.anniversary
          ? moment(currentFamilyInfo?.anniversary, "DD MMM YYYY")
          : null,
        relation: currentFamilyInfo?.relation || "",
        imageUrl: "",
      });
      setUploadedFileUrl(currentFamilyInfo?.imageUrl || "");
    } else if (mode === "add") {
      form.resetFields();
      setUploadedFileUrl("");
    }
  }, [form, currentFamilyInfo, mode]);

  const handleSubmit = async (values) => {
    const updatedFamilyInfo = {
      name: values.name,
      relation: values.relation,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : null,
      anniversary: values.anniversary
        ? values.anniversary.format("YYYY-MM-DD")
        : null,
      imageUrl: uploadedFileUrl || "",
    };

    if (mode === "edit" && currentFamilyInfo) {
      const updatedFamilyInfoList = familyInfo.map((member) => {
        if (
          member.name === currentFamilyInfo.name &&
          member.relation === currentFamilyInfo.relation
        ) {
          return { ...member, ...updatedFamilyInfo };
        }
        return member;
      });

      const updatedPayload = {
        trustId: memberResultData.trustId,
        userId: memberResultData.userId,
        data: {
          ...memberResultData.data,
          familyInfo: updatedFamilyInfoList,
        },
      };

      await updateMembersById(id, updatedPayload);
      queryClient.invalidateQueries(["memberShipProfileData"]);
      console.log("Updated Payload:", updatedPayload);
    } else {
      const addPayload = {
        trustId: memberResultData.trustId,
        userId: memberResultData.userId,
        data: {
          ...memberResultData.data,
          familyInfo: [...familyInfo, updatedFamilyInfo],
        },
      };

      await updateMembersById(id, addPayload);
      form.resetFields()
      queryClient.invalidateQueries(["memberShipProfileData"]);
    }

    setIsModalVisible(false);
  };

  return (
    <Modal
      title={modalTitle}
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("member_family_name")}
          name="name"
          rules={[{ required: true, message: t("required_family_name") }]}
        >
          <Input placeholder={t("placeHolder_family_name")} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label={t("member_dob")} name="dateOfBirth">
              <CustomDatePickerComponent
                placeholder={t("member_dob")}
                style={{ width: "100%" }}
                format="DD MMM YYYY"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={t("member_anniversary")} name="anniversary">
              <CustomDatePickerComponent
                placeholder={t("member_anniversary")}
                style={{ width: "100%" }}
                format="DD MMM YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("member_family_relation")}
              name="relation"
              rules={[
                { required: true, message: t("required_family_relation") },
              ]}
            >
              <Select placeholder={t("placeHolder_family_relation")}>
                {relationOptions.map((relation) => (
                  <Option key={relation} value={relation}>
                    {relation}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={t("upload_profile_image")} name="imageUrl">
              <Upload
                name="image"
                listType="picture"
                customRequest={customRequest}
                maxCount={1}
              >
                <Button
                  icon={
                    <img
                      src={uploadIcon}
                      alt="Upload Icon"
                      style={{ width: 16, height: 16 }}
                    />
                  }
                  style={{ width: "100%" }}
                  y
                >
                  {t("upload_profile_image")}
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {t("save")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FamilyModalForm;
