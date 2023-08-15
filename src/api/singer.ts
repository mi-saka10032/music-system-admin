import { http } from "@/utils/http";
import SystemResponse from "@/music-api/code/SystemResponse";
import { SingerDTO } from "@/music-api/dto/SingerDTO";
import { SingerVO } from "@/music-api/vo/SingerVO";

export type SingerList = Pick<SingerVO, keyof SingerVO>;

/** 获取歌手列表 */
export const getSingerLists = ()