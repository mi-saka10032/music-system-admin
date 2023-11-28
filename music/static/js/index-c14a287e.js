import{u as W}from"./useTable-26197b9e.js";import{u as X}from"./useCreate-38084e83.js";import{u as Z,a as ee}from"./useDelete-eb5c411b.js";import{u as ne}from"./useUpdate-10e3474f.js";import{u}from"./music-865cdeb6.js";import{e as D}from"./mitt-7f99bbc0.js";import{c as oe,u as ae,g as te,d as h,a as re}from"./singer-c0032c90.js";import{d as se,p as le,Y as c,e as n,ar as g,r as d,as as N,h as _,t as ie,a6 as ue,o as me,c as ce,f as a,j as ge,at as b}from"./index-1bb20c8b.js";import{_ as de}from"./RelatedSongsTable.vue_vue_type_script_setup_true_lang-cd7ecb54.js";import"./resetForm-d556050e.js";import"./song-de5da4eb.js";const Be=se({name:"Singer",__name:"index",setup(fe){const{loading:y,tableColumns:f,tableData:p,pagination:i,checkedIds:C,openLoading:B,closeLoading:w,injectCheckedIds:I,handleCurrentPageChange:U,handlePageSizeChange:x,resetPagination:P}=W(),{queryForm:m,queryFormColumns:L,resetQueryForm:R}=Z({singerName:"",coverUrl:""},u().singerFormColumns),{createForm:v,createFormColumns:k,resetCreateForm:M,createSuccessMsg:z}=X({id:null,singerName:"",coverUrl:""},u().singerFormColumns),{updateForm:t,updateFormColumns:E,resetUpdateForm:V,updateSuccessMsg:Q}=ne({id:null,singerName:"",coverUrl:""},u().singerFormColumns),{deleteSuccessMsg:S,deleteNoCheckedMsg:T}=ee();f.value=u().singerTableColumns;const $=le(()=>({singerName:m.singerName,coverUrl:m.coverUrl,pageNo:i.currentPage,pageSize:i.pageSize})),j=c({title:"歌手信息新增",contentRenderer:()=>n(g,{formValue:v,formColumns:k,showButton:!1,isFlex:!1},null),beforeSure:async e=>{await oe(v),z(),e(),o()}}),q=c({title:"歌手信息编辑",contentRenderer:()=>n(g,{formValue:t,formColumns:E,showButton:!1,isFlex:!1},null),beforeSure:async e=>{await ae(t),Q(),e(),o()}}),A=c({title:"歌手-关联歌曲详情",contentRenderer:()=>n("div",null,[n(d("el-row"),{class:"mt-5 mb-5"},{default:()=>[n(N,{value:12},{default:()=>[_("歌手ID："),t.id]}),n(N,{value:12},{default:()=>[_("歌手名称："),t.singerName]})]}),n(de,{relatedId:t.id,relation:"singer"},null)]),footerRenderer:()=>n("div",null,null)});async function o(){B();try{const e=await te($.value);p.value=e.list,i.total=e.total}catch{}w()}function H(){R(),P(),o()}async function Y(e){await h(e),S(),o()}async function G(){C.value.length>0?(await Promise.all(C.value.map(e=>h(e))),S(),o()):T()}function J(){M(),b(j)}async function F(e,r){V();const l=await re(r);t.id=l.id,t.singerName=l.singerName,t.coverUrl=l.coverUrl,b(e)}return ie(()=>{o(),D.on("openSingerSongsDialog",e=>{F(A,Number(e))})}),ue(()=>{D.off("openSingerSongsDialog")}),(e,r)=>{const l=d("InlineButton"),K=d("pure-table");return me(),ce("div",null,[n(g,{"form-value":a(m),"form-columns":a(L),"show-button":!0,"is-flex":!0,onQuery:o,onReset:H,onCreate:J,onDelete:G},null,8,["form-value","form-columns"]),n(K,{loading:a(y),columns:a(f),data:a(p),pagination:a(i),onSelectionChange:a(I),onPageCurrentChange:r[0]||(r[0]=s=>a(U)(s,o)),onPageSizeChange:r[1]||(r[1]=s=>a(x)(s,o))},{operation:ge(({row:s})=>[n(l,{onInlineEdit:O=>F(q,s.id),onInlineDelete:O=>Y(s.id)},null,8,["onInlineEdit","onInlineDelete"])]),_:1},8,["loading","columns","data","pagination","onSelectionChange"])])}}});export{Be as default};