<script setup lang="tsx">
import { useTable } from "@/layout/hooks/useTable";
import { ref, reactive, onMounted, computed } from "vue";
import type { SongForm, SongParam, SongResult, SongDetail } from "@/api/song";
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
import { formatDateWithAny, formatDuration } from "@/utils/formatTime";
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
  openLoading,
  closeLoading
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
tableColumns.value = [
  { type: "selection" },
  {
    label: "歌曲名称",
    prop: "songName"
  },
  {
    label: "歌词",
    prop: "lyric",
    showOverflowTooltip: true
  },
  {
    label: "链接",
    prop: "musicUrl"
  },
  {
    label: "所属专辑",
    prop: "albumName",
    cellRenderer: ({ row }) => <>{(row as SongResult).album?.albumName}</>
  },
  {
    label: "歌手",
    prop: "singerName",
    cellRenderer: ({ row }) => (
      <div>
        {(row as SongResult).singers.map(singer => (
          <div>{singer.singerName}</div>
        ))}
      </div>
    )
  },
  {
    label: "发行日期",
    prop: "publishTime",
    cellRenderer: ({ row }) => <>{formatDateWithAny(row["publishTime"])}</>
  },
  {
    label: "歌曲时长",
    prop: "duration",
    cellRenderer: ({ row }) => <>{formatDuration(row["duration"])}</>,
    // SimpleForm 指定 className 为 set_number 表明el-input应采取number形式
    className: "set_number"
  },
  {
    label: "操作",
    fixed: "right",
    slot: "operation"
  }
];

pagination.pageSize = ORIGIN_PAGE_SIZE;

/** 已选中表格ids */
const checkedIds = ref<Array<number>>([]);

/** 歌曲查询表单配置 */
const songFormColumns = computed(() => [
  ...tableColumns.value.slice(1, 7),
  {
    label: "开始发行日期",
    prop: "startPublishTime",
    slot: "startPublishTime"
  },
  {
    label: "截止发行日期",
    prop: "endPublishTime",
    slot: "endPublishTime"
  }
]);

/** 歌曲表单详情配置 与上面的查询用表单略有区别 */
const songFormDetailColumns = computed(() => [
  // 截取 歌名、歌词、链接
  ...tableColumns.value.slice(1, 4),
  // 此处的三个自定义插槽，需要在songDialog实现
  {
    label: "所属专辑",
    prop: "albumName",
    slot: "albumName"
  },
  {
    label: "歌手",
    prop: "singerName",
    slot: "singerName"
  },
  {
    label: "发行日期",
    prop: "publishTime",
    slot: "publishTime"
  },
  ...tableColumns.value.slice(7, 8)
]);

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

/** 歌曲详情表单 */
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

/** 歌曲详情弹窗 */
const songDialog = reactive<DialogOptions>({
  title: "歌曲详情",
  contentRenderer: () => (
    <SimpleForm
      formValue={songFormDetail}
      formColumns={songFormDetailColumns.value}
      showButton={false}
      isFlex={false}
      v-slots={{
        albumName: () => (
          <el-select
            v-model={songFormDetail.albumId}
            clearable={true}
            placeholder="请选择专辑"
          >
            {song_albums.value.map(item => (
              <el-option value={item.value} label={item.label} />
            ))}
          </el-select>
        ),
        singerName: () => (
          <el-select
            v-model={songFormDetail.singerIds}
            multiple={true}
            clearable={true}
            placeholder="请选择歌手"
          >
            {song_singers.value.map(item => (
              <el-option value={item.value} label={item.label} />
            ))}
          </el-select>
        ),
        publishTime: () => (
          <el-date-picker
            v-model={songFormDetail.publishTime}
            type="date"
            placeholder="发行日期"
          />
        )
      }}
    ></SimpleForm>
  ),
  beforeSure: async (done: Function) => {
    // 歌曲的新增与更新参数区别较大，新增时支持同时新增所属专辑与歌手
    // 专辑or歌手不存在则新建并关联，若存在则直接关联
    if (songFormDetail.id && songFormDetail.id !== 0) {
      await updateSong(songFormDetail);
      message("修改成功", { type: "success" });
    } else {
      await createSong(songFormDetail);
      message("新增成功", { type: "success" });
    }
    done();
    getLists();
  }
});

interface OptionValue {
  label: string;
  value: string | number;
}

/** 歌曲详情-歌手筛选项列表 */
const song_singers = ref<Array<OptionValue>>([]);

// singer的全量筛选项 挂载时触发
async function querySingerLists(): Promise<void> {
  const param = { pageNo: 1, pageSize: 1000 };
  const { data } = await getSingerLists(param as SingerParam);
  song_singers.value = data.list.map(item => ({
    value: item.id,
    label: item.singerName
  }));
}

/** 歌曲详情-专辑筛选项列表 */
const song_albums = ref<Array<OptionValue>>([]);

// album的全量筛选项 挂载时触发
async function queryAlbumLists(): Promise<void> {
  const param = { pageNo: 1, pageSize: 1000 };
  const { data } = await getAlbumLists(param as AlbumParam);
  song_albums.value = data.list.map(item => ({
    value: item.id,
    label: item.albumName
  }));
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
    songFormDetail.id = null;
    songFormDetail.songName = "";
    songFormDetail.duration = null;
    songFormDetail.lyric = "";
    songFormDetail.musicUrl = "";
    songFormDetail.publishTime = null;
    songFormDetail.albumId = null;
    songFormDetail.singerIds = [];
  }
  addDialog(dialogOption);
}

function injectCheckedIds(checkedTableData: Array<SongResult>) {
  checkedIds.value = checkedTableData.map(item => item.id);
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

function handleCurrentPageChange(cp: number) {
  pagination.currentPage = cp;
  getLists();
}

function handlePageSizeChange(ps: number) {
  pagination.pageSize = ps;
  getLists();
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
      @create="openDialog(songDialog)"
      @delete="batchDeleteLists"
    >
      <template #startPublishTime>
        <el-date-picker
          v-model="songForm.startPublishTime"
          type="date"
          placeholder="开始日期"
        />
      </template>
      <template #endPublishTime>
        <el-date-picker
          v-model="songForm.endPublishTime"
          type="date"
          placeholder="截止日期"
        />
      </template>
    </SimpleForm>
    <pure-table
      :loading="loading"
      :columns="tableColumns"
      :data="tableData"
      :pagination="pagination"
      @selection-change="injectCheckedIds"
      @page-current-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <!-- 操作列的slot名称必须为operation -->
      <template #operation="{ row }">
        <InlineButton
          @inline-edit="openDialog(songDialog, row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>
