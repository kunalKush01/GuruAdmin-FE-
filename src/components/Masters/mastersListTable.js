import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import ANTDcustometable from "../partials/antdReactTable";
import '../../assets/scss/common.scss'

export function MasterListTable({
  data,
  pagination,
  onChangePage,
  onChangePageSize,
}) {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("Names"),
      dataIndex: "name",
      width: 220,
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
    <div>
      <ANTDcustometable
        columns={columns}
        data={masterList}
        pagination={pagination}
        onChangePage={onChangePage}
        onChangePageSize={onChangePageSize}
      />
    </div>
  );
}
