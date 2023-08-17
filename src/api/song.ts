// import { http } from "@/utils/http";
// import SystemResponse from "@/music-api/code/SystemResponse";
import { BaseSongVO } from "@/music-api/vo/BaseVO";
import { PageVOClass } from "@/music-api/vo/PageVO";

// BaseSong出参类型
export type BaseSongResult = Pick<BaseSongVO, keyof BaseSongVO>;

// BaseSong出参列表类型
export type BaseSongResultList = Pick<
  PageVOClass<BaseSongResult>,
  keyof PageVOClass<BaseSongResult>
>;
