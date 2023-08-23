import { http } from "@/utils/http";
import SystemResponse from "@/music-api/code/SystemResponse";
import {
  SongDTO,
  UpdateSongDTO,
  NewSongDTO,
  Relation_Album_SongDTO,
  Relation_Singer_SongDTO,
  Shelve_Album_SongDTO,
  Shelve_Singer_SongDTO
} from "@/music-api/dto/SongDTO";
import { PageVOClass } from "@/music-api/vo/PageVO";
import { SongVO } from "@/music-api/vo/SongVO";

/** page查询表单类型 */
export type SongQueryForm = Omit<SongDTO, "id" | "pageNo" | "pageSize">;

/** 编辑参数类型 */
export type SongUpdate = Pick<UpdateSongDTO, keyof UpdateSongDTO>;

/** 新增参数类型 */
export type SongCreate = Pick<NewSongDTO, keyof NewSongDTO>;

/** page查询入参类型 */
export type SongParam = Omit<SongDTO, "id">;

/** page查询出参列表类型 */
export type SongResult = Pick<SongVO, keyof SongVO>;

/** page查询出参列表类型 */
export type SongResultList = Pick<
  PageVOClass<SongResult>,
  keyof PageVOClass<SongResult>
>;

/** 根据专辑id page查询入参类型 */
export type RelatedAlbumSongParam = Omit<Relation_Album_SongDTO, "id">;

/** 根据歌手id page查询入参类型 */
export type RelatedSingerSongParam = Omit<Relation_Singer_SongDTO, "id">;

/** 专辑-歌曲取关入参类型 */
export type DISASSOCIATIONAlbumParam = Pick<
  Shelve_Album_SongDTO,
  keyof Shelve_Album_SongDTO
>;

/** 歌手-歌曲取关入参类型 */
export type DISASSOCIATIONSingerParam = Pick<
  Shelve_Singer_SongDTO,
  keyof Shelve_Singer_SongDTO
>;

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
export const updateSong = (data: SongUpdate) => {
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

/** 批量创建歌曲信息，适用于上传解析生成的批量模板 */
export const batchCreateSongs = (data: Array<SongCreate>) => {
  return http.post<SystemResponse<SongResult>>(`${songPrefix}/batchCreate`, {
    data
  });
};

/** 根据专辑id分页查询关联歌曲信息 */
export const getAlbumRelatedSongLists = (data: RelatedAlbumSongParam) => {
  return http.post<SystemResponse<SongResultList>>(
    `${songPrefix}/pageByAlbumId`,
    {
      data
    }
  );
};

/** 根据歌手id分页查询关联歌曲信息 */
export const getSingerRelatedSongLists = (data: RelatedSingerSongParam) => {
  return http.post<SystemResponse<SongResultList>>(
    `${songPrefix}/pageSingerId`,
    {
      data
    }
  );
};

/** 解除专辑与歌曲关联 */
export const disassociation_album_song = (data: DISASSOCIATIONAlbumParam) => {
  return http.post<SystemResponse<boolean>>(`${songPrefix}/shelveAlbumId`, {
    data
  });
};

/** 解除歌手与歌曲关联 */
export const disassociation_singer_song = (data: DISASSOCIATIONSingerParam) => {
  return http.post<SystemResponse<boolean>>(`${songPrefix}/shelveSingerId`, {
    data
  });
};
