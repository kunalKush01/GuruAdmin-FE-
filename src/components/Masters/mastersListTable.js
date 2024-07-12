import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const MasterTableWarapper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
`;

export function MasterListTable({ data }) {
  const { t } = useTranslation();
  const columns = [
    {
      name: t("Names"),
      selector: (row) => row.name,
      width: "220px",
    },
  ];
  const masterList = useMemo(() => {
    return data.map((item, idx) => ({
      id: idx + 1,
      name: (
        <div className="d-flex align-items-center">
          <Link to={`/configuration/masters/info/${item.id}`}>
            {ConverFirstLatterToCapital(item.name ?? "-")}
          </Link>
        </div>
      ),
    }));
  }, [data]);

  return (
    <MasterTableWarapper>
      <CustomDataTable
        maxHeight={""}
        columns={columns}
        data={masterList}
        masterListPagination={data.length > 10 && true}
      />
    </MasterTableWarapper>
  );
}
