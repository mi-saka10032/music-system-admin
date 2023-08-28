<script setup lang="tsx">
import { reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useTable } from "@/hooks/useTable";
import { useCreate, useRead, useUpdate, useDelete } from "@/hooks/useForm";
import { useMusicStoreHook } from "@/store/modules/music";
import type {
  SongQueryForm,
  SongParam,
  SongResult,
  SongUpdate,
  SongCreate
} from "@/api/song";
import {
  getSongLists,
  getSongDetail,
  updateSong,
  createSong,
  deleteSong,
  batchCreateSongs,
  getSTSToken
} from "@/api/song";
import { type SingerParam, getSingerLists } from "@/api/singer";
import { type AlbumParam, getAlbumLists } from "@/api/album";
import {
  type SocketSongResponse,
  SocketSongEnum,
  SocketSongText
} from "@/music-api/code/SocketSongEnum";
import {
  type DialogOptions,
  addDialog,
  dialogStore
} from "@/components/ReDialog";
import { useScrollView } from "@/hooks/useScrollView";
import { useWebsocket } from "@/hooks/useWebsocket";
import { emitter } from "@/utils/mitt";
import {
  Back,
  Right,
  SetUp,
  DataAnalysis,
  UploadFilled,
  MagicStick
} from "@element-plus/icons-vue";
import SimpleForm from "@/components/SimpleForm/index.vue";
import MusicUpload from "./components/MusicUpload.vue";

defineOptions({
  name: "Song"
});

const {
  loading,
  tableColumns,
  tableData,
  pagination,
  checkedIds,
  openLoading,
  closeLoading,
  injectCheckedIds,
  handleCurrentPageChange,
  handlePageSizeChange,
  resetPagination
} = useTable<SongResult>();

const { queryForm, queryFormColumns, resetQueryForm } = useRead<SongQueryForm>(
  {
    songName: "",
    lyric: "",
    startPublishTime: null,
    endPublishTime: null,
    albumName: "",
    singerName: ""
  },
  useMusicStoreHook().songQueryFormColumns
);

const {
  createForm,
  createFormColumns,
  resetCreateForm,
  createSuccessMsg,
  batchCreateSuccessMsg
} = useCreate<SongCreate>(
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

const { deleteSuccessMsg, deleteNoCheckedMsg } = useDelete();

/** 歌曲表格配置 */
tableColumns.value = useMusicStoreHook().songTableColumns;

/** 歌曲列表查询请求参数 */
const songQueryParam = computed<SongParam>(() => ({
  songName: queryForm.songName,
  lyric: queryForm.lyric,
  startPublishTime: queryForm.startPublishTime,
  endPublishTime: queryForm.endPublishTime,
  albumName: queryForm.albumName,
  singerName: queryForm.singerName,
  pageNo: pagination.currentPage,
  pageSize: pagination.pageSize
}));

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
          <el-input v-model={createForm.musicUrl}>
            {{
              append: () => <el-upload />
            }}
          </el-input>
        )
      }}
    </SimpleForm>
  ),
  beforeSure: async (done: Function) => {
    await createSong(createForm);
    createSuccessMsg();
    done();
    getLists();
  }
});

/** 歌曲编辑详情弹窗 */
const editDialog = reactive<DialogOptions>({
  title: "歌曲信息编辑",
  contentRenderer: () => (
    <SimpleForm
      formValue={updateForm}
      formColumns={updateFormColumns}
      showButton={false}
      isFlex={false}
    />
  ),
  beforeSure: async (done: Function) => {
    await updateSong(updateForm);
    updateSuccessMsg();
    done();
    getLists();
  }
});

/** singer的全量筛选项 挂载时触发 */
async function querySingerLists(): Promise<void> {
  const param = { pageNo: 1, pageSize: 1000 };
  const data = await getSingerLists(param as SingerParam);
  const options = data.list.map(item => ({
    value: item.id,
    label: item.singerName
  }));
  for (let i = 0; i < createFormColumns.length; i++) {
    if (createFormColumns[i].prop === "singerId") {
      createFormColumns[i].options = options;
      break;
    }
  }
  for (let i = 0; i < updateFormColumns.length; i++) {
    if (updateFormColumns[i].prop === "singerIds") {
      updateFormColumns[i].options = options;
      break;
    }
  }
}

/** album的全量筛选项 挂载时触发 */
async function queryAlbumLists(): Promise<void> {
  const param = { pageNo: 1, pageSize: 1000 };
  const data = await getAlbumLists(param as AlbumParam);
  const options = data.list.map(item => ({
    value: item.id,
    label: item.albumName
  }));
  for (let i = 0; i < createFormColumns.length; i++) {
    if (createFormColumns[i].prop === "albumId") {
      createFormColumns[i].options = options;
      break;
    }
  }
  for (let i = 0; i < updateFormColumns.length; i++) {
    if (updateFormColumns[i].prop === "albumId") {
      updateFormColumns[i].options = options;
      break;
    }
  }
}

/** 查询歌曲列表 */
async function getLists(): Promise<void> {
  openLoading();
  try {
    const data = await getSongLists(songQueryParam.value);
    const list = data.list;
    tableData.value = list;
    pagination.total = data.total;
  } catch (error: any) {
    console.log(error);
  }
  closeLoading();
}

/** 重置查询歌曲列表 */
function resetLists(): void {
  resetQueryForm();
  resetPagination();
  getLists();
}

/** 删除歌曲信息 */
async function deleteList(id: number): Promise<void> {
  await deleteSong(id);
  deleteSuccessMsg();
  getLists();
}

/** 批量删除歌曲信息 */
async function batchDeleteLists() {
  if (checkedIds.value.length > 0) {
    await Promise.all(checkedIds.value.map(id => deleteSong(id)));
    deleteSuccessMsg();
    getLists();
  } else {
    deleteNoCheckedMsg();
  }
}

/** 打开歌曲新增普通弹窗 */
function openCreateDialog(): void {
  resetCreateForm();
  addDialog(createDialog);
}

/** 打开歌曲编辑弹窗 */
async function openUpdateDialog(id: number): Promise<void> {
  resetUpdateForm();
  const data = await getSongDetail(id);
  updateForm.id = data.id;
  updateForm.songName = data.songName;
  updateForm.duration = data.duration;
  updateForm.lyric = data.lyric;
  updateForm.musicUrl = data.musicUrl;
  updateForm.publishTime = data.publishTime;
  updateForm.albumId = data.album?.id;
  updateForm.singerIds = data.singers.map(item => item.id);
  addDialog(editDialog);
}

// 以下是歌曲管理页面独有功能

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

/** 批量式模板歌曲新增详情弹窗 使用slot插槽制作内嵌歌手表格单和专辑表单 */
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
    batchCreateSuccessMsg();
    done();
    getLists();
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

/** 上传组件生成的新增歌曲信息模板列表回调，生成批量式新增模板弹窗 */
function generateNewSongs(templateSongs: Array<SongCreate>) {
  batchTemplates.newSongs = templateSongs;
  // 为scrollView子元素可滚动长度赋值
  childrenLength.value = batchTemplates.newSongs.length;
  if (dialogStore.value.length === 0) {
    // 如果当前不存在其他额外弹窗，则直接打开弹窗
    addDialog(batchTemplateSongsDialog);
  } else {
    // 如果歌曲进度列表弹窗没被手动关闭，则手动植入等待值，等待歌曲进度列表弹窗关闭后判断等待值来打开这个等待弹窗
    batchTemplates.isWaiting = true;
  }
}

/** 上传进度WebSocket通信，生成实时进度条显示弹窗 */
function updateSongProgress(result: string) {
  let data: SocketSongResponse;
  try {
    data = JSON.parse(result);
  } catch (error: any) {
    console.log(error);
  }
  if (!data && typeof data !== "object") {
    return;
  }
  const flag = songProgress.songLists.some(item => {
    if (item.originalName === data.originalName) {
      item.status = data.status + 1;
      return true;
    }
  });
  if (!flag) {
    // 只有不存在于已有进度列表中的文件名(originalName)对象才会推入列表中
    songProgress.songLists.push(data);
  }
  // 如果进度条dialog已激活，则不需要重复添加dialog
  if (!songProgress.isAlive) {
    songProgress.isAlive = true;
    addDialog(progressDialog);
  }
}

useWebsocket();

onMounted(() => {
  getLists();
  querySingerLists();
  queryAlbumLists();
  emitter.on("websocketMessage", updateSongProgress);
  getSTSToken()
    .then(res => {
      console.log(res);
    })
    .catch((error: any) => {
      console.log(error);
    });
});

onBeforeUnmount(() => {
  emitter.off("websocketMessage");
});
</script>

<template>
  <div>
    <SimpleForm
      :form-value="queryForm"
      :form-columns="queryFormColumns"
      :show-button="true"
      :is-flex="true"
      @query="getLists"
      @reset="resetLists"
      @create="openCreateDialog"
      @delete="batchDeleteLists"
    />
    <MusicUpload @generate-new-songs="generateNewSongs" />
    <pure-table
      :loading="loading"
      :columns="tableColumns"
      :data="tableData"
      :pagination="pagination"
      @selection-change="injectCheckedIds"
      @page-current-change="handleCurrentPageChange($event, getLists)"
      @page-size-change="handlePageSizeChange($event, getLists)"
    >
      <!-- 操作列的slot名称必须为operation -->
      <template #operation="{ row }">
        <InlineButton
          @inline-edit="openUpdateDialog(row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>

<!-- 处理内嵌SimpleForm的样式优化 -->
<style lang="scss">
.outer_form {
  .el-form-item__label {
    font-weight: 700;
  }

  .embed_album,
  .embed_singer {
    .el-form-item:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
