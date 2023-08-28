<script setup lang="ts">
import { onMounted } from "vue";
import {
  UPLOAD_URL,
  HEADERS,
  ACCEPT,
  MAX_SIZE_TEXT,
  uploadSizeJudge
} from "./uploadConstant";
import { OSS } from "ali-oss";
import { type OSSConfig, getSTSToken } from "@/api/song";
import { type UploadProps } from "element-plus";

defineOptions({
  name: "OSSUpload"
});

const ossConfig: OSSConfig = {};

const beforeUploadHandler: UploadProps["beforeUpload"] = rawFile => {
  const flag = uploadSizeJudge(rawFile);
  // 判断为true
};

onMounted(() => {});
</script>

<template>
  <el-upload
    :action="UPLOAD_URL"
    :headers="HEADERS"
    :show-file-list="false"
    :accept="ACCEPT"
    :before-upload="beforeUploadHandler"
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        大小限制：<span class="text-[14px]">{{ MAX_SIZE_TEXT }}</span>
      </div>
    </template>
  </el-upload>
</template>
