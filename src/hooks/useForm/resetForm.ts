import { cloneDeep } from "@pureadmin/utils";
import type { UnwrapNestedRefs } from "vue";

export default function resetForm<T extends Object>(
  target: UnwrapNestedRefs<T>,
  source: T
) {
  Object.keys(source).forEach(key => {
    const value = source[key];
    if (value && typeof value === "object") {
      target[key] = cloneDeep(value);
    } else {
      target[key] = value;
    }
  });
}
