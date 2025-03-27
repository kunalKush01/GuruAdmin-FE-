import React from "react";
import { Card, Descriptions, Space, Tag, Typography } from "antd";
import moment from "moment";
import "../../../src/assets/scss/common.scss";
import crownIcon from "../../../src/assets/images/icons/crown.svg";
const ImageObservation = ({ data, matchedAmount }) => {
  if (!data) return null;

  const { result } = data;
  const isMatched = matchedAmount === "100% Amount Matched";
  const isAImatchedEnable = true;
  return (
    <>
      {isAImatchedEnable ? (
        <Card
          title={
            <div className="d-flex align-items-center">
              <Typography.Text className="commonFont">
                AI-Detected Payment Details
              </Typography.Text>
              <img src={crownIcon} width={35} />
            </div>
          }
          bordered={true}
        >
          <Descriptions bordered size="small" column={2}>
            {/* First Row with Transaction ID & Timestamp */}
            <Descriptions.Item label="Transaction ID">
              {result?.transactionId ? result.transactionId : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Date and Time">
              {result.timestamp ? result.timestamp : "-"}
            </Descriptions.Item>

            {/* Second Row: Image Observation with All Extracted Data Inside */}
            <Descriptions.Item label="Image Observation" span={2}>
              <div>
                {matchedAmount && (
                  <Tag bordered={false} color={isMatched ? "success" : "red"}>
                    {matchedAmount}
                  </Tag>
                )}

                {result?.status && (
                  <div>
                    <span className="commonSmallFont">Payment Status:</span>{" "}
                    <Tag color="blue">
                      {result.status.charAt(0).toUpperCase() +
                        result.status.slice(1)}
                    </Tag>
                  </div>
                )}

                {result?.amount && (
                  <div>
                    <span className="commonSmallFont">Amount:</span>{" "}
                    <span>₹{result.amount}</span>
                  </div>
                )}

                {result?.from?.name && (
                  <div>
                    <span className="commonSmallFont">From:</span>{" "}
                    {result.from.name}{" "}
                    {result?.from?.bank && (
                      <span>
                        ({result.from.bank}{" "}
                        {result?.from?.accountNumber &&
                          result.from.accountNumber}
                        )
                      </span>
                    )}
                  </div>
                )}

                {result?.to?.name && (
                  <div>
                    <span className="commonSmallFont">To:</span>{" "}
                    {result.to.name}{" "}
                    {result?.to?.upiId && <span>({result.to.upiId})</span>}
                  </div>
                )}
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
              <img src={crownIcon} width={35} />
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
