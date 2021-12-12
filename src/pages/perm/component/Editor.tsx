import { Form, message, Input } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update, create } from '../api';

const { Item } = Form;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  async function onSubmit() {
    const value = await form?.validateFields();
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      let api;
      if (value?.id) {
        api = update;
      } else {
        api = create;
      }

      await api(value);
      await onSuccess?.();
      setModalProps((pre) => ({ ...pre, visible: false }));
      form.resetFields();
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      formProps={{ onFinish: onSubmit, ...formProps }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="id" hidden>
        <Input placeholder="请输入" disabled />
      </Item>
      <Item name="name" label="权限名" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item name="key" label="权限标识" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item name="path" label="族谱">
        <Input placeholder="请输入" />
      </Item>
      <Item name="url" label="url">
        <Input placeholder="请输入" />
      </Item>
    </ModalForm>
  );
};
