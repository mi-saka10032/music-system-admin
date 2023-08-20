<script setup lang="tsx">
import { useTable } from "@/layout/hooks/useTable";
import { reactive, computed, onMounted } from "vue";
import { useMusicStoreHook } from "@/store/modules/music";
import type {
  SongForm,
  SongParam,
  SongResult,
  SongDetail,
  SongCreate
} from "@/api/song";
import {
  getSongLists,
  getSongDetail,
  updateSong,
  createSong,
  deleteSong
} from "@/api/song";
import { type DialogOptions, addDialog } from "@/components/ReDialog";
import SimpleForm from "@/components/SimpleForm/index.vue";
import { message } from "@/utils/message";
import { type SingerParam, getSingerLists } from "@/api/singer";
import { type AlbumParam, getAlbumLists } from "@/api/album";

defineOptions({
  name: "Song"
});

const {
  ORIGIN_CURRENT_PAGE,
  ORIGIN_PAGE_SIZE,
  loading,
  tableColumns,
  tableData,
  pagination,
  checkedIds,
  openLoading,
  closeLoading,
  injectCheckedIds,
  handleCurrentPageChange,
  handlePageSizeChange
} = useTable<SongResult>();

/** 歌曲表单 */
const songForm = reactive<SongForm>({
  songName: "",
  lyric: "",
  startPublishTime: null,
  endPublishTime: null,
  albumName: "",
  singerName: ""
});

/** 歌曲表格配置 */
tableColumns.value = useMusicStoreHook().songTableColumns;

/** 歌曲查询表单配置 */
const songFormColumns = useMusicStoreHook().songQueryFormColumns;

/** 歌曲表单详情配置 与上面的查询用表单略有区别 */
const songFormDetailColumns = useMusicStoreHook().songDetailFormColumns;

/** 歌曲新增表单详情配置 */
const songFormCreateColumn = useMusicStoreHook().songCreateFormColumns;

/** 歌曲请求参数 */
const songRequest = computed<SongParam>(() => ({
  songName: songForm.songName,
  lyric: songForm.lyric,
  startPublishTime: songForm.startPublishTime,
  endPublishTime: songForm.endPublishTime,
  albumName: songForm.albumName,
  singerName: songForm.singerName,
  pageNo: pagination.currentPage,
  pageSize: pagination.pageSize
}));

/** 歌曲编辑详情表单 */
const songFormDetail = reactive<SongDetail>({
  id: null,
  songName: "",
  duration: 0,
  lyric: "",
  musicUrl: "",
  publishTime: null,
  albumId: null,
  singerIds: []
});

/** 歌曲编辑详情弹窗 */
const songDetailDialog = reactive<DialogOptions>({
  title: "歌曲详情",
  contentRenderer: () => (
    <SimpleForm
      formValue={songFormDetail}
      formColumns={songFormDetailColumns}
      showButton={false}
      isFlex={false}
    />
  ),
  beforeSure: async (done: Function) => {
    await updateSong(songFormDetail);
    message("修改成功", { type: "success" });
    done();
    getLists();
  }
});

/** 歌曲新增详情表单 */
const songFormCreate = reactive<SongCreate>({
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
});

/** 歌曲新增详情表单 */
const songCreateDialog = reactive<DialogOptions>({
  title: "新增歌曲",
  contentRenderer: () => (
    <SimpleForm
      formValue={songFormCreate}
      formColumns={songFormCreateColumn}
      showButton={false}
      isFlex={false}
    />
  ),
  beforeSure: async (done: Function) => {
    await createSong(songFormCreate);
    message("新增成功", { type: "success" });
    done();
    getLists();
  }
});

// singer的全量筛选项 挂载时触发
async function querySingerLists(): Promise<void> {
  const param = { pageNo: 1, pageSize: 1000 };
  const { data } = await getSingerLists(param as SingerParam);
  const options = data.list.map(item => ({
    value: item.id,
    label: item.singerName
  }));
  for (let i = 0; i < songFormDetailColumns.length; i++) {
    if (songFormDetailColumns[i].prop === "singerIds") {
      songFormDetailColumns[i].options = options;
      break;
    }
  }
  for (let i = 0; i < songFormCreateColumn.length; i++) {
    if (songFormCreateColumn[i].prop === "singerId") {
      songFormCreateColumn[i].options = options;
      break;
    }
  }
}

// album的全量筛选项 挂载时触发
async function queryAlbumLists(): Promise<void> {
  const param = { pageNo: 1, pageSize: 1000 };
  const { data } = await getAlbumLists(param as AlbumParam);
  const options = data.list.map(item => ({
    value: item.id,
    label: item.albumName
  }));
  for (let i = 0; i < songFormDetailColumns.length; i++) {
    if (songFormDetailColumns[i].prop === "albumId") {
      songFormDetailColumns[i].options = options;
      break;
    }
  }
  for (let i = 0; i < songFormCreateColumn.length; i++) {
    if (songFormCreateColumn[i].prop === "albumId") {
      songFormCreateColumn[i].options = options;
      break;
    }
  }
}

/** 歌曲详情-专辑筛选项列表 */
async function getLists(): Promise<void> {
  openLoading();
  try {
    const { data } = await getSongLists(songRequest.value);
    const list: Array<SongResult> = data.list;
    tableData.value = list;
    pagination.total = data.total;
  } catch (error: any) {
    console.log(error);
  }
  closeLoading();
}

function resetLists(): void {
  songForm.songName = "";
  songForm.lyric = "";
  songForm.albumName = "";
  songForm.singerName = "";
  songForm.startPublishTime = null;
  songForm.endPublishTime = null;
  pagination.currentPage = ORIGIN_CURRENT_PAGE;
  pagination.pageSize = ORIGIN_PAGE_SIZE;
  getLists();
}

async function deleteList(id: number): Promise<void> {
  await deleteSong(id);
  message("删除成功", { type: "success" });
  getLists();
}

async function openDialog(
  dialogOption: DialogOptions,
  id?: number
): Promise<void> {
  if (id && id !== 0) {
    const { data } = await getSongDetail(id);
    songFormDetail.id = data.id;
    songFormDetail.songName = data.songName;
    songFormDetail.duration = data.duration;
    songFormDetail.lyric = data.lyric;
    songFormDetail.musicUrl = data.musicUrl;
    songFormDetail.publishTime = data.publishTime;
    songFormDetail.albumId = data.album?.id;
    songFormDetail.singerIds = data.singers.map(item => item.id);
  } else {
    songFormCreate.songName = "";
    songFormCreate.duration = null;
    songFormCreate.lyric = "";
    songFormCreate.musicUrl = "";
    songFormCreate.publishTime = null;
    songFormCreate.albumId = null;
    songFormCreate.singerId = null;
  }
  addDialog(dialogOption);
}

async function batchDeleteLists() {
  if (checkedIds.value.length > 0) {
    await Promise.all(checkedIds.value.map(id => deleteSong(id)));
    message("删除成功", { type: "success" });
    getLists();
  } else {
    message("当前无选中项", { type: "error" });
  }
}

onMounted(() => {
  getLists();
  querySingerLists();
  queryAlbumLists();
});
</script>

<template>
  <div>
    <SimpleForm
      :form-value="songForm"
      :form-columns="songFormColumns"
      :show-button="true"
      :is-flex="true"
      @query="getLists"
      @reset="resetLists"
      @create="openDialog(songCreateDialog)"
      @delete="batchDeleteLists"
    />
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
          @inline-edit="openDialog(songDetailDialog, row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>
