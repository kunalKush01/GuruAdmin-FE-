import React from "react";
import { Card, Descriptions, Tag, Typography } from "antd";
import "../../../src/assets/scss/common.scss";
import crownIcon from "../../../src/assets/images/icons/crown.svg";
import { useSelector } from "react-redux";

const ImageObservation = ({ data, matchedAmount, isID }) => {
  const result = isID ? data?.imagePayment : data?.result || {}; // Ensure result always exists
  const isMatched = matchedAmount === "100% Amount Matched";
  const trustDetails = useSelector((state) => state.auth) || {};
  const isAImatchedEnable = trustDetails?.isAImatchedEnable ?? false;
  return (
    <>
      {isAImatchedEnable ? (
        <Card
          title={
            <div className="d-flex align-items-center">
              <Typography.Text className="commonFont">
                AI-Detected Payment Details
              </Typography.Text>
              <span
                style={{ fontSize: 24, marginLeft: 8, marginBottom: 9 }}
                role="img"
                aria-label="crown"
              >
                👑
              </span>
            </div>
          }
          bordered={true}
        >
          <Descriptions bordered size="small" column={2}>
            {/* First Row with Transaction ID & Timestamp */}
            <Descriptions.Item label="Transaction ID">
              {result.transactionId || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Date and Time">
              {result.timestamp || "N/A"}
            </Descriptions.Item>

            {/* Second Row: Image Observation with All Extracted Data Inside */}
            <Descriptions.Item label="Image Observation" span={2}>
              <div>
                {matchedAmount ? (
                  <Tag bordered={false} color={isMatched ? "success" : "red"}>
                    {matchedAmount}
                  </Tag>
                ) : (
                  <Tag bordered={false} color="red">
                    No matched amount available
                  </Tag>
                )}
                <div>
                  <span className="commonSmallFont">Payment Status:</span>{" "}
                  <Tag color="blue">
                    {result.status
                      ? result.status.charAt(0).toUpperCase() +
                        result.status.slice(1)
                      : "N/A"}
                  </Tag>
                </div>
                <div>
                  <span className="commonSmallFont">Amount:</span>{" "}
                  <span>₹{result.amount || "N/A"}</span>
                </div>
                <div>
                  <span className="commonSmallFont">From:</span>{" "}
                  {result?.from?.name || "N/A"}{" "}
                  {result?.from?.bank ? (
                    <span>
                      ({result.from.bank} {result?.from?.accountNumber || "N/A"}
                      )
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <span className="commonSmallFont">To:</span>{" "}
                  {result?.to?.name || "N/A"}{" "}
                  {result?.to?.upiId ? <span>({result.to.upiId})</span> : ""}
                </div>
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <Card
          title={
            <div className="d-flex align-items-center">
              <Typography.Text className="commonFont">
                AI-Detected Payment Details
              </Typography.Text>
              <span
                style={{ fontSize: 24, marginLeft: 8, marginBottom: 9 }}
                role="img"
                aria-label="crown"
              >
                👑
              </span>
            </div>
          }
          bordered={true}
        >
          <Typography.Text className="commonFont d-flex align-items-center justify-content-center">
            Contact Apna Dharm team to get this feature enabled.
          </Typography.Text>
        </Card>
      )}
    </>
  );
};

export default ImageObservation;
