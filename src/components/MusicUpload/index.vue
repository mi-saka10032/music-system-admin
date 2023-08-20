<script setup lang="ts">
import { ref, watch } from "vue";
import { formatToken, getToken } from "@/utils/auth";
import { type UploadProps, ElLoading } from "element-plus";

defineOptions({
  name: "MusicUpload"
});

/** 上传headers */
const headers = {
  Authorization: formatToken(getToken()?.accessToken || "")
};

/** 上传文件计数 */
const uploadFilesCount = ref(0);

const beforeUploadCount: UploadProps["beforeUpload"] = () => {
  uploadFilesCount.value += 1;
  return true;
};

const onSuccessResponse: UploadProps["onSuccess"] = response => {
  uploadFilesCount.value -= 1;
  console.log(response);
};

const onErrorResponse: UploadProps["onError"] = (error: any) => {
  uploadFilesCount.value -= 1;
  console.log(error);
};

let loadingInstance = null;

const loadingOption = {
  lock: true,
  text: "上传解析歌曲中...",
  background: "rgba(0, 0, 0, 0.7)"
};

/** 监听上传文件计数，
 * oldCount为0 -> 开启loading
 * newCount为0 -> 关闭loading */
watch(uploadFilesCount, (newCount, oldCount) => {
  if (oldCount === 0) {
    loadingInstance = ElLoading.service(loadingOption);
  } else if (newCount === 0) {
    loadingInstance.close();
  }
});
</script>

<template>
  <el-upload
    class="flex justify-end mb-4"
    action="/api/song/upload"
    :headers="headers"
    :show-file-list="false"
    multiple
    accept=".mp3"
    :limit="10"
    :before-upload="beforeUploadCount"
    :on-success="onSuccessResponse"
    :on-error="onErrorResponse"
  >
    <el-button type="primary">上传歌曲(可批量)</el-button>
    <template #tip>
      <div class="el-upload__tip ml-2 !mt-2">格式限制:MP3;大小限制：256MB</div>
    </template>
  </el-upload>
</template>
