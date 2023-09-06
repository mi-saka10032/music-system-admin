import { reactive } from "vue";
import { useUpdate } from "@/hooks/useForm";
import { useMusicStoreHook } from "@/store/modules/music";
import { updateSong } from "@/api/song";
import type { SongUpdate } from "@/api/song";
import type { DialogOptions } from "@/components/ReDialog";
import SimpleForm from "@/components/SimpleForm/index.vue";
import OSSUpload from "../components/OSSUpload.vue";

export function useUpdateDialog(sureCallback: Function) {
  const { updateForm, updateFormColumns, resetUpdateForm, updateSuccessMsg } =
    useUpdate<SongUpdate>(
      {
        id: null,
        songName: "",
        duration: 0,
        lyric: "",
        musicUrl: "",
        publishTime: null,
        albumId: null,
        singerIds: []
      },
      useMusicStoreHook().songDetailFormColumns
    );

  /** 歌曲编辑详情弹窗 */
  const editDialog = reactive<DialogOptions>({
    title: "歌曲信息编辑",
    contentRenderer: () => (
      <SimpleForm
        formValue={updateForm}
        formColumns={updateFormColumns}
        showButton={false}
        isFlex={false}
      >
        {{
          ossUpload: () => <OSSUpload v-model={updateForm.musicUrl} />
        }}
      </SimpleForm>
    ),
    beforeSure: async (done: Function) => {
      await updateSong(updateForm);
      updateSuccessMsg();
      done();
      sureCallback && sureCallback();
    }
  });

  return {
    updateForm, // 外部表格需要findId填充编辑表单
    updateFormColumns, // 表单配置存在el-select列表变化
    resetUpdateForm, // 外部需要接收Dialog配置
    editDialog // 重置编辑表单参数
  };
}
