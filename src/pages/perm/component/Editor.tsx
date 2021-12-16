import { Form, Cascader, Input, Popconfirm, Tooltip } from 'antd';
import type { CascaderProps } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update, create, list, validateKey } from '../api';
import { useQuery } from 'react-query';
import Perm from '@/model/Perm';
import { compose } from '@/js-sdk/decorators/utils';
import { ReactElement, ReactNode } from 'react';
import { IOC } from '@/js-sdk/decorators/hoc';
import Format from '@/js-sdk/decorators/Format';
import dfs, { dfsMap } from '@/js-sdk/utils/dfs';

const { Item } = Form;

interface PermOpt extends Perm {
  label: ReactNode;
  value: Perm['id'];
  children?: PermOpt[];
  genealogy?: Perm['id'][];
}

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

  function genTree(
    origin: Perm[] = [],
    pNode?: PermOpt,
  ): { matched: PermOpt[]; mismatched: PermOpt[] } {
    let _matched: PermOpt[] = [],
      _mismatched: PermOpt[] = [];

    for (const p of origin) {
      let opt: PermOpt = {
        ...p,
        label: p.name,
        value: p.id,
        genealogy: (pNode?.genealogy ?? []).concat(p.id),
      };
      if (p.pID === pNode?.id) {
        _matched.push(opt);
      } else {
        _mismatched.push(opt);
      }
    }

    let solution: PermOpt[] = [];

    for (const match of _matched) {
      let { matched, mismatched } = genTree(_mismatched, match);
      solution.push({ ...match, children: matched });
      _mismatched = mismatched;
    }

    return {
      matched: solution,
      mismatched: _mismatched,
    };
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
              { children: genTree(perms?.data?.data ?? []).matched },
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

          console.log(validOpt);

          return (
            <Item name="pID" label="父级id">
              {compose<any>(
                IOC([
                  Format({
                    f: (value) => (value?.length ? value?.[value?.length - 1] : ''),
                    g: (value) =>
                      dfs<Partial<PermOpt>>(
                        { children: validOpt },
                        'children',
                        (t) => t.id === value,
                      )?.genealogy ?? [value],
                  }),
                ]),
              )(
                <Cascader
                  placeholder="请选择"
                  options={validOpt}
                  changeOnSelect
                  showSearch={{
                    filter: (input, path) =>
                      path?.some(
                        (option) =>
                          option?.value
                            ?.toString()
                            ?.toLowerCase()
                            ?.includes(input?.toString()?.toLowerCase()) ||
                          option?.label
                            ?.toString()
                            ?.toLowerCase()
                            ?.includes(input?.toString()?.toLowerCase()),
                      ),
                  }}
                />,
              )}
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
