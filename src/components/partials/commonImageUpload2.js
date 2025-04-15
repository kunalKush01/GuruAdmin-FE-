import { Button, Carousel, Image, Upload, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, FileOutlined, EyeOutlined } from "@ant-design/icons";
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
        const fetchFiles = async () => {
          const fileArray = await Promise.all(
            initialUploadUrl.map(async (item) => {
              const url = await fetchImage(item.fileName);
              return { url, fileName: item.fileName, type: item.type || "image/*" };
            })
          );

          setFileUrl(fileArray);
          setUploadedFileUrl(fileArray);
        };

        fetchFiles();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [initialUploadUrl, refreshFlag]);

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      if (isMultiple && uploadedFileUrl.length >= 5) {
        onError(new Error("You can only upload up to 5 files."));
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileFunction(formData);
      if (response && response.data.result) {
        const newFileUrl = response.data.result.filePath;
        const url = await fetchImage(newFileUrl);
        setFileUrl((prev) =>
          Array.isArray(prev)
            ? [
                ...prev,
                {
                  url,
                  fileName: newFileUrl,
                  type: file.type,
                },
              ]
            : [
                {
                  url,
                  fileName: newFileUrl,
                  type: file.type,
                },
              ]
        );
        setUploadedFileUrl((prev) =>
          Array.isArray(prev)
            ? [
                ...prev,
                {
                  url,
                  fileName: newFileUrl,
                  type: file.type,
                },
              ]
            : [
                {
                  url,
                  fileName: newFileUrl,
                  type: file.type,
                },
              ]
        );        

        setIsImageVisible(false);
        onSuccess(newFileUrl);
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
    if (file.type === 'application/pdf' || (file.url && file.url.endsWith('.pdf'))) {
      window.open(file.url, '_blank');
    } else {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    }
  };

  const handlePdfPreview = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const isPdf = (fileType) => {
    return fileType === 'application/pdf' || (typeof fileType === 'string' && fileType.includes('pdf'));
  };

  const getFileName = (filePath) => {
    if (!filePath) return 'File';
    return filePath.split('/').pop().split('_').pop();
  };

  return (
    <>
      <div style={{ display: props.isEdit ? "none" : "block" }}>
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
            style={{ width: "100%", display: props.isEdit ? "none" : "block" }}
            disabled={
              (isMultiple && uploadedFileUrl.length >= 5) || props.isEdit
            } 
          >
            {buttonLabel}
          </Button>
        </Upload>
      </div>
      <div className="previewImagesContainer py-1" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {isMultiple ? (
          Array.isArray(uploadedFileUrl) && uploadedFileUrl.length > 0 ? (
            uploadedFileUrl?.map((item, index) => (
              <div 
                key={index} 
                className="previewImages"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '130px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  padding: '4px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isPdf(item.type) ? (
                  <div className="pdf-preview" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%',
                    position: 'relative',
                    paddingRight: '50px' 
                  }}>
                    <FileOutlined style={{ fontSize: '18px', marginRight: '5px' }} />
                    <Tooltip title={getFileName(item.fileName)}>
                      <span style={{ 
                        fontSize: '11px', 
                        maxWidth: '50px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}>
                        {getFileName(item.fileName)}
                      </span>
                    </Tooltip>
                    <div style={{ 
                      position: 'absolute', 
                      right: '2px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      display: 'flex'
                    }}>
                      <Button
                        type="text"
                        icon={<EyeOutlined style={{ fontSize: '14px' }} />}
                        onClick={() => handlePdfPreview(item.url)}
                        style={{ 
                          padding: '0', 
                          minWidth: '20px', 
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 2px'
                        }}
                      />
                      <Button
                        type="text"
                        danger
                        disabled={props.isEdit}
                        icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
                        onClick={() => handleDelete(item)}
                        style={{ 
                          padding: '0', 
                          minWidth: '20px', 
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    width: '100%', 
                    position: 'relative',
                    height: '45px'
                  }}>
                    <Image
                      style={{
                        height: "45px",
                        width: "45px",
                        objectFit: "cover"
                      }}
                      src={item.url}
                      className="heroImages"
                      alt="Uploaded"
                    />
                    <Button
                      type="text"
                      danger
                      disabled={props.isEdit}
                      icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
                      onClick={() => handleDelete(item)}
                      style={{ 
                        position: 'absolute',
                        right: '2px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '0', 
                        minWidth: '20px', 
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "140px",
              }}
            >
              No File Available
            </div>
          )
        ) : isImageVisible &&
          Array.isArray(uploadedFileUrl) &&
          uploadedFileUrl.length > 0 ? (
          <div 
            className="previewImages"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '130px',
              border: '1px solid #e8e8e8',
              borderRadius: '4px',
              padding: '4px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isPdf(uploadedFileUrl[0]?.type) ? (
              <div className="pdf-preview" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                position: 'relative',
                paddingRight: '50px' 
              }}>
                <FileOutlined style={{ fontSize: '18px', marginRight: '5px' }} />
                <Tooltip title={getFileName(uploadedFileUrl[0]?.fileName)}>
                  <span style={{ 
                    fontSize: '11px', 
                    maxWidth: '50px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap'
                  }}>
                    {getFileName(uploadedFileUrl[0]?.fileName)}
                  </span>
                </Tooltip>
                <div style={{ 
                  position: 'absolute', 
                  right: '2px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  display: 'flex'
                }}>
                  <Button
                    type="text"
                    icon={<EyeOutlined style={{ fontSize: '14px' }} />}
                    onClick={() => handlePdfPreview(uploadedFileUrl[0]?.url)}
                    style={{ 
                      padding: '0', 
                      minWidth: '20px', 
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 2px'
                    }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
                    disabled={props.isEdit}
                    onClick={() => handleDelete(uploadedFileUrl[0])}
                    style={{ 
                      padding: '0', 
                      minWidth: '20px', 
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ 
                width: '100%', 
                position: 'relative',
                height: '45px'
              }}>
                <Image
                  src={uploadedFileUrl[0]?.url}
                  alt="Uploaded"
                  style={{
                    height: "45px",
                    width: "45px",
                    objectFit: "cover",
                    display: uploadedFileUrl[0]?.url ? "block" : "none",
                  }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
                  disabled={props.isEdit}
                  onClick={() => handleDelete(uploadedFileUrl[0])}
                  style={{ 
                    position: 'absolute',
                    right: '2px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0', 
                    minWidth: '20px', 
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "140px",
            }}
          >
            No File Available
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