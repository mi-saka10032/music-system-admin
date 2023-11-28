import{u as oe}from"./useTable-c19068e5.js";import{u as ne,a as ae}from"./useDelete-9eb44457.js";import{useCreateDialog as se}from"./useCreateDialog-51df3baf.js";import{useUpdateDialog as ie}from"./useUpdateDialog-53823b8e.js";import{useBatchTemplateDialog as re}from"./useBatchTemplateDialog-0f43fa91.js";import{u as x}from"./music-db77b10b.js";import{c as le,e as M,f as ue}from"./song-facb0be7.js";import{g as me}from"./singer-29969942.js";import{g as ce}from"./album-d3c6640a.js";import{t as z,a6 as B,aI as ge,aJ as pe,d as de,p as fe,r as U,o as be,c as he,e as y,f as r,ar as we,j as Se,at as C,aK as ye}from"./index-17a497b2.js";import{e as L}from"./mitt-7f99bbc0.js";import{_ as Ce}from"./MusicUpload.vue_vue_type_script_setup_true_lang-270cdbda.js";import"./resetForm-657498b8.js";import"./useCreate-a668a9f7.js";import"./OSSUpload.vue_vue_type_script_setup_true_lang-17693bea.js";import"./useOSS-4b2adf5e.js";import"./useUpdate-6ba1c33f.js";function ke(P=3e4){const k=`ws://${window.location.host}`;let n=null,f=null,u=0;function m(){window.clearTimeout(f)}function b(){f=window.setTimeout(()=>{n.readyState===1?(n.send("ping"),m(),b()):a()},P)}function N(){m(),b()}function _(){}function v(){++u<=3&&a()}function h(){n&&n.close(),m()}function D(c){const w=c.data;w!=="pong"&&L.emit("websocketMessage",w)}function a(){if(!("WebSocket"in window)){console.warn("当前浏览器不支持Websocket!");return}const c=`/socket/${ge()}`;n=new window.WebSocket(k+c),n.onopen=N,n.onclose=_,n.onerror=v,window.onbeforeunload=h,n.onmessage=D,pe.set("socketId",c)}z(a),B(h)}const Ae=de({name:"Song",__name:"index",setup(P){const{loading:k,tableColumns:n,tableData:f,pagination:u,checkedIds:m,openLoading:b,closeLoading:N,injectCheckedIds:_,handleCurrentPageChange:v,handlePageSizeChange:h,resetPagination:D}=oe(),{queryForm:a,queryFormColumns:c,resetQueryForm:w}=ne({songName:"",lyric:"",startPublishTime:null,endPublishTime:null,albumName:"",singerName:""},x().songQueryFormColumns),W=fe(()=>({songName:a.songName,lyric:a.lyric,startPublishTime:a.startPublishTime,endPublishTime:a.endPublishTime,albumName:a.albumName,singerName:a.singerName,pageNo:u.currentPage,pageSize:u.pageSize}));n.value=x().songTableColumns;async function $(){const s=(await me({pageNo:1,pageSize:1e3})).list.map(e=>({value:e.id,label:e.singerName}));for(let e=0;e<g.length;e++)if(g[e].prop==="singerId"){g[e].options=s;break}for(let e=0;e<p.length;e++)if(p[e].prop==="singerIds"){p[e].options=s;break}}async function q(){const s=(await ce({pageNo:1,pageSize:1e3})).list.map(e=>({value:e.id,label:e.albumName}));for(let e=0;e<g.length;e++)if(g[e].prop==="albumId"){g[e].options=s;break}for(let e=0;e<p.length;e++)if(p[e].prop==="albumId"){p[e].options=s;break}}async function i(){b();try{const o=await le(W.value),t=o.list;f.value=t,u.total=o.total}catch{}N()}function T(){i(),$(),q()}const{createFormColumns:g,createDialog:A,resetCreateForm:E}=se(i),{updateForm:l,updateFormColumns:p,editDialog:Q,resetUpdateForm:R}=ie(i),{batchTemplates:I,songProgress:S,batchTemplateSongsDialog:j,progressDialog:G,childrenLength:J}=re(T),{deleteSuccessMsg:F,deleteNoCheckedMsg:O}=ae();function H(){w(),D(),i()}async function K(o){await M(o),F(),i()}async function V(){m.value.length>0?(await Promise.all(m.value.map(o=>M(o))),F(),i()):O()}function X(){E(),C(A)}async function Y(o){var s;R();const t=await ue(o);l.id=t.id,l.songName=t.songName,l.duration=t.duration,l.lyric=t.lyric,l.musicUrl=t.musicUrl,l.publishTime=t.publishTime,l.albumId=(s=t.album)==null?void 0:s.id,l.singerIds=t.singers.map(e=>e.id),C(Q)}function Z(o){I.newSongs=o,J.value=I.newSongs.length,ye.value.length===0?C(j):I.isWaiting=!0}function ee(o){let t;try{t=JSON.parse(o)}catch{}if(!t&&typeof t!="object")return;S.songLists.some(e=>{if(e.originalName===t.originalName)return e.status=t.status+1,!0})||S.songLists.push(t),S.isAlive||(S.isAlive=!0,C(G))}return ke(),z(()=>{T(),L.on("websocketMessage",ee)}),B(()=>{L.off("websocketMessage")}),(o,t)=>{const s=U("InlineButton"),e=U("pure-table");return be(),he("div",null,[y(we,{"form-value":r(a),"form-columns":r(c),"show-button":!0,"is-flex":!0,onQuery:i,onReset:H,onCreate:X,onDelete:V},null,8,["form-value","form-columns"]),y(Ce,{onGenerateNewSongs:Z}),y(e,{loading:r(k),columns:r(n),data:r(f),pagination:r(u),onSelectionChange:r(_),onPageCurrentChange:t[0]||(t[0]=d=>r(v)(d,i)),onPageSizeChange:t[1]||(t[1]=d=>r(h)(d,i))},{operation:Se(({row:d})=>[y(s,{onInlineEdit:te=>Y(d.id),onInlineDelete:te=>K(d.id)},null,8,["onInlineEdit","onInlineDelete"])]),_:1},8,["loading","columns","data","pagination","onSelectionChange"])])}}});export{Ae as default};