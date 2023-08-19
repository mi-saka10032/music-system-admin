<script setup lang="ts">
/**
 * @description 简单表单组件
 * 根据formColumns动态生成表单相关组件，默认生成el-input
 * el-input默认与formValue绑定，键名是item.prop，请注意prop的声明
 * item.className存在额外排定，当item.className包含set_number时表示el-input应切换为number形式
 * 其余组件如select、datepicker请在item.slot中声明name并在外部使用插槽
 * 功能按钮在下部点缀，如果需要位置调整，请使用deep穿透btn_box和btn_container来调整position
 * 最后isFlex表示是否将form行内排列，true则每行4等分排列，false则每个item一行排列
 */
import type { TableColumnList } from "@/layout/hooks/useTable";

defineOptions({
  name: "SimpleForm"
});

interface SimpleForm {
  formColumns: TableColumnList;
  formValue: { [key: string]: any };
  showButton: boolean;
  isFlex: boolean;
}

defineProps<SimpleForm>();

const emit = defineEmits(["query", "reset", "create", "delete"]);
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
        <template v-if="item.slot">
          <slot :name="item.slot" />
        </template>
        <template v-else>
          <el-input
            v-if="item.className && item.className.includes('set_number')"
            clearable
            v-model.number="formValue[item.prop as string]"
          />
          <el-input v-else clearable v-model="formValue[item.prop as string]" />
        </template>
      </el-form-item>
    </el-form>
    <div v-if="showButton" class="btn_box relative h-8 mb-4">
      <div class="btn_container absolute right-0 bottom-0">
        <el-button type="success" @click="emit('query')">查询</el-button>
        <el-button type="primary" @click="emit('reset')">重置</el-button>
        <el-button type="warning" @click="emit('create')">新增</el-button>
        <el-button type="danger" @click="emit('delete')">删除</el-button>
      </div>
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
