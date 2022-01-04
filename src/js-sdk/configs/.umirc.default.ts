import { defineConfig } from 'umi';

export default defineConfig({
  qiankun: {
    slave: {},
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/Loading',
  },
  helmet: false,
  dva: false,
  model: false,
  initialState: false,
  layout: false,
  locale: false,
  preact: false,
  request: false,
  sass: false,
  hash: true,
  runtimePublicPath: true,
  externals: {
    moment: 'moment',
    '@ant-design/icons': '@ant-design/icons',
  },
  scripts: [
    'https://lib.baomitu.com/moment.js/latest/moment.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/ant-design-icons/4.7.0/index.umd.min.js',
  ],
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'gzip', // stat  // gzip
  },
  chunks: ['react', 'umi', 'antd', 'lodash', 'vendors'],
  chainWebpack: (config: any) => {
    config.optimization.splitChunks({
      cacheGroups: {
        antd: {
          name: 'antd',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](antd|@ant-design|rc-.*)[\\/]/,
          priority: 4,
        },
        react: {
          name: 'react',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          priority: 3,
        },
        lodash: {
          name: 'lodash',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](lodash)[\\/]/,
          priority: 2,
        },
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
        },
      },
    });
  },
});
