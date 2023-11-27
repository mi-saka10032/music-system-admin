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
  MULTIPLE_SIZE,
  MAX_SIZE_TEXT,
  ACCEPT,
  LIMIT_COUNT,
  uploadSizeJudge
} from "./uploadConstant";
import { message } from "@/utils/message";
import { type UploadProps, ElLoading } from "element-plus";
import { ErrorCode } from "@/music-api/code/ErrorCode";
import type SystemResponse from "@/music-api/code/SystemResponse";
import {
  type SongCreate,
  type OSSCreate,
  getOSSAnalysisResult
} from "@/api/song";
import { useOSS } from "@/hooks/useOSS";
import type OSS from "ali-oss";
import { type UploadRequestOptions } from "element-plus";

defineOptions({
  name: "MusicUpload"
});

const emit = defineEmits(["generate-new-songs"]);

/** 通用：模拟ElLoading.service返回值的接口类型 element-plus不支持提供这个类型 */
interface LoadingService {
  setText: (text: string) => void;
  close: () => void;
}

// 通用：上传配置项
const loadingOption = {
  lock: true,
  text: "上传解析歌曲中...",
  background: "rgba(0, 0, 0, 0.7)"
};

// 通用：上传提示信息
const liveFilesAnnouncement = computed(
  () =>
    `上传解析歌曲中... 等待数：${waitingUploadCount.value} 成功数：${successfulUploadCount.value} 失败数：${failureUploadCount.value}`
);

// 通用：等待上传文件计数 成功计数 失败计数 Loading实例
const waitingUploadCount = ref(0);
const successfulUploadCount = ref(0);
const failureUploadCount = ref(0);
const loadingInstance = shallowRef<LoadingService>(null);

// 通用：计数方法
const beforeUploadCount = () => (waitingUploadCount.value += 1);
const completedUploadCount = () => (waitingUploadCount.value -= 1);
const succeedCount = () => (successfulUploadCount.value += 1);
const failCount = () => (failureUploadCount.value += 1);

// 通用：成功回调数据收集列表
const successfulNewSongs = shallowRef<Array<SongCreate>>([]);

// 通用：上传前回调，多文件上传前计数
const beforeUploadHandler: UploadProps["beforeUpload"] = rawFile => {
  const flag = uploadSizeJudge(rawFile);
  // 判断为true才调用上传计数，返回true才回正常上传执行
  flag && beforeUploadCount();
  return flag;
};

/** 旧上传组件：成功回调，成功和失败回调触发次数之和等于上传回调触发次数 上传计数-1 成功计数+1 */
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

/** 旧上传组件：失败回调，成功和失败回调触发次数之和等于上传回调触发次数 上传计数-1 失败计数+1 */
const onErrorResponse: UploadProps["onError"] = error => {
  completedUploadCount();
  failCount();
  message(error.message, { type: "error" });
};

/** 新上传组件：使用OSS */
const { client, downloadPrefix } = useOSS();

/** 新上传组件：OSS链接数据收集 */
const ossData = shallowRef<OSSCreate[]>([]);

/** 批量上传阿里云OSS函数 */
async function batchUploadOSS(item: UploadRequestOptions) {
  if (client.value != null) {
    const originalName = item.file.name;
    // 1. 根据{时间戳-原始文件名}生成唯一的文件名
    const filename = `${Date.now()}-${originalName}`;
    try {
      let downloadUrl = "";
      if (item.file.size >= MULTIPLE_SIZE) {
        // 1.大文件分片上传
        const result: OSS.MultipartUploadResult =
          await client.value.multipartUpload(
            `/music/${filename}`,
            item.file,
            {}
          );
        // 3.根据结果name获取签名url（真正的可下载链接）
        if (result.name && result?.res.status === 200) {
          downloadUrl = downloadPrefix.value + result.name;
        }
      } else {
        // 2.小文件普通上传
        const result: OSS.PutObjectResult = await client.value.put(
          `/music/${filename}`,
          item.file
        );
        if (result.name && result?.res.status === 200) {
          downloadUrl = result.url;
        }
      }
      if (downloadUrl.length > 0) {
        // 生成的OSS链接有效，推入ossData等待统一上传调用分析接口
        ossData.value.push({
          ossPath: downloadUrl,
          filename: originalName
        });
        completedUploadCount();
        succeedCount();
      } else {
        completedUploadCount();
        failCount();
      }
    } catch (error: any) {
      completedUploadCount();
      failCount();
      console.log(error);
    }
  } else {
    completedUploadCount();
    failCount();
    message("获取阿里云OSS实例失败，请刷新后重试", { type: "error" });
  }
}

/** 监听等待上传文件计数，
 * newCount大于0 -> loading为null则开启loading，loading实例持续更新计数信息
 * oldCount等于0 -> 起始清空数据收集列表
 * newCount等于0 -> 末尾关闭loading 清空成功和失败计数 抛送数据收集列表 */
watch(waitingUploadCount, async (newCount, oldCount) => {
  if (newCount > 0) {
    if (loadingInstance.value === null) {
      loadingInstance.value = ElLoading.service(loadingOption);
    }
    loadingInstance.value.setText(liveFilesAnnouncement.value);
  }
  if (oldCount === 0) {
    ossData.value = [];
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
    // 通过判断ossData的情况，确认是否使用了新上传组件。长度不为0的情况下，批量调用接口解析oss歌曲链接
    if (ossData.value.length > 0) {
      successfulNewSongs.value = await Promise.all(
        ossData.value.map(data => getOSSAnalysisResult(data))
      );
    }
    if (successfulNewSongs.value.length > 0) {
      emit("generate-new-songs", successfulNewSongs.value);
    }
  }
});
</script>

<template>
  <div class="flex justify-end">
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
    <el-upload
      class="ml-2"
      multiple
      :action="UPLOAD_URL"
      :headers="HEADERS"
      :show-file-list="false"
      :accept="ACCEPT"
      :before-upload="beforeUploadHandler"
      :http-request="batchUploadOSS"
    >
      <el-tooltip effect="light" placement="bottom" :enterable="false">
        <template #content>
          <div class="text-sm text-gray-500 font-semibold">
            <div>支持批量上传mp3文件，更改为浏览器上传至OSS生成链接</div>
            <div>服务器读取并解析出歌曲相关信息，生成新增歌曲信息弹窗</div>
            <div class="text-xl font-bold">推荐使用</div>
          </div>
        </template>
        <el-button type="primary">智能上传解析歌曲（新）</el-button>
      </el-tooltip>
    </el-upload>
  </div>
</template>
