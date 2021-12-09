import curriedRestful from '@/js-sdk/utils/http/curriedRestful';

export const create = curriedRestful.post('/perm/create');
export const remove = (id: string) => curriedRestful.delete(`/perm/remove/${id}`);
export const update = curriedRestful.put('/perm/update');
export const list = curriedRestful.get('/perm/list');
