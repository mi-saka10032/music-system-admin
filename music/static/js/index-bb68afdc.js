import{_ as p}from"./logo-e802d43a.js";import{d as v,n as h,t as x,o,c as d,a as m,_ as y,r as g,e as n,g as s,F as z,v as S,h as _,z as r,j as k}from"./index-b0f6dbf0.js";const b=m('<div class="line" style="--color:#ec3e27;--x:3;--z:3;--d:1;" data-v-18785117></div><div class="line" style="--color:#fff;--x:3;--z:2;--d:2;" data-v-18785117></div><div class="line" style="--color:#fff;--x:4;--z:1;--d:3;" data-v-18785117></div><div class="line" style="--color:#fd79a8;--x:4;--z:0;--d:1;" data-v-18785117></div><div class="line" style="--color:#fff;--x:6;--z:-1;--d:2;" data-v-18785117></div><div class="line" style="--color:#0984e3;--x:6;--z:-2;--d:3;" data-v-18785117></div><div class="line" style="--color:#fff;--x:8;--z:-3;--d:1;" data-v-18785117></div><div class="line" style="--color:#fff;--x:10;--z:-4;--d:2;" data-v-18785117></div><div class="line" style="--color:#fff;--x:12;--z:-5;--d:3;" data-v-18785117></div><div class="line" style="--color:#fff;--x:14;--z:-6;--d:1;" data-v-18785117></div><div class="line" style="--color:#fff;--x:16;--z:-7;--d:2;" data-v-18785117></div><div class="line" style="--color:#fff;--x:18;--z:-8;--d:3;" data-v-18785117></div><div class="line" style="--color:#e056fd;--x:20;--z:-9;--d:1;" data-v-18785117></div>',13),O=[b],N=v({name:"Meteors",__name:"index",setup(f){const e=h(null);return x(()=>{if(e.value){const i=e.value.clientWidth,a=e.value.clientHeight,t=document.querySelector(".meteors");t.addEventListener("mousemove",l=>{const c=l.clientX/i,u=l.clientY/a;t.style.perspectiveOrigin=c+"%"+u+"%"})}}),(i,a)=>(o(),d("div",{class:"meteors",ref_key:"root",ref:e},O,512))}});const V=y(N,[["__scopeId","data-v-18785117"]]),w={class:"!m-0"},B={class:"relative z-10 p-6 text-slate-100"},C=s("h1",{class:"flex mb-2"},[s("img",{src:p,alt:"",class:"w-8"}),_("一款简约的音乐管理系统 ")],-1),M=s("h3",{class:"mb-2"},"仓库地址",-1),P=m('<h3 class="mt-2 mb-2">功能介绍</h3><ol class="pl-4"><li class="list-decimal">整体功能：歌手管理、专辑管理和歌曲管理</li><li class="list-decimal"> 歌手管理：歌手信息的增删改查，支持勾选批量删除，每个歌手可查看关联的歌曲信息，支持歌曲与歌手解除关联 </li><li class="list-decimal"> 专辑管理：专辑信息的增删改查，支持勾选批量删除，每个专辑可查看关联的歌曲信息，支持专辑与歌手解除关联 </li><li class="list-decimal"><h4 class="mb-2">歌曲管理：</h4><ol><li class="list-decimal">歌曲信息的增删改查，支持勾选批量删除</li><li class="list-decimal"> 新增歌曲时支持阿里云OSS客户端直传，可生成有效的阿里云链接录入新增数据 </li><li class="list-decimal"><div>【实验性功能】</div><div> 提供可批量上传的歌曲信息解析功能，歌曲文件上传至服务器后可解析歌曲基本信息，生成相关字段，同时自动上传阿里云OSS生成链接，并通过网易云API查询详细信息完成填充 </div><div>整个过程会开启Websocket监听上传进度，自动弹出步骤条弹窗</div><div> 批量上传完成后，关闭步骤条弹窗，会跟随弹出上传解析成功的歌曲信息弹窗，可对内部信息做二次编辑，随后可批量新增歌曲 </div><div><strong>注意：</strong>由于该功能需要将文件上传至后端服务器，上传和解析进度受服务器带宽影响很大，仅建议本地开发使用，远程线上环境慎用 </div><div> 写在最后：整个解析+OSS上传的功能其实可以全部放在前端实现，OSS文件上传在上面已经实现了，解析也是有办法做到的 </div></li></ol></li></ol>',2),E=v({name:"Welcome",__name:"index",setup(f){const e=[{name:"前端仓库",url:"https://github.com/mi-saka10032/music-system-admin.git"},{name:"后端仓库",url:"https://github.com/mi-saka10032/jay-music-manage-system.git"},{name:"类型仓库",url:"https://github.com/mi-saka10032/music-api.git"}];return(i,a)=>{const t=g("el-link");return o(),d("div",w,[n(V),s("div",B,[C,M,s("ul",null,[(o(),d(z,null,S(e,(l,c)=>s("li",{key:c},[s("span",null,r(l.name)+"：",1),n(t,{type:"primary",href:l.url},{default:k(()=>[_(r(l.url),1)]),_:2},1032,["href"])])),64))]),P])])}}});export{E as default};
