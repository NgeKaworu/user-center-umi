import { mainHost } from './host';

export const config: ProxyConfig = {
  '/main/': {
    target: mainHost,
    pathRewrite: ['^/main/', '/'],
  },
};

export interface ProxyConfig {
  [matchPath: string]: {
    target: string | Function;
    pathRewrite?: [string, string];
  };
}

/**
 * 参考webpack devServer 的 proxy
 * https://webpack.docschina.org/configuration/dev-server/#devserver-proxy
 * @param {url} url 请求的url
 * @param {options} Options proxy的参数
 */
export default function proxy(url: string, proxy: ProxyConfig) {

  const matchKey = Object.keys(proxy).find(i => url.match(`^${i}`));

  if (matchKey === undefined ){
    throw new Error(`Not match url: ${url}, proxy: ${proxy}`) 
  }

  const { target, pathRewrite } = proxy[matchKey];
  const realURL = typeof target === 'function' ? target() : target;

  if (pathRewrite !== undefined ){
    const [source, replace] = pathRewrite;
    const proxyUrl = url.replace(source, replace);
    return realURL + proxyUrl
  }
  
  return realURL + url;
};
