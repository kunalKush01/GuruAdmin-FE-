import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
// import bg_plus from "../../../assets/img/ListItems/bg_plus.svg";
import { Storage } from "@aws-amplify/storage";
import bg_plus from "../../assets/images/icons/Thumbnail.svg";
import { Button } from "reactstrap";
const WraperImageField = styled.div`
  .image_text {
    font: normal normal medium 22px/30px Kanit;
  }
  .removeImageButton {
    position: absolute;
    padding: 0.5rem;
    border: none;
    background-color: transparent !important;
    font: normal normal bold 17px/20px Noto Sans;
    border-color:none !important ;
    color:  #FF8744 !important;
    right: 15px;
    top: 6px;
  }
  .dropZone_Box {
    height: 328px;
    display: flex;
    align-items: center;
    justify-content: center;
    //border: 3px solid #707070;
  }
  .image_text strong {
    color: #ff8341;
  }
  .dropZone_Box svg {
    width: 56px;
    height: 56px;
  }
  .dropImageBx {
    display: inline-flex;
    border-radius: 5px;
    width: 130px;
    height: 130px;
    //border: 3px solid #707070;
    margin-bottom: 8px;
    margin-right: 8px;
    padding: 4px;
    box-sizing: border-box;
  }
  /* .mainImageDiv:hover img {
    opacity: 50%;
    transition: opacity 1s;
  }
  .mainImageDiv:hover .removeImageButton{
    display: block;
  } */
  @media screen and (max-width: 1199px) and (min-width: 992px) {
    .preview_box li {
      width: 80px;
      height: 80px;
    }
  }
  @media screen and (max-width: 991px) {
    .preview_box li {
      width: 60px;
      height: 60px;
      background-size: 35px;
    }
    .dropZone_Box {
      height: 40vh;
    }
    .image_text {
      font: normal normal 500 14px/16px Kanit;
    }
    .dropZone_Box svg {
      width: 45px;
      height: 45px;
    }
  }
  @media screen and (max-width: 767px) {
    .preview_box li {
      width: 60px;
      height: 60px;
      background-size: 30px;
    }
    .dropZone_Box {
      height: 30vh;
    }
    .image_text {
      font: normal normal 500 14px/16px Kanit;
    }
    .dropZone_Box svg {
      width: 45px;
      height: 45px;
    }
  }
`;

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
  //   borderRadius: 2,
  //   border: "1px solid #707070",
  marginBottom: 8,
  marginRight: 8,
  width: "100%",
  height: "100%",
  //   padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const thumbInnerBorderRadius = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "50%",
};
const img = {
  display: "block",
  width: "100%",
  height: "100%",
};
const imgBorderRadius = {
  display: "block",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
};

const Thumbs = ({
  file,
  multiple,
  editedFileNameInitialValue,
  profileImage,
}) => (
  <div style={thumb} key={file?.name}>
    <div
      style={profileImage ? thumbInnerBorderRadius : thumbInner}
      // className={profileImage ? "profileBlock" : "thumbBlock"}
    >
      <img
        src={
          file?.preview
            ? file?.preview
            : multiple
            ? file?.presignedUrl
            : editedFileNameInitialValue
        }
        style={img}
        alt={file.name}
      />
    </div>
  </div>
);

function ImageUpload(props) {
  console.log("props.editedFileNameInitialValue",props.editedFileNameInitialValue);
  const thumbsContainer = {
    backgroundImage: `url('${props?.bg_plus}')`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  };
  const [files, setFiles] = useState(
    props.defaultImages?.length > 0 ? props.defaultImages : []
    );
  const handleUpload = (acceptedFiles) => {
    Storage.put(
      `temp/${props.randomNumber}_${acceptedFiles?.name}`,
      acceptedFiles,
      {
        contentType: acceptedFiles?.type,
      }
    )
      .then((res) => {
        props.fileName(acceptedFiles?.name, acceptedFiles?.type);
        // props.filePreview(acceptedFiles)
        console.log("acceptedFiles",acceptedFiles);
        if (props.multiple) {
          setFiles(
            // acceptedFiles.map((file) =>
            [
              ...files,
              Object.assign(acceptedFiles, {
                preview: URL.createObjectURL(acceptedFiles),
              }),
            ]

            // )
          );
        } else {
          setFiles(
            // acceptedFiles.map((file) =>
            [
              Object.assign(acceptedFiles, {
                preview: URL.createObjectURL(acceptedFiles),
              }),
            ]
            // )
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "",
    onDrop: (acceptedFiles) => {
      handleUpload(acceptedFiles[0]);
    },
  });
  const removeFile = (file) => {
    // props.removeFile(files.indexOf(file));
    props.removeFile(file?.name);
    if (props?.type) {
      props?.setDeletedImages((prev) => [...prev, file?.name]);
    }
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };
  useEffect(
    () => () => {
      files?.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );
  const ref = useRef();
  return (
    <WraperImageField>
      <div
        {...getRootProps({ className: "dropzone" })}
        onClick={(e) => e.stopPropagation}
      >
        <div onClick={open} className="d-none" ref={ref}>
          <input
            {...getInputProps()}
            accept={props.acceptFile}
            disabled={props?.disabled}
          />
          <div></div>
          {/*<div>*/}
          {/*    <UploadCloud />*/}
          {/*    <div className="image_text">*/}
          {/*        <strong>Browse</strong> photos or Capture the*/}
          {/*        <br /> images from your camera*/}
          {/*    </div>*/}
          {/*</div>*/}
        </div>
      </div>
      <aside>
        {/* files.length > 0 && */}
        <div className="d-flex align-items-center flex-wrap gap-2">
          {props.multiple ? (
            <>
              {files?.map((file, idx) => (
                <div key={idx} className="position-relative">
                  <Button
                    className="removeImageButton"
                    onClick={(e) => {
                      removeFile(file);
                    }}
                  >
                    X
                  </Button>
                  <div
                    style={{ ...thumbStyles }}
                    className="dropImageBx cursor-pointer"
                    onClick={() => ref.current.click()}
                  >
                    <div className="w-100 h-100">
                      {files.length > 0 ? (
                        <>
                          <Thumbs
                            file={file}
                            multiple={props.multiple}
                            editedFileNameInitialValue={
                              props?.editedFileNameInitialValue
                            }
                          />
                        </>
                      ) : props.editTrue === "edit" ? (
                        <>
                          <img
                            src={props?.editedFileNameInitialValue}
                            style={img}
                          />
                        </>
                      ) : null}
                      {/* {thumbs.length ? (
                    <Thumbs file={file} />
                  ) : (
                    <img src={props?.editedFileNameInitialValue} style={img} />
                  )} */}
                    </div>
                  </div>
                </div>
              ))}

              <div
                style={{ ...thumbStyles, ...thumbsContainer }}
                className="dropImageBx cursor-pointer"
                onClick={() => ref.current.click()}
              />
            </>
          ) : (
            <div className="position-relative mainImageDiv">
              {files?.length > 0 || props?.editedFileNameInitialValue ? (
                <Button
                  className="removeImageButton"
                  onClick={(e) => {
                    removeFile(files?.name);
                  }}
                >
                  X
                </Button>
              ) : (
                ""
              )}

              <div
                style={{ ...thumbStyles, ...thumbsContainer }}
                className={`dropImageBx cursor-pointer ${
                  files?.length > 0 ? "bg-none" : ""
                }`}
                onClick={() => ref.current.click()}
              >
                {files?.length > 0 || props?.editedFileNameInitialValue ? (
                  <div className="w-100 h-100">
                    {files.length > 0 ? (
                      files?.map((file,idx) => (
                        <Thumbs
                        key={idx}
                          file={file}
                          profileImage={props?.profileImage}
                          editedFileNameInitialValue={
                            props?.editedFileNameInitialValue
                          }
                        />
                      ))
                    ) : props.editTrue === "edit" ? (
                      <img
                        src={props?.editedFileNameInitialValue}
                        style={props?.profileImage ? imgBorderRadius : img}
                      />
                    ) : null}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </WraperImageField>
  );
}

export default ImageUpload;
