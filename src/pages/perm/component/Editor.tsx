import { Form, Input, Tooltip, TreeSelect } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update, create, list, validateKey } from '../api';
import { useQuery } from 'react-query';
import dfs, { dfsMap } from '@/js-sdk/utils/dfs';
import perm2Tree, { PermOpt } from '../util/perm2Tree';
import { filter } from '@/js-sdk/decorators/Select/Search';

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
      perms.refetch();
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
      <Item name="name" label="权限名" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="id"
        label="权限标识"
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
      <Item dependencies={['id']} noStyle>
        {({ getFieldValue }) => {
          const id = getFieldValue(['id']),
            validOpt = dfsMap<Partial<PermOpt>>(
              { children: perm2Tree(perms?.data?.data ?? []).matched },
              'children',
              (t) =>
                t?.genealogy?.includes(id)
                  ? {
                      ...t,
                      disabled: true,
                      label: <Tooltip title="不能选子孙节点">{t.label}</Tooltip>,
                    }
                  : t,
            ).children;

          return (
            <Item name="pID" label="父级id">
              <TreeSelect
                placeholder="请选择"
                treeNodeLabelProp="label"
                treeLine
                treeData={validOpt}
                showSearch
                filterTreeNode={(input, treeNode) =>
                  !!(treeNode && dfs(treeNode, 'children', (cur) => filter(input, cur)))
                }
              />
            </Item>
          );
        }}
      </Item>
      <Item name="url" label="url">
        <Input placeholder="请输入" />
      </Item>
    </ModalForm>
  );
};
