import React from "react";
import { Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

export default () =>
  <Form.Item
    name="pwd"
    rules={[
      { required: true, message: "密码不能为空" },
      { min: 8, message: "密码最短应为8位" },
    ]}
  >
    <Input
      prefix={<LockOutlined />}
      type="password"
      placeholder="Password"
      allowClear
    />
  </Form.Item>;
