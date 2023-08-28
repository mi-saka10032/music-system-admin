import { ref, reactive, computed } from "vue";
import { useCreate } from "@/hooks/useForm";
import { useMusicStoreHook } from "@/store/modules/music";
import { createSong } from "@/api/song";
import type { SongCreate } from "@/api/song";
import type { DialogOptions } from "@/components/ReDialog";
import SimpleForm from "@/components/SimpleForm/index.vue";
import OSSUpload from "../components/OSSUpload.vue";

export function useCreateDialog(sureCallback: Function) {
  const { createForm, createFormColumns, resetCreateForm, createSuccessMsg } =
    useCreate<SongCreate>(
      {
        songName: "",
        duration: 0,
        lyric: "",
        musicUrl: "",
        publishTime: null,
        album: {
          albumName: "",
          coverUrl: "",
          publishTime: null
        },
        singer: {
          singerName: "",
          coverUrl: ""
        },
        albumId: null,
        singerId: null
      },
      useMusicStoreHook().songCreateFormColumns
    );

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

  /** 歌曲新增详情弹窗 */
  const createDialog = reactive<DialogOptions>({
    title: "歌曲信息新增",
    contentRenderer: () => (
      <SimpleForm
        formValue={createForm}
        formColumns={createFormColumns}
        showButton={false}
        isFlex={false}
      >
        {{
          ossUpload: () => (
            <div class="w-full">
              <el-input v-model={createForm.musicUrl}>
                {{
                  append: () => (
                    <OSSUpload
                      onProgress={(p: string) =>
                        (ossProgress.value = Number(p))
                      }
                      onSuccess={(url: string) => (createForm.musicUrl = url)}
                    />
                  )
                }}
              </el-input>
              <el-progress
                class="mt-1"
                style={{ display: ossProgress.value > 0 ? "flex" : "none" }}
                text-inside
                stroke-width={16}
                percentage={ossProgress.value}
                status={ossStatus.value}
              />
            </div>
          )
        }}
      </SimpleForm>
    ),
    beforeSure: async (done: Function) => {
      await createSong(createForm);
      createSuccessMsg();
      done();
      sureCallback && sureCallback();
    },
    closeCallBack: () => {
      ossProgress.value = 0;
    }
  });

  return {
    createFormColumns, // 表单配置存在el-select列表变化
    createDialog, // 外部需要接收Dialog配置
    resetCreateForm // 重置新增表单参数
  };
}
