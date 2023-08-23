import { message } from "@/utils/message";

/** 删除几乎不含表单逻辑，所以只保存message提示函数 */
export function useDelete() {
  const deleteSuccessMsg = () => message("删除成功", { type: "success" });
  const deleteNoCheckedMsg = () => message("当前无选中项", { type: "error" });
  return {
    deleteSuccessMsg,
    deleteNoCheckedMsg
  };
}
