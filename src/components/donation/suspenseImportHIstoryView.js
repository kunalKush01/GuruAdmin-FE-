import React, { useRef } from "react";
import { X, Clipboard } from "react-feather";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Table,
} from "reactstrap";
import { ConverFirstLatterToCapital } from "../../utility/formater";

function SuspenseImportHIstoryView({ isOpen, toggle, details }) {
  const errorTableRef = useRef(null);

  // Function to copy error table to clipboard
  const copyToClipboard = () => {
    if (errorTableRef.current) {
      const range = document.createRange();
      range.selectNodeContents(errorTableRef.current);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
      alert("Error details copied to clipboard!");
    }
  };

  // Dummy error data for demonstration
  const errorData = details.lineErrors || [];
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
                      details.status == "completed" ? "#24C444" : "#FF0700",
                    font: "normal normal 600 11px/20px Noto Sans",
                  }}
                >
                  {ConverFirstLatterToCapital(details.status)}
                </span>
              </p>
              <p>
                <strong>Success Count:</strong>{" "}
                {details.lineErrors.length > 0 ? 0 : lineErrors.length || 0}
              </p>
              <p>
                <strong>Failed Count:</strong> {details.lineErrors.length || 0}
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
                <Table bordered ref={errorTableRef}>
                  <thead>
                    <tr>
                      <th>Line Number</th>
                      <th>Error Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorData.map((lineError, lineIndex) =>
                      lineError.errorMsg.map((error, errorIndex) => (
                        <tr key={`${lineIndex}-${errorIndex}`}>
                          <td>{lineError.line}</td>
                          <td>{error.error}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
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
