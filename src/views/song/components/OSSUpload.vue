<script setup lang="ts">
import { onMounted } from "vue";
import {
  UPLOAD_URL,
  HEADERS,
  ACCEPT,
  MAX_SIZE_TEXT,
  uploadSizeJudge
} from "./uploadConstant";
import { getSTSToken } from "@/api/song";
import { message } from "@/utils/message";
import { type UploadRequestOptions } from "element-plus";

defineOptions({
  name: "OSSUpload"
});

const emit = defineEmits(["progress", "success"]);

let client = null;

let downloadPrefix = "";

/** 上传阿里云OSS函数 */
async function uploadOSS(item: UploadRequestOptions) {
  if (client) {
    // 1. 根据{时间戳-原始文件名}生成唯一的文件名
    const filename = `${Date.now()}-${item.file.name}`;
    try {
      // 2.分片上传
      const result = await client.multipartUpload(
        `/music/${filename}`,
        item.file,
        {
          // 呈递上传进度
          progress: (p: number) => emit("progress", Number(p * 100).toFixed(0))
        }
      );
      // 3.根据结果name获取签名url（真正的可下载链接）
      if (result.name && result?.res.status === 200) {
        const downloadUrl = downloadPrefix + result.name;
        // 呈递OSS链接
        emit("success", downloadUrl);
      }
    } catch (error: any) {
      console.log(error);
    }
  } else {
    message("获取阿里云OSS实例失败，请刷新后重试", { type: "error" });
  }
}

/** 挂载时初始化阿里云客户端实例 */
onMounted(async () => {
  const data = await getSTSToken();
  console.log(data);
  downloadPrefix = data.region;
  client = new window.OSS({
    region: "oss-cn-chengdu",
    accessKeyId: data.accessKeyId,
    accessKeySecret: data.accessKeySecret,
    stsToken: data.stsToken,
    bucket: data.bucket,
    refreshSTSToken: async () => {
      const data = await getSTSToken();
      console.log("refreshSTSToken");
      return {
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.stsToken
      };
    },
    refreshSTSTokenInterval: 300000
  });
});
</script>

<template>
  <el-upload
    :action="UPLOAD_URL"
    :headers="HEADERS"
    :show-file-list="false"
    :accept="ACCEPT"
    :before-upload="uploadSizeJudge"
    :http-request="uploadOSS"
  >
    <el-button type="primary"
      >点击上传OSS(大小限制{{ MAX_SIZE_TEXT }})</el-button
    >
  </el-upload>
</template>
