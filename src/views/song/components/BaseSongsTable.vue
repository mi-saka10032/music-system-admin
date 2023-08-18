<script setup lang="tsx">
import { useTable } from "@/layout/hooks/useTable";
import { BaseSongResult } from "@/api/song";
import { onMounted } from "vue";
import formatDateWithAny from "@/utils/formatDate";

/** 歌手管理下的歌曲列表管理 */
defineOptions({
  name: "BaseSongsTable"
});

/** props歌手的歌曲列表  */
const props = defineProps<{
  baseSongs: Array<BaseSongResult>;
}>();

const { tableColumns, tableData, pagination, loading } =
  useTable<BaseSongResult>();

tableColumns.value = [
  {
    label: "歌曲名称",
    prop: "songName"
  },
  {
    label: "歌曲时长",
    prop: "duration"
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
    cellRenderer: ({ row }) => (
      <div>{formatDateWithAny(row["publishTime"])}</div>
    )
  }
];

onMounted(() => {
  tableData.value = props.baseSongs;
});
</script>

<template>
  <pure-table
    :loading="loading"
    :columns="tableColumns"
    :data="tableData"
    :pagination="pagination"
  />
</template>
