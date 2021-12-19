import { Form, Input } from 'antd';
import { validateKey } from '../api';
const { Item } = Form;

export interface FieldProps {
  disabled?: boolean;
  checkout?: boolean;
}

export const Email = ({ disabled, checkout }: FieldProps) => (
  <Item
    name="email"
    label="邮箱"
    rules={[
      { required: true },
      {
        validator: (_, email) =>
          checkout && email ? validateKey({ params: { email }, notify: false }) : Promise.resolve(),
      },
      { type: 'email' },
    ]}
  >
    <Input placeholder="请输入" disabled={disabled} />
  </Item>
);

export const Pwd = ({ disabled }: FieldProps) => (
  <Item
    name="pwd"
    label="密码"
    rules={[{ required: !disabled }, { type: 'string', min: 8 }]}
    hasFeedback
  >
    <Input.Password placeholder="请输入" />
  </Item>
);

export const ConfirmPwd = ({ pwdField = 'pwd' }: { pwdField?: string }) => (
  <Item
    name="confirmPwd"
    label="确认密码"
    dependencies={[[pwdField]]}
    rules={[
      { required: true },
      { type: 'string', min: 8 },
      ({ getFieldValue }) => ({
        validator: (_, v) =>
          v === getFieldValue(pwdField)
            ? Promise.resolve()
            : Promise.reject(new Error('两次密码不一致')),
      }),
    ]}
    hasFeedback
  >
    <Input.Password placeholder="请输入" />
  </Item>
);

export const Name = () => (
  <Item name="name" label="用户名" rules={[{ required: true }]}>
    <Input placeholder="请输入" />
  </Item>
);
