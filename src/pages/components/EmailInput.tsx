import React from "react";
import { Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";

export default () =>
  <Form.Item
    name="email"
    rules={[
      { required: true, message: "请输入邮箱地址" },
      { type: "email", message: "请输入正确的邮箱地址" },
    ]}
  >
    <Input prefix={<MailOutlined />} placeholder="E-Mail" allowClear />
  </Form.Item>;
