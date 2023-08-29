<h1>music-system-admin 一款简约的音乐管理系统</h1>

## 来源

系统模板参考自 [vue-admin-thin](https://github.com/pure-admin/pure-admin-thin) ，非常感谢 pure 提供的项目灵感、齐全的基础功能和高自由度开发。

因为不需要太过复杂的组件和依赖，所以没有选用功能更完整的 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin)。

## 介绍

整体功能：歌手管理、专辑管理和歌曲管理

#### 歌手管理

歌手信息的增删改查，支持勾选批量删除，每个歌手可查看关联的歌曲信息，支持歌曲与歌手解除关联

### 专辑管理

专辑信息的增删改查，支持勾选批量删除，每个专辑可查看关联的歌曲信息，支持专辑与歌手解除关联

### 歌曲管理

1. 歌曲信息的增删改查，支持勾选批量删除
2. 新增歌曲时支持阿里云 OSS 客户端直传，可生成有效的阿里云链接录入新增数据
3. 【实验性功能】
   - 提供可批量上传的歌曲信息解析功能，歌曲文件上传至服务器后可解析歌曲基本信息，生成相关字段，同时自动上传阿里云 OSS 生成链接，并通过网易云 API 查询详细信息完成填充
   - 整个过程会开启 Websocket 监听上传进度，自动弹出步骤条弹窗
   - 批量上传完成后，关闭步骤条弹窗，会跟随弹出上传解析成功的歌曲信息弹窗，可对内部信息做二次编辑，随后可批量新增歌曲
   - 注意：由于该功能需要将文件上传至后端服务器，上传和解析进度受服务器带宽影响很大，仅建议本地开发使用，远程线上环境慎用

## 关联仓库地址

后端仓库：<https://github.com/mi-saka10032/jay-music-manage-system.git>

类型仓库：<https://github.com/mi-saka10032/music-api.git>

后端项目也是使用 Typescript 开发，所以前后端仓库共用同一个类型数据（DTO、VO）子仓库

## 环境要求

开发环境：建议 Node 版本>16 以上

包管理器：only pnpm，请使用 pnpm 安装启动项目

```bash
npm install -g pnpm
```

## 安装

### 克隆项目

```bash
git clone git@github.com:mi-saka10032/music-system-admin.git

# 项目里有git子仓库，需要初始化并更新子仓库内容
# 这个指令只在第一次克隆时使用
git submodule init

# 更新子仓库内容到最新分支记录
git submodule update
```

执行完 submodule 命令后如果`src/music-api`目录下不为空则子仓库拉取成功

### 安装依赖

```bash
pnpm install
```

## 启动

```bash
pnpm serve
```

加载完成后打开 <http://localhost:8848> 访问

**注意：**该项目的前端对接接口功能完整，请拉取[jay-music-manage-system](https://github.com/mi-saka10032/jay-music-manage-system.git)，按照步骤启动后端接口后，再访问前端项目
