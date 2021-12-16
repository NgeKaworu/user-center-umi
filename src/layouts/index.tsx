import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { PropsWithChildren } from 'react';

import { ConfigProvider, Layout } from 'antd';

const { Content } = Layout;

import zhCN from 'antd/es/locale/zh_CN';

const queyClient = new QueryClient();

export default (props: PropsWithChildren<any>) => {
  return (
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN}>
        <Layout style={{ height: '100%' }}>
          <Content>{props.children}</Content>
        </Layout>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
