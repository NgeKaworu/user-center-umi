import { restful } from './';
import { curry_p } from '../../decorators/utils';
import { Curry } from '../../decorators/type';

const methods = ['get', 'delete', 'head', 'options', 'post', 'put', 'patch'] as const;
export default methods.reduce(
  (acc, method) => ({ ...acc, [method]: curry_p(restful?.[method]) }),
  {} as Record<typeof methods[number], Curry<typeof restful[typeof methods[number]]>>,
);
