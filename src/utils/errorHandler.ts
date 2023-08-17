import { ComponentPublicInstance } from "vue";
import axios from "axios";

// window全局异常处理
window.onerror = function (message, source, lineno, colno, error) {
  console.log(message, source, lineno, colno, error);
};

// 全局异常处理函数 注：不能收集异步错误
export default function errorHandler(
  err: Error,
  vm: ComponentPublicInstance | null,
  info: string
): void {
  // 判断异常是否来自axios
  if (axios.isAxiosError(err)) {
    // 异常来自axios
    console.warn("Axios error:", err.message);
    return;
  }

  // 在这里处理其他异常，例如打印错误信息或发送错误报告
  console.error("Error:", err);
  console.error("Vue component:", vm);
  console.error("Error info:", info);
}
