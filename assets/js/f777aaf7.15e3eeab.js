"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6077],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=c(r),f=o,y=d["".concat(p,".").concat(f)]||d[f]||u[f]||i;return r?n.createElement(y,a(a({ref:t},l),{},{components:r})):n.createElement(y,a({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2428:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>f,frontMatter:()=>s,metadata:()=>c,toc:()=>u});var n=r(7462),o=r(3366),i=(r(7294),r(3905)),a=["components"],s={id:"hydro",title:"Hydro Post Processing"},p=void 0,c={unversionedId:"hydro",id:"version-v.3.3.0/hydro",title:"Hydro Post Processing",description:"Main Contributors: Jon Holdship",source:"@site/versioned_docs/version-v.3.3.0/hydro.md",sourceDirName:".",slug:"/hydro",permalink:"/docs/hydro",draft:!1,tags:[],version:"v.3.3.0",frontMatter:{id:"hydro",title:"Hydro Post Processing"}},l={},u=[],d={toc:u};function f(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Main Contributors"),": Jon Holdship"),(0,i.kt)("p",null,"UCLCHEM includes a post-processing module ",(0,i.kt)("inlineCode",{parentName:"p"},"src/hydro.f90")," which is effectively a template as it necessarily requires user editing. The module reads in a columnated file of physical properties such as the output from a hydrodynamical model and creates interpolation functions."),(0,i.kt)("p",null,"As ",(0,i.kt)("inlineCode",{parentName:"p"},"updatePhysics")," is called by UCLCHEM's main loop, these interpolation functions are called to get the physical properties of the gas at the current simulation time."),(0,i.kt)("p",null,"Whilst the maximum amount of information that can be read from the input file is set by the physical properties  UCLCHEM deals with, this is naturally a user dependent process. The input file format and the gas properties that are supplied (eg just density/temperature or density/temperature/Av) depend on the model being post processed. Thus ",(0,i.kt)("inlineCode",{parentName:"p"},"src/hydro.f90")," needs to be edited to account for this."))}f.isMDXComponent=!0}}]);