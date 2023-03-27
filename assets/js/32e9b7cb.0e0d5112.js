"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[2927],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>h});var s=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,s)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,s,n=function(e,t){if(null==e)return{};var a,s,n={},r=Object.keys(e);for(s=0;s<r.length;s++)a=r[s],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(s=0;s<r.length;s++)a=r[s],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=s.createContext({}),p=function(e){var t=s.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},c=function(e){var t=p(e.components);return s.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},u=s.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),u=p(a),h=n,d=u["".concat(l,".").concat(h)]||u[h]||m[h]||r;return a?s.createElement(d,i(i({ref:t},c),{},{components:a})):s.createElement(d,i({ref:t},c))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,i=new Array(r);i[0]=u;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var p=2;p<r;p++)i[p]=a[p];return s.createElement.apply(null,i)}return s.createElement.apply(null,a)}u.displayName="MDXCreateElement"},7888:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>o,metadata:()=>p,toc:()=>m});var s=a(7462),n=a(3366),r=(a(7294),a(3905)),i=["components"],o={id:"network",title:"Creating a Network"},l=void 0,p={unversionedId:"network",id:"version-v3.1.0/network",title:"Creating a Network",description:"MakeRates",source:"@site/versioned_docs/version-v3.1.0/start-network.md",sourceDirName:".",slug:"/network",permalink:"/docs/v3.1.0/network",tags:[],version:"v3.1.0",frontMatter:{id:"network",title:"Creating a Network"},sidebar:"docs",previous:{title:"Installation",permalink:"/docs/v3.1.0/"},next:{title:"Model Parameters",permalink:"/docs/v3.1.0/parameters"}},c={},m=[{value:"MakeRates",id:"makerates",level:2},{value:"Input",id:"input",level:2},{value:"Default Network",id:"default-network",level:2},{value:"Outputs",id:"outputs",level:2},{value:"What MakeRates Does",id:"what-makerates-does",level:2},{value:"Creating your own Network",id:"creating-your-own-network",level:2},{value:"Species list",id:"species-list",level:4},{value:"Reaction list",id:"reaction-list",level:4},{value:"Three Phase Chemistry",id:"three-phase-chemistry",level:2}],u={toc:m};function h(e){var t=e.components,a=(0,n.Z)(e,i);return(0,r.kt)("wrapper",(0,s.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"makerates"},"MakeRates"),(0,r.kt)("p",null,"In order to make a chemical model flexible, the ability to solve a user supplied chemical network is a must. UCLCHEM uses a preprocessing python script to turn csv lists of species and reactions into fortran files for use in the main code. This script is called MakeRates and can be found in the Makerates subdirectory of the repository. It combines a gas phase reaction database with user supplied lists of species and additional reactions into the necessary Fortran code to run UCLCHEM. It also supplies a number of human readable outputs."),(0,r.kt)("p",null,"In the sections below, we discuss how to build your network and set the inputs for MakeRates but once that is done, you can run MakeRates with the following commands:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd MakeRates\npython MakeRates.py\ncd ..\npip install .\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Note the pip install at the end of the process. Any output from MakeRates requires that the code be recompiled because MakeRates produces new source code for UCLCHEM!")),(0,r.kt)("h2",{id:"input"},"Input"),(0,r.kt)("p",null,"Makerates is controlled using a yaml file ",(0,r.kt)("inlineCode",{parentName:"p"},"Makerates/user_settings.yaml"),". By changing the values in this file, you can create different networks. The default values of this file are copied below."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"#Your list of all species\nspecies_file : inputFiles/default_species.csv\n\n#core reactions from gas phase database\ndatabase_reaction_file : inputFiles/umist12-ucledit.csv\ndatabase_reaction_type : UMIST\n\n#set of additional reactions: eg grain network\ncustom_reaction_file : inputFiles/default_grain_network.csv\ncustom_reaction_type : UCL\n\n#whether to automatically expand to three phase network\nthree_phase : True\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"species_file")," is a csv list of species and their properties. We provide a default list and detailed instructions below."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"database_reaction_file")," is your first reaction file, we expect most users to use UMIST12 or KIDA2014 for this but you could create your own file from an alternative database. Makerates can read files formatted in the same manner as the UMIST or KIDA databases as well as our own simple csv format, the ",(0,r.kt)("inlineCode",{parentName:"p"},"database_reaction_type")," setting lets MakeRates know which and should be set to 'UMIST', 'KIDA', or 'UCL'."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"custom_reaction_file")," is an additional reaction file. In the example file, we include all of our grain surface reactions which is the intended use of this file. "),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"three_phase")," is a toggle that tells MakeRates whether to automatically expand your network into a three phase model."),(0,r.kt)("h2",{id:"default-network"},"Default Network"),(0,r.kt)("p",null,"A basic version of each of the required file is supplied in the repository. The network that MakeRates produces from those files is also include in the source code so that a new user who simply installs UCLCHEM without running MakeRates will be using our default network. These default files serve largely as examples of how the files should be formatted and we also describe each one below so that the user can produce their own network."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"We do not endorse the default network"),", we have simply produced a grain surface network that was relatively up to date in 2018. It produces reasonable ice mantle abundances for major species and ignores larger COMs.  We strongly suggest any published work be based on a network in which the user has confidence. However, where the user is not greatly concerned with grain surface chemistry, the default network is a good starting point."),(0,r.kt)("h2",{id:"outputs"},"Outputs"),(0,r.kt)("p",null,"Outputs from MakeRates are automatically moved to the ",(0,r.kt)("inlineCode",{parentName:"p"},"src/")," directory so the user can ",(0,r.kt)("inlineCode",{parentName:"p"},"pip install .")," and update their installation of UCLCHEM to use their new network. However, by adding the parameter ",(0,r.kt)("inlineCode",{parentName:"p"},"output_directory")," to the yaml file, you can have all the files moved to a directory instead without copying them to your UCLCHEM src folder. If you do, the following files will be produced:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"network.f90 - Fortran arrays containing lists of species names and properties (mass, binding energy etc) as well as reaction reactants, products and rate coefficients."),(0,r.kt)("li",{parentName:"ul"},"odes.f90 - Code to calculate the rate of change of each species' abundance for the numerical solver"),(0,r.kt)("li",{parentName:"ul"},"species.csv - A list of all species in the network and their properties. Made for humans not UCLCHEM."),(0,r.kt)("li",{parentName:"ul"},"reactions.csv - A list of all reactions including reactants, products and coefficients. Made for humans not UCLCHEM.")),(0,r.kt)("h2",{id:"what-makerates-does"},"What MakeRates Does"),(0,r.kt)("p",null,"MakeRates does the following:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Combines the two input reaction lists"),(0,r.kt)("li",{parentName:"ul"},"Filters to remove any reactions containing species not in the input species list"),(0,r.kt)("li",{parentName:"ul"},"Adds freeze out and desorption reactions for all species"),(0,r.kt)("li",{parentName:"ul"},"Creates branching reactions for Langmuir-Hinshelwood and Eley-Rideal reactions where products chemically desorb"),(0,r.kt)("li",{parentName:"ul"},"Optionally: creates additional reactions and species needed for a three phase network"),(0,r.kt)("li",{parentName:"ul"},"Does basic network consistency checks and alerts user of problems"),(0,r.kt)("li",{parentName:"ul"},"Writes fortran files for UCLCHEM"),(0,r.kt)("li",{parentName:"ul"},"Writes other output files")),(0,r.kt)("h2",{id:"creating-your-own-network"},"Creating your own Network"),(0,r.kt)("p",null,"To create your own network you need to produce a species list and a reaction list."),(0,r.kt)("h4",{id:"species-list"},"Species list"),(0,r.kt)("p",null,"The species list should simply be a list with one row per species in the network. Each row should contain the species name, mass, binding energy and enthalpy of formation. The latter two are only used for surface species so can be set to zero for the gas phase species. MakeRates will check the mass is correct for each species and alert you of discrepancies."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"C,12,0,0,0,0,0\n#CH4,16,960,0,0.7,0.667,-15.9\n")),(0,r.kt)("p",null,"In the above example, C is a gas phase species so we have set the mass but ignored the other variables. #CH4 is methane in the ice so we have additionally set a binding energy of 960 K and enthalpy of formation of -15.9 kcal/mol. The other three values (0, 0.7, 0.667) are desorption fractions that three phase chemistry networks ignore. For two phase networks, we mimic the multiple desorption events seen in TPD experiments by setting these fractions. See ",(0,r.kt)("a",{parentName:"p",href:"https://ui.adsabs.harvard.edu/abs/2004MNRAS.354.1141V/abstract"},"Viti et al. 2004")," for more information."),(0,r.kt)("p",null,"The enthalpy of formation for essentially any species can be found in chemical databases such as the ",(0,r.kt)("a",{parentName:"p",href:"https://webbook.nist.gov/"},"NIST web book"),". They're usually in kj/mol but the conversion to kcal/mol is easy enough and NIST has an option to switch values to kcal. A fantastic resource for binding energies is ",(0,r.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1016/j.molap.2017.01.002"},"Wakelam et al. 2017")," but these are harder to find in general. In the absolute worse case, you can sum up the binding energies of sub-groups in your molecule but this is pretty inaccurate."),(0,r.kt)("h4",{id:"reaction-list"},"Reaction list"),(0,r.kt)("p",null,"The second reaction list is intended to contain your surface network but can also be used to augment the gas phase databases by including additional gas phase reactions. The reaction list should be a list with one row per reaction and each row should be a comma separated list of 3 reactants, 4 products, three coefficients (alpha,beta,gamma) and a minimum and maximum temperature. Any missing values such as a third reactant can be left blank. In particular, the temperatures are optional but can be useful when you include multiple versions of the same reaction. In that case, UCLCHEM will only use each one within its specified temperature range."),(0,r.kt)("p",null,"The third reactant can be used as a keyword to tell MakeRates what kind of reaction is occuring. In the absence of a keyword, MakeRates and UCLCHEM will treat any reaction as a gas-phase two body reaction. Two keywords the user may wish to use are ER and LH for Eley-Rideal and Langmuir-Hinshelwood reactions respectively (see ",(0,r.kt)("a",{parentName:"p",href:"grain/"},"Grain Chemisty"),"). If a keyword is not added, UCLCHEM will assume a reaction between two surface reactions follows a Kooji-Arrhenius equation."),(0,r.kt)("p",null,"Two other useful reactions types to include are FREEZE and DESORB. Makerates adds freeze out and desorption reactions for every species, assuming they remain unchanged by the process. For example, CO in the gas becomes #CO on the grain. If you would instead like to specify the products, you can include a reaction:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"H3O+,FREEZE,,#H2O,H,,,1,0,0,,,\n#HPN,DESORB,,HPN+,,,,1,0,0,,,\n")),(0,r.kt)("p",null,"which will override the desorption or freeze out products of a species. "),(0,r.kt)("h2",{id:"three-phase-chemistry"},"Three Phase Chemistry"),(0,r.kt)("p",null,"The input ",(0,r.kt)("inlineCode",{parentName:"p"},"three_phase")," controls whether the ices are treated as a single phase or the surface is treated separated to the bulk. If ",(0,r.kt)("inlineCode",{parentName:"p"},"three_phase")," is set to true, the chemical network will have gas, grain surface, and bulk ice chemistry. If ",(0,r.kt)("inlineCode",{parentName:"p"},"three_phase")," is set to false, the chemical network will have gas and grain surface chemistry."),(0,r.kt)("p",null,"When true, MakeRates will create the bulk ice chemistry by duplicating the surface species and reactions in your input files. The difference will be that, unless you specifically override the bulk binding energy, every species in the bulk has a binding energy equal to the H2O binding energy. It will also add terms to the ODEs to allow transfer between the bulk and the surface. See the chemistry sections for more information."),(0,r.kt)("p",null,'You can override the binding energy of material in the bulk by explicitly including the bulk species in your species file rather than allowing MakeRates to automatically add it. Bulk species are designated with an "@". For example, "H2O" is gas phase H',(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mrow",{parentName:"msub"}),(0,r.kt)("mn",{parentName:"msub"},"2"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"_2")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.45110799999999995em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span"}),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))))))),'O, "#H2O" is surface H',(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mrow",{parentName:"msub"}),(0,r.kt)("mn",{parentName:"msub"},"2"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"_2")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.45110799999999995em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span"}),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))))))),'O and "@H2O" is H',(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mrow",{parentName:"msub"}),(0,r.kt)("mn",{parentName:"msub"},"2"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"_2")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.45110799999999995em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span"}),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))))))),'O in the bulk. If you set the binding energy to "Inf", the species will not leave the grains during thermal desorption. This allows you to model refractory species in the bulk.'))}h.isMDXComponent=!0}}]);