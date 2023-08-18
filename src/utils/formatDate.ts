import { formatDate } from "@vueuse/core";

type AnyDate = Date | number | string | null;

/** 任意类型日期数据格式化 */
export default function formatDateWithAny(
  date: AnyDate,
  format = "YYYY-MM-DD"
) {
  const formatResult = new Date(date);
  return isNaN(formatResult.getTime()) ? "" : formatDate(formatResult, format);
}
