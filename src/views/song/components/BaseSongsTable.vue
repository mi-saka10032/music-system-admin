<script setup lang="tsx">
import { useTable } from "@/hooks/useTable";
import type { BaseSongResult } from "@/api/song";
import { onMounted } from "vue";
import { formatDateWithAny, formatDuration } from "@/utils/formatTime";

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
