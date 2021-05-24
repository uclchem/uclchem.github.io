(self.webpackChunk=self.webpackChunk||[]).push([[8827],{3905:(e,t,r)=>{"use strict";r.d(t,{Zo:()=>p,kt:()=>u});var o=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=o.createContext({}),l=function(e){var t=o.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=l(e.components);return o.createElement(c.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=l(r),u=n,m=d["".concat(c,".").concat(u)]||d[u]||h[u]||a;return r?o.createElement(m,i(i({ref:t},p),{},{components:r})):o.createElement(m,i({ref:t},p))}));function u(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,i=new Array(a);i[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var l=2;l<a;l++)i[l]=r[l];return o.createElement.apply(null,i)}return o.createElement.apply(null,r)}d.displayName="MDXCreateElement"},1820:(e,t,r)=>{"use strict";r.r(t),r.d(t,{frontMatter:()=>i,metadata:()=>s,toc:()=>c,default:()=>p});var o=r(2122),n=r(9756),a=(r(7294),r(3905)),i={id:"shocks",title:"Shock Models"},s={unversionedId:"shocks",id:"shocks",isDocsHomePage:!1,title:"Shock Models",description:"Main Contributors: Izaskun Jimenez-Serra, Tom James, Jon Holdship",source:"@site/docs/shocks.md",sourceDirName:".",slug:"/shocks",permalink:"/docs/shocks",version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1621867778,formattedLastUpdatedAt:"5/24/2021",frontMatter:{id:"shocks",title:"Shock Models"},sidebar:"docs",previous:{title:"Cloud Core Model",permalink:"/docs/cloud"},next:{title:"Collapse Models",permalink:"/docs/collapse"}},c=[{value:"Shock Profiles",id:"shock-profiles",children:[]},{value:"Sputtering",id:"sputtering",children:[]}],l={toc:c};function p(e){var t=e.components,r=(0,n.Z)(e,["components"]);return(0,a.kt)("wrapper",(0,o.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Main Contributors"),": Izaskun Jimenez-Serra, Tom James, Jon Holdship"),(0,a.kt)("h3",{id:"shock-profiles"},"Shock Profiles"),(0,a.kt)("p",null,"UCLCHEM has two physics modules to deal with shocks: cshock.f90 and jshock.f90. c-shock.f90 is based on ",(0,a.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361:20078054"},"Jimenez-Serra et al. 2008")," which parameterizes the density, temperature and velocity profiles of c-shocks as a function of shock velocity, initial gas density and magnetic field. These were validated against the results of the detailed shock modelling of ",(0,a.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1046/j.1365-8711.2003.06716.x"},"Flower et al. 2003")),(0,a.kt)("p",null,"jshock.f90 is a similar parameterization for j-shocks from ",(0,a.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361/201936536"},"James et al.")," validated against more recent results from MHDvode (",(0,a.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361/201525740"},"Flower et al. 2015"),")."),(0,a.kt)("p",null,"A key assumption of these parameterizations is that the chemistry and microphysics of the MHD models was sufficiently accurate that the chemistry and physics can be decoupled. That is to say, including the more detailed chemistry of UCLCHEM in MHDvode would not improve their shock profiles. Thus, more detailed chemistry can be safely post-processed using the physical outputs from those models."),(0,a.kt)("h3",{id:"sputtering"},"Sputtering"),(0,a.kt)("p",null,"Both models use the same sputtering process described by ",(0,a.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361:20078054"},"Jimenez-Serra et al. 2008"),". Briefly, we calculate the average energy imparted on the grains from a collision between the shocked gas and the grains. We then combine this with the collision rate and average yield for a given energy to calculate the sputtering rate which we integrate through time."),(0,a.kt)("p",null,"Once the shock reaches 130 K, all remaining grain surface material is injected into the gas phase. This is the temperature at which water ice sublimates and we expect all material to co-desorb with that sublimation."))}p.isMDXComponent=!0}}]);