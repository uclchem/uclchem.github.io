"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6697],{8958:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var a=t(2540),n=t(8453);const i={id:"network",title:"Creating a Network"},r=void 0,l={id:"network",title:"Creating a Network",description:"MakeRates",source:"@site/docs/start-network.md",sourceDirName:".",slug:"/network",permalink:"/docs/next/network",draft:!1,unlisted:!1,tags:[],version:"current",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1697189829e3,frontMatter:{id:"network",title:"Creating a Network"},sidebar:"docs",previous:{title:"Installation",permalink:"/docs/next/"},next:{title:"Model Parameters",permalink:"/docs/next/parameters"}},o={},c=[{value:"MakeRates",id:"makerates",level:2},{value:"Input",id:"input",level:2},{value:"Default Network",id:"default-network",level:2},{value:"Outputs",id:"outputs",level:2},{value:"What MakeRates Does",id:"what-makerates-does",level:2},{value:"Creating your own Network",id:"creating-your-own-network",level:2},{value:"Species list",id:"species-list",level:4},{value:"Reaction list",id:"reaction-list",level:4},{value:"Three Phase Chemistry",id:"three-phase-chemistry",level:2}];function h(e){const s={a:"a",annotation:"annotation",code:"code",h2:"h2",h4:"h4",li:"li",math:"math",mn:"mn",mrow:"mrow",msub:"msub",p:"p",pre:"pre",semantics:"semantics",span:"span",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.h2,{id:"makerates",children:"MakeRates"}),"\n",(0,a.jsx)(s.p,{children:"In order to make a chemical model flexible, the ability to solve a user supplied chemical network is a must. UCLCHEM uses a preprocessing python script to turn csv lists of species and reactions into fortran files for use in the main code. This script is called MakeRates and can be found in the Makerates subdirectory of the repository. It combines a gas phase reaction database with user supplied lists of species and additional reactions into the necessary Fortran code to run UCLCHEM. It also supplies a number of human readable outputs."}),"\n",(0,a.jsx)(s.p,{children:"In the sections below, we discuss how to build your network and set the inputs for MakeRates but once that is done, you can run MakeRates with the following commands:"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{className:"language-bash",children:"cd MakeRates\npython MakeRates.py\ncd ..\npip install -e . \n"})}),"\n",(0,a.jsx)(s.p,{children:(0,a.jsx)(s.strong,{children:"Note the pip install at the end of the process. Any output from MakeRates requires that the code be recompiled because MakeRates produces new source code for UCLCHEM!"})}),"\n",(0,a.jsx)(s.h2,{id:"input",children:"Input"}),"\n",(0,a.jsxs)(s.p,{children:["Makerates is controlled using a yaml file ",(0,a.jsx)(s.code,{children:"Makerates/user_settings.yaml"}),". By changing the values in this file, you can create different networks. The default values of this file are copied below."]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{className:"language-yaml",children:"#Your list of all species\nspecies_file : inputFiles/default_species.csv\n\n#core reactions from gas phase database\ndatabase_reaction_file : inputFiles/umist12-ucledit.csv\ndatabase_reaction_type : UMIST\n\n#set of additional reactions: eg grain network\ncustom_reaction_file : inputFiles/default_grain_network.csv\ncustom_reaction_type : UCL\n\n#whether to automatically expand to three phase network\nthree_phase : True\n"})}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"species_file"})," is a csv list of species and their properties. We provide a default list and detailed instructions below."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"database_reaction_file"})," is your first reaction file, we expect most users to use UMIST12 or KIDA2014 for this but you could create your own file from an alternative database. Makerates can read files formatted in the same manner as the UMIST or KIDA databases as well as our own simple csv format, the ",(0,a.jsx)(s.code,{children:"database_reaction_type"})," setting lets MakeRates know which and should be set to 'UMIST', 'KIDA', or 'UCL'."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"custom_reaction_file"})," is an additional reaction file. In the example file, we include all of our grain surface reactions which is the intended use of this file."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"three_phase"})," is a toggle that tells MakeRates whether to automatically expand your network into a three phase model."]}),"\n",(0,a.jsx)(s.h2,{id:"default-network",children:"Default Network"}),"\n",(0,a.jsx)(s.p,{children:"A basic version of each of the required file is supplied in the repository. The network that MakeRates produces from those files is also include in the source code so that a new user who simply installs UCLCHEM without running MakeRates will be using our default network. These default files serve largely as examples of how the files should be formatted and we also describe each one below so that the user can produce their own network."}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"We do not endorse the default network"}),", we have simply produced a grain surface network that was relatively up to date in 2018. It produces reasonable ice mantle abundances for major species and ignores larger COMs.  We strongly suggest any published work be based on a network in which the user has confidence. However, where the user is not greatly concerned with grain surface chemistry, the default network is a good starting point."]}),"\n",(0,a.jsx)(s.h2,{id:"outputs",children:"Outputs"}),"\n",(0,a.jsxs)(s.p,{children:["Outputs from MakeRates are automatically moved to the ",(0,a.jsx)(s.code,{children:"src/"})," directory so the user can ",(0,a.jsx)(s.code,{children:"pip install ."})," and update their installation of UCLCHEM to use their new network. However, by adding the parameter ",(0,a.jsx)(s.code,{children:"output_directory"})," to the yaml file, you can have all the files moved to a directory instead without copying them to your UCLCHEM src folder. If you do, the following files will be produced:"]}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"network.f90 - Fortran arrays containing lists of species names and properties (mass, binding energy etc) as well as reaction reactants, products and rate coefficients."}),"\n",(0,a.jsx)(s.li,{children:"odes.f90 - Code to calculate the rate of change of each species' abundance for the numerical solver"}),"\n",(0,a.jsx)(s.li,{children:"species.csv - A list of all species in the network and their properties. Made for humans not UCLCHEM."}),"\n",(0,a.jsx)(s.li,{children:"reactions.csv - A list of all reactions including reactants, products and coefficients. Made for humans not UCLCHEM."}),"\n"]}),"\n",(0,a.jsx)(s.h2,{id:"what-makerates-does",children:"What MakeRates Does"}),"\n",(0,a.jsx)(s.p,{children:"MakeRates does the following:"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"Combines the two input reaction lists"}),"\n",(0,a.jsx)(s.li,{children:"Filters to remove any reactions containing species not in the input species list"}),"\n",(0,a.jsx)(s.li,{children:"Adds freeze out and desorption reactions for all species"}),"\n",(0,a.jsx)(s.li,{children:"Creates branching reactions for Langmuir-Hinshelwood and Eley-Rideal reactions where products chemically desorb"}),"\n",(0,a.jsx)(s.li,{children:"Optionally: creates additional reactions and species needed for a three phase network"}),"\n",(0,a.jsx)(s.li,{children:"Does basic network consistency checks and alerts user of problems"}),"\n",(0,a.jsx)(s.li,{children:"Writes fortran files for UCLCHEM"}),"\n",(0,a.jsx)(s.li,{children:"Writes other output files"}),"\n"]}),"\n",(0,a.jsx)(s.h2,{id:"creating-your-own-network",children:"Creating your own Network"}),"\n",(0,a.jsx)(s.p,{children:"To create your own network you need to produce a species list and a reaction list."}),"\n",(0,a.jsx)(s.h4,{id:"species-list",children:"Species list"}),"\n",(0,a.jsx)(s.p,{children:"The species list should simply be a list with one row per species in the network. Each row should contain the species name, mass, binding energy and enthalpy of formation. The latter two are only used for surface species so can be set to zero for the gas phase species. MakeRates will check the mass is correct for each species and alert you of discrepancies."}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"C,12,0,0,0,0,0\n#CH4,16,960,0,0.7,0.667,-15.9\n"})}),"\n",(0,a.jsxs)(s.p,{children:["In the above example, C is a gas phase species so we have set the mass but ignored the other variables. #CH4 is methane in the ice so we have additionally set a binding energy of 960 K and enthalpy of formation of -15.9 kcal/mol. The other three values (0, 0.7, 0.667) are desorption fractions that three phase chemistry networks ignore. For two phase networks, we mimic the multiple desorption events seen in TPD experiments by setting these fractions. See ",(0,a.jsx)(s.a,{href:"https://ui.adsabs.harvard.edu/abs/2004MNRAS.354.1141V/abstract",children:"Viti et al. 2004"})," for more information."]}),"\n",(0,a.jsxs)(s.p,{children:["The enthalpy of formation for essentially any species can be found in chemical databases such as the ",(0,a.jsx)(s.a,{href:"https://webbook.nist.gov/",children:"NIST web book"}),". They're usually in kj/mol but the conversion to kcal/mol is easy enough and NIST has an option to switch values to kcal. A fantastic resource for binding energies is ",(0,a.jsx)(s.a,{href:"https://dx.doi.org/10.1016/j.molap.2017.01.002",children:"Wakelam et al. 2017"})," but these are harder to find in general. In the absolute worse case, you can sum up the binding energies of sub-groups in your molecule but this is pretty inaccurate."]}),"\n",(0,a.jsx)(s.h4,{id:"reaction-list",children:"Reaction list"}),"\n",(0,a.jsx)(s.p,{children:"The second reaction list is intended to contain your surface network but can also be used to augment the gas phase databases by including additional gas phase reactions. The reaction list should be a list with one row per reaction and each row should be a comma separated list of 3 reactants, 4 products, three coefficients (alpha,beta,gamma) and a minimum and maximum temperature. Any missing values such as a third reactant can be left blank. In particular, the temperatures are optional but can be useful when you include multiple versions of the same reaction. In that case, UCLCHEM will only use each one within its specified temperature range."}),"\n",(0,a.jsxs)(s.p,{children:["The third reactant can be used as a keyword to tell MakeRates what kind of reaction is occuring. In the absence of a keyword, MakeRates and UCLCHEM will treat any reaction as a gas-phase two body reaction. Two keywords the user may wish to use are ER and LH for Eley-Rideal and Langmuir-Hinshelwood reactions respectively (see ",(0,a.jsx)(s.a,{href:"grain/",children:"Grain Chemisty"}),"). If a keyword is not added, UCLCHEM will assume a reaction between two surface reactions follows a Kooji-Arrhenius equation."]}),"\n",(0,a.jsx)(s.p,{children:"Two other useful reactions types to include are FREEZE and DESORB. Makerates adds freeze out and desorption reactions for every species, assuming they remain unchanged by the process. For example, CO in the gas becomes #CO on the grain. If you would instead like to specify the products, you can include a reaction:"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"H3O+,FREEZE,,#H2O,H,,,1,0,0,,,\n#HPN,DESORB,,HPN+,,,,1,0,0,,,\n"})}),"\n",(0,a.jsx)(s.p,{children:"which will override the desorption or freeze out products of a species."}),"\n",(0,a.jsx)(s.h2,{id:"three-phase-chemistry",children:"Three Phase Chemistry"}),"\n",(0,a.jsxs)(s.p,{children:["The input ",(0,a.jsx)(s.code,{children:"three_phase"})," controls whether the ices are treated as a single phase or the surface is treated separated to the bulk. If ",(0,a.jsx)(s.code,{children:"three_phase"})," is set to true, the chemical network will have gas, grain surface, and bulk ice chemistry. If ",(0,a.jsx)(s.code,{children:"three_phase"})," is set to false, the chemical network will have gas and grain surface chemistry."]}),"\n",(0,a.jsx)(s.p,{children:"When true, MakeRates will create the bulk ice chemistry by duplicating the surface species and reactions in your input files. The difference will be that, unless you specifically override the bulk binding energy, every species in the bulk has a binding energy equal to the H2O binding energy. It will also add terms to the ODEs to allow transfer between the bulk and the surface. See the chemistry sections for more information."}),"\n",(0,a.jsxs)(s.p,{children:['You can override the binding energy of material in the bulk by explicitly including the bulk species in your species file rather than allowing MakeRates to automatically add it. Bulk species are designated with an "@". For example, "H2O" is gas phase H',(0,a.jsxs)(s.span,{className:"katex",children:[(0,a.jsx)(s.span,{className:"katex-mathml",children:(0,a.jsx)(s.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,a.jsxs)(s.semantics,{children:[(0,a.jsx)(s.mrow,{children:(0,a.jsxs)(s.msub,{children:[(0,a.jsx)(s.mrow,{}),(0,a.jsx)(s.mn,{children:"2"})]})}),(0,a.jsx)(s.annotation,{encoding:"application/x-tex",children:"_2"})]})})}),(0,a.jsx)(s.span,{className:"katex-html","aria-hidden":"true",children:(0,a.jsxs)(s.span,{className:"base",children:[(0,a.jsx)(s.span,{className:"strut",style:{height:"0.4511em",verticalAlign:"-0.15em"}}),(0,a.jsxs)(s.span,{className:"mord",children:[(0,a.jsx)(s.span,{}),(0,a.jsx)(s.span,{className:"msupsub",children:(0,a.jsxs)(s.span,{className:"vlist-t vlist-t2",children:[(0,a.jsxs)(s.span,{className:"vlist-r",children:[(0,a.jsx)(s.span,{className:"vlist",style:{height:"0.3011em"},children:(0,a.jsxs)(s.span,{style:{top:"-2.55em",marginRight:"0.05em"},children:[(0,a.jsx)(s.span,{className:"pstrut",style:{height:"2.7em"}}),(0,a.jsx)(s.span,{className:"sizing reset-size6 size3 mtight",children:(0,a.jsx)(s.span,{className:"mord mtight",children:"2"})})]})}),(0,a.jsx)(s.span,{className:"vlist-s",children:"\u200b"})]}),(0,a.jsx)(s.span,{className:"vlist-r",children:(0,a.jsx)(s.span,{className:"vlist",style:{height:"0.15em"},children:(0,a.jsx)(s.span,{})})})]})})]})]})})]}),'O, "#H2O" is surface H',(0,a.jsxs)(s.span,{className:"katex",children:[(0,a.jsx)(s.span,{className:"katex-mathml",children:(0,a.jsx)(s.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,a.jsxs)(s.semantics,{children:[(0,a.jsx)(s.mrow,{children:(0,a.jsxs)(s.msub,{children:[(0,a.jsx)(s.mrow,{}),(0,a.jsx)(s.mn,{children:"2"})]})}),(0,a.jsx)(s.annotation,{encoding:"application/x-tex",children:"_2"})]})})}),(0,a.jsx)(s.span,{className:"katex-html","aria-hidden":"true",children:(0,a.jsxs)(s.span,{className:"base",children:[(0,a.jsx)(s.span,{className:"strut",style:{height:"0.4511em",verticalAlign:"-0.15em"}}),(0,a.jsxs)(s.span,{className:"mord",children:[(0,a.jsx)(s.span,{}),(0,a.jsx)(s.span,{className:"msupsub",children:(0,a.jsxs)(s.span,{className:"vlist-t vlist-t2",children:[(0,a.jsxs)(s.span,{className:"vlist-r",children:[(0,a.jsx)(s.span,{className:"vlist",style:{height:"0.3011em"},children:(0,a.jsxs)(s.span,{style:{top:"-2.55em",marginRight:"0.05em"},children:[(0,a.jsx)(s.span,{className:"pstrut",style:{height:"2.7em"}}),(0,a.jsx)(s.span,{className:"sizing reset-size6 size3 mtight",children:(0,a.jsx)(s.span,{className:"mord mtight",children:"2"})})]})}),(0,a.jsx)(s.span,{className:"vlist-s",children:"\u200b"})]}),(0,a.jsx)(s.span,{className:"vlist-r",children:(0,a.jsx)(s.span,{className:"vlist",style:{height:"0.15em"},children:(0,a.jsx)(s.span,{})})})]})})]})]})})]}),'O and "@H2O" is H',(0,a.jsxs)(s.span,{className:"katex",children:[(0,a.jsx)(s.span,{className:"katex-mathml",children:(0,a.jsx)(s.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,a.jsxs)(s.semantics,{children:[(0,a.jsx)(s.mrow,{children:(0,a.jsxs)(s.msub,{children:[(0,a.jsx)(s.mrow,{}),(0,a.jsx)(s.mn,{children:"2"})]})}),(0,a.jsx)(s.annotation,{encoding:"application/x-tex",children:"_2"})]})})}),(0,a.jsx)(s.span,{className:"katex-html","aria-hidden":"true",children:(0,a.jsxs)(s.span,{className:"base",children:[(0,a.jsx)(s.span,{className:"strut",style:{height:"0.4511em",verticalAlign:"-0.15em"}}),(0,a.jsxs)(s.span,{className:"mord",children:[(0,a.jsx)(s.span,{}),(0,a.jsx)(s.span,{className:"msupsub",children:(0,a.jsxs)(s.span,{className:"vlist-t vlist-t2",children:[(0,a.jsxs)(s.span,{className:"vlist-r",children:[(0,a.jsx)(s.span,{className:"vlist",style:{height:"0.3011em"},children:(0,a.jsxs)(s.span,{style:{top:"-2.55em",marginRight:"0.05em"},children:[(0,a.jsx)(s.span,{className:"pstrut",style:{height:"2.7em"}}),(0,a.jsx)(s.span,{className:"sizing reset-size6 size3 mtight",children:(0,a.jsx)(s.span,{className:"mord mtight",children:"2"})})]})}),(0,a.jsx)(s.span,{className:"vlist-s",children:"\u200b"})]}),(0,a.jsx)(s.span,{className:"vlist-r",children:(0,a.jsx)(s.span,{className:"vlist",style:{height:"0.15em"},children:(0,a.jsx)(s.span,{})})})]})})]})]})})]}),'O in the bulk. If you set the binding energy to "Inf", the species will not leave the grains during thermal desorption. This allows you to model refractory species in the bulk.']})]})}function d(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,a.jsx)(s,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},8453:(e,s,t)=>{t.d(s,{R:()=>r,x:()=>l});var a=t(3696);const n={},i=a.createContext(n);function r(e){const s=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:r(e.components),a.createElement(i.Provider,{value:s},e.children)}}}]);