export const mainHost = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://api.furan.xyz/user-center';
    default:
      return '/user-center-go';
  }
};
