import dayjs from "dayjs";
// 时间插件
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

type AnyDate = Date | number | string | null;

type DateFormatFunction = (date: AnyDate, format?: string) => string;

type DurationFormatFunction = (seconds: number) => string;

/** 任意类型日期数据格式化 */
export const formatDateWithAny: DateFormatFunction = (
  date,
  format = "YYYY-MM-DD"
) => {
  if (date == null) {
    return "";
  }
  const target = new Date(date);
  return isNaN(target.getTime()) ? "" : dayjs(date).format(format);
};

/** 秒数格式化为X分X秒 */
export const formatDuration: DurationFormatFunction = seconds =>
  dayjs.duration(seconds, "seconds").format("mm分ss秒");
