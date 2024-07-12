import React, { useState } from 'react';
import { Switch, Table } from 'antd';
import '../../views/configuration/Masters/masterStyle.css'
function ANTDcustometable({ columns, data }) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{
      x: 1500,
      y: 400,
    }}
      sticky={{
        offsetHeader: 64,
      }}
      bordered
    />
  );
}

export default ANTDcustometable;
