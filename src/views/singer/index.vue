<script setup lang="tsx">
import { useTable } from "@/layout/hooks/useTable";
import { ref, reactive, onMounted, computed } from "vue";
import type {
  SingerForm,
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
import type { BaseSongResult } from "@/api/song";
import { type DialogOptions, addDialog } from "@/components/ReDialog";
import SimpleForm from "@/components/SimpleForm/index.vue";
import ReCol from "@/components/ReCol";
import BaseSongsTable from "@/views/song/components/BaseSongsTable.vue";
import { message } from "@/utils/message";

defineOptions({
  name: "Singer"
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
} = useTable<SingerResult>();

/** 歌手表单 */
const singerForm = reactive<SingerForm>({
  singerName: "",
  coverUrl: ""
});

/** 歌手表格配置 */
tableColumns.value = [
  { type: "selection" },
  {
    label: "歌手名称",
    prop: "singerName"
  },
  {
    label: "封面图片链接",
    prop: "coverUrl",
    cellRenderer: ({ row }) =>
      row["coverUrl"] ? (
        <img src={row["coverUrl"]} class="w-24 h-24" />
      ) : (
        <div class="w-24 h-24" />
      )
  },
  {
    label: "歌曲列表",
    prop: "songs",
    cellRenderer: ({ row }) => (
      <el-button
        type="success"
        onClick={() => openDialog(singerSongsDialog, row.id as number)}
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

/** 歌手表单配置 */
const singerFormColumns = computed(() => tableColumns.value.slice(1, 3));

/** 歌手请求参数 */
const singerRequest = computed<SingerParam>(() => ({
  singerName: singerForm.singerName,
  coverUrl: singerForm.coverUrl,
  pageNo: pagination.currentPage,
  pageSize: pagination.pageSize
}));

/** 歌手详情表单 */
const singerFormDetail = reactive<SingerDetail>({
  id: null,
  singerName: "",
  coverUrl: ""
});

/** 歌手详情弹窗 */
const singerDialog = reactive<DialogOptions>({
  title: "歌手详情",
  contentRenderer: () => (
    <SimpleForm
      formValue={singerFormDetail}
      formColumns={singerFormColumns.value}
      showButton={false}
    />
  ),
  beforeSure: async (done: Function) => {
    if (singerFormDetail.id && singerFormDetail.id !== 0) {
      await updateSinger(singerFormDetail);
      message("修改成功", { type: "success" });
    } else {
      await createSinger(singerFormDetail);
      message("新增成功", { type: "success" });
    }
    done();
    getLists();
  }
});

/** 歌手详情-歌曲列表 */
const singerSongs = ref<Array<BaseSongResult>>([]);

/** 歌手详情-歌曲弹窗 */
const singerSongsDialog = reactive<DialogOptions>({
  title: "歌手-歌曲详情",
  contentRenderer: () => (
    <div>
      <el-row class="mt-5 mb-5">
        <ReCol value={12}>歌手ID：{singerFormDetail.id}</ReCol>
        <ReCol value={12}>歌手名称：{singerFormDetail.singerName}</ReCol>
      </el-row>
      <BaseSongsTable baseSongs={singerSongs.value} />
    </div>
  )
});

async function getLists(): Promise<void> {
  openLoading();
  try {
    const { data } = await getSingerLists(singerRequest.value);
    const list: Array<SingerResult> = data.list;
    tableData.value = list;
    pagination.total = data.total;
  } catch (error: any) {
    console.log(error);
  }
  closeLoading();
}

function resetLists(): void {
  singerForm.singerName = "";
  singerForm.coverUrl = "";
  pagination.currentPage = ORIGIN_CURRENT_PAGE;
  pagination.pageSize = ORIGIN_PAGE_SIZE;
  getLists();
}

async function deleteList(id: number): Promise<void> {
  await deleteSinger(id);
  message("删除成功", { type: "success" });
  getLists();
}

async function openDialog(
  dialogOption: DialogOptions,
  id?: number
): Promise<void> {
  if (id && id !== 0) {
    const { data } = await getSingerDetail(id);
    singerFormDetail.id = data.id;
    singerFormDetail.singerName = data.singerName;
    singerFormDetail.coverUrl = data.coverUrl;
    singerSongs.value = data.songs;
  } else {
    singerFormDetail.id = 0;
    singerFormDetail.singerName = "";
    singerFormDetail.coverUrl = "";
    singerSongs.value = [];
  }
  addDialog(dialogOption);
}

function injectCheckedIds(checkedTableData: Array<SingerResult>) {
  checkedIds.value = checkedTableData.map(item => item.id);
}

async function batchDeleteLists() {
  if (checkedIds.value.length > 0) {
    await Promise.all(checkedIds.value.map(id => deleteSinger(id)));
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
      :form-value="singerForm"
      :form-columns="singerFormColumns"
      :show-button="true"
      @query="getLists"
      @reset="resetLists"
      @create="openDialog(singerDialog)"
      @delete="batchDeleteLists"
    />
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
          @inline-edit="openDialog(singerDialog, row.id as number)"
          @inline-delete="deleteList(row.id)"
        />
      </template>
    </pure-table>
  </div>
</template>
