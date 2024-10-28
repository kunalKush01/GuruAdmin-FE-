import { Button, Upload } from "antd";
import React from "react";

function UploadImage({
  uploadFileFunction,
  setUploadedFileUrl,
  name,
  listType = "picture",
  maxCount = 1,
  buttonLabel = "Upload File",
  icon,
}) {
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileFunction(formData);
      if (response && response.data.result) {
        setUploadedFileUrl(response.data.result.filePath);
        onSuccess(response.data.result.filePath);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      onError(new Error("Error uploading file"));
    }
  };
  return (
    <Upload
      name={name}
      listType={listType}
      customRequest={customRequest}
      maxCount={maxCount}
    >
      <Button icon={icon} style={{ width: "100%" }}>
        {buttonLabel}
      </Button>
    </Upload>
  );
}

export default UploadImage;
