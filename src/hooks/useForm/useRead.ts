import { reactive } from "vue";
import type { FormColumnTypeList } from "@/store/modules/music";
import { cloneDeep } from "@pureadmin/utils";
import resetForm from "./resetForm";

/** 注意F对象内部的prop值需要与，与F对象属性关联 */
export function useRead<R extends Object>(f: R, fc: FormColumnTypeList<R>) {
  const init: R = cloneDeep(f);
  const queryForm = reactive(f);
  const queryFormColumns = reactive(fc);
  const resetQueryForm = () => resetForm(queryForm, init);
  return {
    queryForm,
    queryFormColumns,
    resetQueryForm
  };
}
