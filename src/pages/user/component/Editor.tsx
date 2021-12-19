import { Form, TreeSelect, Input } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { list } from '../../role/api';
import { update, create, validateKey } from '../api';
import { useQuery } from 'react-query';

import SearchSelect from '@/js-sdk/components/SearchSelect';
import { compose } from '@/js-sdk/decorators/utils';
import { IOC } from '@/js-sdk/decorators/hoc';
import SelectAll from '@/js-sdk/decorators/Select/SelectAll';

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
  const inEdit = modalProps?.title === '编辑';
  const roles = useQuery(['user-center/role/list', 'infinity'], () =>
      list({ params: { limit: 0 } }),
    ),
    rolesOpt = roles.data?.data?.map((r) => ({ label: r.name, value: r.id }));

  async function onSubmit() {
    const value = await form?.validateFields();
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      let api;
      if (inEdit) {
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
        <input disabled />
      </Item>
      <Item name="name" label="用户名" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="email"
        label="邮箱"
        rules={[
          { required: true },
          {
            validator: (_, email) =>
              inEdit || !email
                ? Promise.resolve()
                : validateKey({ params: { email }, notify: false }),
          },
          { type: 'email' },
        ]}
      >
        <Input placeholder="请输入" disabled={inEdit} />
      </Item>
      <Item name="pwd" label="密码" rules={[{ required: !inEdit }, { type: 'string', min: 8 }]}>
        <Input.Password placeholder="请输入" />
      </Item>
      <Item name="roles" label="拥有权限">
        {compose<any>(IOC([SelectAll]))(<SearchSelect allowClear options={rolesOpt} />)}
      </Item>
    </ModalForm>
  );
};
