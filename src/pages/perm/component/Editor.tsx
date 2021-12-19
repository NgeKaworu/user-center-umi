import { Form, Input, Tooltip, TreeSelect, Radio, message } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update, create, list, validateKey } from '../api';
import { useQuery } from 'react-query';
import { dfsMap } from '@/js-sdk/struct/tree/dfs';
import perm2Tree, { PermOpt } from '../util/perm2Tree';
import permFilter from '../util/permFilter';
import { MENU_TYPE_MAP } from '../model/constant';
import Options from '@/js-sdk/utils/Options';

const { Item } = Form;
const { Group: RGroup } = Radio;

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
  const perms = useQuery(['user-center/perm/list', 'menu', 'infinity'], () =>
    list({ params: { limit: 0, isMenu: true } }),
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

      await onSuccess?.(await api(value));
      setModalProps((pre) => ({ ...pre, visible: false }));
      perms.refetch();
      form.resetFields();
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        initialValues: { isMenu: true, isHide: false },
        ...formProps,
      }}
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
              inEdit || !id ? Promise.resolve() : validateKey({ params: { id }, notify: false }),
          },
          {
            pattern: /^[\w-]*$/,
            message: '仅允许英文、数字和“-”',
          },
        ]}
      >
        <Input placeholder="请输入" disabled={inEdit} />
      </Item>

      <Item
        name="isMenu"
        label="是否当作菜单使用？"
        tooltip="菜单模式可以配置层级关系"
        rules={[{ required: true }]}
      >
        <RGroup optionType="button" options={Options(MENU_TYPE_MAP).toOpt} disabled={inEdit} />
      </Item>

      <Item dependencies={[['isMenu']]} noStyle>
        {({ getFieldValue }) =>
          getFieldValue(['isMenu']) && (
            <>
              <Item dependencies={['id']} noStyle>
                {() => {
                  const id = getFieldValue(['id']),
                    validOpt = dfsMap<Partial<PermOpt>>(
                      { children: perm2Tree(perms?.data?.data) },
                      'children',
                      (t) => {
                        const ouroboros = t?.genealogy?.includes(id);
                        return {
                          ...t,
                          disabled: ouroboros,
                          name: (
                            <Tooltip title={ouroboros ? '不能选子孙节点' : t.url}>{t.name}</Tooltip>
                          ),
                        };
                      },
                    ).children;

                  return (
                    <Item name="pID" label="上级菜单">
                      <TreeSelect
                        fieldNames={{ label: 'name' }}
                        treeDefaultExpandAll
                        placeholder="请选择"
                        treeNodeLabelProp="name"
                        treeLine
                        treeData={validOpt}
                        showSearch
                        filterTreeNode={permFilter}
                        allowClear
                      />
                    </Item>
                  );
                }}
              </Item>

              <Item
                name="url"
                label="路由"
                rules={[{ required: true }, { type: getFieldValue(['pID']) ? 'string' : 'url' }]}
              >
                <Input placeholder="请输入" />
              </Item>

              <Item
                name="isHide"
                label="是否在菜单中隐藏"
                tooltip="开起隐藏后将不在菜单中渲染，但依旧可以通过url访问"
              >
                <RGroup optionType="button" options={Options(MENU_TYPE_MAP).toOpt} />
              </Item>
            </>
          )
        }
      </Item>
    </ModalForm>
  );
};
