import{n as a,Y as E}from"./index-c2671b15.js";function _(){const o=a(!1),i=a([]),u=a([]),n=E({currentPage:1,pageSize:10,background:!0,total:0}),c=a([]);function r(){o.value=!0}function s(){o.value=!1}function I(t){c.value=t.map(e=>e.id)}function g(t,e){n.currentPage=t,typeof e=="function"&&e()}function f(t,e){n.pageSize=t,typeof e=="function"&&e()}function l(){n.currentPage=1,n.pageSize=10}return{ORIGIN_CURRENT_PAGE:1,ORIGIN_PAGE_SIZE:10,loading:o,tableColumns:i,tableData:u,pagination:n,checkedIds:c,openLoading:r,closeLoading:s,injectCheckedIds:I,handleCurrentPageChange:g,handlePageSizeChange:f,resetPagination:l}}export{_ as u};
