// Perm 权限schema
export default interface Perm {
  id: string; // id
  name: string; // 权限名
  key: string; // 权限标识
  createAt: string; // 创建时间
  updateAt: string; // 更新时间

  // menu
  pKey?: string; // 父级key
  url?: string; // url
}
