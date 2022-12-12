import React, { useState, useEffect } from "react";
import { useField } from "formik";
import { Star, Upload, X } from "react-feather";
import { useDrop } from "ahooks";
import { v4 as uuidv4 } from "uuid";
import swal from "sweetalert";
import { PRIMARY_COLOR } from "../../theme";
import Swiper from "react-id-swiper";
import { uploadFileToS3 } from "../../utility/helpers/helpers.js";
import "swiper/swiper.scss";
import addImage from "../../assets/img/icons/add_image.svg";
import { Spinner } from "reactstrap";
//import "../../assets/scss/plugins/extensions/swiper.scss";

export default function ImageUploadField({
  label,
  icon,
  placeholder,
  borderColor = PRIMARY_COLOR,
  multiple = true,
  postDelete,
  ...props
}) {
  const params = {
    slidesPerView: multiple ? 4 : 1,
    spaceBetween: 30,
  };

  const [field, meta, helpers] = useField(props);

  const [dropProps, { isHovering }] = useDrop({
    onFiles: (files, e) => {
      if (multiple || images.length === 0) {
        setFilesToState(files);
      }
    },
  });

  const [images, setImages] = useState(field.value ? field.value : []);
  const [dropMode, setDropMode] = useState(images.length > 0 ? false : true);

  useEffect(() => {
    if (isHovering) {
      if (multiple || images.length === 0) {
        setDropMode(true);
      }
    } else if (images.length > 0) {
      setDropMode(false);
    }
    console.log("Hover status change", isHovering);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  useEffect(() => {
    helpers.setValue(images);
    if (images.length > 0) {
      setDropMode(false);
    } else {
      setDropMode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const selectDefaultImage = (uuid) => {
    setImages((prevImages) => {
      const newImages = prevImages.map((prevImage) => {
        if (prevImage.uuid === uuid) {
          return { ...prevImage, is_default_image: true };
        } else {
          return { ...prevImage, is_default_image: false };
        }
      });
      return [...newImages];
    });
  };

  const setFilesToState = (files) => {
    if (files && files.length > 0) {
      files.map(async (file) => {
        let localUrl = URL.createObjectURL(file);
        const uuid = uuidv4();

        setImages((prevImages) => {
          return [
            ...prevImages,
            {
              uuid,
              name: file.name,
              uploaded: false,
              file,
              localUrl,
              url: "",
              is_default_image: prevImages.length === 0,
            },
          ];
        });
        const url = await uploadFileToS3(file);

        setImages((prevImages) => {
          const newImages = prevImages.map((image) => {
            if (image.uuid === uuid) {
              const newImage = Object.assign({}, image);
              newImage.url = url;
              newImage.uploaded = true;
              return newImage;
            }
            return image;
          });
          return newImages;
        });
      });
    }
  };

  const deleteImage = (img) => {
    console.log(
      "🚀 ~ file: ImageUploadField.js ~ line 116 ~ deleteImage ~ img",
      img
    );
    swal({
      title: "Are you sure you want to delete  this image?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setImages((prevImages) => {
          const newImages = prevImages.filter(
            (image) => image.uuid !== img.uuid
          );
          return [...newImages];
        });
        if (postDelete) {
          postDelete(img._id);
        }
      }
    });
  };

  return (
    <>
      <label style={{ marginBottom: "8px" }}>{label}</label>
      <div className=" p-2 mb-2" style={{ borderRadius: 10 }} {...dropProps}>
        {dropMode && (
          <div
            className=" w-100 d-flex justify-content-center align-items-center flex-column  position-relative"
            style={{
              minHeight: "18.5rem",
              border: `dashed 3px ${borderColor}`,
              borderRadius: 10,
            }}
          >
            <input
              type="file"
              placeholder={placeholder}
              className="w-100"
              multiple={true}
              style={{
                borderRadius: "10px",
                minHeight: "18.5rem",
                opacity: 0,
                cursor: "pointer",
                position: "absolute",
                top: "0",
                left: "0",
              }}
              onChange={(event) => {
                const files = Array.from(event.target.files);
                setFilesToState(files);
              }}
            />
            <Upload size={70} className="text-primary mb-1" />
            <span className="btn btn-primary">
              {multiple ? "Add Images" : "Add Image"}{" "}
            </span>
            <h3 className="mt-1 text-center">or drop image to upload</h3>
          </div>
        )}
        {dropMode || (
          <Swiper {...params} shouldSwiperUpdate={true}>
            {multiple ? (
              <div
                style={{
                  background: "grey",
                  backgroundImage: `url(${addImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  cursor: "pointer",
                  height: "18rem",
                  overflow: "hidden",
                  borderRadius: 10,
                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                  margin: 10,
                }}
              >
                <input
                  type="file"
                  placeholder={placeholder}
                  className="w-100"
                  style={{
                    minHeight: "18rem",
                    cursor: "pointer",
                    opacity: 0,
                  }}
                  multiple={true}
                  onChange={(event) => {
                    const files = Array.from(event.target.files);
                    setFilesToState(files);
                  }}
                />
              </div>
            ) : (
              <></>
            )}

            {images.length > 0 &&
              images.map((image) => (
                <div
                  style={{
                    backgroundImage: `url(${
                      image.localUrl ? image.localUrl : image.url
                    })`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    height: "18rem",
                    // width: "18rem",
                    overflow: "hidden",
                    borderRadius: 10,
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    margin: 10,
                  }}
                  key={image.uuid}
                >
                  <div
                    className="text-white text-right"
                    style={{ cursor: "pointer", margin: 0, fontSize: "2rem" }}
                  >
                    <span
                      className="p-1 "
                      style={{
                        borderBottomLeftRadius: 10,
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <Star
                        size={25}
                        fill={image.is_default_image ? "gold" : "grey"}
                        onClick={(e) => {
                          selectDefaultImage(image.uuid);
                          e.stopPropagation();
                        }}
                      />
                      <X
                        size={25}
                        className="text-danger"
                        onClick={(e) => {
                          deleteImage(image);
                          e.stopPropagation();
                        }}
                      />
                    </span>
                  </div>
                  {image.uploaded || (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: "13rem" }}
                    >
                      <Spinner size="lg" color="primary" />
                    </div>
                  )}
                </div>
              ))}
          </Swiper>
        )}
        {meta.touched && meta.error ? (
          <div className="field-error text-danger mt-1">{meta.error}</div>
        ) : null}
      </div>
    </>
  );
}
