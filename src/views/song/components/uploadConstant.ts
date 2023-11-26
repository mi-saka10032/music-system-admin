// 记录上传组件公用的常量或函数
import { formatToken, getToken } from "@/utils/auth";
import { type UploadRawFile } from "element-plus";
import { message } from "@/utils/message";

// 上传地址
export const UPLOAD_URL = "/api/song/upload";
export const HEADERS = {
  Authorization: formatToken(getToken()?.accessToken || "")
};
export const MAX_SIZE = 256 * 1024 * 1024;
export const MAX_SIZE_TEXT = "256MB";
export const ACCEPT = ".mp3, .flac";
export const LIMIT_COUNT = 10;

/** 超大文件判断 */
/** 上传前回调，拒绝大体积文件上传，避免上传堵塞 */
export const uploadSizeJudge = (rawFile: UploadRawFile): boolean => {
  const { name, size } = rawFile;
  if (size > MAX_SIZE) {
    message(`${name}文件超出${MAX_SIZE_TEXT}大小限制，已取消上传`, {
      type: "error"
    });
    return false;
  }
  return true;
};
