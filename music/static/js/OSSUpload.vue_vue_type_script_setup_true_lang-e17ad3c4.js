import{u as d}from"./oss-c316d2df.js";import{u as U,M as C}from"./uploadConstant-7169a552.js";import{d as D,p as m,n as f,r as l,b as z,o as _,c as B,w as E,i as N,j as u,e as c,f as i,h as T,z as $,O as j,ax as M}from"./index-a4230535.js";const X={class:"w-full"},H=D({name:"OSSUpload",__name:"OSSUpload",props:{modelValue:String},emits:["update:modelValue"],setup(S,{emit:g}){const v=S,n=m({get(){return v.modelValue},set(e){g("update:modelValue",e)}}),p=d().client,w=d().prefix,o=f(0),x=m(()=>{const e=o.value;return e>=0&&e<=50?"exception":e>50&&e<100?"warning":e>=100?"success":""}),r=f(!1),V=[".wav",".flac",".aac",".ogg",".aiff",".wma",".mp3"].join(",");async function h(e){if(p!==null){r.value=!0;const s=`${Date.now()}-${e.file.name}`;try{const t=await p.multipartUpload(`/music/${s}`,e.file,{progress:a=>o.value=Number((a*100).toFixed(0))});if(t.name&&(t==null?void 0:t.res.status)===200){const a=w+t.name;n.value=a}}catch{}r.value=!1}else M("获取阿里云OSS实例失败，请刷新后重试",{type:"error"})}return(e,s)=>{const t=l("el-button"),a=l("el-upload"),O=l("el-input"),b=l("el-progress"),y=z("loading");return _(),B("div",X,[E((_(),N(O,{modelValue:n.value,"onUpdate:modelValue":s[0]||(s[0]=k=>n.value=k),placeholder:"请上传文件后待返回OSS链接"},{append:u(()=>[c(a,{multiple:!1,"show-file-list":!1,accept:i(V),"before-upload":i(U),"http-request":h},{default:u(()=>[c(t,{type:"primary"},{default:u(()=>[T("点击上传OSS(大小限制"+$(i(C))+")",1)]),_:1})]),_:1},8,["accept","before-upload"])]),_:1},8,["modelValue"])),[[y,r.value]]),c(b,{class:j(["mt-1",o.value>0?"flex":"hidden"]),"text-inside":"","stroke-width":16,percentage:o.value,status:x.value},null,8,["class","percentage","status"])])}}});export{H as _};
