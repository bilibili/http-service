import{d as W,h as i,g as C,o as l,c,k as t,F as $,C as F,N,n as M,t as B,p as D,m as T,_ as q,G as A,a as V}from"./chunks/framework.dab116c3.js";const z="/bili-utils/unify-http-request/assets/musk.b36eb9ae.png",m=u=>(D("data-v-f4c85eb1"),u=u(),T(),u),O={id:"wonderland"},R={id:"viewport"},j=["count"],E=m(()=>t("img",{src:z,alt:""},null,-1)),G=[E],H={id:"sky"},J=m(()=>t("div",{id:"head"},null,-1)),K={id:"body"},Q=m(()=>t("div",{id:"foot"},[t("div",{id:"part1"}),t("div",{id:"part2"})],-1)),U=m(()=>t("div",{id:"land"},null,-1)),p=6e3,X=W({__name:"WonderLand",setup(u){const d=i(null),s=i(null),h=i(["Timeout","Body","ResData","InitCtx","Retry"].reverse()),o=i(-1),b=i(!1),y=i(!1),g=i([{left:"10%",top:"30px"}]),I=C(()=>{if(y.value)return"";const e=h.value.length-o.value;return o.value===-1?"Launch":e===0?"Ignition":e===-1?"Liftoff!":e});let a=0,n=0,_=0;function w(){n<a?(_+=.01,n+=_,d.value.style.bottom=`-${n}px`,s.value.style.bottom=`${n+50}px`,n>a/5&&(s.value.style.transform=`scale(${Math.max(1-(n-a/5)/a,.3)})`),requestAnimationFrame(w)):(y.value=!0,_=0,x(1500).then(k))}function k(){n>0?(_+=.01,n-=_,d.value.style.bottom=`-${n}px`,s.value.style.bottom=`${n+50}px`,n>a/5?s.value.style.transform=`scale(${Math.max(1-(n-a/5)/a,.3)})`:s.value.style.transform="",requestAnimationFrame(k)):L()}function x(e){return new Promise(f=>{setTimeout(()=>{f(!0)},e)})}async function L(){let e=Promise.resolve(!0);for(;o.value>=0;)await e,o.value=o.value-1,e=x(1e3)}async function P(){let e=Promise.resolve(!0);for(;o.value<h.value.length+1;)await e,o.value=o.value+1,e=x(1e3)}async function S(){if(b.value)return;b.value=!0;const e=d.value;e.style.height=`${p}px`,a=p-e.parentNode.offsetHeight,g.value=new Array(Math.round(p/50)).fill(0).map((f,r)=>({left:`${Math.random()*100}%`,top:`${r*50}px`})).filter(f=>{if(!(Math.random()>.5))return!1;const v=Number(f.top.replace("px",""));return v>100&&v<p-700}),await P(),w()}return(e,f)=>(l(),c("div",O,[t("div",R,[t("div",{id:"content",ref_key:"content",ref:d},[t("div",{id:"emiter",onClick:S,count:I.value},G,8,j),t("div",H,[(l(!0),c($,null,F(g.value,r=>(l(),c("div",{class:"cloud",style:N({left:r.left,top:r.top})},null,4))),256))]),t("div",{id:"rocket",ref_key:"rocket",ref:s},[t("div",{id:"fetch",style:N({opacity:y.value?1:0})},"💡Fetch Done",4),J,t("div",K,[(l(!0),c($,null,F(h.value,(r,v)=>(l(),c("div",{class:M(o.value===v?"active":"")},B(r),3))),256))]),Q],512),U],512)])]))}});const Y=q(X,[["__scopeId","data-v-f4c85eb1"]]),Z=t("h1",{id:"wonder",tabindex:"-1"},[V("Wonder "),t("a",{class:"header-anchor",href:"#wonder","aria-label":'Permalink to "Wonder"'},"​")],-1),ne=JSON.parse('{"title":"Wonder","description":"","frontmatter":{},"headers":[],"relativePath":"intro/wonder.md","filePath":"intro/wonder.md"}'),ee={name:"intro/wonder.md"},oe=Object.assign(ee,{setup(u){return(d,s)=>(l(),c("div",null,[Z,A(Y)]))}});export{ne as __pageData,oe as default};
