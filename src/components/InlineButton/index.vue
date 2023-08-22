<script setup lang="ts">
/** table的单元格行内按钮组件 */
defineOptions({
  name: "InlineButton"
});

const emit = defineEmits(["inline-edit", "inline-delete"]);
</script>

<template>
  <el-button link type="primary" @click="emit('inline-edit')">编辑</el-button>
  <el-popconfirm title="是否确认删除" @confirm="emit('inline-delete')">
    <template #reference>
      <el-button link type="danger">删除</el-button>
    </template>
  </el-popconfirm>
</template>
