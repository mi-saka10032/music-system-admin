import{aL as s}from"./index-c2671b15.js";const e="/song",o=t=>s.post(`${e}/page`,{data:t}),a=t=>s.post(`${e}/findById`,{params:{id:t}}),r=t=>s.post(`${e}/update`,{data:t}),g=t=>s.post(`${e}/create`,{data:t}),p=t=>s.post(`${e}/delete`,{params:{id:t}}),c=t=>s.post(`${e}/batchCreate`,{data:t}),i=t=>s.post(`${e}/pageByAlbumId`,{data:t}),u=t=>s.post(`${e}/pageSingerId`,{data:t}),d=t=>s.post(`${e}/shelveAlbumId`,{data:t}),S=t=>s.post(`${e}/shelveSingerId`,{data:t}),l=()=>s.get(`${e}/getSTS`);export{u as a,S as b,o as c,d,p as e,a as f,i as g,c as h,g as i,l as j,r as u};