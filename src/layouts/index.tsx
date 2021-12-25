import { QueryClient, QueryClientProvider } from 'react-query';
import type { PropsWithChildren } from 'react';

import { ConfigProvider, Layout } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import styles from './index.less';
const { Content } = Layout;

const queyClient = new QueryClient();

export default (props: PropsWithChildren<any>) => {
  return (
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN}>
        <Layout className={styles.layout}>
          <Content className={styles.content}>{props.children}</Content>
        </Layout>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
