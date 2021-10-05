(self.webpackChunk=self.webpackChunk||[]).push([[9234],{3905:(e,a,t)=>{"use strict";t.d(a,{Zo:()=>m,kt:()=>h});var s=t(7294);function n(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);a&&(s=s.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,s)}return t}function i(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?r(Object(t),!0).forEach((function(a){n(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function p(e,a){if(null==e)return{};var t,s,n=function(e,a){if(null==e)return{};var t,s,n={},r=Object.keys(e);for(s=0;s<r.length;s++)t=r[s],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(s=0;s<r.length;s++)t=r[s],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var l=s.createContext({}),o=function(e){var a=s.useContext(l),t=a;return e&&(t="function"==typeof e?e(a):i(i({},a),e)),t},m=function(e){var a=o(e.components);return s.createElement(l.Provider,{value:a},e.children)},c={inlineCode:"code",wrapper:function(e){var a=e.children;return s.createElement(s.Fragment,{},a)}},u=s.forwardRef((function(e,a){var t=e.components,n=e.mdxType,r=e.originalType,l=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),u=o(t),h=n,d=u["".concat(l,".").concat(h)]||u[h]||c[h]||r;return t?s.createElement(d,i(i({ref:a},m),{},{components:t})):s.createElement(d,i({ref:a},m))}));function h(e,a){var t=arguments,n=a&&a.mdxType;if("string"==typeof e||n){var r=t.length,i=new Array(r);i[0]=u;var p={};for(var l in a)hasOwnProperty.call(a,l)&&(p[l]=a[l]);p.originalType=e,p.mdxType="string"==typeof e?e:n,i[1]=p;for(var o=2;o<r;o++)i[o]=t[o];return s.createElement.apply(null,i)}return s.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8338:(e,a,t)=>{"use strict";t.r(a),t.d(a,{frontMatter:()=>i,metadata:()=>p,toc:()=>l,default:()=>m});var s=t(2122),n=t(9756),r=(t(7294),t(3905)),i={id:"network",title:"Creating a Network"},p={unversionedId:"network",id:"network",isDocsHomePage:!1,title:"Creating a Network",description:"MakeRates",source:"@site/docs/network.md",sourceDirName:".",slug:"/network",permalink:"/docs/network",version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1621867778,formattedLastUpdatedAt:"5/24/2021",frontMatter:{id:"network",title:"Creating a Network"},sidebar:"docs",previous:{title:"Basic Use",permalink:"/docs/"},next:{title:"Model Parameters",permalink:"/docs/parameters"}},l=[{value:"MakeRates",id:"makerates",children:[]},{value:"Inputs",id:"inputs",children:[]},{value:"Outputs",id:"outputs",children:[]},{value:"What MakeRates Does",id:"what-makerates-does",children:[]},{value:"Creating your own Network",id:"creating-your-own-network",children:[]},{value:"Three Phase Chemistry",id:"three-phase-chemistry",children:[]}],o={toc:l};function m(e){var a=e.components,t=(0,n.Z)(e,["components"]);return(0,r.kt)("wrapper",(0,s.Z)({},o,t,{components:a,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"makerates"},"MakeRates"),(0,r.kt)("p",null,"In order to make a chemical model flexible, the ability to solve a user supplied chemical network is a must. UCLCHEM uses a preprocessing python script to turn csv lists of species and reactions into fortran files for use in the main code. This script is called MakeRates and can be found in a subdirectory of the repository. It combines a gas phase reaction database with user supplied lists of species and additional reactions into odes.f90 and network.f90 which contain all necessary information. It also supplies a number of human readable outputs."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Any output from MakeRates requires that the code be recompiled from scratch (make clean, then make)")),(0,r.kt)("h2",{id:"inputs"},"Inputs"),(0,r.kt)("p",null,"Inputs for MakeRates can be found in ",(0,r.kt)("inlineCode",{parentName:"p"},"MakeRates/inputFiles/")," and the specific files used by MakeRates can be changed in ",(0,r.kt)("inlineCode",{parentName:"p"},"MakeRates/MakeRates.py"),". MakeRates requires three inputs:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"A species list containing all species and their properties"),(0,r.kt)("li",{parentName:"ul"},"A gas phase reaction database in UMIST or KIDA formats"),(0,r.kt)("li",{parentName:"ul"},"A user supplied reaction database including all freeze out reactions at a minimum")),(0,r.kt)("p",null,"A basic version of each of these is supplied with UCLCHEM include KIDA2014 and UMIST12. ",(0,r.kt)("strong",{parentName:"p"},"We do not endorse the resulting network"),", we have simply produced a grain surface network that was relatively up to date in 2018. It produces reasonable ice mantle abundances for major species and ignores larger COMs.  We strongly suggest any published work be based on a network in which the user has confidence. However, where the user is not greatly concerned with grain surface chemistry, the default network is a good starting point."),(0,r.kt)("h2",{id:"outputs"},"Outputs"),(0,r.kt)("p",null,"Outputs from MakeRates can be found in ",(0,r.kt)("inlineCode",{parentName:"p"},"MakeRates/outputFiles/")," and must be copied to ",(0,r.kt)("inlineCode",{parentName:"p"},"src")," to be included in UCLCHEM. They include:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Network.f90 - Fortran arrays containing lists of species names and properties (mass, binding energy etc) as well as reaction reactants, products and rate coefficients."),(0,r.kt)("li",{parentName:"ul"},"odes.f90 - Code to calculate the rate of change of each species' abundance for the numerical solver"),(0,r.kt)("li",{parentName:"ul"},"species.csv - A list of all species in the network and their properties. Made for humans not UCLCHEM."),(0,r.kt)("li",{parentName:"ul"},"reactions.csv - A list of all reactions including reactants, products and coefficients. Made for humans not UCLCHEM.")),(0,r.kt)("h2",{id:"what-makerates-does"},"What MakeRates Does"),(0,r.kt)("p",null,"MakeRates does the following:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Combines the two input reaction lists"),(0,r.kt)("li",{parentName:"ul"},"Filters to remove any reactions containing species not in the input species list"),(0,r.kt)("li",{parentName:"ul"},"Checks all species freeze out"),(0,r.kt)("li",{parentName:"ul"},"Adds non-thermal desorption reactions for all frozen species"),(0,r.kt)("li",{parentName:"ul"},"Does basic network consistency checks and alerts user of problems"),(0,r.kt)("li",{parentName:"ul"},"Writes fortran files for UCLCHEM"),(0,r.kt)("li",{parentName:"ul"},"Writes other output files")),(0,r.kt)("h2",{id:"creating-your-own-network"},"Creating your own Network"),(0,r.kt)("p",null,"To create your own network you need to produce a species list and a reaction list."),(0,r.kt)("h5",{id:"species-list"},"Species list"),(0,r.kt)("p",null,"The species list should simply be a list with one row per species in the network. Each row should contain the species name, mass, binding energy and enthalpy. The latter two are only used for surface species so can be set to zero for the gas phase species. MakeRates will check the mass is correct for each species and alert you of discrepancies."),(0,r.kt)("h5",{id:"reaction-list"},"Reaction list"),(0,r.kt)("p",null,"The second reaction list is intended to contain your surface network but can also be used to augment the gas phase databases by including additional gas phase reactions. The reaction list should be a list with one row per reaction and each row should be a comma separated list of 3 reactants, 4 products, three coefficients (alpha,beta,gamma) and a minimum and maximum temperature. Any missing values such as a third reactant can be left blank. In particular, the temperatures are optional but you can including multiple versions of the same reaction and UCLCHEM will only use each one within its specified temperature range if included."),(0,r.kt)("p",null,"The third reactant can be used as a keyword to tell MakeRates what kind of reaction is occuring. In the absence of a keyword, MakeRates and UCLCHEM will treat any reaction as a gas-phase two body reaction. Two keywords the user may wish to use are ER and LH for Eley-Rideal and Langmuir-Hinshelwood reactions respectively (see ",(0,r.kt)("a",{parentName:"p",href:"grain/"},"Grain Chemisty"),"). If LH is not added, UCLCHEM will assume a reaction between two surface reactions follows a  Kooji-Arrhenius equation."),(0,r.kt)("p",null,"For every species, the user reaction file should contain at least one freeze out route. This plus UMIST12 is the minimum possible reaction network. Some users may wish to freeze a species out as something other than itself and so MakeRates does not automatically add these reactions."),(0,r.kt)("h2",{id:"three-phase-chemistry"},"Three Phase Chemistry"),(0,r.kt)("p",null,"Whilst not strictly an input, there is a flag in ",(0,r.kt)("inlineCode",{parentName:"p"},"MakeRates.py")," called ",(0,r.kt)("inlineCode",{parentName:"p"},"three_phase"),". If this is set to true, the chemical network will have gas, grain surface, and bulk ice chemistry. If it set to false, the ice mantles will be treated as a single phase. "),(0,r.kt)("p",null,"When true, MakeRates will create the bulk ice chemistry by adding a bulk version of each species with a binding energy equal to the H2O binding energy. It will also duplicate all LH reactions so they take place in the bulk and it will add terms to the ODEs to allow transfer between the bulk and the surface. See the chemistry sections for more information."),(0,r.kt)("p",null,'You can override the binding energy of material in the bulk by explicitly including the bulk species in your species file rather than allowing MakeRates to automatically add it. Bulk species are designated with an "@". For example, "H2O" is gas phase H',(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mrow",{parentName:"msub"}),(0,r.kt)("mn",{parentName:"msub"},"2"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"_2")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.45110799999999995em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span"}),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))))))),'O, "#H2O" is surface H',(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mrow",{parentName:"msub"}),(0,r.kt)("mn",{parentName:"msub"},"2"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"_2")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.45110799999999995em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span"}),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))))))),'O and "@H2O" is H',(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mrow",{parentName:"msub"}),(0,r.kt)("mn",{parentName:"msub"},"2"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"_2")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.45110799999999995em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span"}),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))))))),"O in the bulk."))}m.isMDXComponent=!0}}]);