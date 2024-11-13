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
function SuspenseImportForm({ onClose, open, tab, setShowHistory }) {
  const { t } = useTranslation();
  const targetFields = [
    t('transaction_id'),
    t('transaction_Date'),
    t('bank_narration'),
    t('cheque_no'),
    t('amount'),
    t('mode_of_payment')
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
              setMapping({});
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
    setMapping({
      ...mapping,
      [targetField]: sourceField,
    });
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
          placeholder={t('select_source_fields')}
          onChange={(value) => handleMappingChange(record.targetField, value)}
          value={mapping[record.targetField]}
        >
          <Select.Option key="" value="">
            {t('select_option')}
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

  const data = targetFields.map((field) => ({
    key: field,
    targetField: field,
    sourceField: mapping[field],
  }));
  const queryClient = useQueryClient();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (tab === "Suspense") {
        const payload = {
          targetFields: {
            transactionDate: mapping["Transaction Date"] || "",
            transactionId: mapping["Transaction Id"] || "",
            bankNarration: mapping["Bank Narration"] || "",
            chequeNo: mapping["Cheque No"] || "",
            amount: mapping["Amount"] || "",
            modeOfPayment: mapping["Mode Of Payment"] || "",
          },
          sourceFields: sourceFields,
          file: file,
          upload_type: "Suspense",
        };
        await createImport(payload);
        await queryClient.invalidateQueries("suspenseData");
        await queryClient.refetchQueries("suspenseData");
        setShowHistory(true);
      } else if (tab == "Donation") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_type", "Donation");
        await importDonationFile(formData);
        await queryClient.invalidateQueries("donations");
        await queryClient.refetchQueries("donations");
      } else if (tab == "Pledge") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_type", "Pledge");
        await importCommitmentFile(formData);
        await queryClient.invalidateQueries("Commitments");
        await queryClient.refetchQueries("Commitments");
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
    <Drawer title={t("import_xlsx_csv")} onClose={onClose} open={open} width={420}>
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
              <Col xs={6} sm={12} md={tab == "Suspense" ? 12 : 6}>
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
                    {t('click_to_upload')}
                  </AntdButton>
                </Upload>
              </Col>
              {tab && tab == "Suspense" && (
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
                {loading ? <Spinner size="sm" /> : <span>{t('import')}</span>}
              </ReactstrapButton>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}

export default SuspenseImportForm;
