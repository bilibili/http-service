import{d as I,h as r,g as $,o as u,c as d,k as s,n as b,N as v,F as D,C as A,a0 as P,a1 as q,t as N,B as L,a as k,G as w,Q as B}from"./chunks/framework.61af9522.js";const M="/http-service/assets/wp.d6208a21.svg",R="/http-service/assets/onion.e8e8ff24.webp",V={class:"framework-experience"},H=["onMouseenter","title"],O={class:"fe-onion-layer-name"},W={class:"fe-console"},z=s("div",{class:"fe-console-header"},"terminal",-1),J={class:"fe-console-content"},K=["innerHTML"],F=100,j=I({__name:"FrameworkExperience",setup(E){const x=r([]),l=$(()=>{const t=[{name:"Retry",builtin:!0},{name:"Init Context",builtin:!0},...x.value,{name:"Res Data",builtin:!0},{name:"Body",builtin:!0},{name:"Timeout",builtin:!0},{name:"Fetch",builtin:!0}],a=["rgb(75, 0, 130)","rgb(109, 0, 137)","rgb(141, 0, 142)","rgb(171, 0, 146)","rgb(200, 0, 147)","rgb(228, 0, 148)"];return t.map((e,n)=>Object.assign(e,{color:a[n]}))}),o=r(-1);function T(t){if(g.value)return{width:F+"px",height:"300px",left:(F+20)*t+"px",top:0};const a=l.value.length,e=(a-t)/a;return{zIndex:t,transform:"translate(-50%, -50%)",width:e*600+"px",height:e*500+"px"}}function S(t){const a=o.value===t;return{backgroundColor:l.value[t].color,transform:`scale(${a?1.05:1}) `,borderRadius:g.value?"8px":""}}const g=r(!1),y=t=>new Promise(a=>{setTimeout(()=>{a(!0)},t*1e3)});function _(t,a){const{name:e,color:n}=t;return e==="Fetch"&&(a==="before"?a="start":a="done"),`[<em style="color:${n}">${e}</em>]request ${a}`}async function C(){h.value=0,m.value=0,f.value=0,c.value=[],await y(0),g.value=!0,i.value=!0;const t=l.value.length,a=F+20;h.value=t*a-20;let e=0;o.value=e,c.value.push(_(l.value[e],"before"));let n=setInterval(()=>{e++,c.value.push(_(l.value[e],"before")),o.value=e},500);await y(2.7),clearInterval(n),m.value=120,await y(1.2),f.value=t*a-20,c.value.push(_(l.value[e],"after")),n=setInterval(()=>{c.value.push(_(l.value[e],"after")),e--,o.value=e},500),await y(3),clearInterval(n),i.value=!1,o.value=-1}const h=r(0),m=r(0),f=r(0),i=r(!1),c=r([]),p=r(["linear-gradient(90deg, rgb(0, 191, 255), rgb(0, 177, 255))","linear-gradient(rgb(0, 177, 255), rgb(0, 161, 255))","linear-gradient(270deg, rgb(0, 161, 255), rgb(30, 144, 255))"]);return(t,a)=>(u(),d("div",V,[s("div",{class:"fe-try",onClick:C},"Try it!"),s("div",{class:"fe-onion",onMouseleave:a[0]||(a[0]=e=>o.value=-1)},[s("div",{class:b(["fe-onion-line1",i.value&&"animating"]),style:v({top:"80px",height:"20px",width:h.value+"px",backgroundImage:`linear-gradient(90deg, ${p.value[0]},${p.value[1]})`})},null,6),s("div",{class:b(["fe-onion-line2",i.value&&"animating"]),style:v({left:h.value-20+"px",width:"20px",top:"100px",height:m.value+"px",backgroundImage:`linear-gradient(180deg,${p.value[1]},${p.value[2]})`})},null,6),s("div",{class:b(["fe-onion-line3",i.value&&"animating"]),style:v({right:600-h.value+20+"px",width:f.value?f.value-20+"px":"",height:"20px",top:80+m.value+"px",backgroundImage:`linear-gradient(270deg,${p.value[2]},${p.value[3]})`})},null,6),(u(!0),d(D,null,A(l.value,(e,n)=>(u(),d("div",{class:"fe-onion-layer",onMouseenter:()=>{i.value||(o.value=n)},key:e.name,title:e.name,style:v(T(n))},[s("div",{class:"fe-onion-layer-halo",style:v(S(n))},null,4),s("div",O,N(e.name),1)],44,H))),128))],32),P(s("div",W,[z,s("div",J,[(u(!0),d(D,null,A(c.value,(e,n)=>(u(),d("div",{class:"fe-console-line",key:n,innerHTML:e},null,8,K))),128))])],512),[[q,g.value]])]))}});const G={id:"框架设计",tabindex:"-1"},Q=s("a",{class:"header-anchor",href:"#框架设计","aria-label":'Permalink to "框架设计 <Badge type="tip" text="概念介绍" />"'},"​",-1),U=B(`<p>我们采用了洋葱模式来设计框架，<a href="#模型图">此处跳转</a></p><h2 id="仿真体验" tabindex="-1">仿真体验 <a class="header-anchor" href="#仿真体验" aria-label="Permalink to &quot;仿真体验&quot;">​</a></h2><p>我们假设每个中间件的实现均为:</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">async</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">handler</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">ctx</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">next</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">[MIDDLEWARE_NAME]request before</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">next</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">[MIDDLEWARE_NAME]request after</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div>`,4),X=B('<h2 id="设计过程" tabindex="-1">设计过程 <a class="header-anchor" href="#设计过程" aria-label="Permalink to &quot;设计过程&quot;">​</a></h2><ul><li><strong>与服务端对比</strong></li></ul><table><thead><tr><th style="text-align:center;">端</th><th style="text-align:center;">语言</th><th style="text-align:center;">特点</th></tr></thead><tbody><tr><td style="text-align:center;">前端</td><td style="text-align:center;">JS(TS)/Node</td><td style="text-align:center;">偏灵活，动态</td></tr><tr><td style="text-align:center;">后端</td><td style="text-align:center;">Go/Java</td><td style="text-align:center;">偏稳固，静态</td></tr></tbody></table><ul><li><strong>Register</strong></li></ul><p>在注册能力上，后端选择在服务启动时一次性初始化所有插件/中间件， 我们选择保留前端业务灵活、语言动态的特点</p><p><strong>因此我们有两个允许：</strong></p><ol><li>允许用户在发起请求时，携带该次请求所需要的临时中间件</li><li>允许中间件内部依赖按需加载</li></ol><p>例如：</p><ol><li>可以在需要进行风控验证的接口请求时携带风控验证中间件</li><li>风控验证中间件所依赖的验证SDK可以先不进行初始化，实际触发时再去加载执行</li></ol><p>除了以上，我们也要遵守几个原则：</p><ol><li>对一个模块下的公共能力尽量进行最大范围的全局初始化</li><li>每个实例要有明显的使用划分，避免混用，有条件的全局使用一个实例（也取决于前端应用的场景，请灵活决策）</li></ol><h2 id="模型图" tabindex="-1">模型图 <a class="header-anchor" href="#模型图" aria-label="Permalink to &quot;模型图&quot;">​</a></h2><h3 id="http-service-的洋葱模型" tabindex="-1">HTTP Service 的洋葱模型 <a class="header-anchor" href="#http-service-的洋葱模型" aria-label="Permalink to &quot;HTTP Service 的洋葱模型&quot;">​</a></h3><p><img src="'+M+'" alt="洋葱模型"></p><h3 id="koa-的洋葱模型" tabindex="-1">KOA 的洋葱模型 <a class="header-anchor" href="#koa-的洋葱模型" aria-label="Permalink to &quot;KOA 的洋葱模型&quot;">​</a></h3><p><img src="'+R+'" alt="洋葱模型"></p>',16),ee=JSON.parse('{"title":"框架设计","description":"","frontmatter":{},"headers":[],"relativePath":"intro/framework.md","filePath":"intro/framework.md"}'),Y={name:"intro/framework.md"},ae=Object.assign(Y,{setup(E){return(x,l)=>{const o=L("Badge");return u(),d("div",null,[s("h1",G,[k("框架设计 "),w(o,{type:"tip",text:"概念介绍"}),k(),Q]),U,w(j),X])}}});export{ee as __pageData,ae as default};
