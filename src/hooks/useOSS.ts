import { type Ref, type ShallowRef, onMounted, ref, shallowRef } from "vue";
import OSS from "@/views/song/components/oss";
import { getSTSToken } from "@/api/song";

interface UseOSS {
  client: ShallowRef<InstanceType<typeof OSS>>;
  downloadPrefix: Ref<String>;
}

export function useOSS(): UseOSS {
  const client = shallowRef<InstanceType<typeof OSS>>(null);

  const downloadPrefix = ref("");

  /** 挂载时初始化阿里云客户端实例 */
  onMounted(async () => {
    const data = await getSTSToken();
    downloadPrefix.value = data.region;
    client.value = new window.OSS({
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

  return {
    client,
    downloadPrefix
  };
}
