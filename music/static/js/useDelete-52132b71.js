import{D as u,Y as t,ax as o}from"./index-c2671b15.js";import{r as a}from"./resetForm-75febbff.js";function l(e,s){const c=u(e),r=t(e),n=t(s);return{queryForm:r,queryFormColumns:n,resetQueryForm:()=>a(r,c)}}function y(){return{deleteSuccessMsg:()=>o("删除成功",{type:"success"}),deleteNoCheckedMsg:()=>o("当前无选中项",{type:"error"})}}export{y as a,l as u};