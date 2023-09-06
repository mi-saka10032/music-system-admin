import { reactive } from "vue";
import { useMusicStoreHook } from "@/store/modules/music";
import { useScrollView } from "@/hooks/useScrollView";
import { batchCreateSongs } from "@/api/song";
import type { SongCreate } from "@/api/song";
import { addDialog, type DialogOptions } from "@/components/ReDialog";
import {
  type SocketSongResponse,
  SocketSongEnum,
  SocketSongText
} from "@/music-api/code/SocketSongEnum";
import { message } from "@/utils/message";
import SimpleForm from "@/components/SimpleForm/index.vue";
import OSSUpload from "../components/OSSUpload.vue";
import {
  Back,
  Right,
  SetUp,
  DataAnalysis,
  UploadFilled,
  MagicStick
} from "@element-plus/icons-vue";

export function useBatchTemplateDialog(sureCallback: Function) {
  /** 批量模板表单响应式数据 */
  const batchTemplates = reactive({
    /** 批量式模板新增歌曲列表 */
    newSongs: new Array<SongCreate>(),
    /** 批量式模板歌曲新增表单详情配置 */
    formColumns: useMusicStoreHook().songTemplateCreateFormColumns,
    /** 内嵌歌手表单详情配置 */
    albumFormColumns: useMusicStoreHook().albumDetailFormColumns,
    /** 内嵌专辑表单详情配置 */
    singerFormColumns: useMusicStoreHook().singerFormColumns,
    /** 弹窗阻塞等待状态，用于关闭进度条弹窗后判断模板歌曲表单是否等待开启 */
    isWaiting: false
  });

  /** 歌曲进度条响应式数据 */
  const songProgress = reactive({
    /** 歌曲进度列表 */
    songLists: new Array<SocketSongResponse>(),
    /** socket弹窗添加判断值 */
    isAlive: false
  });

  /** 重置模板表单参数 */
  function resetBatchTemplate() {
    batchTemplates.newSongs = [];
    batchTemplates.isWaiting = false;
  }

  /** 重置进度条参数 */
  function resetSongProgress() {
    songProgress.songLists = [];
    songProgress.isAlive = false;
  }

  /** 批量模板表单页滚动参数 */
  const {
    childrenLength,
    enablePrev,
    enableNext,
    prevTo,
    nextTo,
    resetCurIndex
  } = useScrollView(".outer_form");

  /** 批量式模板歌曲新增详情弹窗 使用slot插槽制作内嵌歌手表单和专辑表单 */
  const batchTemplateSongsDialog = reactive<DialogOptions>({
    title: "批量新增歌曲信息",
    openDelay: 100,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    contentRenderer: () => (
      <div>
        <div class="outer_form flex overflow-x-scroll">
          {batchTemplates.newSongs.map(item => (
            <SimpleForm
              class="grow-0 shrink-0 basis-full"
              formValue={item}
              formColumns={batchTemplates.formColumns}
              showButton={false}
              isFlex={false}
            >
              {{
                ossUpload: () => <OSSUpload v-model:value={item.musicUrl} />,
                embedAlbum: () => (
                  <SimpleForm
                    class="embed_album w-full"
                    formValue={item.album}
                    formColumns={batchTemplates.albumFormColumns}
                    showButton={false}
                    isFlex={false}
                  />
                ),
                embedSinger: () => (
                  <SimpleForm
                    class="embed_singer w-full"
                    formValue={item.singer}
                    formColumns={batchTemplates.singerFormColumns}
                    showButton={false}
                    isFlex={false}
                  />
                )
              }}
            </SimpleForm>
          ))}
        </div>
        {batchTemplates.newSongs.length > 1 ? (
          <div class="flex justify-center items-center mt-2">
            <el-button
              icon={Back}
              circle
              disabled={!enablePrev.value}
              onClick={prevTo}
            />
            <el-button
              icon={Right}
              circle
              disabled={!enableNext.value}
              onClick={nextTo}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    ),
    beforeSure: async (done: Function) => {
      await batchCreateSongs(batchTemplates.newSongs);
      message("批量新增成功", { type: "success" });
      done();
      sureCallback && sureCallback();
    },
    // 批量模板表单关闭时
    // 1.必定重置表单参数
    // 2.同时也需要重置相关联的进度表参数
    // 3.重置翻页索引值
    closeCallBack: () => {
      resetBatchTemplate();
      resetSongProgress();
      resetCurIndex();
    }
  });

  /** 歌曲进度socket弹窗 */
  const progressDialog = reactive<DialogOptions>({
    title: "歌曲上传进度",
    closeOnClickModal: false,
    closeOnPressEscape: false,
    contentRenderer: () => (
      <ul>
        {songProgress.songLists.map((item, index) => (
          <li key={item.originalName + index} class="flex items-center">
            <el-tooltip placement="left" effect="light" enterable={false}>
              {{
                default: () => (
                  <div class="w-48 truncate text-base font-semibold">
                    {item.originalName}：
                  </div>
                ),
                content: () => (
                  <div class="text-base font-semibold">{item.originalName}</div>
                )
              }}
            </el-tooltip>
            <el-steps
              class="flex-1"
              active={item.status}
              process-status="finish"
              finish-status="success"
              align-center
            >
              <el-step
                title={SocketSongEnum[0]}
                description={SocketSongText[0]}
                icon={SetUp}
              />
              <el-step
                title={SocketSongEnum[1]}
                description={SocketSongText[1]}
                icon={DataAnalysis}
              />
              <el-step
                title={SocketSongEnum[2]}
                description={SocketSongText[2]}
                icon={UploadFilled}
              />
              <el-step
                title={SocketSongEnum[3]}
                description={SocketSongText[3]}
                icon={MagicStick}
              />
            </el-steps>
          </li>
        ))}
      </ul>
    ),
    // 不需要按钮确认
    footerRenderer: () => <div></div>,
    // 关闭弹窗后 判断模板弹窗等待值是否为true，说明模板歌曲信息已生成，添加dialog打开，同时重置进度表参数
    closeCallBack: () => {
      if (batchTemplates.isWaiting) {
        resetSongProgress();
        addDialog(batchTemplateSongsDialog);
      }
    }
  });

  // 四个reactive数据都需要暴露 模板数量长度也需要暴露
  return {
    batchTemplates,
    songProgress,
    batchTemplateSongsDialog,
    progressDialog,
    childrenLength
  };
}
