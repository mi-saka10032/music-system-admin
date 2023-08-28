import{ac as H,p as i,ay as Z,ab as q,l as P,V as f,W as d,m as c,J as _,s as z,n as N,d as B,ae as M,az as ee,aA as E,aB as te,R as ne,u as oe,aC as ae,E as ue,av as R,aD as le,a3 as se,aE as re,o as W,c as j,g as T}from"./index-7abcff81.js";import{e as L}from"./mitt-7f99bbc0.js";function ie(){const{$storage:t,$config:e}=H(),o=()=>{Z().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=q),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"default",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1})},n=i(()=>t==null?void 0:t.layout.layout),u=i(()=>t.layout);return{layout:n,layoutTheme:u,initStorage:o}}const fe=P({id:"pure-app",state:()=>{var t,e;return{sidebar:{opened:((t=f().getItem(`${d()}layout`))==null?void 0:t.sidebarStatus)??c().SidebarStatus,withoutAnimation:!1,isClickCollapse:!1},layout:((e=f().getItem(`${d()}layout`))==null?void 0:e.layout)??c().Layout,device:_()?"mobile":"desktop"}},getters:{getSidebarStatus(t){return t.sidebar.opened},getDevice(t){return t.device}},actions:{TOGGLE_SIDEBAR(t,e){const o=f().getItem(`${d()}layout`);t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!0,o.sidebarStatus=!0):!t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!1,o.sidebarStatus=!1):!t&&!e&&(this.sidebar.withoutAnimation=!1,this.sidebar.opened=!this.sidebar.opened,this.sidebar.isClickCollapse=!this.sidebar.opened,o.sidebarStatus=this.sidebar.opened),f().setItem(`${d()}layout`,o)},async toggleSideBar(t,e){await this.TOGGLE_SIDEBAR(t,e)},toggleDevice(t){this.device=t},setLayout(t){this.layout=t}}});function de(){return fe(z)}const ce=P({id:"pure-epTheme",state:()=>{var t,e;return{epThemeColor:((t=f().getItem(`${d()}layout`))==null?void 0:t.epThemeColor)??c().EpThemeColor,epTheme:((e=f().getItem(`${d()}layout`))==null?void 0:e.theme)??c().Theme}},getters:{getEpThemeColor(t){return t.epThemeColor},fill(t){return t.epTheme==="light"?"#409eff":t.epTheme==="yellow"?"#d25f00":"#fff"}},actions:{setEpThemeColor(t){const e=f().getItem(`${d()}layout`);this.epTheme=e==null?void 0:e.theme,this.epThemeColor=t,e&&(e.epThemeColor=t,f().setItem(`${d()}layout`,e))}}});function S(){return ce(z)}const x={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"C:/project/music-system-admin/node_modules/.pnpm/@pureadmin+theme@3.1.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #001529 !default;
        $menuHover: #4091f7 !default;
        $subMenuBg: #0f0303 !default;
        $subMenuActiveBg: #4091f7 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #002140 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-light",varsContent:`
        $subMenuActiveText: #409eff !default;
        $menuBg: #fff !default;
        $menuHover: #e0ebf6 !default;
        $subMenuBg: #fff !default;
        $subMenuActiveBg: #e0ebf6 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #fff !default;
        $menuTitleHover: #000 !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-dusk",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2a0608 !default;
        $menuHover: #e13c39 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #e13c39 !default;
        $menuText: rgb(254 254 254 / 65.1%) !default;
        $sidebarLogo: #42090c !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e13c39 !default;
      `},{scopeName:"layout-theme-volcano",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2b0e05 !default;
        $menuHover: #e85f33 !default;
        $subMenuBg: #0f0603 !default;
        $subMenuActiveBg: #e85f33 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #441708 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e85f33 !default;
      `},{scopeName:"layout-theme-yellow",varsContent:`
        $subMenuActiveText: #d25f00 !default;
        $menuBg: #2b2503 !default;
        $menuHover: #f6da4d !default;
        $subMenuBg: #0f0603 !default;
        $subMenuActiveBg: #f6da4d !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #443b05 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #f6da4d !default;
      `},{scopeName:"layout-theme-mingQing",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #032121 !default;
        $menuHover: #59bfc1 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #59bfc1 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #053434 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #59bfc1 !default;
      `},{scopeName:"layout-theme-auroraGreen",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #0b1e15 !default;
        $menuHover: #60ac80 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #60ac80 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #112f21 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #60ac80 !default;
      `},{scopeName:"layout-theme-pink",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #28081a !default;
        $menuHover: #d84493 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #d84493 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #3f0d29 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #d84493 !default;
      `},{scopeName:"layout-theme-saucePurple",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #130824 !default;
        $menuHover: #693ac9 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #693ac9 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #1f0c38 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #693ac9 !default;
      `}]},me="./",he="assets";function Q(t){let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e}function D(t,e,o){let n=[t.toString(16),e.toString(16),o.toString(16)];for(let u=0;u<3;u++)n[u].length==1&&(n[u]=`0${n[u]}`);return`#${n.join("")}`}function pe(t,e){let o=Q(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return D(o[0],o[1],o[2])}function ge(t,e){let o=Q(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return D(o[0],o[1],o[2])}function O(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function I({scopeName:t,multipleScopeVars:e}){const o=Array.isArray(e)&&e.length?e:x.multipleScopeVars;let n=document.documentElement.className;new RegExp(O(t)).test(n)||(o.forEach(u=>{n=n.replace(new RegExp(O(u.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function $({id:t,href:e}){const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o}function ve(t){const e={scopeName:"theme-default",customLinkHref:r=>r,...t},o=e.themeLinkTagId||x.themeLinkTagId;let n=document.getElementById(o);const u=e.customLinkHref(`${me.replace(/\/$/,"")}${`/${he}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const r=$({id:o,href:u});n.nextSibling?n.parentNode.insertBefore(r,n.nextSibling):n.parentNode.appendChild(r),r.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),I(e)};return}n=$({id:o,href:u}),I(e),document[(e.themeLinkTagInjectTo||x.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function Ee(){var m;const{layoutTheme:t,layout:e}=ie(),o=N([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=H(),u=N((m=n==null?void 0:n.layout)==null?void 0:m.darkMode),r=document.documentElement;function p(s=c().Theme??"default"){var l,h;if(t.value.theme=s,ve({scopeName:`layout-theme-${s}`}),n.layout={layout:e.value,theme:s,darkMode:u.value,sidebarStatus:(l=n.layout)==null?void 0:l.sidebarStatus,epThemeColor:(h=n.layout)==null?void 0:h.epThemeColor},s==="default"||s==="light")g(c().EpThemeColor);else{const y=o.value.find(k=>k.themeColor===s);g(y.color)}}function v(s,l,h){document.documentElement.style.setProperty(`--el-color-primary-${s}-${l}`,u.value?pe(h,l/10):ge(h,l/10))}const g=s=>{S().setEpThemeColor(s),document.documentElement.style.setProperty("--el-color-primary",s);for(let l=1;l<=2;l++)v("dark",l,s);for(let l=1;l<=9;l++)v("light",l,s)};function C(){S().epTheme==="light"&&u.value?p("default"):p(S().epTheme),u.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:r,dataTheme:u,layoutTheme:t,themeColors:o,dataThemeChange:C,setEpThemeColor:g,setLayoutThemeColor:p}}function Re(t,e){const o=/^IF-/;if(o.test(t)){const n=t.split(o)[1],u=n.slice(0,n.indexOf(" ")==-1?n.length:n.indexOf(" ")),r=n.slice(n.indexOf(" ")+1,n.length);return B({name:"FontIcon",render(){return M(ee,{icon:u,iconType:r,...e})}})}else return typeof t=="function"||typeof(t==null?void 0:t.render)=="function"?t:typeof t=="object"?B({name:"OfflineIcon",render(){return M(E,{icon:t,...e})}}):B({name:"Icon",render(){const n=t&&t.includes(":")?te:E;return M(n,{icon:t,...e})}})}const be="data:image/jpeg;base64,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",Te="当前路由配置不正确，请检查配置";function Le(){var w;const t=ne(),e=de(),o=oe().options.routes,{wholeMenus:n}=ae(ue()),u=((w=c())==null?void 0:w.TooltipEffect)??"light",r=i(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),p=i(()=>{var a;return(a=R())==null?void 0:a.username}),v=i(()=>p.value?{marginRight:"10px"}:""),g=i(()=>!e.getSidebarStatus),C=i(()=>e.getDevice),{$storage:m,$config:s}=H(),l=i(()=>{var a;return(a=m==null?void 0:m.layout)==null?void 0:a.layout}),h=i(()=>s.Title);function y(a){const b=c().Title;b?document.title=`${a.title} | ${b}`:document.title=a.title}function k(){R().logOut()}function U(){var a;le.push((a=se())==null?void 0:a.path)}function V(){L.emit("openPanel")}function X(){e.toggleSideBar()}function K(a){a==null||a.handleResize()}function Y(a){var F;if(!a.children)return console.error(Te);const b=/^http(s?):\/\//,A=(F=a.children[0])==null?void 0:F.path;return b.test(A)?a.path+"/"+A:A}function J(a){n.value.length===0||G(a)||L.emit("changLayoutRoute",a)}function G(a){return re.includes(a)}return{route:t,title:h,device:C,layout:l,logout:k,routers:o,$storage:m,backTopMenu:U,onPanel:V,getDivStyle:r,changeTitle:y,toggleSideBar:X,menuSelect:J,handleResize:K,resolvePath:Y,isCollapse:g,pureApp:e,username:p,userAvatar:be,avatarsStyle:v,tooltipEffect:u}}const Ce={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},ye=T("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),ke=T("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),Ae=[ye,ke];function Be(t,e){return W(),j("svg",Ce,Ae)}const Oe={render:Be},Me={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},Se=T("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),xe=T("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),He=[Se,xe];function we(t,e){return W(),j("svg",Me,He)}const Ie={render:we};export{Re as a,Le as b,Ee as c,de as d,Oe as e,Ie as f,ie as g,ve as t,S as u};
