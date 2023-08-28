<script setup lang="tsx">
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useTable } from "@/hooks/useTable";
import { useRead, useDelete } from "@/hooks/useForm";
import { useCreateDialog } from "@/views/song/dialogs/useCreateDialog";
import { useUpdateDialog } from "@/views/song/dialogs/useUpdateDialog";
import { useBatchTemplateDialog } from "@/views/song/dialogs/useBatchTemplateDialog";
import { useMusicStoreHook } from "@/store/modules/music";
import type {
  SongQueryForm,
  SongParam,
  SongResult,
  SongCreate
} from "@/api/song";
import { getSongLists, getSongDetail, deleteSong } from "@/api/song";
import { type SingerParam, getSingerLists } from "@/api/singer";
import { type AlbumParam, getAlbumLists } from "@/api/album";
import { type SocketSongResponse } from "@/music-api/code/SocketSongEnum";
import { addDialog, dialogStore } from "@/components/ReDialog";
import { useWebsocket } from "@/hooks/useWebsocket";
import { emitter } from "@/utils/mitt";
import SimpleForm from "@/components/SimpleForm/index.vue";
import MusicUpload from "@/views/song/components/MusicUpload.vue";

/** 因为Song集成的Dialog表单功能太多，这里将新增、编辑、批量模板新增等内嵌Dialog表单拆分成hooks以便阅读 */
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

/** 歌曲表格配置 */
tableColumns.value = useMusicStoreHook().songTableColumns;

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

/** 新增表单 */
const { createFormColumns, createDialog, resetCreateForm } =
  useCreateDialog(getLists);

/** 编辑表单 */
const { updateForm, updateFormColumns, editDialog, resetUpdateForm } =
  useUpdateDialog(getLists);

/** 批量模板新增表单 */
const {
  batchTemplates,
  songProgress,
  batchTemplateSongsDialog,
  progressDialog,
  childrenLength
} = useBatchTemplateDialog(getLists);

const { deleteSuccessMsg, deleteNoCheckedMsg } = useDelete();

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
      item.status = data.status + 1; // status + 1表示当前进度已完成
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

/** 开启websocket */
useWebsocket();

onMounted(() => {
  getLists();
  querySingerLists();
  queryAlbumLists();
  emitter.on("websocketMessage", updateSongProgress);
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
