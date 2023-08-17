<script setup lang="ts">
import { useTable } from "@/layout/hooks/useTable";
import { SongResult } from "@/api/song";
import { onMounted } from "vue";

/** 歌手管理下的歌曲列表管理 */
defineOptions({
  name: "SingerSongsTable"
});

/** props歌手的歌曲列表  */
const props = defineProps<{
  singerSongs: Array<SongResult>;
}>();

const { tableColumns, tableData, pagination, loading } = useTable<SongResult>();

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
    prop: "publishTime"
  }
];

onMounted(() => {
  tableData.value = props.singerSongs;
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
