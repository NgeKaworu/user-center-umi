import { ReactNode } from 'react';

// Perm 权限schema
export default interface Perm {
  id: string; // id
  name: ReactNode; // 权限名
  createAt: string; // 创建时间
  updateAt: string; // 更新时间

  // menu
  pID?: string; // 父级id
  url?: string; // url
}
