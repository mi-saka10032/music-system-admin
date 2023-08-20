import { http } from "@/utils/http";
import SystemResponse from "@/music-api/code/SystemResponse";
import { SongDTO, UpdateSongDTO, NewSongDTO } from "@/music-api/dto/SongDTO";
import { BaseSongVO } from "@/music-api/vo/BaseVO";
import { PageVOClass } from "@/music-api/vo/PageVO";
import { SongVO } from "@/music-api/vo/SongVO";

/** BaseSong出参类型 */
export type BaseSongResult = Pick<BaseSongVO, keyof BaseSongVO>;

/** BaseSong出参列表类型 */
export type BaseSongResultList = Pick<
  PageVOClass<BaseSongResult>,
  keyof PageVOClass<BaseSongResult>
>;

/** 表单类型 */
export type SongForm = Omit<SongDTO, "id" | "pageNo" | "pageSize">;

/** 更新参数类型 */
export type SongDetail = Pick<UpdateSongDTO, keyof UpdateSongDTO>;

/** page查询入参类型 */
export type SongParam = Omit<SongDTO, "id">;

/** page查询出参列表类型 */
export type SongResult = Pick<SongVO, keyof SongVO>;

/** page查询出参列表类型 */
export type SongResultList = Pick<
  PageVOClass<SongResult>,
  keyof PageVOClass<SongResult>
>;

/** 新增歌曲表单参数类型 */
export type SongCreate = Pick<NewSongDTO, keyof NewSongDTO>;

const songPrefix = "/song";

/** 获取歌曲列表 */
export const getSongLists = (data: SongParam) => {
  return http.post<SystemResponse<SongResultList>>(`${songPrefix}/page`, {
    data
  });
};

/** 获取歌曲详情 */
export const getSongDetail = (id: number) => {
  return http.post<SystemResponse<SongResult>>(`${songPrefix}/findById`, {
    params: { id }
  });
};

/** 更新歌曲信息 */
export const updateSong = (data: SongDetail) => {
  return http.post<SystemResponse<SongResult>>(`${songPrefix}/update`, {
    data
  });
};

/** 创建歌曲信息 */
export const createSong = (data: SongCreate) => {
  return http.post<SystemResponse<SongResult>>(`${songPrefix}/create`, {
    data
  });
};

/** 删除歌曲信息 */
export const deleteSong = (id: number) => {
  return http.post<SystemResponse<boolean>>(`${songPrefix}/delete`, {
    params: { id }
  });
};
