import { reactive } from "vue";
import type { FormColumnTypeList } from "@/store/modules/music";
import { cloneDeep } from "@pureadmin/utils";
import { message } from "@/utils/message";
import resetForm from "./resetForm";

/** 注意F对象内部的键值需要与，同时约束了FormColumn的prop值，与F对象强关联 */
export function useUpdate<U extends Object>(f: U, fc: FormColumnTypeList<U>) {
  const init: U = cloneDeep(f);
  const updateForm = reactive(f);
  const updateFormColumns = reactive(fc);
  const resetUpdateForm = () => resetForm(updateForm, init);
  const updateSuccessMsg = () => message("修改成功", { type: "success" });
  return {
    updateForm,
    updateFormColumns,
    resetUpdateForm,
    updateSuccessMsg
  };
}
