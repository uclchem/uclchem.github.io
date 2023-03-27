"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7524],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=c(r),f=o,m=d["".concat(s,".").concat(f)]||d[f]||u[f]||a;return r?n.createElement(m,l(l({ref:t},p),{},{components:r})):n.createElement(m,l({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var c=2;c<a;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8528:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>f,frontMatter:()=>i,metadata:()=>c,toc:()=>u});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),l=["components"],i={id:"physics-collapse",title:"Collapse Models"},s=void 0,c={unversionedId:"physics-collapse",id:"physics-collapse",title:"Collapse Models",description:"Main Contributors: Felix Priestley",source:"@site/docs/physics-collapse.md",sourceDirName:".",slug:"/physics-collapse",permalink:"/docs/next/physics-collapse",tags:[],version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1651073142,formattedLastUpdatedAt:"4/27/2022",frontMatter:{id:"physics-collapse",title:"Collapse Models"},sidebar:"docs",previous:{title:"Shock Models",permalink:"/docs/next/physics-shocks"},next:{title:"Chemistry",permalink:"/docs/next/category/chemistry"}},p={},u=[],d={toc:u};function f(e){var t=e.components,r=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Main Contributors"),": Felix Priestley"),(0,a.kt)("p",null,"The freefall collapse function used to control the density in most UCLCHEM models is fairly simplistic. ",(0,a.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.3847/1538-3881/aac957"},"Priestley et al. 2018")," created the collapse model which parameterizes the density profile of a collapsing core as a function of time and radius. The following collapse modes are possible:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},'"BE1.1": Bonnor-Ebert sphere, overdensity factor 1.1 (Aikawa+2005)'),(0,a.kt)("li",{parentName:"ul"},'"BE4": Bonnor-Ebert sphere, overdensity factor 4 (Aikawa+2005)'),(0,a.kt)("li",{parentName:"ul"},'"filament": magnetised filament, initially unstable to collapse (Nakamura+1995)'),(0,a.kt)("li",{parentName:"ul"},'"ambipolar": magnetised cloud, initially stable, collapse due to ambipolar diffusion (Fiedler+1993)')))}f.isMDXComponent=!0}}]);