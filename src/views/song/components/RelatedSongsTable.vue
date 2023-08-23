<!-- 
  歌手/专辑的关联歌曲列表管理，根据主键id和实体类型(album | singer)来调用接口查询
  仅支持基本分页查询，单条歌曲与所属表解除关联
 -->
<script setup lang="tsx">
import { watchEffect } from "vue";
import { useTable } from "@/hooks/useTable";
import {
  type SongResult,
  getAlbumRelatedSongLists,
  getSingerRelatedSongLists,
  disassociation_album_song,
  disassociation_singer_song
} from "@/api/song";
import { formatDateWithAny, formatDuration } from "@/utils/formatTime";
import { message } from "@/utils/message";

defineOptions({
  name: "RelatedSongsTable"
});

/** props歌手的歌曲列表  */
const props = defineProps<{
  relatedId: number;
  relation: "album" | "singer";
}>();

const {
  tableColumns,
  tableData,
  pagination,
  loading,
  openLoading,
  closeLoading,
  resetPagination
} = useTable<SongResult>();

tableColumns.value = [
  {
    label: "歌曲名称",
    prop: "songName"
  },
  {
    label: "歌曲时长",
    prop: "duration",
    cellRenderer: ({ row }) => <>{formatDuration(row["duration"])}</>
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
    label: "发行日期",
    prop: "publishTime",
    cellRenderer: ({ row }) => <>{formatDateWithAny(row["publishTime"])}</>
  },
  {
    label: "操作",
    fixed: "right",
    slot: "operation"
  }
];

async function getRelatedLists() {
  try {
    if (props.relation === "album") {
      openLoading();
      const { data } = await getAlbumRelatedSongLists({
        albumId: props.relatedId,
        pageNo: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      tableData.value = data.list;
      pagination.total = data.total;
    } else if (props.relation === "singer") {
      openLoading();
      const { data } = await getSingerRelatedSongLists({
        singerId: props.relatedId,
        pageNo: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      tableData.value = data.list;
      pagination.total = data.total;
    } else return;
  } catch (error: any) {
    console.log(error);
  }
  closeLoading();
}

async function disassociationTheSong(inlineId: number) {
  if (props.relation === "album") {
    await disassociation_album_song({
      albumId: props.relatedId,
      songId: inlineId,
      shelve: false
    });
  } else if (props.relation === "singer") {
    await disassociation_singer_song({
      singerIds: [props.relatedId],
      songId: inlineId,
      shelve: false
    });
  } else return;
  message("解除关联成功", { type: "success" });
  resetPagination();
  getRelatedLists();
}

watchEffect(() => {
  if (props.relatedId && props.relatedId > 0) {
    getRelatedLists();
  }
});
</script>

<template>
  <pure-table
    :loading="loading"
    :columns="tableColumns"
    :data="tableData"
    :pagination="pagination"
  >
    <template #operation="{ row }">
      <el-popconfirm
        title="是否确认解除关联，解除后分页参数将重置"
        @confirm="disassociationTheSong(row.id)"
      >
        <template #reference>
          <el-button link type="danger">解除关联</el-button>
        </template>
      </el-popconfirm>
    </template>
  </pure-table>
</template>
