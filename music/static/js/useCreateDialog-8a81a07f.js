import{u as c}from"./useCreate-1133f0b6.js";import{u as p}from"./music-9614a675.js";import{i as f}from"./song-2e3cd61e.js";import{n as d,p as g,Y as v,e as o,r as a,ar as C}from"./index-c2671b15.js";import{_ as U}from"./OSSUpload.vue_vue_type_script_setup_true_lang-c04f3b45.js";import"./resetForm-75febbff.js";import"./mitt-7f99bbc0.js";import"./uploadConstant-4a8f5fd6.js";function V(l){const{createForm:r,createFormColumns:t,resetCreateForm:u,createSuccessMsg:n}=c({songName:"",duration:0,lyric:"",musicUrl:"",publishTime:null,album:{albumName:"",coverUrl:"",publishTime:null},singer:{singerName:"",coverUrl:""},albumId:null,singerId:null},p().songCreateFormColumns),s=d(0),i=g(()=>{const e=s.value;return e>=0&&e<=50?"exception":e>50&&e<100?"warning":e>=100?"success":""}),m=v({title:"歌曲信息新增",contentRenderer:()=>o(C,{formValue:r,formColumns:t,showButton:!1,isFlex:!1},{ossUpload:()=>o("div",{class:"w-full"},[o(a("el-input"),{modelValue:r.musicUrl,"onUpdate:modelValue":e=>r.musicUrl=e},{append:()=>o(U,{onProgress:e=>s.value=Number(e),onSuccess:e=>r.musicUrl=e},null)}),o(a("el-progress"),{class:"mt-1",style:{display:s.value>0?"flex":"none"},"text-inside":!0,"stroke-width":16,percentage:s.value,status:i.value},null)])}),beforeSure:async e=>{await f(r),n(),e(),l&&l()},closeCallBack:()=>{s.value=0}});return{createFormColumns:t,createDialog:m,resetCreateForm:u}}export{V as useCreateDialog};