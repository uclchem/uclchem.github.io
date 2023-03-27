"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7209],{3905:(t,a,e)=>{e.d(a,{Zo:()=>s,kt:()=>N});var n=e(7294);function r(t,a,e){return a in t?Object.defineProperty(t,a,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[a]=e,t}function l(t,a){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable}))),e.push.apply(e,n)}return e}function i(t){for(var a=1;a<arguments.length;a++){var e=null!=arguments[a]?arguments[a]:{};a%2?l(Object(e),!0).forEach((function(a){r(t,a,e[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):l(Object(e)).forEach((function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))}))}return t}function m(t,a){if(null==t)return{};var e,n,r=function(t,a){if(null==t)return{};var e,n,r={},l=Object.keys(t);for(n=0;n<l.length;n++)e=l[n],a.indexOf(e)>=0||(r[e]=t[e]);return r}(t,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(n=0;n<l.length;n++)e=l[n],a.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(t,e)&&(r[e]=t[e])}return r}var p=n.createContext({}),o=function(t){var a=n.useContext(p),e=a;return t&&(e="function"==typeof t?t(a):i(i({},a),t)),e},s=function(t){var a=o(t.components);return n.createElement(p.Provider,{value:a},t.children)},d={inlineCode:"code",wrapper:function(t){var a=t.children;return n.createElement(n.Fragment,{},a)}},u=n.forwardRef((function(t,a){var e=t.components,r=t.mdxType,l=t.originalType,p=t.parentName,s=m(t,["components","mdxType","originalType","parentName"]),u=o(e),N=r,k=u["".concat(p,".").concat(N)]||u[N]||d[N]||l;return e?n.createElement(k,i(i({ref:a},s),{},{components:e})):n.createElement(k,i({ref:a},s))}));function N(t,a){var e=arguments,r=a&&a.mdxType;if("string"==typeof t||r){var l=e.length,i=new Array(l);i[0]=u;var m={};for(var p in a)hasOwnProperty.call(a,p)&&(m[p]=a[p]);m.originalType=t,m.mdxType="string"==typeof t?t:r,i[1]=m;for(var o=2;o<l;o++)i[o]=e[o];return n.createElement.apply(null,i)}return n.createElement.apply(null,e)}u.displayName="MDXCreateElement"},3147:(t,a,e)=>{e.r(a),e.d(a,{assets:()=>s,contentTitle:()=>p,default:()=>N,frontMatter:()=>m,metadata:()=>o,toc:()=>d});var n=e(7462),r=e(3366),l=(e(7294),e(3905)),i=["components"],m={id:"parameters",title:"Model Parameters"},p=void 0,o={unversionedId:"parameters",id:"version-v3.1.0/parameters",title:"Model Parameters",description:"UCLCHEM will default to these values unless they are overridden by user. Users can override these by adding the variable name as written here in the paramdict argument of any UCLCHEM model function. paramdict is not case sensitive.",source:"@site/versioned_docs/version-v3.1.0/start-parameters.md",sourceDirName:".",slug:"/parameters",permalink:"/docs/v3.1.0/parameters",tags:[],version:"v3.1.0",frontMatter:{id:"parameters",title:"Model Parameters"},sidebar:"docs",previous:{title:"Creating a Network",permalink:"/docs/v3.1.0/network"},next:{title:"Python Reference",permalink:"/docs/v3.1.0/pythonapi"}},s={},d=[{value:"Physical Variables",id:"physical-variables",level:2},{value:"Behavioural Controls",id:"behavioural-controls",level:2},{value:"Input and Output",id:"input-and-output",level:2},{value:"Initial Abundances",id:"initial-abundances",level:2},{value:"Integration Controls",id:"integration-controls",level:2},{value:"Here be Dragons",id:"here-be-dragons",level:2}],u={toc:d};function N(t){var a=t.components,e=(0,r.Z)(t,i);return(0,l.kt)("wrapper",(0,n.Z)({},u,e,{components:a,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"UCLCHEM will default to these values unless they are overridden by user. Users can override these by adding the variable name as written here in the param_dict argument of any UCLCHEM model function. param_dict is not case sensitive."),(0,l.kt)("h2",{id:"physical-variables"},"Physical Variables"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"initialTemp"),(0,l.kt)("td",{parentName:"tr",align:null},"10.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Initial gas temperature in Kelvin for all gas parcels in model.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"initialDens"),(0,l.kt)("td",{parentName:"tr",align:null},"1.00d2"),(0,l.kt)("td",{parentName:"tr",align:null},"Initial gas density in H nuclei per cm",(0,l.kt)("span",{parentName:"td",className:"math math-inline"},(0,l.kt)("span",{parentName:"span",className:"katex"},(0,l.kt)("span",{parentName:"span",className:"katex-mathml"},(0,l.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,l.kt)("semantics",{parentName:"math"},(0,l.kt)("mrow",{parentName:"semantics"},(0,l.kt)("msup",{parentName:"mrow"},(0,l.kt)("mrow",{parentName:"msup"}),(0,l.kt)("mrow",{parentName:"msup"},(0,l.kt)("mo",{parentName:"mrow"},"\u2212"),(0,l.kt)("mn",{parentName:"mrow"},"3")))),(0,l.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"^{-3}")))),(0,l.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,l.kt)("span",{parentName:"span",className:"base"},(0,l.kt)("span",{parentName:"span",className:"strut",style:{height:"0.8141079999999999em",verticalAlign:"0em"}}),(0,l.kt)("span",{parentName:"span",className:"mord"},(0,l.kt)("span",{parentName:"span"}),(0,l.kt)("span",{parentName:"span",className:"msupsub"},(0,l.kt)("span",{parentName:"span",className:"vlist-t"},(0,l.kt)("span",{parentName:"span",className:"vlist-r"},(0,l.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141079999999999em"}},(0,l.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,l.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,l.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,l.kt)("span",{parentName:"span",className:"mord mtight"},(0,l.kt)("span",{parentName:"span",className:"mord mtight"},"\u2212"),(0,l.kt)("span",{parentName:"span",className:"mord mtight"},"3")))))))))))))," for all gas parcels in model.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"finalDens"),(0,l.kt)("td",{parentName:"tr",align:null},"1.00d5"),(0,l.kt)("td",{parentName:"tr",align:null},"Final gas density achieved via freefall.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"currentTime"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Time at start of model in years.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"finalTime"),(0,l.kt)("td",{parentName:"tr",align:null},"5.0d6"),(0,l.kt)("td",{parentName:"tr",align:null},"Time to stop model in years, if not using ",(0,l.kt)("inlineCode",{parentName:"td"},"endAtFinalDensity")," below.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"radfield"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Interstellar radiation field in Habing")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"zeta"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Cosmic ray ionisation rate as multiple of ",(0,l.kt)("span",{parentName:"td",className:"math math-inline"},(0,l.kt)("span",{parentName:"span",className:"katex"},(0,l.kt)("span",{parentName:"span",className:"katex-mathml"},(0,l.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,l.kt)("semantics",{parentName:"math"},(0,l.kt)("mrow",{parentName:"semantics"},(0,l.kt)("mn",{parentName:"mrow"},"1.31"),(0,l.kt)("msup",{parentName:"mrow"},(0,l.kt)("mn",{parentName:"msup"},"0"),(0,l.kt)("mrow",{parentName:"msup"},(0,l.kt)("mo",{parentName:"mrow"},"\u2212"),(0,l.kt)("mn",{parentName:"mrow"},"17"))),(0,l.kt)("msup",{parentName:"mrow"},(0,l.kt)("mi",{parentName:"msup"},"s"),(0,l.kt)("mrow",{parentName:"msup"},(0,l.kt)("mo",{parentName:"mrow"},"\u2212"),(0,l.kt)("mn",{parentName:"mrow"},"1")))),(0,l.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"1.3 10^{-17} s^{-1}")))),(0,l.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,l.kt)("span",{parentName:"span",className:"base"},(0,l.kt)("span",{parentName:"span",className:"strut",style:{height:"0.8141079999999999em",verticalAlign:"0em"}}),(0,l.kt)("span",{parentName:"span",className:"mord"},"1"),(0,l.kt)("span",{parentName:"span",className:"mord"},"."),(0,l.kt)("span",{parentName:"span",className:"mord"},"3"),(0,l.kt)("span",{parentName:"span",className:"mord"},"1"),(0,l.kt)("span",{parentName:"span",className:"mord"},(0,l.kt)("span",{parentName:"span",className:"mord"},"0"),(0,l.kt)("span",{parentName:"span",className:"msupsub"},(0,l.kt)("span",{parentName:"span",className:"vlist-t"},(0,l.kt)("span",{parentName:"span",className:"vlist-r"},(0,l.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141079999999999em"}},(0,l.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,l.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,l.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,l.kt)("span",{parentName:"span",className:"mord mtight"},(0,l.kt)("span",{parentName:"span",className:"mord mtight"},"\u2212"),(0,l.kt)("span",{parentName:"span",className:"mord mtight"},"1"),(0,l.kt)("span",{parentName:"span",className:"mord mtight"},"7"))))))))),(0,l.kt)("span",{parentName:"span",className:"mord"},(0,l.kt)("span",{parentName:"span",className:"mord mathnormal"},"s"),(0,l.kt)("span",{parentName:"span",className:"msupsub"},(0,l.kt)("span",{parentName:"span",className:"vlist-t"},(0,l.kt)("span",{parentName:"span",className:"vlist-r"},(0,l.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141079999999999em"}},(0,l.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,l.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,l.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,l.kt)("span",{parentName:"span",className:"mord mtight"},(0,l.kt)("span",{parentName:"span",className:"mord mtight"},"\u2212"),(0,l.kt)("span",{parentName:"span",className:"mord mtight"},"1"))))))))))))))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"rout"),(0,l.kt)("td",{parentName:"tr",align:null},"0.05"),(0,l.kt)("td",{parentName:"tr",align:null},"Outer radius of cloud being modelled in pc.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"rin"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Minimum radial distance from cloud centre to consider.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"baseAv"),(0,l.kt)("td",{parentName:"tr",align:null},"2.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Extinction at cloud edge, Av of a parcel at rout.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"points"),(0,l.kt)("td",{parentName:"tr",align:null},"1"),(0,l.kt)("td",{parentName:"tr",align:null},"Number of gas parcels equally spaced between rin to rout to consider")))),(0,l.kt)("h2",{id:"behavioural-controls"},"Behavioural Controls"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"The following parameters generally turn on or off features of the model. If a parameter is set to ",(0,l.kt)("inlineCode",{parentName:"em"},"True"),", then it is turned on. If it is set to ",(0,l.kt)("inlineCode",{parentName:"em"},"False"),", then it is turned off.")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"freezeFactor"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Modify freeze out rate of gas parcels by this factor.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"endAtFinalDensity"),(0,l.kt)("td",{parentName:"tr",align:null},".False."),(0,l.kt)("td",{parentName:"tr",align:null},"Choose to end model at final density, otherwise end at final time.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"freefall"),(0,l.kt)("td",{parentName:"tr",align:null},".False."),(0,l.kt)("td",{parentName:"tr",align:null},"Controls whether models density increaes following freefall equation.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"freefallFactor"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Modify freefall rate by factor, usually to slow it.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"desorb"),(0,l.kt)("td",{parentName:"tr",align:null},".True."),(0,l.kt)("td",{parentName:"tr",align:null},"Toggles all non-thermal desoprtion processes on or off.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"h2desorb"),(0,l.kt)("td",{parentName:"tr",align:null},".True."),(0,l.kt)("td",{parentName:"tr",align:null},"Individually toggle non-thermal desorption due to H2 formation.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"crdesorb"),(0,l.kt)("td",{parentName:"tr",align:null},".True."),(0,l.kt)("td",{parentName:"tr",align:null},"Individually toggle non-thermal desorption due to cosmic rays.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"uvdesorb"),(0,l.kt)("td",{parentName:"tr",align:null},".True."),(0,l.kt)("td",{parentName:"tr",align:null},"Individually toggle non-thermal desorption due to uv photons.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"thermdesorb"),(0,l.kt)("td",{parentName:"tr",align:null},".True."),(0,l.kt)("td",{parentName:"tr",align:null},"Toggle continuous thermal desorption.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"instantSublimation"),(0,l.kt)("td",{parentName:"tr",align:null},".False."),(0,l.kt)("td",{parentName:"tr",align:null},"Toggle instantaneous sublimation of the ices at t")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"cosmicRayAttenuation"),(0,l.kt)("td",{parentName:"tr",align:null},".False."),(0,l.kt)("td",{parentName:"tr",align:null},"Use column density to attenuate cosmic ray ionisation rate following ",(0,l.kt)("a",{parentName:"td",href:"https://arxiv.org/abs/1803.09348"},"Padovani et al. 2018"),".")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ionModel"),(0,l.kt)("td",{parentName:"tr",align:null},"'L'"),(0,l.kt)("td",{parentName:"tr",align:null},"L/H model for cosmic ray attenuation ",(0,l.kt)("a",{parentName:"td",href:"https://arxiv.org/abs/1803.09348"},"Padovani et al. 2018"),".")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"improvedH2CRPDissociation"),(0,l.kt)("td",{parentName:"tr",align:null},".False."),(0,l.kt)("td",{parentName:"tr",align:null},"Use H2 CRP dissociation rate from ",(0,l.kt)("a",{parentName:"td",href:"https://arxiv.org/abs/1809.04168"},"Padovani et al. 2018b"),".")))),(0,l.kt)("h2",{id:"input-and-output"},"Input and Output"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"outputFile"),(0,l.kt)("td",{parentName:"tr",align:null},'"output/full.dat"'),(0,l.kt)("td",{parentName:"tr",align:null},"File to write full output of UCLCHEM. This includes physical parameter values and all abundances at every time step.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"columnFile"),(0,l.kt)("td",{parentName:"tr",align:null},'"output/column.dat"'),(0,l.kt)("td",{parentName:"tr",align:null},"File to write specific species abundances, see outSpecies.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"writeStep"),(0,l.kt)("td",{parentName:"tr",align:null},"1"),(0,l.kt)("td",{parentName:"tr",align:null},"Writing to columnFile only happens every writeStep timesteps.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"abundSaveFile"),(0,l.kt)("td",{parentName:"tr",align:null},"None"),(0,l.kt)("td",{parentName:"tr",align:null},"File to store final abundances at the end of the model so future models can use them as the initial abundances. If not provided, no file will be produced.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"abundLoadFile"),(0,l.kt)("td",{parentName:"tr",align:null},"None"),(0,l.kt)("td",{parentName:"tr",align:null},"File from which to load initial abundances for the model, created through ",(0,l.kt)("inlineCode",{parentName:"td"},"abundSaveFile"),". If not provided, the model starts from elemental gas.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"outSpecies"),(0,l.kt)("td",{parentName:"tr",align:null},"None"),(0,l.kt)("td",{parentName:"tr",align:null},"A space separated list of species to output to columnFile. Supplied as a separate list argument to most python functions, see python API docs.")))),(0,l.kt)("h2",{id:"initial-abundances"},"Initial Abundances"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Unless otherwise specified, we take all abundances from Jenkins et al. 2009, using the heavily depleted case from Table 4.")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"metallicity"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Scale the abundances of all elements heavier than He by this factor.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ion"),(0,l.kt)("td",{parentName:"tr",align:null},"2"),(0,l.kt)("td",{parentName:"tr",align:null},"Sets how much elemental C is initially atomic (0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fh"),(0,l.kt)("td",{parentName:"tr",align:null},"0.5"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of H is always 1 by definition because abundances are relative to number of H nuclei. Use fh to set how much to initially put in atomic H, the rest goes to H2.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fhe"),(0,l.kt)("td",{parentName:"tr",align:null},"0.1"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of He.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fc"),(0,l.kt)("td",{parentName:"tr",align:null},"1.77d-04"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of C.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fo"),(0,l.kt)("td",{parentName:"tr",align:null},"3.34d-04"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of O.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fn"),(0,l.kt)("td",{parentName:"tr",align:null},"6.18d-05"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of N.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fs"),(0,l.kt)("td",{parentName:"tr",align:null},"3.51d-6"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of S.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fmg"),(0,l.kt)("td",{parentName:"tr",align:null},"2.256d-07"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of Mg.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fsi"),(0,l.kt)("td",{parentName:"tr",align:null},"1.78d-06"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of Si.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fcl"),(0,l.kt)("td",{parentName:"tr",align:null},"3.39d-08"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of Cl.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fp"),(0,l.kt)("td",{parentName:"tr",align:null},"7.78d-08"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of P.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ffe"),(0,l.kt)("td",{parentName:"tr",align:null},"2.01d-7"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of Fe.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ff"),(0,l.kt)("td",{parentName:"tr",align:null},"3.6d-08"),(0,l.kt)("td",{parentName:"tr",align:null},"fp depleted 1/100 of solar from Asplund 2009.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fd"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"The following elements are not typically used. We do not recommend any particular value.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fli"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of Li.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fna"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Total elemental abundance of Na.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"fpah"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Total initial abundance of PAHs.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"f15n"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Total initial abundance of 15N.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"f13c"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Total initial abundance of 13C.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"f18O"),(0,l.kt)("td",{parentName:"tr",align:null},"0.0"),(0,l.kt)("td",{parentName:"tr",align:null},"Total initial abundance of 18O.")))),(0,l.kt)("h2",{id:"integration-controls"},"Integration Controls"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"reltol"),(0,l.kt)("td",{parentName:"tr",align:null},"1d-8"),(0,l.kt)("td",{parentName:"tr",align:null},"Relative tolerance for integration, see ",(0,l.kt)("a",{parentName:"td",href:"/docs/trouble-integration"},"integration docs")," for advice.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"abstol_factor"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0d-14"),(0,l.kt)("td",{parentName:"tr",align:null},"Absolute tolerance for integration is calculated by multiplying species abundance by this factor.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"abstol_min"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0d-25"),(0,l.kt)("td",{parentName:"tr",align:null},"Minimum value absolute tolerances can take.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"MXSTEP"),(0,l.kt)("td",{parentName:"tr",align:null},"10000"),(0,l.kt)("td",{parentName:"tr",align:null},"Maximum steps allowed in integration before warning is thrown.")))),(0,l.kt)("h2",{id:"here-be-dragons"},"Here be Dragons"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"These are not recommended to be changed unless you know what you are doing")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ebmaxh2"),(0,l.kt)("td",{parentName:"tr",align:null},"1.21d3"),(0,l.kt)("td",{parentName:"tr",align:null},"Maximum binding energy of species desorbed by H2 formation.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ebmaxcr"),(0,l.kt)("td",{parentName:"tr",align:null},"1.21d3"),(0,l.kt)("td",{parentName:"tr",align:null},"Maximum binding energy of species desorbed by cosmic ray ionisation.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ebmaxuvcr"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0d4"),(0,l.kt)("td",{parentName:"tr",align:null},"Maximum binding energy of species desorbed by UV photons.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"epsilon"),(0,l.kt)("td",{parentName:"tr",align:null},"0.01"),(0,l.kt)("td",{parentName:"tr",align:null},"Number of molecules desorbed per H2 formation.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"uv_yield"),(0,l.kt)("td",{parentName:"tr",align:null},"0.1"),(0,l.kt)("td",{parentName:"tr",align:null},"Number of molecules desorbed per UV photon.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"phi"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0d5"),(0,l.kt)("td",{parentName:"tr",align:null},"Number of molecules desorbed per cosmic ray ionisation.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"uvcreff"),(0,l.kt)("td",{parentName:"tr",align:null},"1.0d-3"),(0,l.kt)("td",{parentName:"tr",align:null},"Ratio of CR induced UV photons to ISRF UV photons.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"omega"),(0,l.kt)("td",{parentName:"tr",align:null},"0.5"),(0,l.kt)("td",{parentName:"tr",align:null},"Dust grain albedo.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"alpha"),(0,l.kt)("td",{parentName:"tr",align:null},"{1:0.0,2:0.0}"),(0,l.kt)("td",{parentName:"tr",align:null},"Set alpha coeffecients of reactions using a python dictionary where keys are reaction numbers and values are the coefficients. Once you do this, you cannot return to the default value in the same python script or without restarting the kernel in iPython. See the chemistry docs for how alpha is used for each reaction type.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"beta"),(0,l.kt)("td",{parentName:"tr",align:null},"{1:0.0,2:0.0}"),(0,l.kt)("td",{parentName:"tr",align:null},"Set beta coeffecients of reactions using a python dictionary where keys are reaction numbers and values are the coefficients. Once you do this, you cannot return to the default value in the same python script or without restarting the kernel in iPython. See the chemistry docs for how beta is used for each reaction type.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"gama"),(0,l.kt)("td",{parentName:"tr",align:null},"{1:0.0,2:0.0}"),(0,l.kt)("td",{parentName:"tr",align:null},"Set gama coeffecients of reactions using a python dictionary where keys are reaction numbers and values are the coefficients. Once you do this, you cannot return to the default value in the same python script or without restarting the kernel in iPython. See the chemistry docs for how gama is used for each reaction type.")))))}N.isMDXComponent=!0}}]);