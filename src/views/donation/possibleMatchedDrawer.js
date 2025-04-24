import React, { useMemo, useState } from "react";
import {
  Tabs,
  Button,
  Drawer,
  List,
  Avatar,
  Card,
  Collapse,
  Space,
  Checkbox,
} from "antd";
import "../../assets/scss/common.scss";
import moment from "moment";
import Swal from "sweetalert2";
import { matchTransaction } from "../../api/suspenseApi";
const { TabPane } = Tabs;
const { Panel } = Collapse;

function PossibleMatchedDrawer({
  isDrawerOpen,
  handleDrawerClose,
  selectedRowKeys,
  matchedData = [],
}) {
  const [drawerTab, setDrawerTab] = useState("match");
  const [selectedPossibleMatches, setSelectedPossibleMatches] = useState([]);
  const handleCheckboxChange = (record) => {
    setSelectedPossibleMatches((prev) => {
      const exists = prev.some((item) => item.recordId === record.recordId);
      if (exists) {
        return prev.filter((item) => item.recordId !== record.recordId);
      } else {
        return [...prev, record];
      }
    });
  };
  const handleSelectAll = (list) => {
    const allSelected = list.every((item) =>
      selectedPossibleMatches.some((sel) => sel.recordId === item.recordId)
    );

    setSelectedPossibleMatches(allSelected ? [] : list);
  };

  const coloredMatchedData = useMemo(() => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#1890ff",
      "#13c2c2",
    ];
    const getRandomColor = () =>
      colors[Math.floor(Math.random() * colors.length)];

    return matchedData.map((item) => ({
      ...item,
      color: getRandomColor(),
    }));
  }, [matchedData]);
  const bestMatches = useMemo(
    () => coloredMatchedData.filter((item) => item.confidence === "high"),
    [coloredMatchedData]
  );

  const possibleMatches = useMemo(
    () => coloredMatchedData.filter((item) => item.confidence === "low"),
    [coloredMatchedData]
  );
  //   const bestMatches = useMemo(
  //     () => matchedData.filter((item) => item.confidence === "high"),
  //     [matchedData]
  //   );

  //   const possibleMatches = useMemo(
  //     () => matchedData.filter((item) => item.confidence === "low"),
  //     [matchedData]
  //   );
  const handleMatchButtonClick = async (item) => {
    const isArray = Array.isArray(item);
    const records = isArray ? item : [item];

    const payload = {
      suspenseIds: selectedRowKeys,
      transactionIds: records.map((rec) => rec.recordId),
      transactionType: records[0]?.model,
      matchReason: "Manual match",
    };
    try {
      const response = await matchTransaction(payload);
      // Optional: check response if your API returns a success flag
      if (response?.error) {
        throw new Error("Something went wrong.");
      }

      Swal.fire({
        icon: "success",
        title: "Matched successfully!",
        text: "The suspense records have been updated.",
        confirmButtonColor: "#1890ff",
      });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      Swal.fire({
        icon: "error",
        title: "Match failed",
        text: errorMsg,
        confirmButtonColor: "#ff4d4f",
      });
    }
  };

  const renderMatchList = (data, isPossible = false) => (
    <>
      {isPossible && (
        <div style={{ padding: "0 0 10px 10px" }}>
          <Checkbox
            checked={data.every((item) =>
              selectedPossibleMatches.some(
                (sel) => sel.recordId === item.recordId
              )
            )}
            indeterminate={
              data.some((item) =>
                selectedPossibleMatches.some(
                  (sel) => sel.recordId === item.recordId
                )
              ) &&
              !data.every((item) =>
                selectedPossibleMatches.some(
                  (sel) => sel.recordId === item.recordId
                )
              )
            }
            onChange={() => handleSelectAll(data)}
          >
            Select All
          </Checkbox>
        </div>
      )}
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: item.color }}>
                      {item.name[0]}
                    </Avatar>
                  }
                  title={
                    <span className="commonSmallFont">
                      {item.name} | ₹{item.amount}
                    </span>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <div className="commonFontFamily commonFontColor">
                        Dated {moment(item.date).format("DD MMM YYYY")}
                      </div>
                      <div className="commonFontFamily commonFontColor">
                        Remark: {item.remark}
                      </div>
                    </Space>
                  }
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  {isPossible ? (
                    <Checkbox
                      checked={selectedPossibleMatches.some(
                        (selected) => selected.recordId === item.recordId
                      )}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  ) : (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleMatchButtonClick(item)}
                    >
                      Match
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </>
  );

  return (
    <div>
      {" "}
      <Drawer
        className="no-padding-drawer"
        title={
          <Tabs
            activeKey={drawerTab}
            onChange={setDrawerTab}
            size="small"
            style={{ marginBottom: "-16px" }}
          >
            <TabPane tab="Match Transaction" key="match" />
            <TabPane tab="Categorize Manually" key="categorize" />
          </Tabs>
        }
        width={600} // Increased drawer width
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        footer={
          drawerTab === "match" && (
            <div style={{ textAlign: "right" }}>
              <Button onClick={handleDrawerClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                type="primary"
                disabled={selectedPossibleMatches.length === 0}
                onClick={() => handleMatchButtonClick(selectedPossibleMatches)}
                style={{
                  opacity: selectedPossibleMatches.length === 0 ? 0.5 : 1,
                }}
              >
                Match
              </Button>
            </div>
          )
        }
      >
        {drawerTab === "match" && (
          <Collapse
            defaultActiveKey={["best", "possible"]}
            bordered={false}
            expandIconPosition="end"
          >
            <Panel header="Best Matches" key="best">
              {renderMatchList(bestMatches, false)}
            </Panel>
            <Panel header="Possible Match List" key="possible">
              {renderMatchList(possibleMatches, true)}
            </Panel>
          </Collapse>
        )}

        {drawerTab === "categorize" && (
          <div style={{ padding: "10px" }}>Coming Soon.</div>
        )}
      </Drawer>
    </div>
  );
}

export default PossibleMatchedDrawer;
