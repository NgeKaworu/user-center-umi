import React from 'react';
import Table, { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import useLightTablePro from '@/js-sdk/components/LightTablePro/hook/useLightTablePro';
import Perm from '@/model/Perm';

export default () => {
  const { actionRef, formRef } = useLightTablePro();

  const columns: LightTableProColumnProps<Perm>[] = [];

  return <Table actionRef={actionRef} formRef={formRef} />;
};
