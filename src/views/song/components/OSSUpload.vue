<script setup lang="ts">
import { ref, computed } from "vue";
import { useOSS } from "@/hooks/useOSS";
import OSS from "./oss";
import { MAX_SIZE_TEXT, uploadSizeJudge } from "./uploadConstant";
import { type UploadRequestOptions } from "element-plus";
import { message } from "@/utils/message";

defineOptions({
  name: "OSSUpload"
});

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(["update:modelValue"]);

/** 双向绑定el-input value */
const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  }
});

/** 阿里云OSS实例 url前缀 */
const { client, downloadPrefix } = useOSS();

/** 阿里云OSS文件上传进度百分比 */
const ossProgress = ref(0);

/** 阿里云OSS文件上传进度状态 */
const ossStatus = computed(() => {
  const progress = ossProgress.value;
  if (progress >= 0 && progress <= 50) {
    return "exception";
  } else if (progress > 50 && progress < 100) {
    return "warning";
  } else if (progress >= 100) {
    return "success";
  } else return "";
});

const ossLoading = ref(false);

/** 允许上传格式 */
const multi_accept = [
  ".wav",
  ".flac",
  ".aac",
  ".ogg",
  ".aiff",
  ".wma",
  ".mp3"
].join(",");

/** 上传阿里云OSS函数 */
async function uploadOSS(item: UploadRequestOptions) {
  if (client.value != null) {
    ossLoading.value = true;
    // 1. 根据{时间戳-原始文件名}生成唯一的文件名
    const filename = `${Date.now()}-${item.file.name}`;
    try {
      // 2.分片上传
      const result: OSS.MultipartUploadResult =
        await client.value.multipartUpload(`/music/${filename}`, item.file, {
          // 呈递上传进度
          progress: (p: number) =>
            (ossProgress.value = Number((p * 100).toFixed(0)))
        });
      // 3.根据结果name获取签名url（真正的可下载链接）
      if (result.name && result?.res.status === 200) {
        const downloadUrl = downloadPrefix.value + result.name;
        // 呈递OSS链接
        localValue.value = downloadUrl;
      }
    } catch (error: any) {
      console.log(error);
    }
    ossLoading.value = false;
  } else {
    message("获取阿里云OSS实例失败，请刷新后重试", { type: "error" });
  }
}
</script>

<template>
  <div class="w-full">
    <el-input
      v-model="localValue"
      v-loading="ossLoading"
      placeholder="请上传文件后待返回OSS链接"
    >
      <template #append>
        <el-upload
          :multiple="false"
          :show-file-list="false"
          :accept="multi_accept"
          :before-upload="uploadSizeJudge"
          :http-request="uploadOSS"
        >
          <el-button type="primary"
            >点击上传OSS(大小限制{{ MAX_SIZE_TEXT }})</el-button
          >
        </el-upload>
      </template>
    </el-input>
    <el-progress
      class="mt-1"
      :class="ossProgress > 0 ? 'flex' : 'hidden'"
      text-inside
      :stroke-width="16"
      :percentage="ossProgress"
      :status="ossStatus"
    />
  </div>
</template>
