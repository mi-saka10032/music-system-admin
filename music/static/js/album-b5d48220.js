import{aL as t}from"./index-a4230535.js";const s="/album",u=e=>t.request("post",`${s}/page`,{data:e}),a=e=>t.request("post",`${s}/findById`,{params:{id:e}}),o=e=>t.request("post",`${s}/update`,{data:e}),p=e=>(delete e.id,t.request("post",`${s}/create`,{data:e})),n=e=>t.request("post",`${s}/delete`,{params:{id:e}});export{a,p as c,n as d,u as g,o as u};