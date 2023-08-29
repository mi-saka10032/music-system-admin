<script setup lang="ts">
import Meteors from "@/components/Meteors/index.vue";

defineOptions({
  name: "Welcome"
});

const repo = [
  {
    name: "前端仓库",
    url: "https://github.com/mi-saka10032/music-system-admin.git"
  },
  {
    name: "后端仓库",
    url: "https://github.com/mi-saka10032/jay-music-manage-system.git"
  },
  { name: "类型仓库", url: "https://github.com/mi-saka10032/music-api.git" }
];
</script>

<template>
  <div class="!m-0">
    <Meteors />
    <div class="relative z-10 p-6 text-slate-100">
      <h1 class="flex mb-2">
        <img src="/logo.svg" alt="" class="w-8" />一款简约的音乐管理系统
      </h1>
      <h3 class="mb-2">仓库地址</h3>
      <ul>
        <li v-for="(item, index) in repo" :key="index">
          <span>{{ item.name }}：</span>
          <el-link type="primary" :href="item.url">{{ item.url }}</el-link>
        </li>
      </ul>
      <h3 class="mt-2 mb-2">功能介绍</h3>
      <ol class="pl-4">
        <li class="list-decimal">整体功能：歌手管理、专辑管理和歌曲管理</li>
        <li class="list-decimal">
          歌手管理：歌手信息的增删改查，支持勾选批量删除，每个歌手可查看关联的歌曲信息，支持歌曲与歌手解除关联
        </li>
        <li class="list-decimal">
          专辑管理：专辑信息的增删改查，支持勾选批量删除，每个专辑可查看关联的歌曲信息，支持专辑与歌手解除关联
        </li>
        <li class="list-decimal">
          <h4 class="mb-2">歌曲管理：</h4>
          <ol>
            <li class="list-decimal">歌曲信息的增删改查，支持勾选批量删除</li>
            <li class="list-decimal">
              新增歌曲时支持阿里云OSS客户端直传，可生成有效的阿里云链接录入新增数据
            </li>
            <li class="list-decimal">
              <div>【实验性功能】</div>
              <div>
                提供可批量上传的歌曲信息解析功能，歌曲文件上传至服务器后可解析歌曲基本信息，生成相关字段，同时自动上传阿里云OSS生成链接，并通过网易云API查询详细信息完成填充
              </div>
              <div>整个过程会开启Websocket监听上传进度，自动弹出步骤条弹窗</div>
              <div>
                批量上传完成后，关闭步骤条弹窗，会跟随弹出上传解析成功的歌曲信息弹窗，可对内部信息做二次编辑，随后可批量新增歌曲
              </div>
              <div>
                <strong>注意：</strong
                >由于该功能需要将文件上传至后端服务器，上传和解析进度受服务器带宽影响很大，仅建议本地开发使用，远程线上环境慎用
              </div>
              <div>
                写在最后：整个解析+OSS上传的功能其实可以全部放在前端实现，OSS文件上传在上面已经实现了，解析也是有办法做到的
              </div>
            </li>
          </ol>
        </li>
      </ol>
    </div>
  </div>
</template>
