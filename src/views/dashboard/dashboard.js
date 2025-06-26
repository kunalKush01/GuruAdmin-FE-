import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { TeamOutlined, EnvironmentOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Welcome to Admin Dashboard</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Gurus"
              value={0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Locations"
              value={0}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
