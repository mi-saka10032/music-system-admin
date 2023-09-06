import { defineStore } from "pinia";
import { store } from "@/store";
import { getSTSToken } from "@/api/song";

export const useOSSStore = defineStore({
  id: "music-oss",
  state: () => ({
    prefix: "",
    client: null
  }),
  actions: {
    async initOSS(): Promise<void> {
      const data = await getSTSToken();
      console.log(data);
      this.prefix = data.region;
      this.client = new window.OSS({
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
    }
  }
});

export function useOSSStoreHook() {
  return useOSSStore(store);
}
