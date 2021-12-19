import { restful } from '@/js-sdk/utils/http';
import { Spin } from 'antd';
import { useQuery } from 'react-query';

export default () => {
  const profile = useQuery(['profile'], () => restful.get('user-center/profile'));

  return <Spin spinning={profile.isFetching}>profile</Spin>;
};
