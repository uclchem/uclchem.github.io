"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6077],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=c(r),f=o,y=u["".concat(p,".").concat(f)]||u[f]||d[f]||a;return r?n.createElement(y,i(i({ref:t},l),{},{components:r})):n.createElement(y,i({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=u;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},2428:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>f,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],s={id:"hydro",title:"Hydro Post Processing"},p=void 0,c={unversionedId:"hydro",id:"version-v.3.3.0/hydro",title:"Hydro Post Processing",description:"Main Contributors: Jon Holdship",source:"@site/versioned_docs/version-v.3.3.0/hydro.md",sourceDirName:".",slug:"/hydro",permalink:"/docs/hydro",draft:!1,tags:[],version:"v.3.3.0",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1693569187,formattedLastUpdatedAt:"Sep 1, 2023",frontMatter:{id:"hydro",title:"Hydro Post Processing"}},l={},d=[],u={toc:d};function f(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Main Contributors"),": Jon Holdship"),(0,a.kt)("p",null,"UCLCHEM includes a post-processing module ",(0,a.kt)("inlineCode",{parentName:"p"},"src/hydro.f90")," which is effectively a template as it necessarily requires user editing. The module reads in a columnated file of physical properties such as the output from a hydrodynamical model and creates interpolation functions."),(0,a.kt)("p",null,"As ",(0,a.kt)("inlineCode",{parentName:"p"},"updatePhysics")," is called by UCLCHEM's main loop, these interpolation functions are called to get the physical properties of the gas at the current simulation time."),(0,a.kt)("p",null,"Whilst the maximum amount of information that can be read from the input file is set by the physical properties  UCLCHEM deals with, this is naturally a user dependent process. The input file format and the gas properties that are supplied (eg just density/temperature or density/temperature/Av) depend on the model being post processed. Thus ",(0,a.kt)("inlineCode",{parentName:"p"},"src/hydro.f90")," needs to be edited to account for this."))}f.isMDXComponent=!0}}]);