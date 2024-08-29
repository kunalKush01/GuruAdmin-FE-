import React, { useRef } from "react";
import { X, Clipboard } from "react-feather";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { Table as AntdTable, Button as CustomButton } from "antd";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "antd/dist/reset.css";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function SuspenseImportHistoryView({ isOpen, toggle, details }) {
  const errorTableRef = useRef(null);
  const { t } = useTranslation();

  const copyToClipboard = () => {
    if (errorTableRef.current) {
      const formattedData = flattenedErrorData
        .map(({ line, error }) => `Line ${line}: ${error}`)
        .join("\n");

      const textarea = document.createElement("textarea");
      textarea.value = formattedData;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      alert("Error details copied to clipboard!");
    }
  };

  const errorData = details.lineErrors || [];

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
        {t('suspense_import_result')}
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
        {details && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p>
                <strong>{t('suspense_status')}:</strong>{" "}
                <span
                  style={{
                    color:
                      details.status ==="completed" ? "var(--green)" : "var(--red)",
                  }}
                >
                  {ConverFirstLatterToCapital(details.status)}
                </span>
              </p>
              <p>
                <strong>{t('suspense_success_count')}:</strong>{" "}
                {details.totalRecords
                  ? details.totalRecords -
                    (Array.isArray(details.lineErrors)
                      ? details.lineErrors.length
                      : 0)
                  : 0}
              </p>
              <p>
                <strong>{t('suspense_failed_count')}:</strong>
                {Array.isArray(details.lineErrors)
                  ? details.lineErrors.length
                  : 0}
              </p>

              {errorData.length > 0 && (
                <p className="d-flex align-items-center flex-row">
                  <strong>{t('copyToClipboard')} &nbsp;</strong>
                  <CustomButton
                    type=""
                    icon={<CopyOutlined />}
                    size={30}
                    style={{borderColor:"var(--primary-color)",borderRadius:"4px"}}
                    onClick={copyToClipboard}
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

export default SuspenseImportHistoryView;
