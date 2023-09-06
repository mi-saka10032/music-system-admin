import { reactive } from "vue";
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
          ossUpload: () => <OSSUpload v-model={createForm.musicUrl} />
        }}
      </SimpleForm>
    ),
    beforeSure: async (done: Function) => {
      await createSong(createForm);
      createSuccessMsg();
      done();
      sureCallback && sureCallback();
    }
  });

  return {
    createFormColumns, // 表单配置存在el-select列表变化
    createDialog, // 外部需要接收Dialog配置
    resetCreateForm // 重置新增表单参数
  };
}
