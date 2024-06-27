import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js

import { deletePregnancy } from "../../../api/cattle/cattlePregnancy";
=======
import { Button } from "reactstrap";
import { deleteRoom, getRoomTypeList} from "../../../api/dharmshala/dharmshalaInfo";
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js
import { DELETE } from "../../../utility/permissionsVariable";

const PregnancyTableWrapper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
  .modal-body {
    max-height: 600px !important;
    overflow: auto !important;
  }
  .tableDes p {
    margin-bottom: 0;
  }
`;
=======
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DharmshalaRoomTableWrapper } from "../dharmshalaStyles";
import "../dharmshala_css/dharmshalaroom.css"; 

>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js

const PregnancyReportTable = ({
  data = [],
  allPermissions,
  subPermission,
  currentPage,
  currentFilter,
  currentPregnancyStatus,
  maxHeight,
  height,
<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js
=======
  currentFilter,
  currentStatus,
  currentPage,
  buildingID,
  floorID,
  isMobileView,
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeletePregnancy = async (payload) => {
    return deletePregnancy(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeletePregnancy,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattlePregnancyList"]);
      }
    },
  });

  const columns = [
    {
<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js
      name: t("cattle_id"),
      selector: (row) => row?.cattleId,
      width: "200px",
    },
    {
      name: t("cattle_conceiving_date"),
      selector: (row) => row?.conceivingDate,
      width: "200px",
=======
      name: t("Room Number"),
      selector: (row) => row.roomNumber,
      width: "150px",
    },
    {
      name: t("Direct Booking Available"),
      selector: (row) => (row.directBookingAvailable ? "Yes" : "No"),
      width: "250px",
    },
    {
      name: t("Room Type Id"),
      selector: (row) => (row.roomTypeId),
      width: "250px",
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js
    },
    {
      name: t("cattle_delivery_date"),
      selector: (row) => row?.deliveryDate,
      width: "200px",
    },
    {
      name: t("cattle_pregnancy_status"),
      selector: (row) => row?.pregnancyStatus,
    },
    {
      name: t(""),
      selector: (row) => row.edit,
      width: "100px",
    },
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
    },
  ];

<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js
  const pregnancyData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        cattleId: item?.tagId,
        conceivingDate: moment(item?.conceivingDate).format("DD MMM YYYY"),
        deliveryDate: item?.deliveryDate
          ? moment(item?.deliveryDate).format("DD MMM YYYY")
          : "N/A",
        pregnancyStatus: item?.status,
=======


  const DharmshalasRoom = useMemo(() => {
    const {floorId} = useParams()
    const {buildingId} = useParams()
    const URLParams = useParams("");


    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        roomNumber: item?.roomNumber,
        directBookingAvailable: item?.directBookingAvailable,
        roomTypeId: item?.roomTypeId,
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => {
              history.push(
<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js
                `/cattle/pregnancy-reports/${item?.id}?page=${currentPage}&status=${currentPregnancyStatus}&filter=${currentFilter}`
=======
                `/rooms/edit/${item?._id}/${URLParams.floorId}/${URLParams.buildingId}?page=${currentPage}&filter=${currentFilter}&number=${item?.roomNumber}&directBookingAvailable=${item?.directBookingAvailable}`
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js
              );
            }}
          />
        ),
        delete: (
          // allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
                html: `
                                      <h3 class="swal-heading mt-1">${t(
                                        "cattle_pregnancy_delete"
                                      )}</h3>
                                      <p>${t("cattle_pregnancy_sure")}</p>
                                      `,
                showCloseButton: false,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: ` ${t("cancel")}`,
                cancelButtonAriaLabel: ` ${t("cancel")}`,

                confirmButtonText: ` ${t("confirm")}`,
                confirmButtonAriaLabel: "Confirm",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  deleteMutation.mutate(item.id);
                }
              });
            }}
          />
        ),
        // ) : (
        //   ""
        // ),
      };
    });
  }, [data]);

  return (
<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js
    <PregnancyTableWrapper>
=======
    <DharmshalaRoomTableWrapper>
      {isMobileView ? (
        <div className="card-container">
          {DharmshalasRoom.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="card-content">
                  <h5 className="card-title">{item.roomNumber}</h5>
                  <p className="card-text">{item.directBookingAvailable}</p>
                  <p className="card-text">{item.roomTypeId}</p>
                </div>
                <div className="card-icons">
                  {item.edit}
                  {item.delete}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js
      <CustomDataTable
        maxHeight={maxHeight}
        columns={columns}
        height={height}
        data={pregnancyData}
      />
<<<<<<< Updated upstream:src/views/dharmshala-management/pregnancy-report/table.js
    </PregnancyTableWrapper>
  );
};

export default PregnancyReportTable;
=======
      )}
    </DharmshalaRoomTableWrapper>
  );
};

export default DharmshalaRoomTable;

>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/table.js
