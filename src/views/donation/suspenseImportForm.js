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

function SuspenseImportForm({ onClose, open }) {
  const targetFields = [
    "Transaction Id",
    "Transaction Date",
    "Bank Narration",
    "Cheque No",
    "Amount",
    "Mode Of Payment",
  ];

  const [loading, setLoading] = useState(false);
  const [sourceFields, setSourceFields] = useState([]);
  const [mapping, setMapping] = useState({});
  const [fileData, setFileData] = useState(null);
  const [fileUrl, setFileUrl] = useState(""); // State to hold the file URL

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
            complete: (result) => {
              headers = result.meta.fields;
              setSourceFields(headers);
              setFileData(data);
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
          setSourceFields(headers);
          setFileData(data);
          setMapping({});
          message.success(`${fileName} file processed successfully`);
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
    reader.readAsArrayBuffer(file);
  };

  const uploadProps = {
    name: "file",
    accept: ".xlsx,.csv,.xls",
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await handleFileUpload(file);
        // Simulate file upload to S3 or another service, and set the file URL
        // Replace the following line with your actual file upload logic
        setFileUrl("url_to_uploaded_file");
        onSuccess("ok");
      } catch (error) {
        onError(error);
      }
    },
    onChange: (info) => {
      if (info.file.status === "done") {
        // File successfully uploaded
      } else if (info.file.status === "removed") {
        // File removed, reset the source fields and mapping
        setSourceFields([]);
        setMapping({});
        setFileData(null);
        setFileUrl(""); // Reset file URL
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
      title: "Target Fields",
      dataIndex: "targetField",
      key: "targetField",
      width: 200,
    },
    {
      title: "Source Fields",
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
  const trustId = localStorage.getItem("trustId");
  console.log(trustId)
  const handleSubmit = async (values) => {
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
        sourceFields, // This should be an array of source field names
        fileUrl, // Use the actual URL of the uploaded file
      };

      console.log(payload);
      // return;
      await createImport(trustId,payload);
      message.success("Import successful");
      onClose(); // Close the drawer on successful import
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
        <Formik
          initialValues={{}} // Define initial values if needed
          onSubmit={handleSubmit}
        >
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
                  <label
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "#533810",
                    }}
                  >
                    Map Fields
                  </label>
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
