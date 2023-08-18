<script setup lang="tsx">
import { useTable } from "@/layout/hooks/useTable";
import { ref, reactive, onMounted, computed } from "vue";
import type {
  AlbumForm,
  AlbumParam,
  AlbumResult,
  AlbumDetail
} from "@/api/album";
import {
  getAlbumLists,
  getAlbumDetail,
  updateAlbum,
  createAlbum,
  deleteAlbum
} from "@/api/album";
import type { BaseSongResult } from "@/api/song";
import { type DialogOptions, addDialog } from "@/components/ReDialog";
import SimpleForm from "@/components/SimpleForm/index.vue";
import ReCol from "@/components/ReCol";
import BaseSongsTable from "../song/components/BaseSongsTable.vue";
import { message } from "@/utils/message";
import formatDateWithAny from "@/utils/formatDate";

defineOptions({
  name: "Album"
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
} = useTable<AlbumResult>();

/** 专辑表单 */
const albumForm = reactive<AlbumForm>({
  albumName: "",
  coverUrl: "",
  startPublishTime: null,
  endPublishTime: null
});

/** 专辑表格配置 */
tableColumns.value = [
  { type: "selection" },
  {
    label: "专辑名称",
    prop: "albumName"
  },
  {
    label: "专辑图片链接",
    prop: "coverUrl",
    cellRenderer: ({ row }) =>
      row["coverUrl"] ? (
        <img src={row["coverUrl"]} class="w-24 h-24" />
      ) : (
        <div class="w-24 h-24" />
      )
  },
  {
    label: "发行日期",
    prop: "publishTime",
    cellRenderer: ({ row }) => (
      <div>{formatDateWithAny(row["publishTime"])}</div>
    )
  },
  {
    label: "歌曲列表",
    prop: "songs",
    cellRenderer: ({ row }) => (
      <el-button
        type="success"
        onClick={() => openDialog(albumSongsDialog, row.id as number)}
      >
        编辑查看
      </el-button>
    )
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

/** 专辑表单配置 */
const albumFormColumns = computed(() => [
  ...tableColumns.value.slice(1, 3),
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

/** 专辑表单详情配置 与上面的查询用表单配置略有区别 */
const albumFormDetailColumns = computed(() => [
  ...tableColumns.value.slice(1, 3),
  {
    label: "发行日期",
    prop: "publishTime",
    slot: "publishTime"
  }
]);

/** 专辑请求参数 */
const albumRequest = computed<AlbumParam>(() => ({
  albumName: albumForm.albumName,
  coverUrl: albumForm.coverUrl,
  startPublishTime: albumForm.startPublishTime,
  endPublishTime: albumForm.endPublishTime,
  pageNo: pagination.currentPage,
  pageSize: pagination.pageSize
}));

/** 专辑详情表单 */
const albumFormDetail = reactive<AlbumDetail>({
  id: null,
  albumName: "",
  coverUrl: "",
  publishTime: null
});

/** 专辑详情弹窗 */
const albumDialog = reactive<DialogOptions>({
  title: "专辑详情",
  contentRenderer: () => (
    <SimpleForm
      formValue={albumFormDetail}
      formColumns={albumFormDetailColumns.value}
      showButton={false}
      v-slots={{
        publishTime: () => (
          <el-date-picker
            v-model={albumFormDetail.publishTime}
            type="date"
            placeholder="开始日期"
          />
        )
      }}
    />
  ),
  beforeSure: async (done: Function) => {
    if (albumFormDetail.id && albumFormDetail.id !== 0) {
      await updateAlbum(albumFormDetail);
      message("修改成功", { type: "success" });
    } else {
      await createAlbum(albumFormDetail);
      message("新增成功", { type: "success" });
    }
    done();
    getLists();
  }
});

/** 专辑详情-歌曲列表 */
const albumSongs = ref<Array<BaseSongResult>>([]);

/** 专辑详情-歌曲弹窗 */
const albumSongsDialog = reactive<DialogOptions>({
  title: "专辑-歌曲详情",
  contentRenderer: () => (
    <div>
      <el-row class="mt-5 mb-5">
        <ReCol value={8}>专辑ID：{albumFormDetail.id}</ReCol>
        <ReCol value={8}>专辑名称：{albumFormDetail.albumName}</ReCol>
        <ReCol value={8}>发行日期：{albumFormDetail.publishTime}</ReCol>
      </el-row>
      <BaseSongsTable baseSongs={albumSongs.value} />
    </div>
  )
});

async function getLists(): Promise<void> {
  openLoading();
  try {
    const { data } = await getAlbumLists(albumRequest.value);
    const list: Array<AlbumResult> = data.list;
    tableData.value = list;
    pagination.total = data.total;
  } catch (error: any) {
    console.log(error);
  }
  closeLoading();
}

function resetLists(): void {
  albumForm.albumName = "";
  albumForm.coverUrl = "";
  albumForm.startPublishTime = null;
  albumForm.endPublishTime = null;
  pagination.currentPage = ORIGIN_CURRENT_PAGE;
  pagination.pageSize = ORIGIN_PAGE_SIZE;
  getLists();
}

async function deleteList(id: number): Promise<void> {
  await deleteAlbum(id);
  message("删除成功", { type: "success" });
  getLists();
}

async function openDialog(
  dialogOption: DialogOptions,
  id?: number
): Promise<void> {
  if (id && id !== 0) {
    const { data } = await getAlbumDetail(id);
    albumFormDetail.id = data.id;
    albumFormDetail.albumName = data.albumName;
    albumFormDetail.coverUrl = data.coverUrl;
    albumFormDetail.publishTime = data.publishTime;
    albumSongs.value = data.songs;
  } else {
    albumFormDetail.id = 0;
    albumFormDetail.albumName = "";
    albumFormDetail.coverUrl = "";
    albumFormDetail.publishTime = null;
    albumSongs.value = [];
  }
  addDialog(dialogOption);
}

function injectCheckedIds(checkedTableData: Array<AlbumResult>) {
  checkedIds.value = checkedTableData.map(item => item.id);
}

async function batchDeleteLists() {
  if (checkedIds.value.length > 0) {
    await Promise.all(checkedIds.value.map(id => deleteAlbum(id)));
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
});
</script>

<template>
  <div>
    <SimpleForm
      :form-value="albumForm"
      :form-columns="albumFormColumns"
      :show-button="true"
      @query="getLists"
      @reset="resetLists"
      @create="openDialog(albumDialog)"
      @delete="batchDeleteLists"
    >
      <template #startPublishTime>
        <el-date-picker
          v-model="albumForm.startPublishTime"
          type="date"
          placeholder="开始日期"
        />
      </template>
      <template #endPublishTime>
        <el-date-picker
          v-model="albumForm.endPublishTime"
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
          @inline-edit="openDialog(albumDialog, row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>
