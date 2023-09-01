"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6919],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),p=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},l=function(e){var t=p(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),u=p(n),h=r,m=u["".concat(c,".").concat(h)]||u[h]||d[h]||o;return n?a.createElement(m,s(s({ref:t},l),{},{components:n})):a.createElement(m,s({ref:t},l))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=u;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var p=2;p<o;p++)s[p]=n[p];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},3988:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>p,toc:()=>d});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),s=["components"],i={id:"notation",title:"Notation"},c=void 0,p={unversionedId:"notation",id:"version-v.3.3.0/notation",title:"Notation",description:"UCLCHEM uses notation, which differentiates between species types. Here, we'll give an overview of this notation and associated processes.",source:"@site/versioned_docs/version-v.3.3.0/chem-notation.md",sourceDirName:".",slug:"/notation",permalink:"/docs/notation",draft:!1,tags:[],version:"v.3.3.0",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1693569187,formattedLastUpdatedAt:"Sep 1, 2023",frontMatter:{id:"notation",title:"Notation"},sidebar:"docs",previous:{title:"Chemistry",permalink:"/docs/category/chemistry"},next:{title:"Gas Phase Reactions",permalink:"/docs/gas"}},l={},d=[{value:"Gas phase",id:"gas-phase",level:2},{value:"Ice",id:"ice",level:2},{value:"Surface",id:"surface",level:2},{value:"Bulk",id:"bulk",level:2}],u={toc:d};function h(e){var t=e.components,n=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"UCLCHEM uses notation, which differentiates between species types. Here, we'll give an overview of this notation and associated processes. "),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"th"},"Species type")),(0,o.kt)("th",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"th"},"Symbol")),(0,o.kt)("th",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"th"},"Example")))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"Gas phase"),(0,o.kt)("td",{parentName:"tr",align:"center"}),(0,o.kt)("td",{parentName:"tr",align:"center"},"H2O")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"Ice"),(0,o.kt)("td",{parentName:"tr",align:"center"},"$"),(0,o.kt)("td",{parentName:"tr",align:"center"},"$H2O")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"Surface"),(0,o.kt)("td",{parentName:"tr",align:"center"},"#"),(0,o.kt)("td",{parentName:"tr",align:"center"},"#H2O")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"Bulk"),(0,o.kt)("td",{parentName:"tr",align:"center"},"@"),(0,o.kt)("td",{parentName:"tr",align:"center"},"@H2O")))),(0,o.kt)("h2",{id:"gas-phase"},"Gas phase"),(0,o.kt)("p",null,"The gas phase, i.e., the total abundance of a given species in the gas phase, is marked without any symbol. Hence, in order to analyze a given gas phase species, we need to use the name of the species without any additions, e.g., ",(0,o.kt)("strong",{parentName:"p"},"H2O"),". You can read more on reactions occurring in the gas phase ",(0,o.kt)("a",{parentName:"p",href:"/docs/next/gas"},"here"),"."),(0,o.kt)("h2",{id:"ice"},"Ice"),(0,o.kt)("p",null,"When we need to consider the total ice abundance of a given species, we would have to use the $ symbol in front of the molecule. Following the example from the previous section, this would be ",(0,o.kt)("strong",{parentName:"p"},"$H2O"),". However, what is the total ice abundance? If you run a three-phase model, i.e., the one considering gas, surface, and bulk: ",(0,o.kt)("em",{parentName:"p"},"ice = surface + bulk"),".\nIn the case of a simpler two-phase model, it will simply correspond to the abundance on the surface. "),(0,o.kt)("h2",{id:"surface"},"Surface"),(0,o.kt)("p",null,"The surface species starts with #, and the abundance of water on the surface of the grain would be ",(0,o.kt)("strong",{parentName:"p"},"#H2O"),". The grain surface is the outermost part of the grain, from which species get released to the gas phase but are also frozen onto. Hence, the ",(0,o.kt)("a",{parentName:"p",href:"/docs/next/desorb"},"adsorption & desorption reactions")," only consider the surface. Details of the reactions happening on the dust grain surface are described ",(0,o.kt)("a",{parentName:"p",href:"/docs/next/grain"},"here"),". "),(0,o.kt)("h2",{id:"bulk"},"Bulk"),(0,o.kt)("p",null,"In three-phase models, we also account for the bulk of the dust grain, which corresponds to everything below the surface. The bulk is marked with @, so we can access it through ",(0,o.kt)("strong",{parentName:"p"},"@H2O"),". The species from the bulk can diffuse into the surface but also get released into the gas phase (or destroyed) in fast shocks. Bulk ice processes are described in greater detail in a separate ",(0,o.kt)("a",{parentName:"p",href:"/docs/next/bulk"},"page"),"."))}h.isMDXComponent=!0}}]);