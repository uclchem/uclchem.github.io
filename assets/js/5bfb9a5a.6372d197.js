"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[978],{3905:(e,t,r)=>{r.d(t,{Zo:()=>h,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=a.createContext({}),c=function(e){var t=a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},h=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,h=s(e,["components","mdxType","originalType","parentName"]),p=c(r),m=n,d=p["".concat(l,".").concat(m)]||p[m]||u[m]||o;return r?a.createElement(d,i(i({ref:t},h),{},{components:r})):a.createElement(d,i({ref:t},h))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:n,i[1]=s;for(var c=2;c<o;c++)i[c]=r[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},968:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>h,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>c,toc:()=>p});var a=r(7462),n=r(3366),o=(r(7294),r(3905)),i=["components"],s={title:"The Cosmic-ray Ionization Rate in NGC 253",authors:"jonholdship"},l=void 0,c={permalink:"/blog/2022/04/14/crir-ngc253",source:"@site/blog/2022-04-14-crir-ngc253.md",title:"The Cosmic-ray Ionization Rate in NGC 253",description:"NGC 253 is a nearby starburst galaxy which hosts several large clouds of gas in its central molecular zone. These clouds are similar to GMCs but orders of magnitude more massive and much hotter, where the star formation rate is very high. The temperature of this gas is important because the star formation efficiency will be determined by how much internal energy that gas has.",date:"2022-04-14T00:00:00.000Z",formattedDate:"April 14, 2022",tags:[],readingTime:.895,truncated:!1,authors:[{name:"Jonathan Holdship",title:"UCLCHEM developer",url:"https://jonholdship.github.io",imageURL:"/img/jon.png",key:"jonholdship"}],frontMatter:{title:"The Cosmic-ray Ionization Rate in NGC 253",authors:"jonholdship"},prevItem:{title:"UCLCHEM v3.0",permalink:"/blog/2022/04/29/uclchem-v3"},nextItem:{title:"HITs - History Independent Tracers",permalink:"/blog/2022/02/06/holdship-hits"}},h={authorsImageUrls:[void 0]},p=[],u={toc:p};function m(e){var t=e.components,r=(0,n.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"NGC 253 is a nearby starburst galaxy which hosts several large clouds of gas in its central molecular zone. These clouds are similar to GMCs but orders of magnitude more massive and much hotter, where the star formation rate is very high. The temperature of this gas is important because the star formation efficiency will be determined by how much internal energy that gas has."),(0,o.kt)("p",null,"Many mechanisms could be heating this gas including mechanical heating due to turbulent shocks, UV photons, X-ray photons, and cosmic-rays. Whilst all are reasonable suspects in the CMZ of NGC 253, previous studies have shown ",(0,o.kt)("a",{parentName:"p",href:"https://ui.adsabs.harvard.edu/abs/2021A%26A...654A..55H/abstract"},"1")," ",(0,o.kt)("a",{parentName:"p",href:"https://ui.adsabs.harvard.edu/abs/2021ApJ...923...24H/abstract"},"2")," that the cosmic-ray ionization rate (CRIR) is likely to be very high."),(0,o.kt)("p",null,"In ",(0,o.kt)("a",{parentName:"p",href:"https://ui.adsabs.harvard.edu/abs/2022arXiv220403668H/abstract"},"a recent piece of work")," we have used UCLCHEM to show that the ratio of SO and H_3O^+ is a powerful probe of the CRIR. We model ALMA observations of emission from these molecules using UCLCHEM and ",(0,o.kt)("a",{parentName:"p",href:"https://spectralradex.readthedocs.io/en/latest/"},"SpectralRadex")," to infer the CRIR. We find that regardless of the temperature of the gas, the CRIR is around 10^4 times larger than in the Milky Way."))}m.isMDXComponent=!0}}]);