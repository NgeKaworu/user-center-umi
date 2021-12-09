import React from 'react';
import Table, { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import useLightTablePro from '@/js-sdk/components/LightTablePro/hook/useLightTablePro';
import Perm from '@/model/Perm';

export default () => {
  const { actionRef, formRef } = useLightTablePro();

  const columns: LightTableProColumnProps<Perm>[] = [
    { dataIndex: 'name', title: '权限名' },
    { dataIndex: 'key', title: 'key' },
    { dataIndex: 'createAt', title: '创建时间', valueType: 'dateTime' },
    { dataIndex: 'updateAt', title: '更新时间', valueType: 'dateTime' },
    { dataIndex: 'path', title: 'path' },
    { dataIndex: 'url', title: 'url' },
    { dataIndex: 'id', title: '操作' },
  ];

  return <Table columns={columns} actionRef={actionRef} formRef={formRef} />;
};
