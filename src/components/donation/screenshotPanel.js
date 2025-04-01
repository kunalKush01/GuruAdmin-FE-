import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Spin, Splitter, Switch, Typography } from "antd";
import backIcon from "../../../src/assets/images/icons/arrow-left.svg";
import { fetchImage } from "../partials/downloadUploadImage";
import ScreenshotDescriptionTable from "./screenshotDescriptionTable";
import "../../assets/scss/common.scss";
import ImageObservation from "./imageObservation";
import AIMatchedRecord from "./aiMatchedRecord";
import { useQuery } from "@tanstack/react-query";
import { extractDataFromImage } from "../../api/suspenseApi";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const Desc = (props) => (
  <Flex
    justify="center"
    align="center"
    style={{
      height: "100%",
    }}
  >
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);
const ScreenshotPanel = ({
  setShowScreenshotPanel,
  showScreenshotPanel,
  record,
  setRecord,
}) => {
  const history = useHistory();
  const trustDetails = useSelector((state) => state.auth.trustDetail) || {};
  const trustId = trustDetails?.id;
  const [sizes, setSizes] = useState(["70%", "30%"]);
  const [enabled, setEnabled] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (record) {
      const loadImages = async () => {
        if (record.paymentScreenShot) {
          // If it's a single string, fetch the URL for that single image
          const url = await fetchImage(record.paymentScreenShot);
          setImageUrl([url]); // Store as an array to keep consistency
        } else if (record.images && Array.isArray(record.images)) {
          // If it's an array, map and fetch all images
          const urls = await Promise.all(
            record.images.map(async (image) => {
              const url = await fetchImage(image.name);
              return url;
            })
          );
          setImageUrl(urls);
        }
      };

      loadImages();
    }
  }, [record]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { data, isLoading } = useQuery(
    ["extractData", record?.paymentScreenShot], // Use record?.image_url as a dependency
    () =>
      extractDataFromImage(
        record?.paymentScreenShot
          ? {
              filePath: record.paymentScreenShot,
              trustId: trustId,
              donationId: record?._id,
            }
          : {}
      ), // Ensure initial payload is {}
    {
      keepPreviousData: true,
      enabled: !!record, // Only enable query when record is available
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    }
  );
  const [matchedAmount, setMatchedAmount] = useState(null);
  const clearViewParams = () => {
    setShowScreenshotPanel(false); // Close the view panel
    setRecord(null); // Clear selected record state
    localStorage.removeItem("viewRecord"); // Remove stored record from localStorage

    // Update URL: Remove "view" and "recordId" while keeping other params
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("view");
    searchParams.delete("recordId");

    history.push(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div
      className="d-flex flex-column "
      style={{
        //height: 450,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius:"10px",
        padding:"5px"
      }}
    >
      {showScreenshotPanel && (
        <div className="mb-1 d-flex align-items-center mt-1">
          <img
            src={backIcon}
            width={25}
            className="cursor-pointer"
            onClick={clearViewParams}
          />
          <span className="commonFont">Payment Details</span>
        </div>
      )}
      <Flex vertical gap="middle">
        <Splitter
          onResize={setSizes}
          layout={isMobile ? "vertical" : "horizontal"}
        >
          <Splitter.Panel size={sizes[0]} resizable={enabled}>
            <div className="mx-1 py-1">
              <ScreenshotDescriptionTable
                record={record}
                data={data ? data.result : null}
                setMatchedAmount={setMatchedAmount}
              />
            </div>
            <div className="mx-1 py-1">
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <Spin size="large" />
                </div>
              ) : (
                <ImageObservation
                  matchedAmount={matchedAmount}
                  data={data ? data : null}
                />
              )}
            </div>
            <div className="mx-1 py-1">
              <Card>
                <span className="commonFont">AI Matched Suspense Record</span>
                <AIMatchedRecord />
              </Card>
            </div>
          </Splitter.Panel>
          <Splitter.Panel
            size={sizes[1]}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="mx-1 py-1">
              {record?.paymentScreenShot ? (
                <img
                  src={imageUrl ? imageUrl[0] : null}
                  alt="Payment Screenshot"
                  style={{
                    maxWidth: "100%",
                    height: !isMobile ? "100%" : "200px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Desc text="No Screenshot Available" />
              )}
            </div>
          </Splitter.Panel>
        </Splitter>
        {/* <Flex gap="middle" justify="space-between">
          <Switch
            value={enabled}
            onChange={() => setEnabled(!enabled)}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
          />
          <Button onClick={() => setSizes(["70%", "30%"])}>Reset</Button>
        </Flex> */}
      </Flex>
    </div>
  );
};
export default ScreenshotPanel;
