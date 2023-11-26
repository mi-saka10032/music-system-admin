import{u as h}from"./music-80a5af2f.js";import{u as v}from"./useTable-4940d937.js";import{g as C,a as w,d as T,b as x}from"./song-62e18a23.js";import{d as y,aH as L,r as s,o as R,i as k,j as i,e as c,h as z,f as o,ax as N}from"./index-a4230535.js";const D=y({name:"RelatedSongsTable",__name:"RelatedSongsTable",props:{relatedId:{},relation:{}},setup(g){const e=g,{tableColumns:l,tableData:n,pagination:t,loading:p,openLoading:r,closeLoading:u,resetPagination:m}=v();l.value=h().relatedSongsTableColumns;async function d(){try{if(e.relation==="album"){r();const a=await C({albumId:e.relatedId,pageNo:t.currentPage,pageSize:t.pageSize});n.value=a.list,t.total=a.total}else if(e.relation==="singer"){r();const a=await w({singerId:e.relatedId,pageNo:t.currentPage,pageSize:t.pageSize});n.value=a.list,t.total=a.total}else return}catch{}u()}async function f(a){if(e.relation==="album")await T({albumId:e.relatedId,songId:a,shelve:!1});else if(e.relation==="singer")await x({singerIds:[e.relatedId],songId:a,shelve:!1});else return;N("解除关联成功",{type:"success"}),m(),d()}return L(()=>{e.relatedId&&e.relatedId>0&&d()}),(a,P)=>{const _=s("el-button"),b=s("el-popconfirm"),I=s("pure-table");return R(),k(I,{loading:o(p),columns:o(l),data:o(n),pagination:o(t)},{operation:i(({row:S})=>[c(b,{title:"是否确认解除关联，解除后分页参数将重置",onConfirm:B=>f(S.id)},{reference:i(()=>[c(_,{link:"",type:"danger"},{default:i(()=>[z("解除关联")]),_:1})]),_:2},1032,["onConfirm"])]),_:1},8,["loading","columns","data","pagination"])}}});export{D as _};
