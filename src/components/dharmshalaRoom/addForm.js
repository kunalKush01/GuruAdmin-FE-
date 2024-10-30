import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import { useParams } from "react-router-dom";
import CustomTextField from "../partials/customTextField";
import { getRoomTypeList } from "../../api/dharmshala/dharmshalaInfo";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import "../../assets/scss/common.scss";

const AddRoomForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["roomList"]);
        setLoading(false);
      } else {
        setLoading(false);
      }
    },
  });
  const URLParams = useParams();

  const handleFormSubmit = (values) => {
    setLoading(true);
    setShowPrompt(false);
    const { number, roomType, ...otherValues } = values;
    const data = {
      roomNumber: number,
      roomTypeId: roomType?.value,
      ...otherValues,
    };

    mutation.mutate(data);
    history.push(`/room/${URLParams.floorId}/${URLParams.buildingId}`);
  };

  const {
    data: roomTypesData,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
  } = useQuery(["roomTypes"], getRoomTypeList);
  const roomTypes = roomTypesData?.results ?? [];
  const roomTypeOptions = roomTypes.map((room) => ({
    value: room._id,
    label: room.name,
  }));
  return (
    <div className="FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {(formik) => (
          <Form>
            {showPrompt && (
              <Prompt
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )}

            <Row className="paddingForm">
              <Col xs={12} md={10}>
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_room_number")}
                      placeholder={t("placeHolder_dharmshala_room_number")}
                      name="number"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      labelName={t("room_type")}
                      name="roomType"
                      loadOptions={[
                        { value: "", label: "Select Room Type" }, // Default option
                        ...roomTypeOptions, // Dynamic room type options
                      ]}
                      width
                    />
                    {/* <CustomTextField
                      type="select"
                      label={t("dharmshala_room_room_type")}
                      name="roomType"
                      required
                      autoFocus
                      options={roomTypes}
                      isLoading={isRoomTypesLoading}
                      isError={isRoomTypesError}
                    >
                      {isRoomTypesLoading ? (
                        <option>{t("loading")}...</option>
                      ) : isRoomTypesError ? (
                        <option>{t("error_loading_room_types")}</option>
                      ) : (
                        roomTypes.map((roomType) => (
                          <option key={roomType._id} value={roomType._id}>
                            {roomType.name}
                          </option>
                        ))
                      )}
                    </CustomTextField> */}
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="btn-Published mt-3">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="d-flex align-items-center m-auto"
                  type="submit"
                >
                  {!props.plusIconDisable && (
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
                    </span>
                  )}
                  <span>
                    <Trans i18nKey={`${buttonName}`} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRoomForm;
