import{u as W}from"./useTable-4940d937.js";import{u as X}from"./useCreate-9193a6d0.js";import{u as Z,a as ee}from"./useDelete-045681d7.js";import{u as ae}from"./useUpdate-aa13e205.js";import{u as m}from"./music-80a5af2f.js";import{e as S}from"./mitt-7f99bbc0.js";import{c as te,u as oe,g as le,d as P,a as ne}from"./album-b5d48220.js";import{d as ue,p as se,Y as c,e as a,ar as d,r as p,as as f,h as b,t as re,a6 as ie,o as me,c as ce,f as l,j as de,at as T}from"./index-a4230535.js";import{_ as pe}from"./RelatedSongsTable.vue_vue_type_script_setup_true_lang-4b7aba6f.js";import"./resetForm-951c0337.js";import"./song-62e18a23.js";const ye=ue({name:"Album",__name:"index",setup(fe){const{loading:_,tableColumns:g,tableData:C,pagination:i,checkedIds:h,openLoading:y,closeLoading:N,injectCheckedIds:A,handleCurrentPageChange:w,handlePageSizeChange:I,resetPagination:U}=W(),{queryForm:r,queryFormColumns:x,resetQueryForm:B}=Z({albumName:"",coverUrl:"",startPublishTime:null,endPublishTime:null},m().albumQueryFormColumns),{createForm:F,createFormColumns:E,resetCreateForm:L,createSuccessMsg:R}=X({id:null,albumName:"",coverUrl:"",publishTime:null},m().albumDetailFormColumns),{updateForm:t,updateFormColumns:k,resetUpdateForm:M,updateSuccessMsg:z}=ae({id:null,albumName:"",coverUrl:"",publishTime:null},m().albumDetailFormColumns),{deleteSuccessMsg:v,deleteNoCheckedMsg:Q}=ee();g.value=m().albumTableColumns;const V=se(()=>({albumName:r.albumName,coverUrl:r.coverUrl,startPublishTime:r.startPublishTime,endPublishTime:r.endPublishTime,pageNo:i.currentPage,pageSize:i.pageSize})),$=c({title:"专辑信息新增",contentRenderer:()=>a(d,{formValue:F,formColumns:E,showButton:!1,isFlex:!1},null),beforeSure:async e=>{await te(F),R(),e(),o()}}),j=c({title:"专辑信息编辑",contentRenderer:()=>a(d,{formValue:t,formColumns:k,showButton:!1,isFlex:!1},null),beforeSure:async e=>{await oe(t),z(),e(),o()}}),q=c({title:"专辑-关联歌曲详情",contentRenderer:()=>a("div",null,[a(p("el-row"),{class:"mt-5 mb-5"},{default:()=>[a(f,{value:8},{default:()=>[b("专辑ID："),t.id]}),a(f,{value:8},{default:()=>[b("专辑名称："),t.albumName]}),a(f,{value:8},{default:()=>[b("发行日期："),t.publishTime]})]}),a(pe,{relatedId:t.id,relation:"album"},null)]),footerRenderer:()=>a("div",null,null)});async function o(){y();try{const e=await le(V.value);C.value=e.list,i.total=e.total}catch{}N()}function H(){B(),U(),o()}async function Y(e){await P(e),v(),o()}async function G(){h.value.length>0?(await Promise.all(h.value.map(e=>P(e))),v(),o()):Q()}function J(){L(),T($)}async function D(e,n){M();const u=await ne(n);t.id=u.id,t.albumName=u.albumName,t.coverUrl=u.coverUrl,t.publishTime=u.publishTime,T(e)}return re(()=>{o(),S.on("openAlbumSongsDialog",e=>{D(q,Number(e))})}),ie(()=>{S.off("openAlbumSongsDialog")}),(e,n)=>{const u=p("InlineButton"),K=p("pure-table");return me(),ce("div",null,[a(d,{class:"simple_form","form-value":l(r),"form-columns":l(x),"show-button":!0,"is-flex":!0,onQuery:o,onReset:H,onCreate:J,onDelete:G},null,8,["form-value","form-columns"]),a(K,{loading:l(_),columns:l(g),data:l(C),pagination:l(i),onSelectionChange:l(A),onPageCurrentChange:n[0]||(n[0]=s=>l(w)(s,o)),onPageSizeChange:n[1]||(n[1]=s=>l(I)(s,o))},{operation:de(({row:s})=>[a(u,{onInlineEdit:O=>D(j,s.id),onInlineDelete:O=>Y(s.id)},null,8,["onInlineEdit","onInlineDelete"])]),_:1},8,["loading","columns","data","pagination","onSelectionChange"])])}}});export{ye as default};
