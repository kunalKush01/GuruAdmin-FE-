import { Button, Carousel, Image, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { fetchImage } from "./downloadUploadImage";

function UploadImage({
  uploadFileFunction,
  setUploadedFileUrl,
  initialUploadUrl,
  name,
  listType,
  maxCount,
  buttonLabel,
  icon,
  isMultiple = false,
  setDeletedImage,
  ...props
}) {
  const [uploadedFileUrl, setFileUrl] = useState(initialUploadUrl);
  useEffect(() => {
    if (initialUploadUrl && initialUploadUrl.length > 0) {
      setFileUrl(initialUploadUrl);
    }
  }, [initialUploadUrl]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    if (initialUploadUrl && initialUploadUrl.length > 0 && !refreshFlag) {
      const timer = setTimeout(() => {
        setRefreshFlag(true);
        const fetchImages = async () => {
          const fileArray = await Promise.all(
            initialUploadUrl.map(async (item) => {
              const url = await fetchImage(item.fileName);
              return { url, fileName: item.fileName };
            })
          );

          setFileUrl(fileArray);
          setUploadedFileUrl(fileArray);
        };

        fetchImages();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [initialUploadUrl, refreshFlag]);

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      if (isMultiple && uploadedFileUrl.length >= 5) {
        onError(new Error("You can only upload up to 5 images."));
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileFunction(formData);
      if (response && response.data.result) {
        const newImageUrl = response.data.result.filePath;
        const url = await fetchImage(newImageUrl);
        setFileUrl((prev) =>
          Array.isArray(prev)
            ? [
                ...prev,
                {
                  url,
                  fileName: newImageUrl,
                },
              ]
            : [
                {
                  url,
                  fileName: newImageUrl,
                },
              ]
        );
        setUploadedFileUrl((prev) =>
          Array.isArray(prev)
            ? [
                ...prev,
                {
                  url,
                  fileName: newImageUrl,
                },
              ]
            : [
                {
                  url,
                  fileName: newImageUrl,
                },
              ]
        );

        setIsImageVisible(false);
        onSuccess(newImageUrl);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      onError(new Error("Error uploading file"));
    }
  };
  const handleDelete = (file) => {
    if (isMultiple) {
      const updatedFileArray = uploadedFileUrl.filter(
        (item) => item.fileName !== file.fileName
      );
      setUploadedFileUrl(updatedFileArray);

      setFileUrl(updatedFileArray);

      setIsImageVisible(updatedFileArray.length > 0);
    } else {
      setIsImageVisible(true);
      setFileUrl(initialUploadUrl[0]?.url);
      setUploadedFileUrl(null);
    }
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
        maxCount={isMultiple ? 5 : maxCount}
        onRemove={handleDelete}
        onPreview={handlePreview}
        multiple={isMultiple}
        showUploadList={isMultiple ? false : true}
      >
        <Button
          icon={icon}
          style={{ width: "100%" }}
          disabled={(isMultiple && uploadedFileUrl.length >= 5) || props.isEdit} // Disable button when file count reaches 5
        >
          {buttonLabel}
        </Button>
      </Upload>
      {/* show initial image while editing */}
      <div className="previewImagesContainer py-1">
        {isMultiple
          ? Array.isArray(uploadedFileUrl) &&
            uploadedFileUrl.length > 0 &&
            uploadedFileUrl?.map((item, index) => (
              <div key={index} className="previewImages">
                <Image
                  style={{
                    height: "55px",
                    width: "50px",
                  }}
                  src={item.url}
                  className="heroImages"
                  alt="Uploaded"
                />
                <Button
                  type="text"
                  danger
                  disabled={props.isEdit}
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item)}
                />
              </div>
            ))
          : isImageVisible &&
            Array.isArray(uploadedFileUrl) &&
            uploadedFileUrl.length > 0 && (
              <div className="previewImages">
                <Image
                  src={uploadedFileUrl[0]?.url}
                  alt="Uploaded"
                  style={{
                    height: "55px",
                    // width: "50px",
                    display: uploadedFileUrl[0]?.url ? "block" : "none",
                  }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={props.isEdit}
                  onClick={() => handleDelete(uploadedFileUrl[0])}
                />
              </div>
            )}
      </div>

      {/* to show image preview while selecting image */}
      {previewImage && (
        <div className="pImage">
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
        </div>
      )}
    </>
  );
}

export default UploadImage;
