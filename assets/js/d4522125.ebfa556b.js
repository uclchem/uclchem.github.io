(self.webpackChunk=self.webpackChunk||[]).push([[3746],{3905:(a,e,t)=>{"use strict";t.d(e,{Zo:()=>o,kt:()=>h});var s=t(7294);function n(a,e,t){return e in a?Object.defineProperty(a,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[e]=t,a}function m(a,e){var t=Object.keys(a);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(a);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),t.push.apply(t,s)}return t}function p(a){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?m(Object(t),!0).forEach((function(e){n(a,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):m(Object(t)).forEach((function(e){Object.defineProperty(a,e,Object.getOwnPropertyDescriptor(t,e))}))}return a}function r(a,e){if(null==a)return{};var t,s,n=function(a,e){if(null==a)return{};var t,s,n={},m=Object.keys(a);for(s=0;s<m.length;s++)t=m[s],e.indexOf(t)>=0||(n[t]=a[t]);return n}(a,e);if(Object.getOwnPropertySymbols){var m=Object.getOwnPropertySymbols(a);for(s=0;s<m.length;s++)t=m[s],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(a,t)&&(n[t]=a[t])}return n}var l=s.createContext({}),i=function(a){var e=s.useContext(l),t=e;return a&&(t="function"==typeof a?a(e):p(p({},e),a)),t},o=function(a){var e=i(a.components);return s.createElement(l.Provider,{value:e},a.children)},c={inlineCode:"code",wrapper:function(a){var e=a.children;return s.createElement(s.Fragment,{},e)}},N=s.forwardRef((function(a,e){var t=a.components,n=a.mdxType,m=a.originalType,l=a.parentName,o=r(a,["components","mdxType","originalType","parentName"]),N=i(t),h=n,k=N["".concat(l,".").concat(h)]||N[h]||c[h]||m;return t?s.createElement(k,p(p({ref:e},o),{},{components:t})):s.createElement(k,p({ref:e},o))}));function h(a,e){var t=arguments,n=e&&e.mdxType;if("string"==typeof a||n){var m=t.length,p=new Array(m);p[0]=N;var r={};for(var l in e)hasOwnProperty.call(e,l)&&(r[l]=e[l]);r.originalType=a,r.mdxType="string"==typeof a?a:n,p[1]=r;for(var i=2;i<m;i++)p[i]=t[i];return s.createElement.apply(null,p)}return s.createElement.apply(null,t)}N.displayName="MDXCreateElement"},7740:(a,e,t)=>{"use strict";t.r(e),t.d(e,{frontMatter:()=>p,metadata:()=>r,toc:()=>l,default:()=>o});var s=t(2122),n=t(9756),m=(t(7294),t(3905)),p={id:"cloud",title:"Cloud Core Model"},r={unversionedId:"cloud",id:"cloud",isDocsHomePage:!1,title:"Cloud Core Model",description:"Main Contributors: Serena Viti, Jon Holdship",source:"@site/docs/cloud.md",sourceDirName:".",slug:"/cloud",permalink:"/docs/cloud",version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1621867778,formattedLastUpdatedAt:"5/24/2021",frontMatter:{id:"cloud",title:"Cloud Core Model"},sidebar:"docs",previous:{title:"Physics Modules",permalink:"/docs/physics"},next:{title:"Shock Models",permalink:"/docs/shocks"}},l=[{value:"Phase 1",id:"phase-1",children:[]},{value:"Phase 2",id:"phase-2",children:[]}],i={toc:l};function o(a){var e=a.components,t=(0,n.Z)(a,["components"]);return(0,m.kt)("wrapper",(0,s.Z)({},i,t,{components:e,mdxType:"MDXLayout"}),(0,m.kt)("p",null,(0,m.kt)("strong",{parentName:"p"},"Main Contributors"),": Serena Viti, Jon Holdship"),(0,m.kt)("p",null,"The cloud model can be found in ",(0,m.kt)("inlineCode",{parentName:"p"},"src/cloud.f90")," and is intended to model spherical clouds of gas and hot cores/corinos)."),(0,m.kt)("h3",{id:"phase-1"},"Phase 1"),(0,m.kt)("p",null,"In phase 1, the temperature is held constant and density can be kept constant (collapse=0) or made to increase in freefall (collapse=1). An arbitrary number of gas parcels can be modelled and are spaced evenly between rin and rout. That position is used to calculate the Av, H2 column density and CO column density between the parcel and cloud edge for interactions with UV. Due to the simplistic treatment of UV in UCLCHEM, the code should not be trusted at low Av."),(0,m.kt)("p",null,"Phase 1 is typically used to create a self-consistent set of gas conditions and chemical abundances for phase 2. The final state of the gas in this run can be written to ",(0,m.kt)("inlineCode",{parentName:"p"},"abundFile")," by setting ",(0,m.kt)("inlineCode",{parentName:"p"},"readAbunds = 0"),"."),(0,m.kt)("h3",{id:"phase-2"},"Phase 2"),(0,m.kt)("p",null,"In phase 2, the temperature increases following the temperature profiles given in ",(0,m.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1111/j.1365-2966.2004.08273.x"},"Viti et al. 2004")," with modifications by ",(0,m.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1111/j.1365-2966.2010.17077.x"},"Awad et al. 2010"),". This is a time and radially dependent temperature profile intended to match the heat up of the gas around a hot core."),(0,m.kt)("div",{className:"math math-display"},(0,m.kt)("span",{parentName:"div",className:"katex-display"},(0,m.kt)("span",{parentName:"span",className:"katex"},(0,m.kt)("span",{parentName:"span",className:"katex-mathml"},(0,m.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML",display:"block"},(0,m.kt)("semantics",{parentName:"math"},(0,m.kt)("mrow",{parentName:"semantics"},(0,m.kt)("mi",{parentName:"mrow"},"T"),(0,m.kt)("mo",{parentName:"mrow"},"="),(0,m.kt)("mn",{parentName:"mrow"},"10"),(0,m.kt)("mo",{parentName:"mrow"},"+"),(0,m.kt)("mi",{parentName:"mrow"},"A"),(0,m.kt)("msup",{parentName:"mrow"},(0,m.kt)("mi",{parentName:"msup"},"t"),(0,m.kt)("mi",{parentName:"msup"},"B")),(0,m.kt)("msup",{parentName:"mrow"},(0,m.kt)("mrow",{parentName:"msup"},(0,m.kt)("mo",{parentName:"mrow",fence:"true"},"("),(0,m.kt)("mfrac",{parentName:"mrow"},(0,m.kt)("mi",{parentName:"mfrac"},"r"),(0,m.kt)("mi",{parentName:"mfrac"},"R")),(0,m.kt)("mo",{parentName:"mrow",fence:"true"},")")),(0,m.kt)("mfrac",{parentName:"msup"},(0,m.kt)("mn",{parentName:"mfrac"},"1"),(0,m.kt)("mn",{parentName:"mfrac"},"2"))),(0,m.kt)("mi",{parentName:"mrow"},"K")),(0,m.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"T = 10 + A t^B \\left(\\frac{r}{R}\\right)^{\\frac{1}{2}} K")))),(0,m.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,m.kt)("span",{parentName:"span",className:"base"},(0,m.kt)("span",{parentName:"span",className:"strut",style:{height:"0.68333em",verticalAlign:"0em"}}),(0,m.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.13889em"}},"T"),(0,m.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2777777777777778em"}}),(0,m.kt)("span",{parentName:"span",className:"mrel"},"="),(0,m.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2777777777777778em"}})),(0,m.kt)("span",{parentName:"span",className:"base"},(0,m.kt)("span",{parentName:"span",className:"strut",style:{height:"0.72777em",verticalAlign:"-0.08333em"}}),(0,m.kt)("span",{parentName:"span",className:"mord"},"1"),(0,m.kt)("span",{parentName:"span",className:"mord"},"0"),(0,m.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222222222222222em"}}),(0,m.kt)("span",{parentName:"span",className:"mbin"},"+"),(0,m.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222222222222222em"}})),(0,m.kt)("span",{parentName:"span",className:"base"},(0,m.kt)("span",{parentName:"span",className:"strut",style:{height:"2.17992em",verticalAlign:"-0.686em"}}),(0,m.kt)("span",{parentName:"span",className:"mord mathnormal"},"A"),(0,m.kt)("span",{parentName:"span",className:"mord"},(0,m.kt)("span",{parentName:"span",className:"mord mathnormal"},"t"),(0,m.kt)("span",{parentName:"span",className:"msupsub"},(0,m.kt)("span",{parentName:"span",className:"vlist-t"},(0,m.kt)("span",{parentName:"span",className:"vlist-r"},(0,m.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8913309999999999em"}},(0,m.kt)("span",{parentName:"span",style:{top:"-3.113em",marginRight:"0.05em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,m.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,m.kt)("span",{parentName:"span",className:"mord mathnormal mtight",style:{marginRight:"0.05017em"}},"B")))))))),(0,m.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,m.kt)("span",{parentName:"span",className:"minner"},(0,m.kt)("span",{parentName:"span",className:"minner"},(0,m.kt)("span",{parentName:"span",className:"mopen delimcenter",style:{top:"0em"}},(0,m.kt)("span",{parentName:"span",className:"delimsizing size2"},"(")),(0,m.kt)("span",{parentName:"span",className:"mord"},(0,m.kt)("span",{parentName:"span",className:"mopen nulldelimiter"}),(0,m.kt)("span",{parentName:"span",className:"mfrac"},(0,m.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,m.kt)("span",{parentName:"span",className:"vlist-r"},(0,m.kt)("span",{parentName:"span",className:"vlist",style:{height:"1.10756em"}},(0,m.kt)("span",{parentName:"span",style:{top:"-2.314em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,m.kt)("span",{parentName:"span",className:"mord"},(0,m.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.00773em"}},"R"))),(0,m.kt)("span",{parentName:"span",style:{top:"-3.23em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,m.kt)("span",{parentName:"span",className:"frac-line",style:{borderBottomWidth:"0.04em"}})),(0,m.kt)("span",{parentName:"span",style:{top:"-3.677em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,m.kt)("span",{parentName:"span",className:"mord"},(0,m.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"r")))),(0,m.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,m.kt)("span",{parentName:"span",className:"vlist-r"},(0,m.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.686em"}},(0,m.kt)("span",{parentName:"span"}))))),(0,m.kt)("span",{parentName:"span",className:"mclose nulldelimiter"})),(0,m.kt)("span",{parentName:"span",className:"mclose delimcenter",style:{top:"0em"}},(0,m.kt)("span",{parentName:"span",className:"delimsizing size2"},")"))),(0,m.kt)("span",{parentName:"span",className:"msupsub"},(0,m.kt)("span",{parentName:"span",className:"vlist-t"},(0,m.kt)("span",{parentName:"span",className:"vlist-r"},(0,m.kt)("span",{parentName:"span",className:"vlist",style:{height:"1.49392em"}},(0,m.kt)("span",{parentName:"span",style:{top:"-3.9029em",marginRight:"0.05em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,m.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,m.kt)("span",{parentName:"span",className:"mord mtight"},(0,m.kt)("span",{parentName:"span",className:"mord mtight"},(0,m.kt)("span",{parentName:"span",className:"mopen nulldelimiter sizing reset-size3 size6"}),(0,m.kt)("span",{parentName:"span",className:"mfrac"},(0,m.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,m.kt)("span",{parentName:"span",className:"vlist-r"},(0,m.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8443142857142858em"}},(0,m.kt)("span",{parentName:"span",style:{top:"-2.656em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,m.kt)("span",{parentName:"span",className:"sizing reset-size3 size1 mtight"},(0,m.kt)("span",{parentName:"span",className:"mord mtight"},(0,m.kt)("span",{parentName:"span",className:"mord mtight"},"2")))),(0,m.kt)("span",{parentName:"span",style:{top:"-3.2255000000000003em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,m.kt)("span",{parentName:"span",className:"frac-line mtight",style:{borderBottomWidth:"0.049em"}})),(0,m.kt)("span",{parentName:"span",style:{top:"-3.384em"}},(0,m.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,m.kt)("span",{parentName:"span",className:"sizing reset-size3 size1 mtight"},(0,m.kt)("span",{parentName:"span",className:"mord mtight"},(0,m.kt)("span",{parentName:"span",className:"mord mtight"},"1"))))),(0,m.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,m.kt)("span",{parentName:"span",className:"vlist-r"},(0,m.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.344em"}},(0,m.kt)("span",{parentName:"span"}))))),(0,m.kt)("span",{parentName:"span",className:"mclose nulldelimiter sizing reset-size3 size6"})))))))))),(0,m.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,m.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.07153em"}},"K")))))),(0,m.kt)("p",null,"Where ",(0,m.kt)("span",{parentName:"p",className:"math math-inline"},(0,m.kt)("span",{parentName:"span",className:"katex"},(0,m.kt)("span",{parentName:"span",className:"katex-mathml"},(0,m.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,m.kt)("semantics",{parentName:"math"},(0,m.kt)("mrow",{parentName:"semantics"},(0,m.kt)("mi",{parentName:"mrow"},"r")),(0,m.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"r")))),(0,m.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,m.kt)("span",{parentName:"span",className:"base"},(0,m.kt)("span",{parentName:"span",className:"strut",style:{height:"0.43056em",verticalAlign:"0em"}}),(0,m.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"r")))))," is the distance from the centre of the core to the current point, ",(0,m.kt)("span",{parentName:"p",className:"math math-inline"},(0,m.kt)("span",{parentName:"span",className:"katex"},(0,m.kt)("span",{parentName:"span",className:"katex-mathml"},(0,m.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,m.kt)("semantics",{parentName:"math"},(0,m.kt)("mrow",{parentName:"semantics"},(0,m.kt)("mi",{parentName:"mrow"},"R")),(0,m.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"R")))),(0,m.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,m.kt)("span",{parentName:"span",className:"base"},(0,m.kt)("span",{parentName:"span",className:"strut",style:{height:"0.68333em",verticalAlign:"0em"}}),(0,m.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.00773em"}},"R")))))," is the radius of the core (",(0,m.kt)("inlineCode",{parentName:"p"},"rout"),") and ",(0,m.kt)("span",{parentName:"p",className:"math math-inline"},(0,m.kt)("span",{parentName:"span",className:"katex"},(0,m.kt)("span",{parentName:"span",className:"katex-mathml"},(0,m.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,m.kt)("semantics",{parentName:"math"},(0,m.kt)("mrow",{parentName:"semantics"},(0,m.kt)("mi",{parentName:"mrow"},"A")),(0,m.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"A")))),(0,m.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,m.kt)("span",{parentName:"span",className:"base"},(0,m.kt)("span",{parentName:"span",className:"strut",style:{height:"0.68333em",verticalAlign:"0em"}}),(0,m.kt)("span",{parentName:"span",className:"mord mathnormal"},"A")))))," and ",(0,m.kt)("span",{parentName:"p",className:"math math-inline"},(0,m.kt)("span",{parentName:"span",className:"katex"},(0,m.kt)("span",{parentName:"span",className:"katex-mathml"},(0,m.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,m.kt)("semantics",{parentName:"math"},(0,m.kt)("mrow",{parentName:"semantics"},(0,m.kt)("mi",{parentName:"mrow"},"B")),(0,m.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"B")))),(0,m.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,m.kt)("span",{parentName:"span",className:"base"},(0,m.kt)("span",{parentName:"span",className:"strut",style:{height:"0.68333em",verticalAlign:"0em"}}),(0,m.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.05017em"}},"B")))))," are empirically derived constants. These constants are determined by the mass of the hot core(ino) and cloud.f90 has the values for 1, 5, 10, 15, 25, and 60 solar masses, set by the ",(0,m.kt)("inlineCode",{parentName:"p"},"tempIndx")," variable."))}o.isMDXComponent=!0}}]);