import React from "react";
import { Descriptions, Tag } from "antd";

const ImageObservation = ({ matchedAmount }) => {
  const isMatched = matchedAmount === "100% matched";

  const borderedItems = [
    {
      key: "1",
      label: "Image Observation",
      children: (
        <Tag bordered={false} color={isMatched?"success":"red"}>
          {matchedAmount||""}
        </Tag>
      ),
      labelStyle: { width: "150px", minWidth: "150px", whiteSpace: "nowrap" }, // Controls label width
    },
  ];

  return (
    <Descriptions bordered size="small" column={1} items={borderedItems} />
  );
};

export default ImageObservation;
