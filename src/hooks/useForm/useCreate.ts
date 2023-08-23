import { reactive } from "vue";
import type { FormColumnTypeList } from "@/store/modules/music";
import { cloneDeep } from "@pureadmin/utils";
import { message } from "@/utils/message";
import resetForm from "./resetForm";

/** 注意F对象内部的键值需要与，同时约束了FormColumn的prop值，与F对象强关联 */
export function useCreate<C extends Object>(f: C, fc: FormColumnTypeList<C>) {
  const init: C = cloneDeep(f);
  const createForm = reactive(f);
  const createFormColumns = reactive(fc);
  const resetCreateForm = () => resetForm(createForm, init);
  const createSuccessMsg = () => message("新增成功", { type: "success" });
  const batchCreateSuccessMsg = () =>
    message("批量新增成功", { type: "success" });
  return {
    createForm,
    createFormColumns,
    resetCreateForm,
    createSuccessMsg,
    batchCreateSuccessMsg
  };
}
