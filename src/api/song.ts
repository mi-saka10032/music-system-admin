// import { http } from "@/utils/http";
// import SystemResponse from "@/music-api/code/SystemResponse";
import { SongVO, SongListVO } from "@/music-api/vo/SongVO";

// 出参类型
export type SongResult = Pick<SongVO, keyof SongVO>;

// 出参列表类型
export type SongResultList = Pick<SongListVO, keyof SongListVO>;
