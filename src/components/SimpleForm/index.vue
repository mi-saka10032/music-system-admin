<script setup lang="ts">
/**
 * @description 简单表单组件
 * 根据formColumns动态生成表单相关组件
 * el-input默认与formValue绑定，键名是item.prop，请注意prop的声明
 * 表单内部的组件类型根据item.type来动态判断生成，请注意
 * 当item.type === 'select' || 'multi_select' 时，注意为item.options填充静态or动态的筛选项数据
 * 注意item.type === 'slot' 并开启item.slot来开启自定义插槽
 * 功能按钮在下部点缀，如果需要位置调整，请使用deep穿透btn_container来调整position
 * 最后isFlex表示是否将form行内排列，true则每行4等分排列，false则每个item一行排列
 */
import type { FormColumn } from "@/store/modules/music";
import { ElMessageBox } from "element-plus";

defineOptions({
  name: "SimpleForm"
});

interface SimpleForm {
  formColumns: Array<FormColumn>;
  formValue: { [key: string]: any };
  showButton: boolean;
  isFlex: boolean;
}

defineProps<SimpleForm>();

const emit = defineEmits(["query", "reset", "create", "delete"]);

const confirmDelete = async () => {
  try {
    await ElMessageBox.confirm("删除后无法恢复", "提醒", { type: "warning" });
    emit("delete");
  } catch (error: any) {
    console.log(error);
  }
};
</script>

<template>
  <div>
    <el-form
      :model="formValue"
      label-width="100px"
      label-position="left"
      :class="isFlex ? 'flex flex-wrap' : ''"
      :inline="isFlex"
    >
      <el-form-item
        v-for="(item, index) in formColumns"
        :key="index"
        :label="item.label"
        :value="item.prop"
        :class="isFlex ? 'w-[25%] max-w-lg balance_date !mr-0 pr-5' : ''"
      >
        <template v-if="item.type === 'slot' && item.slot">
          <slot :name="String(item.slot)" />
        </template>
        <template v-else>
          <el-input
            v-if="item.type === 'input'"
            clearable
            v-model="formValue[item.prop as string]"
            :placeholder="item.placeholder || '请输入'"
          />
          <el-input
            v-else-if="item.type === 'input_number'"
            clearable
            v-model.number="formValue[item.prop as string]"
            :placeholder="item.placeholder || '请输入数字'"
          />
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="formValue[item.prop as string]"
            type="date"
            :placeholder="item.placeholder ?? '请选择'"
          />
          <el-select
            v-else-if="item.type === 'select' || item.type === 'multi_select'"
            v-model="formValue[item.prop as string]"
            :multiple="item.type === 'multi_select'"
            clearable
            :placeholder="item.placeholder ?? '请选择'"
          >
            <el-option
              v-for="(option, index) in item.options || []"
              :key="index"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </template>
      </el-form-item>
    </el-form>
    <div class="btn_container flex justify-end mb-4">
      <el-button type="success" @click="emit('query')">查询</el-button>
      <el-button type="primary" @click="emit('reset')">重置</el-button>
      <el-button type="warning" @click="emit('create')">新增</el-button>
      <el-button type="danger" @click="confirmDelete">删除</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::v-deep(.balance_date) {
  .el-date-editor {
    width: 100%;
  }
}
</style>
