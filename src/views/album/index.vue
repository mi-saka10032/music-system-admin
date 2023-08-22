<script setup lang="tsx">
import { useTable } from "@/layout/hooks/useTable";
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useMusicStoreHook } from "@/store/modules/music";
import { emitter } from "@/utils/mitt";
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
  checkedIds,
  openLoading,
  closeLoading,
  injectCheckedIds,
  handleCurrentPageChange,
  handlePageSizeChange
} = useTable<AlbumResult>();

/** 专辑表单 */
const albumForm = reactive<AlbumForm>({
  albumName: "",
  coverUrl: "",
  startPublishTime: null,
  endPublishTime: null
});

/** 专辑表格配置 */
tableColumns.value = useMusicStoreHook().albumTableColumns;

/** 专辑查询表单配置 */
const albumFormColumns = useMusicStoreHook().albumQueryFormColumns;

/** 专辑表单详情配置 与上面的查询用表单配置略有区别 */
const albumFormDetailColumns = useMusicStoreHook().albumDetailFormColumns;

/** 专辑列表查询请求参数 */
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
      formColumns={albumFormDetailColumns}
      showButton={false}
      isFlex={false}
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

async function batchDeleteLists() {
  if (checkedIds.value.length > 0) {
    await Promise.all(checkedIds.value.map(id => deleteAlbum(id)));
    message("删除成功", { type: "success" });
    getLists();
  } else {
    message("当前无选中项", { type: "error" });
  }
}

onMounted(() => {
  getLists();
  emitter.on("openAlbumSongsDialog", id => {
    openDialog(albumSongsDialog, Number(id));
  });
});

onBeforeUnmount(() => {
  emitter.off("openAlbumSongsDialog");
});
</script>

<template>
  <div>
    <SimpleForm
      class="simple_form"
      :form-value="albumForm"
      :form-columns="albumFormColumns"
      :show-button="true"
      :is-flex="true"
      @query="getLists"
      @reset="resetLists"
      @create="openDialog(albumDialog)"
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
          @inline-edit="openDialog(albumDialog, row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>
