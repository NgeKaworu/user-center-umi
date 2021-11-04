import { message } from 'antd';

import axios, { AxiosInstance, AxiosPromise } from 'axios';

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export type Notify = boolean | 'success' | 'fail';

export interface CustomRequestConfig extends AxiosRequestConfig {
  // 是否捕获错误
  throwError?: boolean;
  // 是否通知
  notify?: Notify;
  // 是否重新登录
  reAuth?: boolean;
}

export interface CustomResponse extends AxiosResponse {
  config: CustomRequestConfig;
}

export interface CustomInstance extends AxiosInstance {
  (config: CustomRequestConfig): AxiosPromise;
  (url: string, config?: CustomRequestConfig): AxiosPromise;
}

export interface CustomError extends AxiosError {
  config: CustomRequestConfig;
}

// 状态码对映的消息
const codeMessage: { [key: number]: string } = {
  200: '操作成功。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方式不对',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export const restful: CustomInstance = axios.create({
  baseURL: '/api/',
  timeout: 10000,
  timeoutErrorMessage: '连接超时，请检查网络后再试',
});

// header inject
restful.interceptors.request.use(function (options) {
  return {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `${localStorage.getItem('token')}`,
    },
  };
});

// biz checked
restful.interceptors.response.use(function (response) {
  if (response?.data?.ok) {
    return response;
  }

  throw new Error('biz error');
});

// success notify
restful.interceptors.response.use(function (response: CustomResponse) {
  const { data, config } = response;
  if ([true, 'success']?.includes(config?.notify ?? false)) {
    message.success({ content: data?.message || '操作成功' });
  }
  return data;
});

// error handler
restful.interceptors.response.use(undefined, (error: CustomError) => {
  const { response, message: eMsg, config } = error ?? {},
    { reAuth, notify, throwError } = config ?? {};
  // reAuth标记是用来防止连续401的熔断处理

  if (response?.status === 401) {
    return reAuth
      ? reAuthorization(config)
      : message.warning({
          content: '请先登录',
          onClose: () => {
            localStorage.clear();
            location.replace(`/user-center/login/`);
          },
        });
  }
  // silence标记为true 则不显示消息
  if ([true, 'fail']?.includes(notify ?? true)) {
    const timeoutMsg = eMsg.match('timeout') && '连接超时， 请检查网络。';
    const netErrMsg = eMsg.match('Network Error') && '网络错误，请检查网络。';

    message.error({
      content:
        // 超时
        timeoutMsg ||
        netErrMsg ||
        // 后端业务错误
        response?.data?.errMsg ||
        // 错误码错误
        codeMessage[response?.status as number] ||
        '未知错误',
    });
  }

  // 阻止throw
  if (throwError) {
    throw error;
  }

  return response;
});

// 重新授权处理
function reAuthorization(config: CustomRequestConfig) {
  return restful
    .get('/uc/oauth2/refresh', {
      reAuth: false,
      notify: 'fail',
      params: { token: localStorage.getStorage('refresh_token') },
    } as CustomRequestConfig)
    .then((resp: CustomResponse) => {
      localStorage.setItem('token', resp.data.token);
      localStorage.setItem('refresh_token', resp.data.refresh_token);
      return restful({ ...config, reAuth: false });
    });
}

export const graphqlMethods = ['query', 'mutation'] as const;

export const graphql = graphqlMethods.reduce(
  (acc, method) => ({
    ...acc,
    [method]:
      (url: string, options?: CustomRequestConfig) =>
      (...query: any[]) =>
        restful.post(url, {
          data: {
            query: `${method} {${query[0].reduce(
              (acc: string, cur: string, idx: number) =>
                acc + cur + (query[idx + 1] || ''),
              '',
            )}}`,
          },
          ...options,
        }),
  }),
  {} as Record<
    typeof graphqlMethods[number],
    <T = any>(opt?: CustomRequestConfig) => Promise<T>
  >,
);
