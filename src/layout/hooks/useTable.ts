import type { TableColumns } from "@pureadmin/table";
import { reactive, ref } from "vue";

export type TableColumnList = Array<TableColumns>;

export interface TablePagination {
  currentPage: number;
  pageSize: number;
  background: boolean;
  total: number;
}

export function useTable<T>() {
  const ORIGIN_CURRENT_PAGE = 1;
  const ORIGIN_PAGE_SIZE = 5;
  const loading = ref(false);
  const tableColumns = ref<TableColumnList>([]);
  const tableData = ref<Array<T>>([]);
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    background: true,
    total: 0
  });

  function openLoading() {
    loading.value = true;
  }

  function closeLoading() {
    loading.value = false;
  }

  return {
    ORIGIN_CURRENT_PAGE,
    ORIGIN_PAGE_SIZE,
    loading,
    tableColumns,
    tableData,
    pagination,
    openLoading,
    closeLoading
  };
}
