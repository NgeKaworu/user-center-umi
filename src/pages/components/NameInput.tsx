import React from "react";
import { Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default () =>
  <Form.Item
    name="name"
    rules={[{ required: true, message: "请填写昵称" }]}
  >
    <Input
      prefix={<UserOutlined />}
      placeholder="Nickname"
      allowClear
    />
  </Form.Item>;
