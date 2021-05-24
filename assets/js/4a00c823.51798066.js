(self.webpackChunk=self.webpackChunk||[]).push([[9234],{3905:(e,t,a)=>{"use strict";a.d(t,{Zo:()=>u,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=c(a),h=r,m=d["".concat(l,".").concat(h)]||d[h]||p[h]||i;return a?n.createElement(m,s(s({ref:t},u),{},{components:a})):n.createElement(m,s({ref:t},u))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,s=new Array(i);s[0]=d;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:r,s[1]=o;for(var c=2;c<i;c++)s[c]=a[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},8338:(e,t,a)=>{"use strict";a.r(t),a.d(t,{frontMatter:()=>s,metadata:()=>o,toc:()=>l,default:()=>u});var n=a(2122),r=a(9756),i=(a(7294),a(3905)),s={id:"network",title:"Creating a Network"},o={unversionedId:"network",id:"network",isDocsHomePage:!1,title:"Creating a Network",description:"MakeRates",source:"@site/docs/network.md",sourceDirName:".",slug:"/network",permalink:"/docs/network",version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1621867778,formattedLastUpdatedAt:"5/24/2021",frontMatter:{id:"network",title:"Creating a Network"},sidebar:"docs",previous:{title:"Basic Use",permalink:"/docs/"},next:{title:"Model Parameters",permalink:"/docs/parameters"}},l=[{value:"MakeRates",id:"makerates",children:[]},{value:"Inputs",id:"inputs",children:[]},{value:"Outputs",id:"outputs",children:[]},{value:"What MakeRates Does",id:"what-makerates-does",children:[]},{value:"Creating your own Network",id:"creating-your-own-network",children:[]},{value:"Three Phase Chemistry",id:"three-phase-chemistry",children:[]}],c={toc:l};function u(e){var t=e.components,a=(0,r.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"makerates"},"MakeRates"),(0,i.kt)("p",null,"In order to make a chemical model flexible, the ability to solve a user supplied chemical network is a must. UCLCHEM uses a preprocessing python script to turn csv lists of species and reactions into fortran files for use in the main code. This script is called MakeRates and can be found in a subdirectory of the repository. It combines a gas phase reaction database with user supplied lists of species and additional reactions into odes.f90 and network.f90 which contain all necessary information. It also supplies a number of human readable outputs."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Any output from MakeRates requires that the code be recompiled from scratch (make clean, then make)")),(0,i.kt)("h2",{id:"inputs"},"Inputs"),(0,i.kt)("p",null,"Inputs for MakeRates can be found in ",(0,i.kt)("inlineCode",{parentName:"p"},"MakeRates/inputFiles/")," and the specific files used by MakeRates can be changed in ",(0,i.kt)("inlineCode",{parentName:"p"},"MakeRates/MakeRates.py"),". MakeRates requires three inputs:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"A species list containing all species and their properties"),(0,i.kt)("li",{parentName:"ul"},"A gas phase reaction database in UMIST or KIDA formats"),(0,i.kt)("li",{parentName:"ul"},"A user supplied reaction database including all freeze out reactions at a minimum")),(0,i.kt)("p",null,"A basic version of each of these is supplied with UCLCHEM include KIDA2014 and UMIST12. ",(0,i.kt)("strong",{parentName:"p"},"We do not endorse the resulting network"),", we have simply produced a grain surface network that was relatively up to date in 2018. It produces reasonable ice mantle abundances for major species and ignores larger COMs.  We strongly suggest any published work be based on a network in which the user has confidence. However, where the user is not greatly concerned with grain surface chemistry, the default network is a good starting point."),(0,i.kt)("h2",{id:"outputs"},"Outputs"),(0,i.kt)("p",null,"Outputs from MakeRates can be found in ",(0,i.kt)("inlineCode",{parentName:"p"},"MakeRates/outputFiles/")," and must be copied to ",(0,i.kt)("inlineCode",{parentName:"p"},"src")," to be included in UCLCHEM. They include:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Network.f90 - Fortran arrays containing lists of species names and properties (mass, binding energy etc) as well as reaction reactants, products and rate coefficients."),(0,i.kt)("li",{parentName:"ul"},"odes.f90 - Code to calculate the rate of change of each species' abundance for the numerical solver"),(0,i.kt)("li",{parentName:"ul"},"species.csv - A list of all species in the network and their properties. Made for humans not UCLCHEM."),(0,i.kt)("li",{parentName:"ul"},"reactions.csv - A list of all reactions including reactants, products and coefficients. Made for humans not UCLCHEM.")),(0,i.kt)("h2",{id:"what-makerates-does"},"What MakeRates Does"),(0,i.kt)("p",null,"MakeRates does the following:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Combines the two input reaction lists"),(0,i.kt)("li",{parentName:"ul"},"Filters to remove any reactions containing species not in the input species list"),(0,i.kt)("li",{parentName:"ul"},"Checks all species freeze out"),(0,i.kt)("li",{parentName:"ul"},"Adds non-thermal desorption reactions for all frozen species"),(0,i.kt)("li",{parentName:"ul"},"Does basic network consistency checks and alerts user of problems"),(0,i.kt)("li",{parentName:"ul"},"Writes fortran files for UCLCHEM"),(0,i.kt)("li",{parentName:"ul"},"Writes other output files")),(0,i.kt)("h2",{id:"creating-your-own-network"},"Creating your own Network"),(0,i.kt)("p",null,"To create your own network you need to produce a species list and a reaction list."),(0,i.kt)("h5",{id:"species-list"},"Species list"),(0,i.kt)("p",null,"The species list should simply be a list with one row per species in the network. Each row should contain the species name, mass, binding energy and enthalpy. The latter two are only used for surface species so can be set to zero for the gas phase species. MakeRates will check the mass is correct for each species and alert you of discrepancies."),(0,i.kt)("h5",{id:"reaction-list"},"Reaction list"),(0,i.kt)("p",null,"The second reaction list is intended to contain your surface network but can also be used to augment the gas phase databases by including additional gas phase reactions. The reaction list should be a list with one row per reaction and each row should be a comma separated list of 3 reactants, 4 products, three coefficients (alpha,beta,gamma) and a minimum and maximum temperature. Any missing values such as a third reactant can be left blank. In particular, the temperatures are optional but you can including multiple versions of the same reaction and UCLCHEM will only use each one within its specified temperature range if included."),(0,i.kt)("p",null,"The third reactant can be used as a keyword to tell MakeRates what kind of reaction is occuring. In the absence of a keyword, MakeRates and UCLCHEM will treat any reaction as a gas-phase two body reaction. Two keywords the user may wish to use are ER and LH for Eley-Rideal and Langmuir-Hinshelwood reactions respectively (see ",(0,i.kt)("a",{parentName:"p",href:"grain/"},"Grain Chemisty"),"). If LH is not added, UCLCHEM will assume a reaction between two surface reactions follows a  Kooji-Arrhenius equation."),(0,i.kt)("p",null,"For every species, the user reaction file should contain at least one freeze out route. This plus UMIST12 is the minimum possible reaction network. Some users may wish to freeze a species out as something other than itself and so MakeRates does not automatically add these reactions."),(0,i.kt)("h2",{id:"three-phase-chemistry"},"Three Phase Chemistry"),(0,i.kt)("p",null,"Whilst not strictly an input, there is a flag in ",(0,i.kt)("inlineCode",{parentName:"p"},"MakeRates.py")," called ",(0,i.kt)("inlineCode",{parentName:"p"},"three_phase"),". If this is set to true, the chemical network will have gas, grain surface, and bulk ice chemistry. If it set to false, the ice mantles will be treated as a single phase. "),(0,i.kt)("p",null,"When true, MakeRates will create the bulk ice chemistry by adding a bulk version of each species with a binding energy equal to the H2O binding energy. It will also duplicate all LH reactions so they take place in the bulk and it will add terms to the ODEs to allow transfer between the bulk and the surface. See the chemistry sections for more information."))}u.isMDXComponent=!0}}]);