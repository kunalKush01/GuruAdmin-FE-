import React, { useState } from "react";
import {
  Button as AntdButton,
  Drawer,
  message,
  Select,
  Table,
  Upload,
} from "antd";
import { Form, Formik } from "formik";
import { Button as ReactstrapButton, Col, Row, Spinner } from "reactstrap";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { createImport } from "../../api/suspenseApi";
import { Trans, useTranslation } from "react-i18next";

function SuspenseImportForm({ onClose, open }) {
  const targetFields = [
    "Transaction Id",
    "Transaction Date",
    "Bank Narration",
    "Cheque No",
    "Amount",
    "Mode Of Payment",
  ];
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [sourceFields, setSourceFields] = useState([]);
  const [mapping, setMapping] = useState({});
  const [file, setFile] = useState(null);

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
          placeholder="Select Source Field"
          onChange={(value) => handleMappingChange(record.targetField, value)}
          value={mapping[record.targetField]}
        >
          <Select.Option key="" value="">
            Select Option
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
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
      };
      await createImport(payload);
      message.success("Import successful");
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
    <Drawer title="Import XLSX/CSV" onClose={onClose} open={open} size="medium">
      <div className="formikwrapper">
        <Formik initialValues={{}} onSubmit={handleSubmit}>
          {() => (
            <Form>
              <Row>
                <Col xs={12} sm={12} md={12}>
                  <Upload {...uploadProps} maxCount={1}>
                    <AntdButton icon={<UploadOutlined />}>
                      Click to Upload
                    </AntdButton>
                  </Upload>
                </Col>
                <Col xs={12} sm={12} md={12} className="mt-1">
                  <Trans i18nKey={"map_fields"} />
                  <div className="card mb-1">
                    <div className="card-body">
                      <Row>
                        <Col xs={12} sm={12} md={12}>
                          <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-center">
                <ReactstrapButton
                  color="primary"
                  className="addAction-btn mt-3"
                  type="submit"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : <span>Import</span>}
                </ReactstrapButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
}

export default SuspenseImportForm;
