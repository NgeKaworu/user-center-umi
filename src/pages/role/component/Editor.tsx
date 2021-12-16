import { Form, TreeSelect, Input } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { list } from '../../perm/api';
import { update, create, validateKey } from '../api';
import { useQuery } from 'react-query';
import perm2Tree from '@/pages/perm/util/perm2Tree';
import permFilter from '@/pages/perm/util/permFilter';

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
  const perms = useQuery(['user-center/perm/list', 'infinity'], () =>
    list({ params: { limit: 0 } }),
  );

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
      <Item name="name" label="角色名" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="id"
        label="角色标识"
        rules={[
          { required: true },
          {
            validator: (_, id) =>
              inEdit ? Promise.resolve() : validateKey({ params: { id }, notify: false }),
          },
        ]}
      >
        <Input placeholder="请输入" disabled={inEdit} />
      </Item>
      <Item name="perms" label="拥有权限">
        <TreeSelect
          placeholder="请选择"
          treeNodeLabelProp="name"
          treeData={perm2Tree(perms?.data?.data)}
          filterTreeNode={permFilter}
          treeLine
          showSearch
          multiple
          treeCheckable
          showCheckedStrategy="SHOW_ALL"
        />
      </Item>
    </ModalForm>
  );
};
