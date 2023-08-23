<script setup lang="tsx">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useTable } from "@/hooks/useTable";
import { useCreate, useRead, useUpdate, useDelete } from "@/hooks/useForm";
import { useMusicStoreHook } from "@/store/modules/music";
import { emitter } from "@/utils/mitt";
import type {
  AlbumQueryForm,
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

defineOptions({
  name: "Album"
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
} = useTable<AlbumResult>();

const { queryForm, queryFormColumns, resetQueryForm } = useRead<AlbumQueryForm>(
  {
    albumName: "",
    coverUrl: "",
    startPublishTime: null,
    endPublishTime: null
  },
  useMusicStoreHook().albumQueryFormColumns
);

const { createForm, createFormColumns, resetCreateForm, createSuccessMsg } =
  useCreate<AlbumDetail>(
    {
      id: null,
      albumName: "",
      coverUrl: "",
      publishTime: null
    },
    useMusicStoreHook().albumDetailFormColumns
  );

const { updateForm, updateFormColumns, resetUpdateForm, updateSuccessMsg } =
  useUpdate<AlbumDetail>(
    {
      id: null,
      albumName: "",
      coverUrl: "",
      publishTime: null
    },
    useMusicStoreHook().albumDetailFormColumns
  );

const { deleteSuccessMsg, deleteNoCheckedMsg } = useDelete();

/** 专辑表格配置 */
tableColumns.value = useMusicStoreHook().albumTableColumns;

/** 专辑列表查询请求参数 */
const albumQueryParam = computed<AlbumParam>(() => ({
  albumName: queryForm.albumName,
  coverUrl: queryForm.coverUrl,
  startPublishTime: queryForm.startPublishTime,
  endPublishTime: queryForm.endPublishTime,
  pageNo: pagination.currentPage,
  pageSize: pagination.pageSize
}));

/** 专辑新增详情弹窗 */
const createDialog = reactive<DialogOptions>({
  title: "专辑信息新增",
  contentRenderer: () => (
    <SimpleForm
      formValue={createForm}
      formColumns={createFormColumns}
      showButton={false}
      isFlex={false}
    />
  ),
  beforeSure: async (done: Function) => {
    await createAlbum(createForm);
    createSuccessMsg();
    done();
    getLists();
  }
});

/** 专辑编辑详情弹窗 */
const editDialog = reactive<DialogOptions>({
  title: "专辑信息编辑",
  contentRenderer: () => (
    <SimpleForm
      formValue={updateForm}
      formColumns={updateFormColumns}
      showButton={false}
      isFlex={false}
    />
  ),
  beforeSure: async (done: Function) => {
    await updateAlbum(updateForm);
    updateSuccessMsg();
    done();
    getLists();
  }
});

/** 专辑详情-关联歌曲列表 */
const albumSongs = ref<Array<BaseSongResult>>([]);

/** 专辑详情-关联歌曲弹窗 */
const albumSongsDialog = reactive<DialogOptions>({
  title: "专辑-关联歌曲详情",
  contentRenderer: () => (
    <div>
      <el-row class="mt-5 mb-5">
        <ReCol value={8}>专辑ID：{updateForm.id}</ReCol>
        <ReCol value={8}>专辑名称：{updateForm.albumName}</ReCol>
        <ReCol value={8}>发行日期：{updateForm.publishTime}</ReCol>
      </el-row>
      <BaseSongsTable baseSongs={albumSongs.value} />
    </div>
  )
});

/** 查询专辑列表 */
async function getLists(): Promise<void> {
  openLoading();
  try {
    const { data } = await getAlbumLists(albumQueryParam.value);
    tableData.value = data.list;
    pagination.total = data.total;
  } catch (error: any) {
    console.log(error);
  }
  closeLoading();
}

/** 重置查询专辑列表 */
function resetLists(): void {
  resetQueryForm();
  resetPagination();
  getLists();
}

/** 删除专辑信息 */
async function deleteList(id: number): Promise<void> {
  await deleteAlbum(id);
  deleteSuccessMsg();
  getLists();
}

/** 批量删除专辑信息 */
async function batchDeleteLists() {
  if (checkedIds.value.length > 0) {
    await Promise.all(checkedIds.value.map(id => deleteAlbum(id)));
    deleteSuccessMsg();
    getLists();
  } else {
    deleteNoCheckedMsg();
  }
}

/** 打开专辑新增弹窗 */
function openCreateDialog(): void {
  resetCreateForm();
  albumSongs.value = [];
  addDialog(createDialog);
}

/** 打开专辑编辑弹窗 / 或者是专辑-关联歌曲信息弹窗 */
async function openUpdateDialog(
  dialog: DialogOptions,
  id: number
): Promise<void> {
  resetUpdateForm();
  const { data } = await getAlbumDetail(id);
  updateForm.id = data.id;
  updateForm.albumName = data.albumName;
  updateForm.coverUrl = data.coverUrl;
  updateForm.publishTime = data.publishTime;
  albumSongs.value = data.songs;
  addDialog(dialog);
}

onMounted(() => {
  getLists();
  emitter.on("openAlbumSongsDialog", id => {
    openUpdateDialog(albumSongsDialog, Number(id));
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
      :form-value="queryForm"
      :form-columns="queryFormColumns"
      :show-button="true"
      :is-flex="true"
      @query="getLists"
      @reset="resetLists"
      @create="openCreateDialog"
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
          @inline-edit="openUpdateDialog(editDialog, row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>
