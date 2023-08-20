import { type UnwrapRef } from "vue";
import { store } from "@/store";
import { defineStore } from "pinia";
import { emitter } from "@/utils/mitt";
import { formatDateWithAny, formatDuration } from "@/utils/formatTime";
import { cloneDeep } from "@pureadmin/utils";
import type { SongResult } from "@/api/song";

type MusicStoreId = "admin-music";

export interface OptionValue {
  label: string;
  value: string | number;
}

export interface FormColumn {
  type: "input" | "input_number" | "select" | "multi_select" | "date" | "slot";
  label: string;
  prop: string;
  placeholder?: string;
  options?: Array<OptionValue>;
  slot?: string;
}

export interface MusicState {
  singerTableColumns: TableColumnList;
  singerFormColumns: Array<FormColumn>;
  albumTableColumns: TableColumnList;
  albumQueryFormColumns: Array<FormColumn>;
  albumDetailFormColumns: Array<FormColumn>;
  songTableColumns: TableColumnList;
  songQueryFormColumns: Array<FormColumn>;
  songDetailFormColumns: Array<FormColumn>;
}

export interface MusicGetters {
  [key: string]: any;
  songCreateFormColumns: (state: UnwrapRef<MusicState>) => Array<FormColumn>;
}

export const useMusicStore = defineStore<
  MusicStoreId,
  MusicState,
  MusicGetters
>({
  id: "admin-music",
  state: () => ({
    // 歌手表格配置
    singerTableColumns: [
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
            onClick={() => emitter.emit("openSingerSongsDialog", row.id)}
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
    ],
    // 歌手表单配置
    singerFormColumns: [
      {
        type: "input",
        label: "歌手名称",
        prop: "singerName"
      },
      {
        type: "input",
        label: "封面图片链接",
        prop: "coverUrl"
      }
    ],
    // 专辑表格配置
    albumTableColumns: [
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
        cellRenderer: ({ row }) => <>{formatDateWithAny(row["publishTime"])}</>
      },
      {
        label: "歌曲列表",
        prop: "songs",
        cellRenderer: ({ row }) => (
          <el-button
            type="success"
            onClick={() => emitter.emit("openAlbumSongsDialog", row.id)}
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
    ],
    // 专辑查询表单配置
    albumQueryFormColumns: [
      {
        type: "input",
        label: "专辑名称",
        prop: "albumName"
      },
      {
        type: "input",
        label: "专辑图片链接",
        prop: "coverUrl"
      },
      {
        type: "date",
        label: "开始发行日期",
        prop: "startPublishTime",
        placeholder: "开始日期"
      },
      {
        type: "date",
        label: "截止发行日期",
        prop: "endPublishTime",
        placeholder: "截止日期"
      }
    ],
    // 专辑详情表单配置，与上面的查询用表单配置略有区别
    albumDetailFormColumns: [
      {
        type: "input",
        label: "专辑名称",
        prop: "albumName"
      },
      {
        type: "input",
        label: "专辑图片链接",
        prop: "coverUrl"
      },
      {
        type: "date",
        label: "发行日期",
        prop: "publishTime",
        placeholder: "发行日期"
      }
    ],
    // 歌曲表格配置
    songTableColumns: [
      { type: "selection" },
      {
        label: "歌曲名称",
        prop: "songName"
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
        label: "所属专辑",
        prop: "albumName",
        cellRenderer: ({ row }) => <>{(row as SongResult).album?.albumName}</>
      },
      {
        label: "歌手",
        prop: "singerName",
        cellRenderer: ({ row }) => (
          <div class="flex flex-wrap">
            {(row as SongResult).singers.map(singer => (
              <el-tag class="min-w-[30%] mr-2 mb-2">{singer.singerName}</el-tag>
            ))}
          </div>
        )
      },
      {
        label: "发行日期",
        prop: "publishTime",
        cellRenderer: ({ row }) => <>{formatDateWithAny(row["publishTime"])}</>
      },
      {
        label: "歌曲时长",
        prop: "duration",
        cellRenderer: ({ row }) => <>{formatDuration(row["duration"])}</>
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation"
      }
    ],
    // 歌曲查询表单配置,
    songQueryFormColumns: [
      {
        type: "input",
        label: "歌曲名称",
        prop: "songName"
      },
      {
        type: "input",
        label: "歌词",
        prop: "lyric"
      },
      {
        type: "input",
        label: "链接",
        prop: "musicUrl"
      },
      {
        type: "input",
        label: "所属专辑",
        prop: "albumName"
      },
      {
        type: "input",
        label: "歌手",
        prop: "singerName"
      },
      {
        type: "date",
        label: "开始发行日期",
        prop: "startPublishTime",
        placeholder: "开始日期"
      },
      {
        type: "date",
        label: "截止发行日期",
        prop: "endPublishTime",
        placeholder: "截止日期"
      }
    ],
    // 歌曲编辑详情表单配置，与上面的查询用表单配置略有区别
    songDetailFormColumns: [
      {
        type: "input",
        label: "歌曲名称",
        prop: "songName"
      },
      {
        type: "input",
        label: "歌词",
        prop: "lyric"
      },
      {
        type: "input",
        label: "链接",
        prop: "musicUrl"
      },
      {
        type: "select",
        label: "所属专辑",
        prop: "albumId",
        options: [],
        placeholder: "请选择专辑"
      },
      {
        type: "multi_select",
        label: "歌手",
        prop: "singerIds",
        options: [],
        placeholder: "请选择歌手"
      },
      {
        type: "date",
        label: "发行日期",
        prop: "publishTime",
        placeholder: "发行日期"
      },
      {
        type: "input_number",
        label: "歌曲时长",
        prop: "duration"
      }
    ]
  }),
  getters: {
    // 歌曲新增详情表单配置，新增歌手简化为单选模式
    songCreateFormColumns: state => {
      const columns = cloneDeep(state.songDetailFormColumns);
      columns.splice(4, 1, {
        type: "select",
        label: "新增歌手",
        prop: "singerId",
        options: [],
        placeholder: "请选择歌手"
      });
      return columns;
    }
  }
});

export function useMusicStoreHook() {
  return useMusicStore(store);
}
