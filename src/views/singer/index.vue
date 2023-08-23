<script setup lang="tsx">
import { reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useTable } from "@/hooks/useTable";
import { useCreate, useRead, useUpdate, useDelete } from "@/hooks/useForm";
import { useMusicStoreHook } from "@/store/modules/music";
import { emitter } from "@/utils/mitt";
import type {
  SingerQueryForm,
  SingerParam,
  SingerResult,
  SingerDetail
} from "@/api/singer";
import {
  getSingerLists,
  getSingerDetail,
  updateSinger,
  createSinger,
  deleteSinger
} from "@/api/singer";
import { type DialogOptions, addDialog } from "@/components/ReDialog";
import SimpleForm from "@/components/SimpleForm/index.vue";
import ReCol from "@/components/ReCol";
import RelatedSongsTable from "@/views/song/components/RelatedSongsTable.vue";

defineOptions({
  name: "Singer"
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
} = useTable<SingerResult>();

const { queryForm, queryFormColumns, resetQueryForm } =
  useRead<SingerQueryForm>(
    {
      singerName: "",
      coverUrl: ""
    },
    useMusicStoreHook().singerFormColumns
  );

const { createForm, createFormColumns, resetCreateForm, createSuccessMsg } =
  useCreate<SingerDetail>(
    {
      id: null,
      singerName: "",
      coverUrl: ""
    },
    useMusicStoreHook().singerFormColumns
  );

const { updateForm, updateFormColumns, resetUpdateForm, updateSuccessMsg } =
  useUpdate<SingerDetail>(
    {
      id: null,
      singerName: "",
      coverUrl: ""
    },
    useMusicStoreHook().singerFormColumns
  );

const { deleteSuccessMsg, deleteNoCheckedMsg } = useDelete();

/** 歌手表格配置 */
tableColumns.value = useMusicStoreHook().singerTableColumns;

/** 歌手列表查询请求参数 */
const singerQueryParam = computed<SingerParam>(() => ({
  singerName: queryForm.singerName,
  coverUrl: queryForm.coverUrl,
  pageNo: pagination.currentPage,
  pageSize: pagination.pageSize
}));

/** 歌手新增详情弹窗 */
const createDialog = reactive<DialogOptions>({
  title: "歌手信息新增",
  contentRenderer: () => (
    <SimpleForm
      formValue={createForm}
      formColumns={createFormColumns}
      showButton={false}
      isFlex={false}
    />
  ),
  beforeSure: async (done: Function) => {
    await createSinger(createForm);
    createSuccessMsg();
    done();
    getLists();
  }
});

/** 歌手编辑详情弹窗 */
const editDialog = reactive<DialogOptions>({
  title: "歌手信息编辑",
  contentRenderer: () => (
    <SimpleForm
      formValue={updateForm}
      formColumns={updateFormColumns}
      showButton={false}
      isFlex={false}
    />
  ),
  beforeSure: async (done: Function) => {
    await updateSinger(updateForm);
    updateSuccessMsg();
    done();
    getLists();
  }
});

/** 歌手详情-关联歌曲弹窗 */
const relatedDialog = reactive<DialogOptions>({
  title: "歌手-关联歌曲详情",
  contentRenderer: () => (
    <div>
      <el-row class="mt-5 mb-5">
        <ReCol value={12}>歌手ID：{updateForm.id}</ReCol>
        <ReCol value={12}>歌手名称：{updateForm.singerName}</ReCol>
      </el-row>
      <RelatedSongsTable relatedId={updateForm.id} relation="singer" />
    </div>
  ),
  footerRenderer: () => <div></div>
});

/** 查询歌手列表 */
async function getLists(): Promise<void> {
  openLoading();
  try {
    const { data } = await getSingerLists(singerQueryParam.value);
    tableData.value = data.list;
    pagination.total = data.total;
  } catch (error: any) {
    console.log(error);
  }
  closeLoading();
}

/** 重置查询歌手列表 */
function resetLists(): void {
  resetQueryForm();
  resetPagination();
  getLists();
}

/** 删除歌手信息 */
async function deleteList(id: number): Promise<void> {
  await deleteSinger(id);
  deleteSuccessMsg();
  getLists();
}

/** 批量删除歌手信息 */
async function batchDeleteLists() {
  if (checkedIds.value.length > 0) {
    await Promise.all(checkedIds.value.map(id => deleteSinger(id)));
    deleteSuccessMsg();
    getLists();
  } else {
    deleteNoCheckedMsg();
  }
}

/** 打开歌手新增弹窗 */
function openCreateDialog(): void {
  resetCreateForm();
  addDialog(createDialog);
}

/** 打开歌手编辑弹窗 / 或者是歌手-关联歌曲信息弹窗 */
async function openEditDialog(
  dialog: DialogOptions,
  id: number
): Promise<void> {
  resetUpdateForm();
  const { data } = await getSingerDetail(id);
  updateForm.id = data.id;
  updateForm.singerName = data.singerName;
  updateForm.coverUrl = data.coverUrl;
  addDialog(dialog);
}

onMounted(() => {
  getLists();
  emitter.on("openSingerSongsDialog", id => {
    openEditDialog(relatedDialog, Number(id));
  });
});

onBeforeUnmount(() => {
  emitter.off("openSingerSongsDialog");
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
          @inline-edit="openEditDialog(editDialog, row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>
