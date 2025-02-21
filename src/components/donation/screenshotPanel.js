import React, { useEffect, useState } from "react";
import { Button, Flex, Splitter, Switch, Typography } from "antd";
import backIcon from "../../../src/assets/images/icons/arrow-left.svg";
import { fetchImage } from "../partials/downloadUploadImage";
import ScreenshotDescriptionTable from "./screenshotDescriptionTable";
import "../../assets/scss/common.scss";
import ImageObservation from "./imageObservation";
import AIMatchedRecord from "./aiMatchedRecord";
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
}) => {
  console.log(record);
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

  console.log(imageUrl);
  return (
    <div className="d-flex flex-column ">
      {showScreenshotPanel && (
        <div className="mb-1 d-flex align-items-center">
          <img
            src={backIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => setShowScreenshotPanel(false)}
          />
          <span className="commonFont">Payment Details</span>
        </div>
      )}
      <Flex vertical gap="middle">
        <Splitter
          onResize={setSizes}
          style={{
            height: 450,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Splitter.Panel size={sizes[0]} resizable={enabled}>
            <div className="mx-1 py-1">
              <ScreenshotDescriptionTable record={record} />
            </div>
            <div className="mx-1 py-1">
              <ImageObservation />
            </div>
            {/* <div className="mx-1 py-1">
              <span className="commonFont">AI Matched Suspense Record</span>
              <AIMatchedRecord />
            </div> */}
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
                    height: "400px",
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
