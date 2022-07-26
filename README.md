# umi project

## Getting Started

<<<<<<< HEAD
Install dependencies,
=======
建议使用 git subtree 引入项目

```sh
# 添加加远端URL
git remote add -f edk https://github.com/NgeKaworu/js-sdk.git

# 添加subtree -P --prefix 前缀的缩写  --squash 是压缩成一个
git subtree add -P src/js-sdk edk master --squash
# 拉取 subtree
git subtree pull -P src/js-sdk edk master --squash
# 推送 subtree
git subtree push -P src/js-sdk edk master
>>>>>>> eeef7c7 (Squashed 'src/js-sdk/' changes from 7a1d8dc..e323c52)

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```
