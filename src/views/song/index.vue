<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from "vue";
import { useTable } from "@/hooks/useTable";
import { useCreate, useRead, useUpdate, useDelete } from "@/hooks/useForm";
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
  deleteSong,
  batchCreateSongs
} from "@/api/song";
import { type SingerParam, getSingerLists } from "@/api/singer";
import { type AlbumParam, getAlbumLists } from "@/api/album";
import { type DialogOptions, addDialog } from "@/components/ReDialog";
import SimpleForm from "@/components/SimpleForm/index.vue";
import MusicUpload from "@/components/MusicUpload/index.vue";
import { useScrollView } from "@/hooks/useScrollView";
import { Back, Right } from "@element-plus/icons-vue";

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

const { queryForm, queryFormColumns, resetQueryForm } = useRead<SongForm>(
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
  useUpdate<SongDetail>(
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
    />
  ),
  beforeSure: async (done: Function) => {
    await createSong(createForm);
    createSuccessMsg();
    done();
    getLists();
  }
});

/** 歌曲编辑详情弹窗 */
const updateDialog = reactive<DialogOptions>({
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
  const { data } = await getSingerLists(param as SingerParam);
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
  const { data } = await getAlbumLists(param as AlbumParam);
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
    const { data } = await getSongLists(songQueryParam.value);
    const list: Array<SongResult> = data.list;
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
  const { data } = await getSongDetail(id);
  updateForm.id = data.id;
  updateForm.songName = data.songName;
  updateForm.duration = data.duration;
  updateForm.lyric = data.lyric;
  updateForm.musicUrl = data.musicUrl;
  updateForm.publishTime = data.publishTime;
  updateForm.albumId = data.album?.id;
  updateForm.singerIds = data.singers.map(item => item.id);
  addDialog(updateDialog);
}

// 以下是歌曲管理页面独有功能

/** 批量式模板新增歌曲列表 */
const batchTemplateNewSongs = ref<Array<SongCreate>>([]);

/** 批量式模板歌曲新增表单详情配置 */
const batchTemplateSongsFormColumns =
  useMusicStoreHook().templateSongCreateFormColumns;

/** 内嵌歌手 内嵌专辑 表单详情配置 */
const embedFormColumns = reactive({
  album: useMusicStoreHook().albumDetailFormColumns,
  singer: useMusicStoreHook().singerFormColumns
});

/** 批量模板表单页滚动参数 */
const { childrenLength, enablePrev, enableNext, prevTo, nextTo } =
  useScrollView(".outer_form");

/** 批量式模板歌曲新增详情弹窗 使用slot插槽制作内嵌歌手表格单和专辑表单 */
const batchTemplateSongsDialog = reactive<DialogOptions>({
  title: "批量新增歌曲信息",
  contentRenderer: () => (
    <>
      <div class="outer_form flex overflow-x-scroll">
        {batchTemplateNewSongs.value.map(item => (
          <SimpleForm
            class="grow-0 shrink-0 basis-full"
            formValue={item}
            formColumns={batchTemplateSongsFormColumns}
            showButton={false}
            isFlex={false}
          >
            {{
              embedAlbum: () => (
                <SimpleForm
                  class="embed_album w-full"
                  formValue={item.album}
                  formColumns={embedFormColumns.album}
                  showButton={false}
                  isFlex={false}
                />
              ),
              embedSinger: () => (
                <SimpleForm
                  class="embed_singer w-full"
                  formValue={item.singer}
                  formColumns={embedFormColumns.singer}
                  showButton={false}
                  isFlex={false}
                />
              )
            }}
          </SimpleForm>
        ))}
      </div>
      {batchTemplateNewSongs.value.length > 1 ? (
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
        <></>
      )}
    </>
  ),
  beforeSure: async (done: Function) => {
    await batchCreateSongs(batchTemplateNewSongs.value);
    batchCreateSuccessMsg();
    done();
    getLists();
  }
});

/** 上传组件生成的新增歌曲信息模板列表回调，生成批量式新增模板弹窗 */
function generateNewSongs(templateSongs: Array<SongCreate>) {
  batchTemplateNewSongs.value = templateSongs;
  // 为scrollView子元素可滚动长度赋值
  childrenLength.value = batchTemplateNewSongs.value.length;
  addDialog(batchTemplateSongsDialog);
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
