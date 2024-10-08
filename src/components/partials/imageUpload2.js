import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Spinner } from "reactstrap";
import { X } from "react-feather";
import { toast } from "react-toastify";
import "../../assets/scss/common.scss";
import { uploadFile, deleteFile, downloadFile } from "../../api/sharedStorageApi";

const thumbStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  width: "140px",
  height: "140px",
  backgroundSize: "contain",
};

const thumb = {
  display: "inline-flex",
  marginBottom: 8,
  marginRight: 8,
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "10px",
};

const thumbInnerBorderRadius = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "50%",
};

const img = {
  display: "block",
  width: "140px",
  height: "100%",
  borderRadius: "10px",
};

const imgBorderRadius = {
  display: "block",
  width: "140px",
  height: "100%",
  borderRadius: "50%",
};

const Thumbs = ({ file, profileImage, editedFileNameInitialValue }) => {
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (file?.name) {
          const blob = await downloadFile(file.name);
          const url = URL.createObjectURL(blob);
          setImageData(url);
        } else if (editedFileNameInitialValue) {
          setImageData(editedFileNameInitialValue);
        }
      } catch (error) {
        setError('Failed to load image');
      }
    };

    fetchImage();

    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [file, editedFileNameInitialValue]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!imageData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={thumb} key={file?.name}>
      <div style={profileImage ? thumbInnerBorderRadius : thumbInner}>
        <img
          src={imageData}
          style={profileImage ? imgBorderRadius : img}
          alt={file?.name || "Uploaded image"}
          onError={(e) => console.error('Image load error:', e)}
        />
      </div>
    </div>
  );
};

function ImageUpload(props) {
  const {
    multiple,
    imageName,
    fileName,
    removeFile,
    setImageSpinner,
    editedFileNameInitialValue,
    defaultImages,
    disabledAddLanguage,
    svgNotSupported,
    profileImage,
    bg_plus,
    acceptFile,
    disabled,
    setDeletedImages,
  } = props;

  const [files, setFiles] = useState([]);
  const [indexValue, setIndexValue] = useState({ type: "", idx: "" });

  useEffect(() => {
    if (defaultImages?.length > 0) {
      setFiles(defaultImages);
    } else if (defaultImages?.length === 0) {
      setFiles([]);
    }
  }, [defaultImages]);

  const handleUpload = async (acceptedFile) => {
    setImageSpinner(true);

    const formData = new FormData();
    formData.append('file', acceptedFile);

    try {
      const response = await uploadFile(formData);

      const filePath = response.data.result.filePath;

      setImageSpinner(false);
      fileName(filePath, acceptedFile.type);

      const newFile = {
        ...acceptedFile,
        name: filePath,
      };

      if (multiple) {
        if (indexValue.type === "edit") {
          const cloneFiles = [...files];
          cloneFiles.splice(indexValue.idx, 1, newFile);
          setFiles(cloneFiles);
        } else {
          setFiles([...files, newFile]);
        }
      } else {
        setFiles([newFile]);
      }

      const imageResponse = await downloadFile(filePath);
      const imageUrl = URL.createObjectURL(new Blob([imageResponse]));
      newFile.preview = imageUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      setImageSpinner(false);
      toast.error('Failed to upload file');
    }
  };

  const removeFileHandler = async (file) => {
    try {
      await deleteFile(file.name);
      removeFile(file.name);
      if (props?.type) {
        setDeletedImages((prev) => [...prev, file.name]);
      }
      const newFiles = files.filter(f => f.name !== file.name);
      setFiles(newFiles);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: acceptFile || "",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file?.type?.includes("svg") && svgNotSupported) {
        toast.error("File type SVG is not supported.");
      } else {
        handleUpload(file);
      }
    },
  });

  useEffect(() => {
    return () => files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }, [files]);

  const ref = useRef();

  const thumbsContainer = {
    backgroundImage: `url('${
      editedFileNameInitialValue === null ||
      editedFileNameInitialValue?.length < 1 ||
      multiple
        ? bg_plus
        : ""
    }')`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  };

  return (
    <div className="wraperimagefield">
      <div {...getRootProps({ className: "dropzone" })} onClick={(e) => e.stopPropagation()}>
        <div
          onClick={() => (!disabledAddLanguage ? open() : null)}
          className="d-none"
          ref={ref}
        >
          <input {...getInputProps()} accept={acceptFile} disabled={disabled} />
        </div>
      </div>
      <aside>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {multiple ? (
            <>
              {files?.map((file, idx) => (
                <div key={idx} className="position-relative mainImageDiv">
                  {!disabledAddLanguage && (
                    <Button
                      className="removeImageButton"
                      onClick={() => removeFileHandler(file)}
                    >
                      <X color="#ff8744" stroke-width="3" />
                    </Button>
                  )}
                  <div
                    style={thumbStyles}
                    className="dropImageBx cursor-pointer"
                    onClick={() => {
                      setIndexValue({ idx, type: "edit" });
                      ref.current.click();
                    }}
                  >
                    <div className="w-100 h-100 profileHoverBackground">
                      <Thumbs
                        file={file}
                        multiple={multiple}
                        editedFileNameInitialValue={editedFileNameInitialValue}
                        profileImage={profileImage}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {props.imageSpinner ? (
                <div className="d-flex align-items-center p-4">
                  <Spinner
                    style={{
                      height: "3rem",
                      width: "3rem",
                    }}
                    color="primary"
                  />
                </div>
              ) : (
                <div
                  style={{ ...thumbStyles, ...thumbsContainer }}
                  className="dropImageBx cursor-pointer"
                  onClick={() => ref.current.click()}
                />
              )}
            </>
          ) : (
            <div className="position-relative mainImageDiv">
              {(files?.length > 0 || editedFileNameInitialValue) && !disabledAddLanguage && (
                <Button
                  className="removeImageButton"
                  onClick={() => removeFileHandler(files[0])}
                >
                  <X color="#ff8744" stroke-width="3" />
                </Button>
              )}
              {props.imageSpinner ? (
                <div className="d-flex align-items-center p-4">
                  <Spinner
                    style={{
                      height: "3rem",
                      width: "3rem",
                    }}
                    color="primary"
                  />
                </div>
              ) : (
                <div
                  style={{ ...thumbStyles, ...thumbsContainer }}
                  className={`dropImageBx cursor-pointer ${files?.length > 0 ? "bg-none" : ""}`}
                  onClick={() => ref.current.click()}
                >
                  {files?.length > 0 || editedFileNameInitialValue ? (
                    <div className="w-100 h-100 profileImageBackground">
                      {files.length > 0 ? (
                        files?.map((file, idx) => (
                          <Thumbs
                            key={idx}
                            file={file}
                            profileImage={profileImage}
                            editedFileNameInitialValue={editedFileNameInitialValue}
                          />
                        ))
                      ) : props.editTrue === "edit" ? (
                        <img
                          src={editedFileNameInitialValue}
                          style={profileImage ? imgBorderRadius : img}
                          alt="Edited file"
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default ImageUpload;