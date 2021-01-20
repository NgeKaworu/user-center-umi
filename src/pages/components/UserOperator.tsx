import React from 'react';
import { Space, Divider, Popconfirm, Modal } from 'antd';

export interface User {
  id: string;
  name: string;
  email: string;
  createAt: string;
  updateAt: string;
  isAdmin: boolean;
}

export interface UserOperatorProps {
  user: User;
}

export default (props: UserOperatorProps) => {
  return (
    <Space>
      <a>修改</a>
      <Divider type="vertical"></Divider>
      <Popconfirm title="删除后无法恢复！请确认删除。">
        <a style={{ color: 'red' }}>删除</a>
      </Popconfirm>
      <Modal />
    </Space>
  );
};
