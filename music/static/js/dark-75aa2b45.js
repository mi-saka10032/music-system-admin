import{ac as x,p as i,ay as X,ab as Y,l as z,V as f,W as d,m as c,J as Z,s as D,n as w,d as B,ae as S,az as ee,aA as E,aB as te,R as ne,u as oe,aC as ae,E as ue,av as H,aD as se,a3 as le,aE as re,o as O,c as j,g as b}from"./index-b0f6dbf0.js";import{e as _}from"./mitt-7f99bbc0.js";function ie(){const{$storage:t,$config:e}=x(),o=()=>{X().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=Y),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"default",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1})},n=i(()=>t==null?void 0:t.layout.layout),u=i(()=>t.layout);return{layout:n,layoutTheme:u,initStorage:o}}const fe=z({id:"music-app",state:()=>{var t,e;return{sidebar:{opened:((t=f().getItem(`${d()}layout`))==null?void 0:t.sidebarStatus)??c().SidebarStatus,withoutAnimation:!1,isClickCollapse:!1},layout:((e=f().getItem(`${d()}layout`))==null?void 0:e.layout)??c().Layout,device:Z()?"mobile":"desktop"}},getters:{getSidebarStatus(t){return t.sidebar.opened},getDevice(t){return t.device}},actions:{TOGGLE_SIDEBAR(t,e){const o=f().getItem(`${d()}layout`);t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!0,o.sidebarStatus=!0):!t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!1,o.sidebarStatus=!1):!t&&!e&&(this.sidebar.withoutAnimation=!1,this.sidebar.opened=!this.sidebar.opened,this.sidebar.isClickCollapse=!this.sidebar.opened,o.sidebarStatus=this.sidebar.opened),f().setItem(`${d()}layout`,o)},async toggleSideBar(t,e){await this.TOGGLE_SIDEBAR(t,e)},toggleDevice(t){this.device=t},setLayout(t){this.layout=t}}});function de(){return fe(D)}const ce=z({id:"music-epTheme",state:()=>{var t,e;return{epThemeColor:((t=f().getItem(`${d()}layout`))==null?void 0:t.epThemeColor)??c().EpThemeColor,epTheme:((e=f().getItem(`${d()}layout`))==null?void 0:e.theme)??c().Theme}},getters:{getEpThemeColor(t){return t.epThemeColor},fill(t){return t.epTheme==="light"?"#409eff":t.epTheme==="yellow"?"#d25f00":"#fff"}},actions:{setEpThemeColor(t){const e=f().getItem(`${d()}layout`);this.epTheme=e==null?void 0:e.theme,this.epThemeColor=t,e&&(e.epThemeColor=t,f().setItem(`${d()}layout`,e))}}});function k(){return ce(D)}const A={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"C:/project/music-system-admin/node_modules/.pnpm/@pureadmin+theme@3.1.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
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
      `}]},me="./",he="assets";function G(t){let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e}function F(t,e,o){let n=[t.toString(16),e.toString(16),o.toString(16)];for(let u=0;u<3;u++)n[u].length==1&&(n[u]=`0${n[u]}`);return`#${n.join("")}`}function ge(t,e){let o=G(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return F(o[0],o[1],o[2])}function pe(t,e){let o=G(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return F(o[0],o[1],o[2])}function N(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function P({scopeName:t,multipleScopeVars:e}){const o=Array.isArray(e)&&e.length?e:A.multipleScopeVars;let n=document.documentElement.className;new RegExp(N(t)).test(n)||(o.forEach(u=>{n=n.replace(new RegExp(N(u.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function R({id:t,href:e}){const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o}function Te(t){const e={scopeName:"theme-default",customLinkHref:r=>r,...t},o=e.themeLinkTagId||A.themeLinkTagId;let n=document.getElementById(o);const u=e.customLinkHref(`${me.replace(/\/$/,"")}${`/${he}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const r=R({id:o,href:u});n.nextSibling?n.parentNode.insertBefore(r,n.nextSibling):n.parentNode.appendChild(r),r.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),P(e)};return}n=R({id:o,href:u}),P(e),document[(e.themeLinkTagInjectTo||A.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function Ee(){var m;const{layoutTheme:t,layout:e}=ie(),o=w([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=x(),u=w((m=n==null?void 0:n.layout)==null?void 0:m.darkMode),r=document.documentElement;function g(l=c().Theme??"default"){var s,h;if(t.value.theme=l,Te({scopeName:`layout-theme-${l}`}),n.layout={layout:e.value,theme:l,darkMode:u.value,sidebarStatus:(s=n.layout)==null?void 0:s.sidebarStatus,epThemeColor:(h=n.layout)==null?void 0:h.epThemeColor},l==="default"||l==="light")p(c().EpThemeColor);else{const y=o.value.find(C=>C.themeColor===l);p(y.color)}}function T(l,s,h){document.documentElement.style.setProperty(`--el-color-primary-${l}-${s}`,u.value?ge(h,s/10):pe(h,s/10))}const p=l=>{k().setEpThemeColor(l),document.documentElement.style.setProperty("--el-color-primary",l);for(let s=1;s<=2;s++)T("dark",s,l);for(let s=1;s<=9;s++)T("light",s,l)};function $(){k().epTheme==="light"&&u.value?g("default"):g(k().epTheme),u.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:r,dataTheme:u,layoutTheme:t,themeColors:o,dataThemeChange:$,setEpThemeColor:p,setLayoutThemeColor:g}}function He(t,e){const o=/^IF-/;if(o.test(t)){const n=t.split(o)[1],u=n.slice(0,n.indexOf(" ")==-1?n.length:n.indexOf(" ")),r=n.slice(n.indexOf(" ")+1,n.length);return B({name:"FontIcon",render(){return S(ee,{icon:u,iconType:r,...e})}})}else return typeof t=="function"||typeof(t==null?void 0:t.render)=="function"?t:typeof t=="object"?B({name:"OfflineIcon",render(){return S(E,{icon:t,...e})}}):B({name:"Icon",render(){const n=t&&t.includes(":")?te:E;return S(n,{icon:t,...e})}})}const ve=""+new URL("../png/user-295f7775.png",import.meta.url).href,be="当前路由配置不正确，请检查配置";function _e(){var I;const t=ne(),e=de(),o=oe().options.routes,{wholeMenus:n}=ae(ue()),u=((I=c())==null?void 0:I.TooltipEffect)??"light",r=i(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),g=i(()=>{var a;return(a=H())==null?void 0:a.username}),T=i(()=>g.value?{marginRight:"10px"}:""),p=i(()=>!e.getSidebarStatus),$=i(()=>e.getDevice),{$storage:m,$config:l}=x(),s=i(()=>{var a;return(a=m==null?void 0:m.layout)==null?void 0:a.layout}),h=i(()=>l.Title);function y(a){const v=c().Title;v?document.title=`${a.title} | ${v}`:document.title=a.title}function C(){H().logOut()}function V(){var a;se.push((a=le())==null?void 0:a.path)}function W(){_.emit("openPanel")}function Q(){e.toggleSideBar()}function U(a){a==null||a.handleResize()}function J(a){var L;if(!a.children)return console.error(be);const v=/^http(s?):\/\//,M=(L=a.children[0])==null?void 0:L.path;return v.test(M)?a.path+"/"+M:M}function q(a){n.value.length===0||K(a)||_.emit("changLayoutRoute",a)}function K(a){return re.includes(a)}return{route:t,title:h,device:$,layout:s,logout:C,routers:o,$storage:m,backTopMenu:V,onPanel:W,getDivStyle:r,changeTitle:y,toggleSideBar:Q,menuSelect:q,handleResize:U,resolvePath:J,isCollapse:p,pureApp:e,username:g,userAvatar:ve,avatarsStyle:T,tooltipEffect:u}}const $e={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},ye=b("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Ce=b("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),Me=[ye,Ce];function Be(t,e){return O(),j("svg",$e,Me)}const Ne={render:Be},Se={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},ke=b("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Ae=b("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),xe=[ke,Ae];function Ie(t,e){return O(),j("svg",Se,xe)}const Pe={render:Ie};export{He as a,_e as b,Ee as c,de as d,Ne as e,Pe as f,ie as g,Te as t,k as u};
