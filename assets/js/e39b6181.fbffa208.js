"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4730],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=i.createContext({}),c=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return i.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},u=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),h=a,m=u["".concat(s,".").concat(h)]||u[h]||d[h]||r;return n?i.createElement(m,o(o({ref:t},p),{},{components:n})):i.createElement(m,o({ref:t},p))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<r;c++)o[c]=n[c];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8917:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>h,frontMatter:()=>l,metadata:()=>c,toc:()=>d});var i=n(7462),a=n(3366),r=(n(7294),n(3905)),o=["components"],l={id:"dev-overview",title:"Overview of the Code"},s=void 0,c={unversionedId:"dev-overview",id:"dev-overview",title:"Overview of the Code",description:"The page is designed to give a brief overview of the code's structure. It's less about the scientific justification for the various treatments in the code and more about how the code is segmented and where to look for things.",source:"@site/docs/dev-overview.md",sourceDirName:".",slug:"/dev-overview",permalink:"/docs/dev-overview",tags:[],version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1651073142,formattedLastUpdatedAt:"4/27/2022",frontMatter:{id:"dev-overview",title:"Overview of the Code"},sidebar:"docs",previous:{title:"Developer",permalink:"/docs/category/developer"},next:{title:"Writing The Python Interface",permalink:"/docs/dev-python-wrap"}},p={},d=[{value:"Basic Algorithm",id:"basic-algorithm",level:2},{value:"Physics",id:"physics",level:2},{value:"Chemistry",id:"chemistry",level:2},{value:"Constants",id:"constants",level:2}],u={toc:d};function h(e){var t=e.components,n=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"The page is designed to give a brief overview of the code's structure. It's less about the scientific justification for the various treatments in the code and more about how the code is segmented and where to look for things."),(0,r.kt)("h2",{id:"basic-algorithm"},"Basic Algorithm"),(0,r.kt)("p",null,"Centering the code on the python wrap has made the underlying algorithm more difficult to follow than in older versions of the code. However, you can more or less see the whole procedure of solving the chemical model in ",(0,r.kt)("inlineCode",{parentName:"p"},"solveAbundances")," in ",(0,r.kt)("inlineCode",{parentName:"p"},"src/fortran_src/wrap.f90"),". The steps are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Set all parameters to defaultparameters.f90 values")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Read parameters from the dictionary input")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Initialize physics variables such as column density and model specific values")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Initialize chemical variables like initial abundances")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"While ",(0,r.kt)("inlineCode",{parentName:"p"},"time < finalTime")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"density")," < ",(0,r.kt)("inlineCode",{parentName:"p"},"finalDens")),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"get a new target time"),(0,r.kt)("li",{parentName:"ul"},"update abundances from current time to target time"),(0,r.kt)("li",{parentName:"ul"},"update physics variables to new time"),(0,r.kt)("li",{parentName:"ul"},"Allow physics modules to affect abundances directly (eg to sputter ices)"),(0,r.kt)("li",{parentName:"ul"},"output parameters"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"output final abundances if ",(0,r.kt)("inlineCode",{parentName:"p"},"abundSaveFile")," set."))),(0,r.kt)("p",null,"Exactly what happens in the initialize physics and update physics sections depends on the physical model in question."),(0,r.kt)("h2",{id:"physics"},"Physics"),(0,r.kt)("p",null,"There are a number of physics modules which all implement the same subroutines in different ways. They also all pull from core-physics.f90, a module that contains all the non-optional physics variables. When we initialize or update physics, we first call the initialize/update subroutine from core-physics.f90 and then call it from the physics module. This is achieved by passing the relevant physics module's subroutines to ",(0,r.kt)("inlineCode",{parentName:"p"},"solveAbundances")," from each of the various subroutines in wrap.f90."),(0,r.kt)("p",null,"If you'd like to implement your own physics model, you should try as closely as possible to follow this structure. Since core-physics is always updated first, you can override it with your module. For example, core-physics will calculate the Av and column density in the standard way but you could recalculate your column density in your updatePhysics subroutine to get new behaviour."),(0,r.kt)("h2",{id:"chemistry"},"Chemistry"),(0,r.kt)("p",null,"A large number of the fortran files make up the chemistry module. There's:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"chemistry.f90")," which contains the core chemistry routines and variables."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"rates.f90")," which is actually directly included in ",(0,r.kt)("inlineCode",{parentName:"li"},"chemistry.f90")," and just contains most of the reaction rate calculations"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"surfacereactions.f90")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"photoreactions.f90")," which each contain a lot of the surface or photon chemistry related variables and subroutines. These are often so involved that we just separated them out to avoid overfilling ",(0,r.kt)("inlineCode",{parentName:"li"},"rates.f90"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"odes.f90")," which is generated by MakeRates and is a huge file of ordinary differential equations."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"network.f90")," is also generated by MakeRates and contains lists of things like species names, reaction types, the index of the species that is the nth reactant of each reaction, etc. ",(0,r.kt)("strong",{parentName:"li"},"If you want to store something like the index of a species or reaction, consider having MakeRates add to this file."))),(0,r.kt)("h2",{id:"constants"},"Constants"),(0,r.kt)("p",null,"All constants are defined in ",(0,r.kt)("inlineCode",{parentName:"p"},"constants.f90")," and are accessed by the ",(0,r.kt)("inlineCode",{parentName:"p"},"constants")," module. If you need a physical constant, it's best check if it's here before defining it. There should be no harm at all in importing this module into any other code as it compiles first and nothing is modifiable (eg you can't overwrite the value of ",(0,r.kt)("inlineCode",{parentName:"p"},"PI")," defined in constants.f90)."),(0,r.kt)("p",null,"It's also where we declare ",(0,r.kt)("inlineCode",{parentName:"p"},"dp"),", which allows us to declare real64 variables in the iso standard way. All the ",(0,r.kt)("inlineCode",{parentName:"p"},"real(dp)")," variables you see declared in the code come from this."))}h.isMDXComponent=!0}}]);