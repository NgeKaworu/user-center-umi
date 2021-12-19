import { useState, Key } from 'react';
import { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import Perm from '@/model/Perm';
import { list, deleteOne } from '../api';
import Editor from './Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { Button, Space, Typography, Popconfirm, Form, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MENU_TYPE_MAP } from '../model/constant';
import { useQuery } from 'react-query';
import LightTable from '@/js-sdk/components/LightTable';
import style from '@/js-sdk/components/LightTablePro/index.less';
import Search from '@/js-sdk/components/Search';
import perm2Tree from '../util/perm2Tree';
const { Link } = Typography;

export default () => {
  const [keyword, setKeyword] = useState<Perm>();
  const [expandedRowKeys, onExpandedRowsChange] = useState<readonly Key[]>([]);

  const perms = useQuery(
      ['perm-list'],
      () =>
        list({
          params: {
            skip: 0,
            limit: 0,
          },
        }),
      {
        refetchOnWindowFocus: false,
      },
    ),
    dataSource = perm2Tree(
      perms.data?.data?.filter((p) => keyword?.isMenu === void 0 || p.isMenu === keyword?.isMenu),
    );

  const editor = useModalForm();
  const [form] = Form.useForm();

  const columns: LightTableProColumnProps<Perm & { keyword?: string }>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      hideInSearch: true,
      copyable: true,
      width: 150,
    },
    { dataIndex: 'keyword', title: '关键字', hideInTable: true },
    { dataIndex: 'isMenu', title: '是否菜单', valueEnum: MENU_TYPE_MAP, width: 100 },
    { dataIndex: 'name', title: '权限名', hideInSearch: true, width: 150 },
    {
      dataIndex: 'pID',
      title: '父级菜单',
      hideInSearch: true,
      copyable: true,
      width: 200,
      ellipsis: { padding: 17, tooltip: true },
    },
    {
      dataIndex: 'url',
      title: 'url',
      hideInSearch: true,
      copyable: true,
      width: 200,
      ellipsis: { padding: 17, tooltip: true },
    },
    {
      dataIndex: 'createAt',
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'updateAt',
      title: '更新时间',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'id',
      title: '操作',
      hideInSearch: true,
      width: 180,
      fixed: 'right',
      render: (id, row) => (
        <Space>
          {row.isMenu && <Link onClick={addSubMenu(row)}>添加子菜单</Link>}
          <Link onClick={edit(row)}>编辑</Link>
          <Popconfirm title="操作不可逆，请二次确认" onConfirm={remove(row)}>
            <Link>删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function create() {
    editor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
  }

  function edit(row: Perm) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      editor.form.setFieldsValue(row);
    };
  }

  function addSubMenu(row: Perm) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
      editor.form.setFieldsValue({ pID: row.id });
      onExpandedRowsChange((pre) => pre.concat(row.id));
    };
  }

  function remove(row: Perm) {
    return async () => {
      try {
        await deleteOne(row.id, { notify: true });
        perms.refetch();
      } catch {}
    };
  }

  function editSuccess(res: { data: Key }) {
    perms.refetch();
  }

  function resetAndReload() {
    setKeyword(void 0);
  }

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />

      <div className={`${style.flex} ${style.column}`}>
        <Search
          columns={columns}
          formProps={{ form, onFinish: setKeyword, onReset: resetAndReload }}
        />

        <Card>
          <div className={`${style.flex} ${style.column}`}>
            <div className={`${style.flex} ${style?.['space-between']}`}>
              <div>
                <Space>
                  <Button icon={<PlusOutlined />} type="primary" ghost onClick={create}>
                    新增
                  </Button>
                </Space>
              </div>
            </div>

            <LightTable<Perm>
              size="small"
              rowKey={'id'}
              columns={columns}
              scroll={{ x: 'max-content' }}
              sticky
              columnEmptyText="-"
              bordered
              loading={perms.isFetching}
              expandable={{ onExpandedRowsChange, expandedRowKeys }}
              dataSource={dataSource?.length ? dataSource : perms.data?.data}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};
