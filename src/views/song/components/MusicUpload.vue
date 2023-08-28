<!-- 
  实验性组件：歌曲解析上传组件
  支持批量上传mp3文件，生成OSS链接并自动解析出歌曲相关信息，生成新增歌曲信息弹窗
  由于上传时除了生成OSS链接之外，还会调用其他查询解析接口来查询歌曲关联信息，所以有一定等待时间
  这里采用的是el-upload的自动上传逻辑，因此每个上传文件都会独立调用upload接口，这样也有利于统计成功和失败数量
  所有的成功or失败响应返回之后，收集全部的成功数据emit到父组件中进行处理
  warning：该组件涉及mp3文件直传服务器，文件流解析、上传OSS等大流量操作，在阿里云ECS上表现很差，受服务器带宽严重影响（上传几乎都不成功），仅建议本地代理使用
 -->
<script setup lang="ts">
import { shallowRef, ref, computed, watch } from "vue";
import {
  UPLOAD_URL,
  HEADERS,
  MAX_SIZE_TEXT,
  ACCEPT,
  LIMIT_COUNT,
  uploadSizeJudge
} from "./uploadConstant";
import { message } from "@/utils/message";
import { type UploadProps, ElLoading } from "element-plus";
import { ErrorCode } from "@/music-api/code/ErrorCode";
import type SystemResponse from "@/music-api/code/SystemResponse";
import type { SongCreate } from "@/api/song";

defineOptions({
  name: "MusicUpload"
});

const emit = defineEmits(["generate-new-songs"]);

/** 模拟ElLoading.service返回值的接口类型 element-plus不支持提供这个类型 */
interface LoadingService {
  setText: (text: string) => void;
  close: () => void;
}

// 等待上传文件计数 成功计数 失败计数 Loading实例
const waitingUploadCount = ref(0);
const successfulUploadCount = ref(0);
const failureUploadCount = ref(0);
const loadingInstance = shallowRef<LoadingService>(null);

// 计数方法
const beforeUploadCount = () => (waitingUploadCount.value += 1);
const completedUploadCount = () => (waitingUploadCount.value -= 1);
const succeedCount = () => (successfulUploadCount.value += 1);
const failCount = () => (failureUploadCount.value += 1);

// 成功回调数据收集列表
const successfulNewSongs = shallowRef<Array<SongCreate>>([]);

const beforeUploadHandler: UploadProps["beforeUpload"] = rawFile => {
  const flag = uploadSizeJudge(rawFile);
  // 判断为true才调用上传计数，返回true才回正常上传执行
  flag && beforeUploadCount();
  return flag;
};

/** 成功回调，成功和失败回调触发次数之和等于上传回调触发次数 上传计数-1 成功计数+1 */
const onSuccessResponse: UploadProps["onSuccess"] = (
  response: SystemResponse<Array<SongCreate>>
) => {
  completedUploadCount();
  if (response.code === ErrorCode.OK) {
    succeedCount();
    // 收集响应数据
    successfulNewSongs.value.push(...response.data);
  } else {
    failCount();
    message(response.msg, { type: "error" });
  }
};

/** 失败回调，成功和失败回调触发次数之和等于上传回调触发次数 上传计数-1 失败计数+1 */
const onErrorResponse: UploadProps["onError"] = error => {
  completedUploadCount();
  failCount();
  message(error.message, { type: "error" });
};

const loadingOption = {
  lock: true,
  text: "上传解析歌曲中...",
  background: "rgba(0, 0, 0, 0.7)"
};

const liveFilesAnnouncement = computed(
  () =>
    `上传解析歌曲中... 等待数：${waitingUploadCount.value} 成功数：${successfulUploadCount.value} 失败数：${failureUploadCount.value}`
);

/** 监听等待上传文件计数，
 * newCount大于0 -> loading为null则开启loading，loading实例持续更新计数信息
 * oldCount等于0 -> 起始清空数据收集列表
 * newCount等于0 -> 末尾关闭loading 清空成功和失败计数 抛送数据收集列表 */
watch(waitingUploadCount, (newCount, oldCount) => {
  if (newCount > 0) {
    if (loadingInstance.value === null) {
      loadingInstance.value = ElLoading.service(loadingOption);
    }
    loadingInstance.value.setText(liveFilesAnnouncement.value);
  }
  if (oldCount === 0) {
    successfulNewSongs.value = [];
  }
  if (newCount === 0) {
    loadingInstance.value.close();
    loadingInstance.value = null;
    const successfulCount = successfulUploadCount.value;
    const failureCount = failureUploadCount.value;
    message(`上传解析已完成，成功${successfulCount}个，失败${failureCount}个`);
    successfulUploadCount.value = 0;
    failureUploadCount.value = 0;
    if (successfulNewSongs.value.length > 0) {
      emit("generate-new-songs", successfulNewSongs.value);
    }
  }
});
</script>

<template>
  <el-upload
    class="flex flex-row-reverse items-center mb-4"
    :action="UPLOAD_URL"
    :headers="HEADERS"
    :show-file-list="false"
    multiple
    :accept="ACCEPT"
    :limit="LIMIT_COUNT"
    :before-upload="beforeUploadHandler"
    :on-success="onSuccessResponse"
    :on-error="onErrorResponse"
  >
    <el-tooltip effect="light" placement="bottom" :enterable="false">
      <template #content>
        <div class="text-sm text-gray-500 font-semibold">
          支持批量上传mp3文件，生成OSS链接并自动解析出歌曲相关信息，生成新增歌曲信息弹窗
          <div class="text-xl font-bold">
            警告：建议仅在本地开发使用，远程上传严重受带宽影响
          </div>
        </div>
      </template>
      <el-button type="primary">智能上传解析歌曲</el-button>
    </el-tooltip>
    <template #tip>
      <div
        class="el-upload__tip p-1 mr-2 !mt-0 border-2 border-red-400 font-semibold"
      >
        格式限制: <span class="text-sm">{{ ACCEPT }}</span
        >; 大小限制：<span class="text-sm">{{ MAX_SIZE_TEXT }}</span
        >; 数量限制：<span class="text-sm">{{ LIMIT_COUNT }}</span>
      </div>
    </template>
  </el-upload>
</template>
