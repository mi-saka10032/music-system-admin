import{A as x,M as O,L as C,U as R,H as $,u as k}from"./uploadConstant-7169a552.js";import{d as I,n as f,C as b,p as B,M as D,aM as H,ax as _,r as m,o as V,i as z,j as l,g as t,h as n,z as v,f as s,e as U,aN as P}from"./index-a4230535.js";const X=t("div",{class:"text-sm text-gray-500 font-semibold"},[n(" 支持批量上传mp3文件，生成OSS链接并自动解析出歌曲相关信息，生成新增歌曲信息弹窗 "),t("div",{class:"text-xl font-bold"}," 警告：建议仅在本地开发使用，远程上传严重受带宽影响 ")],-1),j={class:"el-upload__tip p-1 mr-2 !mt-0 border-2 border-red-400 font-semibold"},F={class:"text-sm"},J={class:"text-sm"},K={class:"text-sm"},Q=I({name:"MusicUpload",__name:"MusicUpload",emits:["generate-new-songs"],setup(Z,{emit:w}){const c=f(0),u=f(0),r=f(0),o=b(null),E=()=>c.value+=1,g=()=>c.value-=1,S=()=>u.value+=1,h=()=>r.value+=1,i=b([]),M=e=>{const a=k(e);return a&&E(),a},T=e=>{g(),e.code===P.OK?(S(),i.value.push(...e.data)):(h(),_(e.msg,{type:"error"}))},y=e=>{g(),h(),_(e.message,{type:"error"})},A={lock:!0,text:"上传解析歌曲中...",background:"rgba(0, 0, 0, 0.7)"},N=B(()=>`上传解析歌曲中... 等待数：${c.value} 成功数：${u.value} 失败数：${r.value}`);return D(c,(e,a)=>{if(e>0&&(o.value===null&&(o.value=H.service(A)),o.value.setText(N.value)),a===0&&(i.value=[]),e===0){o.value.close(),o.value=null;const d=u.value,p=r.value;_(`上传解析已完成，成功${d}个，失败${p}个`),u.value=0,r.value=0,i.value.length>0&&w("generate-new-songs",i.value)}}),(e,a)=>{const d=m("el-button"),p=m("el-tooltip"),L=m("el-upload");return V(),z(L,{class:"flex flex-row-reverse items-center mb-4",action:s(R),headers:s($),"show-file-list":!1,multiple:"",accept:s(x),limit:s(C),"before-upload":M,"on-success":T,"on-error":y},{tip:l(()=>[t("div",j,[n(" 格式限制: "),t("span",F,v(s(x)),1),n("; 大小限制："),t("span",J,v(s(O)),1),n("; 数量限制："),t("span",K,v(s(C)),1)])]),default:l(()=>[U(p,{effect:"light",placement:"bottom",enterable:!1},{content:l(()=>[X]),default:l(()=>[U(d,{type:"primary"},{default:l(()=>[n("智能上传解析歌曲")]),_:1})]),_:1})]),_:1},8,["action","headers","accept","limit"])}}});export{Q as _};
