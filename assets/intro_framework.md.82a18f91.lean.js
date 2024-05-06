import{d as I,h as r,g as $,o as u,c as d,k as s,n as b,N as v,F as D,C as A,a0 as P,a1 as q,t as N,B as L,a as k,G as w,Q as B}from"./chunks/framework.61af9522.js";const M="/http-service/assets/wp.d6208a21.svg",R="/http-service/assets/onion.e8e8ff24.webp",V={class:"framework-experience"},H=["onMouseenter","title"],O={class:"fe-onion-layer-name"},W={class:"fe-console"},z=s("div",{class:"fe-console-header"},"terminal",-1),J={class:"fe-console-content"},K=["innerHTML"],F=100,j=I({__name:"FrameworkExperience",setup(E){const x=r([]),l=$(()=>{const t=[{name:"Retry",builtin:!0},{name:"Init Context",builtin:!0},...x.value,{name:"Res Data",builtin:!0},{name:"Body",builtin:!0},{name:"Timeout",builtin:!0},{name:"Fetch",builtin:!0}],a=["rgb(75, 0, 130)","rgb(109, 0, 137)","rgb(141, 0, 142)","rgb(171, 0, 146)","rgb(200, 0, 147)","rgb(228, 0, 148)"];return t.map((e,n)=>Object.assign(e,{color:a[n]}))}),o=r(-1);function T(t){if(g.value)return{width:F+"px",height:"300px",left:(F+20)*t+"px",top:0};const a=l.value.length,e=(a-t)/a;return{zIndex:t,transform:"translate(-50%, -50%)",width:e*600+"px",height:e*500+"px"}}function S(t){const a=o.value===t;return{backgroundColor:l.value[t].color,transform:`scale(${a?1.05:1}) `,borderRadius:g.value?"8px":""}}const g=r(!1),y=t=>new Promise(a=>{setTimeout(()=>{a(!0)},t*1e3)});function _(t,a){const{name:e,color:n}=t;return e==="Fetch"&&(a==="before"?a="start":a="done"),`[<em style="color:${n}">${e}</em>]request ${a}`}async function C(){h.value=0,m.value=0,f.value=0,c.value=[],await y(0),g.value=!0,i.value=!0;const t=l.value.length,a=F+20;h.value=t*a-20;let e=0;o.value=e,c.value.push(_(l.value[e],"before"));let n=setInterval(()=>{e++,c.value.push(_(l.value[e],"before")),o.value=e},500);await y(2.7),clearInterval(n),m.value=120,await y(1.2),f.value=t*a-20,c.value.push(_(l.value[e],"after")),n=setInterval(()=>{c.value.push(_(l.value[e],"after")),e--,o.value=e},500),await y(3),clearInterval(n),i.value=!1,o.value=-1}const h=r(0),m=r(0),f=r(0),i=r(!1),c=r([]),p=r(["linear-gradient(90deg, rgb(0, 191, 255), rgb(0, 177, 255))","linear-gradient(rgb(0, 177, 255), rgb(0, 161, 255))","linear-gradient(270deg, rgb(0, 161, 255), rgb(30, 144, 255))"]);return(t,a)=>(u(),d("div",V,[s("div",{class:"fe-try",onClick:C},"Try it!"),s("div",{class:"fe-onion",onMouseleave:a[0]||(a[0]=e=>o.value=-1)},[s("div",{class:b(["fe-onion-line1",i.value&&"animating"]),style:v({top:"80px",height:"20px",width:h.value+"px",backgroundImage:`linear-gradient(90deg, ${p.value[0]},${p.value[1]})`})},null,6),s("div",{class:b(["fe-onion-line2",i.value&&"animating"]),style:v({left:h.value-20+"px",width:"20px",top:"100px",height:m.value+"px",backgroundImage:`linear-gradient(180deg,${p.value[1]},${p.value[2]})`})},null,6),s("div",{class:b(["fe-onion-line3",i.value&&"animating"]),style:v({right:600-h.value+20+"px",width:f.value?f.value-20+"px":"",height:"20px",top:80+m.value+"px",backgroundImage:`linear-gradient(270deg,${p.value[2]},${p.value[3]})`})},null,6),(u(!0),d(D,null,A(l.value,(e,n)=>(u(),d("div",{class:"fe-onion-layer",onMouseenter:()=>{i.value||(o.value=n)},key:e.name,title:e.name,style:v(T(n))},[s("div",{class:"fe-onion-layer-halo",style:v(S(n))},null,4),s("div",O,N(e.name),1)],44,H))),128))],32),P(s("div",W,[z,s("div",J,[(u(!0),d(D,null,A(c.value,(e,n)=>(u(),d("div",{class:"fe-console-line",key:n,innerHTML:e},null,8,K))),128))])],512),[[q,g.value]])]))}});const G={id:"框架设计",tabindex:"-1"},Q=s("a",{class:"header-anchor",href:"#框架设计","aria-label":'Permalink to "框架设计 <Badge type="tip" text="概念介绍" />"'},"​",-1),U=B("",4),X=B("",16),ee=JSON.parse('{"title":"框架设计","description":"","frontmatter":{},"headers":[],"relativePath":"intro/framework.md","filePath":"intro/framework.md"}'),Y={name:"intro/framework.md"},ae=Object.assign(Y,{setup(E){return(x,l)=>{const o=L("Badge");return u(),d("div",null,[s("h1",G,[k("框架设计 "),w(o,{type:"tip",text:"概念介绍"}),k(),Q]),U,w(j),X])}}});export{ee as __pageData,ae as default};
