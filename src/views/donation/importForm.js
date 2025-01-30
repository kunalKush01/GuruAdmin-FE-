import React, { useEffect, useState } from "react";
import {
  Button as AntdButton,
  Button,
  Drawer,
  message,
  Select,
  Table,
  Upload,
} from "antd";
import { Form, Formik } from "formik";
import { Button as ReactstrapButton, Col, Row, Spinner } from "reactstrap";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import downloadIcon from "../../assets/images/icons/file-download.svg";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { createImport } from "../../api/suspenseApi";
import { Trans, useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import { importDonationFile } from "../../api/donationApi";
import { useQueryClient } from "@tanstack/react-query";
import { importCommitmentFile } from "../../api/commitmentApi";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { importMemberFile } from "../../api/membershipApi";
import { importMessages } from "../../api/messageApi"; 
function ImportForm({
  onClose,
  open,
  tab,
  setShowHistory,
  setShowSuspenseHistory,
  setShowDonationHistory,
  mappedField,
}) {
  const loggedInUser = useSelector((state) => state.auth.userDetail)
  const { t } = useTranslation();
  const targetFields = [
    t("mobileNum"),
    t("donarName"),
    t("transaction_id"),
    t("transaction_Date"),
    t("bank_narration"),
    t("cheque_no"),
    t("amount"),
    t("mode_of_payment"),
    t("masterCategoryId"),
    t("categoryId"),
  ];

  const messageTargetFields = [
    { label: t("Mobile Number"), value: "mobile" },
    { label: t("Message"), value: "message" },
    { label: t("Variable 1"), value: "var1" },
    { label: t("Variable 2"), value: "var2" },
    { label: t("Variable 3"), value: "var3" },
    { label: t("Variable 4"), value: "var4" },
    { label: t("Variable 5"), value: "var5" },
  ];
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [sourceFields, setSourceFields] = useState([]);
  const [mapping, setMapping] = useState({});
  const [file, setFile] = useState(null);
  useEffect(() => {
    setSourceFields([]);
    setMapping({});
    setFile(null);
  }, [tab]);

  const handleFileUpload = async (file) => {
    const fileName = file.name.toLowerCase();
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        let headers = [];
        if (fileName.endsWith(".csv")) {
          Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            preview: 1,
            complete: (result) => {
              headers = result.meta.fields;
              setSourceFields(headers);
              const initialMapping = {};
              headers.forEach(header => {
                const lowerHeader = header.toLowerCase().trim();
                messageTargetFields.forEach(target => {
                  if (lowerHeader === target.value.toLowerCase()) {
                    initialMapping[target.value] = header;
                  }
                });
              });
              setMapping(initialMapping);
              message.success(`${fileName} file processed successfully`);
            },
            error: (error) => {
              console.error("Error reading CSV file:", error);
              message.error("Error reading CSV file.");
            },
          });
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
          const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
          if (headers && headers.length > 0) {
            setSourceFields(headers);
            setMapping({});
            message.success(`${fileName} file processed successfully`);
          } else {
            message.error(
              `Failed to read headers from ${fileName}. Please check the file.`
            );
          }
        } else {
          message.error(
            "Unsupported file type. Please upload a .csv or .xlsx file."
          );
        }
      } catch (error) {
        console.error("Error processing file:", error);
        message.error("Error processing file.");
      }
    };
    if (file.name.toLowerCase().endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const uploadProps = {
    name: "file",
    accept: ".xlsx,.csv,.xls",
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setFile(file);
        await handleFileUpload(file);
        onSuccess("ok");
      } catch (error) {
        onError(error);
        setFile(null);
      }
    },
    onChange: (info) => {
      if (info.file.status === "done") {
      } else if (info.file.status === "removed") {
        setSourceFields([]);
        setMapping({});
        setFile(null);
      }
    },
  };

  const handleMappingChange = (targetField, sourceField) => {
    const field = messageTargetFields.find(f => f.label === targetField);
    const key = field ? field.value : targetField;
    
    setMapping(prevMapping => ({
      ...prevMapping,
      [key]: sourceField
    }));
  };

  const columns = [
    {
      title: t("target_Fields"),
      dataIndex: "targetField",
      key: "targetField",
      width: 200,
    },
    {
      title: t("source_Fields"),
      dataIndex: "sourceField",
      key: "sourceField",
      width: 200,
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          placeholder={t("select_source_fields")}
          onChange={(value) => handleMappingChange(record.targetField, value)}
          value={mapping[record.targetField]}
        >
          <Select.Option key="" value="">
            {t("select_option")}
          </Select.Option>
          {sourceFields.map((field) => (
            <Select.Option key={field} value={field}>
              {field}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const data = tab === "Message" 
  ? messageTargetFields.map((field) => ({
      key: field.value,
      targetField: field.label,
      sourceField: mapping[field.value],
    }))
  : tab !== "MemberShip"
    ? targetFields.map((field) => ({
        key: field,
        targetField: field,
        sourceField: mapping[field],
      }))
    : mappedField &&
      mappedField.map((field, index) => ({
        key: `${field.value}-${index}`,
        targetField: field.label,
        sourceField: mapping[field.value],
      }));
  const queryClient = useQueryClient();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (tab === "Message") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_type", "Message");
        formData.append("createdBy", loggedInUser ? loggedInUser?.id : "");

        await importMessages(formData);
        message.success(t("messages_imported_successfully"));
        await queryClient.invalidateQueries("messages");
        setShowHistory(true);
      } else if (tab === "Suspense") {
        const payload = {
          targetFields: {
            transactionDate: mapping["Transaction Date"] || "",
            transactionId: mapping["Transaction Id"] || "",
            bankNarration: mapping["Bank Narration"] || "",
            chequeNo: mapping["Cheque No"] || "",
            amount: mapping["Amount"] || "",
            modeOfPayment: mapping["Mode Of Payment"] || "",
            mobileNum: mapping["Mobile No"] || "",
            donarName: mapping["Donar Name"] || "",
            masterCategoryId: mapping["Category"] || "",
            categoryId: mapping["Sub Category"] || "",
          },
          sourceFields: sourceFields,
          file: file,
          upload_type: "Suspense",
          createdBy: loggedInUser && loggedInUser?.id
        };
        await createImport(payload);
        await queryClient.invalidateQueries("suspenseData");
        await queryClient.refetchQueries("suspenseData");
        setShowSuspenseHistory(true);
      } else if (tab == "Donation") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_type", "Donation");
        formData.append("createdBy", loggedInUser ? loggedInUser?.name : "");
        await importDonationFile(formData);
        await queryClient.invalidateQueries("donations");
        await queryClient.refetchQueries("donations");
        setShowDonationHistory(true);
      } else if (tab == "Pledge") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_type", "Pledge");
        formData.append("createdBy", loggedInUser ? loggedInUser?.name : "");
        await importCommitmentFile(formData);
        await queryClient.invalidateQueries("Commitments");
        await queryClient.refetchQueries("Commitments");
        setShowHistory(true);
      } else if (tab == "MemberShip") {
        const targetFields = {};
        mappedField.forEach((field) => {
          targetFields[field.value] = mapping[field.label] || "";
        });

        const payload = {
          targetFields,
          sourceFields: sourceFields,
          createdByUserId: loggedInUser && loggedInUser?.id,
          file: file,
          upload_type: "Membership",
        };
        await importMemberFile(payload);
        await queryClient.invalidateQueries("memberShipListData");
        await queryClient.refetchQueries("memberShipListData");
        setShowHistory(true);
      }

      setSourceFields([]);
      setMapping({});
      setFile(null);
      onClose();
    } catch (error) {
      console.error("Error during import:", error);
      message.error("Error during import.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={t("import_xlsx_csv")}
      onClose={onClose}
      open={open}
      width={tab == "MemberShip" ? 500 : 420}
    >
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <Row>
              {tab && tab === "Donation" && (
                <Col xs={6} sm={12} md={6}>
                  <a href="/sampleFile/donations.csv" download>
                    <Button
                      type=""
                      className="uploadBtn"
                      icon={
                        <img
                          src={downloadIcon}
                          alt="Upload Icon"
                          style={{ width: 16, height: 16 }}
                        />
                      }
                    >
                      {t("download_sample_file")}
                    </Button>
                  </a>
                </Col>
              )}
              {tab && tab === "Pledge" && (
                <Col xs={6} sm={12} md={6}>
                  <a href="/sampleFile/commitments.csv" download>
                    <Button
                      type=""
                      className="uploadBtn"
                      icon={
                        <img
                          src={downloadIcon}
                          alt="Upload Icon"
                          style={{ width: 16, height: 16 }}
                        />
                      }
                    >
                      {t("download_sample_file")}
                    </Button>
                  </a>
                </Col>
              )}
              {tab && tab === "Message" && (
                <Col xs={6} sm={12} md={6}>
                  <a href="/sampleFile/messages.csv" download>
                    <Button
                      type=""
                      className="uploadBtn"
                      icon={
                        <img
                          src={downloadIcon}
                          alt="Upload Icon"
                          style={{ width: 16, height: 16 }}
                        />
                      }
                    >
                      {t("download_sample_file")}
                    </Button>
                  </a>
                </Col>
              )}
              <Col
                xs={6}
                sm={12}
                md={tab == "Suspense" || tab == "MemberShip" ? 12 : 6}
              >
                <Upload
                  {...uploadProps}
                  maxCount={1}
                  className="uploadIdCard"
                  showUploadList={file == null ? false : true}
                >
                  <AntdButton
                    className="uploadBtn"
                    icon={
                      <img
                        src={uploadIcon}
                        alt="Upload Icon"
                        style={{ width: 16, height: 16 }}
                      />
                    }
                  >
                    {t("click_to_upload")}
                  </AntdButton>
                </Upload>
              </Col>
              {tab && (tab == "Suspense" || tab == "MemberShip") && (
                <Col xs={12} sm={12} md={12} className="mt-1">
                  <span style={{ color: "var(--font-color)" }}>
                    <Trans i18nKey={"map_fields"} />
                  </span>
                  <div className="card mb-1">
                    <div className="card-body">
                      <Row>
                        <Col xs={12} sm={12} md={12}>
                          <Table
                            className="importTable"
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
            <div className="d-flex justify-content-center">
              <ReactstrapButton
                color="primary"
                className="addAction-btn mt-2"
                type="submit"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : <span>{t("import")}</span>}
              </ReactstrapButton>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}

export default ImportForm;