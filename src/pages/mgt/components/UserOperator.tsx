import React, { useEffect } from 'react';
import { Space, Divider, Popconfirm, Modal, Form, Switch } from 'antd';
import { useState } from 'react';
import SubmitForm from '@/components/SubmitForm';
import EmailInput from '@/components/EmailInput';
import NameInput from '@/components/NameInput';
import PwdInput from '@/components/PwdInput';

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
  const user = props.user;
  const [visible, setVsible] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);

  function visibleHandler() {
    setVsible((s) => !s);
  }

  function submitHandler() {
    form.validateFields().then((values) => console.log(values));
  }

  return (
    <Space>
      <a onClick={visibleHandler}>修改</a>
      <Divider type="vertical"></Divider>
      <Popconfirm title="删除后无法恢复！请确认删除。">
        <a style={{ color: 'red' }}>删除</a>
      </Popconfirm>
      <Modal
        visible={visible}
        onCancel={visibleHandler}
        title="修改用户"
        onOk={submitHandler}
      >
        <SubmitForm
          name="user-edit-form"
          form={form}
          onFinish={submitHandler}
          layout="vertical"
        >
          <EmailInput
            formItemProps={{
              label: '邮箱',
            }}
          />
          <NameInput
            formItemProps={{
              label: '昵称',
            }}
          />
          <PwdInput
            formItemProps={{
              label: '密码',
              rules: [{ min: 8, message: '密码最短应为8位' }],
            }}
          />
          <Form.Item label="管理员" name="isAdmin" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否"></Switch>
          </Form.Item>
        </SubmitForm>
      </Modal>
    </Space>
  );
};
