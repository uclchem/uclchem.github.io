"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3071],{5658:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>a,contentTitle:()=>i,default:()=>p,frontMatter:()=>r,metadata:()=>d,toc:()=>c});var o=s(2540),n=s(8453);const r={id:"hydro",title:"Hydro Post Processing"},i=void 0,d={id:"hydro",title:"Hydro Post Processing",description:"Main Contributors: Jon Holdship",source:"@site/versioned_docs/version-v3.4.0/hydro.md",sourceDirName:".",slug:"/hydro",permalink:"/docs/hydro",draft:!1,unlisted:!1,tags:[],version:"v3.4.0",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1728914606e3,frontMatter:{id:"hydro",title:"Hydro Post Processing"}},a={},c=[];function l(e){const t={code:"code",p:"p",strong:"strong",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.strong,{children:"Main Contributors"}),": Jon Holdship"]}),"\n",(0,o.jsxs)(t.p,{children:["UCLCHEM includes a post-processing module ",(0,o.jsx)(t.code,{children:"src/hydro.f90"})," which is effectively a template as it necessarily requires user editing. The module reads in a columnated file of physical properties such as the output from a hydrodynamical model and creates interpolation functions."]}),"\n",(0,o.jsxs)(t.p,{children:["As ",(0,o.jsx)(t.code,{children:"updatePhysics"})," is called by UCLCHEM's main loop, these interpolation functions are called to get the physical properties of the gas at the current simulation time."]}),"\n",(0,o.jsxs)(t.p,{children:["Whilst the maximum amount of information that can be read from the input file is set by the physical properties  UCLCHEM deals with, this is naturally a user dependent process. The input file format and the gas properties that are supplied (eg just density/temperature or density/temperature/Av) depend on the model being post processed. Thus ",(0,o.jsx)(t.code,{children:"src/hydro.f90"})," needs to be edited to account for this."]})]})}function p(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},8453:(e,t,s)=>{s.d(t,{R:()=>i,x:()=>d});var o=s(3696);const n={},r=o.createContext(n);function i(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),o.createElement(r.Provider,{value:t},e.children)}}}]);