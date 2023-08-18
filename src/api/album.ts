import { http } from "@/utils/http";
import SystemResponse from "@/music-api/code/SystemResponse";
import { AlbumDTO, NewAlbumDTO } from "@/music-api/dto/AlbumDTO";
import { AlbumVO } from "@/music-api/vo/AlbumVO";
import { PageVOClass } from "@/music-api/vo/PageVO";

/** 表单类型 */
export type AlbumForm = Pick<
  AlbumDTO,
  "albumName" | "coverUrl" | "startPublishTime" | "endPublishTime"
>;

/** 更新参数类型 */
export type AlbumDetail = Pick<
  NewAlbumDTO & AlbumDTO,
  "id" | keyof NewAlbumDTO
>;

/** page查询入参类型 */
export type AlbumParam = Omit<AlbumDTO, "id">;

/** page查询出参类型 */
export type AlbumResult = Pick<AlbumVO, keyof AlbumVO>;

/** page查询出参列表类型 */
export type AlbumResultList = Pick<
  PageVOClass<AlbumResult>,
  keyof PageVOClass<AlbumResult>
>;

const albumPrefix = "/album";

/** 获取专辑列表 */
export const getAlbumLists = (data: AlbumParam) => {
  return http.request<SystemResponse<AlbumResultList>>(
    "post",
    `${albumPrefix}/page`,
    { data }
  );
};

/** 获取专辑详情 */
export const getAlbumDetail = (id: number) => {
  return http.request<SystemResponse<AlbumResult>>(
    "post",
    `${albumPrefix}/findById`,
    { params: { id } }
  );
};

/** 更新专辑信息 */
export const updateAlbum = (data: AlbumDetail) => {
  return http.request<SystemResponse<AlbumResult>>(
    "post",
    `${albumPrefix}/update`,
    { data }
  );
};

/** 创建专辑信息 */
export const createAlbum = (data: AlbumDetail) => {
  delete data.id;
  return http.request<SystemResponse<AlbumResult>>(
    "post",
    `${albumPrefix}/create`,
    { data }
  );
};

/** 删除专辑信息 */
export const deleteAlbum = (id: number) => {
  return http.request<SystemResponse<AlbumResult>>(
    "post",
    `${albumPrefix}/delete`,
    { params: { id } }
  );
};
