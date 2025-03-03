import { Button, Carousel, Image, Upload } from "antd";
import React, { useEffect, useState } from "react";

function UploadImage({
  uploadFileFunction,
  setUploadedFileUrl,
  initialUploadUrl,
  name,
  listType,
  maxCount,
  buttonLabel,
  icon,
  isMultiple,
  ...props
}) {
  const [uploadedFileUrl, setFileUrl] = useState(
    isMultiple ? [] : initialUploadUrl
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isImageVisible, setIsImageVisible] = useState(true);
  useEffect(() => {
    setFileUrl(initialUploadUrl); // Ensure initial URL is set properly
    setIsImageVisible(true); // Show image if initialUploadUrl is present
  }, [initialUploadUrl]);
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileFunction(formData);
      if (response && response.data.result) {
        const newImageUrl = response.data.result.filePath;
        if (isMultiple) {
          setFileUrl((prev) => [...prev, newImageUrl]); // Update the displayed image
          setUploadedFileUrl((prev) => [...prev, newImageUrl]); // Pass the new image URL back to the parent
        } else {
          setFileUrl(newImageUrl); // Update the displayed image
          setUploadedFileUrl(newImageUrl); // Pass the new image URL back to the parent
        }
        setIsImageVisible(false);
        onSuccess(newImageUrl);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      onError(new Error("Error uploading file"));
    }
  };
  const handleDelete = (file) => {
    setIsImageVisible(true); // Show the initial image
    setFileUrl(initialUploadUrl);
    setUploadedFileUrl(null); // Clear uploaded file URL in parent
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        className="uploadIdCard"
        name={name}
        listType={listType}
        customRequest={customRequest}
        maxCount={maxCount}
        onRemove={handleDelete}
        onPreview={handlePreview}
        multiple={isMultiple}
      >
        <Button icon={icon} style={{ width: "100%", zIndex: "-1000" }}>
          {buttonLabel}
        </Button>
      </Upload>
      {/* show initial image while editing */}
      {!isMultiple
        ? isImageVisible &&
          uploadedFileUrl && (
            <Image
              src={uploadedFileUrl}
              alt="Uploaded"
              style={{
                marginTop: "10px",
                display: uploadedFileUrl ? "block" : "none",
                zIndex: "-1000",
                position: "relative",
              }}
            />
          )
        : isImageVisible &&
          uploadedFileUrl && (
            <Carousel autoplay>
              {uploadedFileUrl?.length
                ? uploadedFileUrl?.map((item) => {
                    return (
                      <div className="detailImage">
                        <img src={item} className="detailImage h-100 w-100" />
                      </div>
                    );
                  })
                : ""}
            </Carousel>
          )}
      {/* to show image preview while selecting image */}
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}

export default UploadImage;
