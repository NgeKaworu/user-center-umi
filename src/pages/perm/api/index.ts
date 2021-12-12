import { Tail } from '@/js-sdk/decorators/type';
import { restful } from '@/js-sdk/utils/http';

export const create = (...args: Tail<Parameters<typeof restful.post>>) =>
  restful.post('user-center/perm/create', ...args);
export const deleteOne = (id: string, ...args: Tail<Parameters<typeof restful.delete>>) =>
  restful.delete(`user-center/perm/remove/${id}`, ...args);
export const update = (...args: Tail<Parameters<typeof restful.put>>) =>
  restful.put('user-center/perm/update', ...args);
export const list = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get('user-center/perm/list', ...args);
