import React, { useRef } from "react";
import { X, Clipboard } from "react-feather";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { Table as AntdTable } from "antd";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "antd/dist/reset.css";

function SuspenseImportHIstoryView({ isOpen, toggle, details }) {
  const errorTableRef = useRef(null);

  // Function to copy error table to clipboard
  const copyToClipboard = () => {
    if (errorTableRef.current) {
      // Format data as text
      const formattedData = flattenedErrorData
        .map(({ line, error }) => `Line ${line}: ${error}`)
        .join("\n");

      // Create a temporary textarea to copy text
      const textarea = document.createElement("textarea");
      textarea.value = formattedData;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      alert("Error details copied to clipboard!");
    }
  };

  // Extract error data
  const errorData = details.lineErrors || [];

  // Flatten errorData for table display
  const flattenedErrorData = errorData.flatMap((lineError) =>
    lineError.errorMsg.map((error) => ({
      line: lineError.line,
      error: error.error,
    }))
  );

  const columns = [
    {
      title: "Line Number",
      dataIndex: "line",
      key: "line",
    },
    {
      title: "Error Message",
      dataIndex: "error",
      key: "error",
    },
  ];

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        Import Results
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
        {/* Display selected record details here */}
        {details && (
          <div>
            {/* Status, Success Count, Failed Count, and Copy to Clipboard */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      details.status === "completed" ? "#24C444" : "#FF0700",
                    font: "normal normal 600 11px/20px Noto Sans",
                  }}
                >
                  {ConverFirstLatterToCapital(details.status)}
                </span>
              </p>
              <p>
                <strong>Success Count:</strong>{" "}
                {details.totalRecords
                  ? details.totalRecords -
                    (Array.isArray(details.lineErrors)
                      ? details.lineErrors.length
                      : 0)
                  : 0}
              </p>
              <p>
                <strong>Failed Count:</strong>
                {Array.isArray(details.lineErrors)
                  ? details.lineErrors.length
                  : 0}
              </p>

              {errorData.length > 0 && (
                <p className="d-flex align-items-center">
                  <strong>Copy to Clipboard:</strong>{" "}
                  <Clipboard
                    size={20}
                    onClick={copyToClipboard}
                    style={{ cursor: "pointer" }}
                  />
                </p>
              )}
            </div>

            {/* Error Table */}
            {errorData.length > 0 && (
              <div>
                <h5>Errors:</h5>
                <AntdTable
                  className="commitmentListTable"
                  columns={columns}
                  dataSource={flattenedErrorData}
                  scroll={{
                    x: 500,
                    y: 400,
                  }}
                  sticky={{
                    offsetHeader: 64,
                  }}
                  ref={errorTableRef}
                  rowKey={(record, index) => index}
                />
              </div>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default SuspenseImportHIstoryView;
