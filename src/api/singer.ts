import { http } from "@/utils/http";
import SystemResponse from "@/music-api/code/SystemResponse";
import { SingerDTO } from "@/music-api/dto/SingerDTO";
import { SingerVO, SingerListVO } from "@/music-api/vo/SingerVO";

// 表单类型
export type SingerForm = Pick<SingerDTO, "singerName" | "coverUrl">;

// 更新参数类型
export type SingerDetail = Pick<SingerDTO, "id" | "singerName" | "coverUrl">;

// page查询入参类型
export type SingerParam = Omit<SingerDTO, "id">;

// page查询出参类型
export type SingerResult = Pick<SingerVO, keyof SingerVO>;

// page查询出参列表类型
export type SingerResultList = Pick<SingerListVO, keyof SingerListVO>;

const singerPrefix = "/singer";

/** 获取歌手列表 */
export const getSingerLists = (data: SingerParam) => {
  return http.request<SystemResponse<SingerResultList>>(
    "post",
    `${singerPrefix}/page`,
    { data }
  );
};

/** 获取歌手详情 */
export const getSingerDetail = (id: number) => {
  return http.request<SystemResponse<SingerResult>>(
    "post",
    `${singerPrefix}/findById`,
    { params: { id } }
  );
};

/** 更新歌手信息 */
export const updateSinger = (data: SingerDetail) => {
  return http.request<SystemResponse<SingerResult>>(
    "post",
    `${singerPrefix}/update`,
    { data }
  );
};

/** 新增歌手信息 */
export const createSinger = (data: SingerForm) => {
  return http.request<SystemResponse<SingerResult>>(
    "post",
    `${singerPrefix}/create`,
    { data }
  );
};

/** 删除歌手信息 */
export const deleteSinger = (id: number) => {
  return http.request<SystemResponse<SingerResult>>(
    "post",
    `${singerPrefix}/delete`,
    { params: { id } }
  );
};
