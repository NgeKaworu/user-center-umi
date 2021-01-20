import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useQuery } from 'react-query';

import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Table,
  Tag,
  Divider,
  Popconfirm,
} from 'antd';
import moment from 'moment';

import * as http from '@/http';
import SearchForm from './components/SearchForm';
import UserOperator, { User } from './components/UserOperator';

export default () => {
  const [page, setPage] = useState(1);
  const _location = useLocation();

  const { isLoading, data: res } = useQuery(
    ['user-list', page, _location?.search],
    () => {
      const params: { [key: string]: string | Number } = Object.fromEntries(
        new URLSearchParams(_location?.search),
      );
      params.page = page;
      return http.RESTful.get('/main/user/list', {
        params,
        silence: 'success',
      });
    },
  );

  function dateFormat(date: string) {
    return date && moment(date).format('YYYY/MM/DD');
  }

  function isAdmin(role: boolean) {
    return role ? <Tag color="green">管理员</Tag> : <Tag>用户</Tag>;
  }

  const columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '昵称',
      dataIndex: 'name',
    },
    {
      title: '注册日期',
      dataIndex: 'createAt',
      render: dateFormat,
    },
    {
      title: '修改日期',
      dataIndex: 'updateAt',
      render: dateFormat,
    },
    {
      title: '权限',
      dataIndex: 'isAdmin',
      render: isAdmin,
    },
    {
      title: '操作',
      dataIndex: 'operator',
      render: (_: undefined, record: User) => <UserOperator user={record} />,
    },
  ];

  console.log(res);

  return (
    <Card style={{ width: '100%', height: '100%', margin: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <SearchForm isLoading={isLoading}>
          <Form.Item name="keyword">
            <Input placeholder="输入关键字以查询" allowClear></Input>
          </Form.Item>
        </SearchForm>
        <Button type="primary">新建用户</Button>
        <Table
          loading={isLoading}
          rowKey="id"
          columns={columns}
          dataSource={res?.data}
        />
      </Space>
    </Card>
  );
};
