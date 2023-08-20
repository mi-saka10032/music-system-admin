import type { TableColumns } from "@pureadmin/table";
import { reactive, ref } from "vue";

export type TableColumnList = Array<TableColumns>;

export interface TablePagination {
  currentPage: number;
  pageSize: number;
  background: boolean;
  total: number;
}

interface BaseT {
  id: number;
}

export function useTable<T extends BaseT>() {
  // 重置初始化起页
  const ORIGIN_CURRENT_PAGE = 1;
  // 重置初始化分页数
  const ORIGIN_PAGE_SIZE = 10;
  // 加载
  const loading = ref(false);
  // 表格配置项
  const tableColumns = ref<TableColumnList>([]);
  // 表格数据
  const tableData = ref<Array<T>>([]);
  // 分页器
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    background: true,
    total: 0
  });
  // 已选中表格ids
  const checkedIds = ref<Array<number>>([]);

  function openLoading() {
    loading.value = true;
  }

  function closeLoading() {
    loading.value = false;
  }

  // 筛选项change时注入ids
  function injectCheckedIds(checkedTableData: Array<T>) {
    checkedIds.value = checkedTableData.map(item => item.id);
  }

  // currentPage change函数 可传入query函数直接调用查询
  function handleCurrentPageChange(cp: number, cb?: Function) {
    pagination.currentPage = cp;
    typeof cb === "function" && cb();
  }

  // pageSize change函数 可传入query函数直接调用查询
  function handlePageSizeChange(ps: number, cb?: Function) {
    pagination.pageSize = ps;
    typeof cb === "function" && cb();
  }

  return {
    ORIGIN_CURRENT_PAGE,
    ORIGIN_PAGE_SIZE,
    loading,
    tableColumns,
    tableData,
    pagination,
    checkedIds,
    openLoading,
    closeLoading,
    injectCheckedIds,
    handleCurrentPageChange,
    handlePageSizeChange
  };
}
