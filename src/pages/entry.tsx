import { useParams, useHistory } from 'react-router-dom';
import { Button, Form, Card, FormProps, Typography } from 'antd';
import { ConfirmPwd, Email, Name, Pwd } from './user/component/Field';
import { restful } from '@/js-sdk/utils/http';
import { useMutation } from 'react-query';
import styles from './profile.less';

const { Item } = Form;
const { Link } = Typography;

const ENTRY_MAP = new Map([
  ['register', '注册'],
  ['login', '登录'],
]);

const ENTRY_SUB_MAP = new Map([
  ['register', '已有账号？现在登录！'],
  ['login', '没有账号？现在注册！'],
]);

type Entry = 'register' | 'login';

export default () => {
  const { entry } = useParams() as { entry: Entry },
    history = useHistory(),
    [form] = Form.useForm(),
    charon = useMutation((value) => restful.post(`user-center/${entry}`, value));

  if (!['register', 'login'].includes(entry)) {
    history.replace('/');
  }

  function switchEntry() {
    history.replace(`/${entry === 'login' ? 'register' : 'login'}`);
  }

  const onFinish: FormProps['onFinish'] = async (value) => {
    try {
      const res = await charon.mutateAsync(value);
      window.localStorage.setItem('token', res?.data);
      history.push('/');
    } catch {}
  };

  return (
    <div className={styles.content}>
      <Card title="Welcome" style={{ height: 720, width: 405 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {entry === 'register' && <Name />}
          <Email checkout={entry === 'register'} />
          <Pwd />
          {entry === 'register' && <ConfirmPwd />}
          <Item noStyle>
            <Button htmlType="submit" type="primary" ghost block loading={charon.isLoading}>
              {ENTRY_MAP.get(entry)}
            </Button>
          </Item>

          <Item>
            <Link onClick={switchEntry}>{ENTRY_SUB_MAP.get(entry)}</Link>
          </Item>
        </Form>
      </Card>
    </div>
  );
};
