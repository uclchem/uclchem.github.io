"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5230],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>d});var n=a(7294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var o=n.createContext({}),p=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},m=function(e){var t=p(e.components);return n.createElement(o.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,i=e.originalType,o=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),u=p(a),d=l,k=u["".concat(o,".").concat(d)]||u[d]||c[d]||i;return a?n.createElement(k,r(r({ref:t},m),{},{components:a})):n.createElement(k,r({ref:t},m))}));function d(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var i=a.length,r=new Array(i);r[0]=u;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s.mdxType="string"==typeof e?e:l,r[1]=s;for(var p=2;p<i;p++)r[p]=a[p];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5177:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>o,default:()=>d,frontMatter:()=>s,metadata:()=>p,toc:()=>c});var n=a(7462),l=a(3366),i=(a(7294),a(3905)),r=["components"],s={id:"pythonapi",title:"Python Reference"},o="Python API",p={unversionedId:"pythonapi",id:"version-3.1.0/pythonapi",title:"Python Reference",description:"* uclchem",source:"@site/versioned_docs/version-3.1.0/start-pythonapi.md",sourceDirName:".",slug:"/pythonapi",permalink:"/docs/3.1.0/pythonapi",tags:[],version:"3.1.0",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1676464648,formattedLastUpdatedAt:"2/15/2023",frontMatter:{id:"pythonapi",title:"Python Reference"},sidebar:"docs",previous:{title:"Model Parameters",permalink:"/docs/3.1.0/parameters"},next:{title:"Tutorials",permalink:"/docs/3.1.0/category/tutorials"}},m={},c=[{value:"cloud",id:"cloud",level:4},{value:"collapse",id:"collapse",level:4},{value:"hot_core",id:"hot_core",level:4},{value:"cshock",id:"cshock",level:4},{value:"jshock",id:"jshock",level:4},{value:"cshock_dissipation_time",id:"cshock_dissipation_time",level:4},{value:"check_error",id:"check_error",level:4},{value:"get_species_table",id:"get_species_table",level:4},{value:"get_reaction_table",id:"get_reaction_table",level:4},{value:"read_output_file",id:"read_output_file",level:4},{value:"create_abundance_plot",id:"create_abundance_plot",level:4},{value:"plot_species",id:"plot_species",level:4},{value:"analysis",id:"analysis",level:4},{value:"total_element_abundance",id:"total_element_abundance",level:4},{value:"check_element_conservation",id:"check_element_conservation",level:4},{value:"test_ode_conservation",id:"test_ode_conservation",level:4}],u={toc:c};function d(e){var t=e.components,a=(0,l.Z)(e,r);return(0,i.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"python-api"},"Python API"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"#uclchem"},"uclchem"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"#uclchem.model"},"uclchem.model")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.model.cloud"},"cloud")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.model.collapse"},"collapse")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.model.hot_core"},"hot","_","core")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.model.cshock"},"cshock")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.model.jshock"},"jshock")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"#uclchem.utils"},"uclchem.utils")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.utils.cshock_dissipation_time"},"cshock","_","dissipation","_","time")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.utils.check_error"},"check","_","error")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.utils.get_species_table"},"get","_","species","_","table")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.utils.get_reaction_table"},"get","_","reaction","_","table")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"#uclchem.analysis"},"uclchem.analysis")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.analysis.read_output_file"},"read","_","output","_","file")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.analysis.create_abundance_plot"},"create","_","abundance","_","plot")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.analysis.plot_species"},"plot","_","species")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.analysis.analysis"},"analysis")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.analysis.total_element_abundance"},"total","_","element","_","abundance")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.analysis.check_element_conservation"},"check","_","element","_","conservation")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"#uclchem.tests"},"uclchem.tests")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#uclchem.tests.test_ode_conservation"},"test","_","ode","_","conservation"))))),(0,i.kt)("a",{id:"uclchem"}),(0,i.kt)("h1",{id:"uclchem"},"uclchem"),(0,i.kt)("p",null,"The UCLCHEM python module is divided into three parts.\n",(0,i.kt)("inlineCode",{parentName:"p"},"model")," contains the functions for running chemical models under different physics.\n",(0,i.kt)("inlineCode",{parentName:"p"},"analysis")," contains functions for reading and plotting output files as well as investigating the chemistry.\n",(0,i.kt)("inlineCode",{parentName:"p"},"tests")," contains functions for testing the code."),(0,i.kt)("a",{id:"uclchem.model"}),(0,i.kt)("h1",{id:"uclchemmodel"},"uclchem.model"),(0,i.kt)("a",{id:"uclchem.model.cloud"}),(0,i.kt)("h4",{id:"cloud"},"cloud"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def cloud(param_dict=None, out_species=None)\n")),(0,i.kt)("p",null,"Run cloud model from UCLCHEM"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"param_dict")," ",(0,i.kt)("em",{parentName:"li"},"dict,optional")," - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"out_species")," ",(0,i.kt)("em",{parentName:"li"},"list, optional")," - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("p",null,"  A list where the first element is always an integer which is negative if the model failed to run and can be sent to ",(0,i.kt)("inlineCode",{parentName:"p"},"uclchem.utils.check_error()")," to see more details. If the ",(0,i.kt)("inlineCode",{parentName:"p"},"out_species")," parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species."),(0,i.kt)("a",{id:"uclchem.model.collapse"}),(0,i.kt)("h4",{id:"collapse"},"collapse"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def collapse(collapse, physics_output, param_dict=None, out_species=None)\n")),(0,i.kt)("p",null,"Run collapse model from UCLCHEM based on Priestley et al 2018 AJ 156 51 (",(0,i.kt)("a",{parentName:"p",href:"https://ui.adsabs.harvard.edu/abs/2018AJ....156...51P/abstract"},"https://ui.adsabs.harvard.edu/abs/2018AJ....156...51P/abstract"),")"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"collapse")," ",(0,i.kt)("em",{parentName:"li"},"str")," - A string containing the collapse type, options are 'BE1.1', 'BE4', 'filament', or 'ambipolar'"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"physics_output(str)")," - Filename to store physics output, only relevant for 'filament' and 'ambipolar' collapses. If None, no physics output will be saved."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"param_dict")," ",(0,i.kt)("em",{parentName:"li"},"dict,optional")," - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"out_species")," ",(0,i.kt)("em",{parentName:"li"},"list, optional")," - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("p",null,"  A list where the first element is always an integer which is negative if the model failed to run and can be sent to ",(0,i.kt)("inlineCode",{parentName:"p"},"uclchem.utils.check_error()")," to see more details. If the ",(0,i.kt)("inlineCode",{parentName:"p"},"out_species")," parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species."),(0,i.kt)("a",{id:"uclchem.model.hot_core"}),(0,i.kt)("h4",{id:"hot_core"},"hot","_","core"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def hot_core(temp_indx, max_temperature, param_dict=None, out_species=None)\n")),(0,i.kt)("p",null,"Run hot core model from UCLCHEM, based on Viti et al. 2004 and Collings et al. 2004"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"temp_indx")," ",(0,i.kt)("em",{parentName:"li"},"int")," - Used to select the mass of hot core. 1=1Msun,2=5, 3=10, 4=15, 5=25,6=60]"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"max_temperature")," ",(0,i.kt)("em",{parentName:"li"},"float")," - Value at which gas temperature will stop increasing."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"param_dict")," ",(0,i.kt)("em",{parentName:"li"},"dict,optional")," - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"out_species")," ",(0,i.kt)("em",{parentName:"li"},"list, optional")," - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("p",null,"  A list where the first element is always an integer which is negative if the model failed to run and can be sent to ",(0,i.kt)("inlineCode",{parentName:"p"},"uclchem.utils.check_error()")," to see more details. If the ",(0,i.kt)("inlineCode",{parentName:"p"},"out_species")," parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species."),(0,i.kt)("a",{id:"uclchem.model.cshock"}),(0,i.kt)("h4",{id:"cshock"},"cshock"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def cshock(shock_vel, timestep_factor=0.01, minimum_temperature=0.0, param_dict=None, out_species=None)\n")),(0,i.kt)("p",null,"Run C-type shock model from UCLCHEM"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"shock_vel")," ",(0,i.kt)("em",{parentName:"li"},"float")," - Velocity of the shock in km/s"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"timestep_factor")," ",(0,i.kt)("em",{parentName:"li"},"float, optional")," - Whilst the time is less than 2 times the dissipation time of shock, timestep is timestep_factor*dissipation time. Essentially controls\nhow well resolved the shock is in your model. Defaults to 0.01."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"minimum_temperature")," ",(0,i.kt)("em",{parentName:"li"},"float, optional")," - Minimum post-shock temperature. Defaults to 0.0 (no minimum). The shocked gas typically cools to ",(0,i.kt)("inlineCode",{parentName:"li"},"initialTemp")," if this is not set."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"param_dict")," ",(0,i.kt)("em",{parentName:"li"},"dict,optional")," - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"out_species")," ",(0,i.kt)("em",{parentName:"li"},"list, optional")," - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("p",null,"  A list where the first element is always an integer which is negative if the model failed to run and can be sent to ",(0,i.kt)("inlineCode",{parentName:"p"},"uclchem.utils.check_error()")," to see more details. If the model succeeded, the second element is the dissipation time and further elements are the abundances of all species in ",(0,i.kt)("inlineCode",{parentName:"p"},"out_species"),"."),(0,i.kt)("a",{id:"uclchem.model.jshock"}),(0,i.kt)("h4",{id:"jshock"},"jshock"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def jshock(shock_vel, param_dict=None, out_species=None)\n")),(0,i.kt)("p",null,"Run J-type shock model from UCLCHEM"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"shock_vel")," ",(0,i.kt)("em",{parentName:"li"},"float")," - Velocity of the shock"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"param_dict")," ",(0,i.kt)("em",{parentName:"li"},"dict,optional")," - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"out_species")," ",(0,i.kt)("em",{parentName:"li"},"list, optional")," - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("p",null,"  A list where the first element is always an integer which is negative if the model failed to run and can be sent to ",(0,i.kt)("inlineCode",{parentName:"p"},"uclchem.utils.check_error()")," to see more details. If the model succeeded, the second element is the dissipation time and further elements are the abundances of all species in ",(0,i.kt)("inlineCode",{parentName:"p"},"out_species"),"."),(0,i.kt)("a",{id:"uclchem.utils"}),(0,i.kt)("h1",{id:"uclchemutils"},"uclchem.utils"),(0,i.kt)("a",{id:"uclchem.utils.cshock_dissipation_time"}),(0,i.kt)("h4",{id:"cshock_dissipation_time"},"cshock","_","dissipation","_","time"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def cshock_dissipation_time(shock_vel, initial_dens)\n")),(0,i.kt)("p",null,"A simple function used to calculate the dissipation time of a C-type shock.\nUse to obtain a useful timescale for your C-shock model runs. Velocity of\nions and neutrals equalizes at dissipation time and full cooling takes a few dissipation times."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"shock_vel")," ",(0,i.kt)("em",{parentName:"li"},"float")," - Velocity of the shock in km/s"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"initial_dens")," ",(0,i.kt)("em",{parentName:"li"},"float")," - Preshock density of the gas in cm",(0,i.kt)("span",{parentName:"li",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("msup",{parentName:"mrow"},(0,i.kt)("mrow",{parentName:"msup"}),(0,i.kt)("mrow",{parentName:"msup"},(0,i.kt)("mo",{parentName:"mrow"},"\u2212"),(0,i.kt)("mn",{parentName:"mrow"},"3")))),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"^{-3}")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"0.8141079999999999em",verticalAlign:"0em"}}),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span"}),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141079999999999em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mtight"},"\u2212"),(0,i.kt)("span",{parentName:"span",className:"mord mtight"},"3"))))))))))))))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"float")," - The dissipation time of the shock in years")),(0,i.kt)("a",{id:"uclchem.utils.check_error"}),(0,i.kt)("h4",{id:"check_error"},"check","_","error"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def check_error(error_code)\n")),(0,i.kt)("p",null,'Converts the UCLCHEM integer result flag to a simple messaging explaining what went wrong"'),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"error_code")," ",(0,i.kt)("em",{parentName:"li"},"int")," - Error code returned by UCLCHEM models, the first element of the results list.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"str")," - Error message")),(0,i.kt)("a",{id:"uclchem.utils.get_species_table"}),(0,i.kt)("h4",{id:"get_species_table"},"get","_","species","_","table"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def get_species_table()\n")),(0,i.kt)("p",null,"A simple function to load the list of species in the UCLCHEM network into a pandas dataframe."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pandas.DataFrame")," - A dataframe containing the species names and their details")),(0,i.kt)("a",{id:"uclchem.utils.get_reaction_table"}),(0,i.kt)("h4",{id:"get_reaction_table"},"get","_","reaction","_","table"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def get_reaction_table()\n")),(0,i.kt)("p",null,"A function to load the reaction table from the UCLCHEM network into a pandas dataframe."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pandas.DataFrame")," - A dataframe containing the reactions and their rates")),(0,i.kt)("a",{id:"uclchem.analysis"}),(0,i.kt)("h1",{id:"uclchemanalysis"},"uclchem.analysis"),(0,i.kt)("a",{id:"uclchem.analysis.read_output_file"}),(0,i.kt)("h4",{id:"read_output_file"},"read","_","output","_","file"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def read_output_file(output_file)\n")),(0,i.kt)("p",null,"Read the output of a UCLCHEM run created with the outputFile parameter into a pandas DataFrame"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"output_file")," ",(0,i.kt)("em",{parentName:"li"},"str")," - path to file containing a full UCLCHEM output")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pandas.DataFrame")," - A dataframe containing the abundances and physical parameters of the model at every time step.")),(0,i.kt)("a",{id:"uclchem.analysis.create_abundance_plot"}),(0,i.kt)("h4",{id:"create_abundance_plot"},"create","_","abundance","_","plot"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def create_abundance_plot(df, species, figsize=(16, 9), plot_file=None)\n")),(0,i.kt)("p",null,"Create a plot of the abundance of a list of species through time."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"df")," ",(0,i.kt)("em",{parentName:"li"},"pd.DataFrame")," - Pandas dataframe containing the UCLCHEM output, see ",(0,i.kt)("inlineCode",{parentName:"li"},"read_output_file")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"species")," ",(0,i.kt)("em",{parentName:"li"},"list")," - list of strings containing species names. Using a $ instead of # or @ will plot the sum of surface and bulk abundances."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"figsize")," ",(0,i.kt)("em",{parentName:"li"},"tuple, optional")," - Size of figure, width by height in inches. Defaults to (16, 9)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"plot_file")," ",(0,i.kt)("em",{parentName:"li"},"str, optional")," - Path to file where figure will be saved. If None, figure is not saved. Defaults to None.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"fig,ax")," - matplotlib figure and axis objects")),(0,i.kt)("a",{id:"uclchem.analysis.plot_species"}),(0,i.kt)("h4",{id:"plot_species"},"plot","_","species"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def plot_species(ax, df, species)\n")),(0,i.kt)("p",null,"Plot the abundance of a list of species through time directly onto an axis."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"ax")," ",(0,i.kt)("em",{parentName:"li"},"pyplot.axis")," - An axis object to plot on"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"df")," ",(0,i.kt)("em",{parentName:"li"},"pd.DataFrame")," - A dataframe created by ",(0,i.kt)("inlineCode",{parentName:"li"},"read_output_file")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"species")," ",(0,i.kt)("em",{parentName:"li"},"str"),' - A list of species names to be plotted. If species name starts with "$" instead of # or @, plots the sum of surface and bulk abundances')),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pyplot.axis")," - Modified input axis is returned")),(0,i.kt)("a",{id:"uclchem.analysis.analysis"}),(0,i.kt)("h4",{id:"analysis"},"analysis"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def analysis(species_name, result_file, output_file, rate_threshold=0.99)\n")),(0,i.kt)("p",null,"A function which loops over every time step in an output file and finds the rate of change of a species at that time due to each of the reactions it is involved in.\nFrom this, the most important reactions are identified and printed to file. This can be used to understand the chemical reason behind a species' behaviour."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"species_name")," ",(0,i.kt)("em",{parentName:"li"},"str")," - Name of species to be analysed"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"result_file")," ",(0,i.kt)("em",{parentName:"li"},"str")," - The path to the file containing the UCLCHEM output"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"output_file")," ",(0,i.kt)("em",{parentName:"li"},"str")," - The path to the file where the analysis output will be written"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"rate_threshold")," ",(0,i.kt)("em",{parentName:"li"},"float,optional")," - Analysis output will contain the only the most efficient reactions that are responsible for rate_threshold of the total production and destruction rate. Defaults to 0.99.")),(0,i.kt)("a",{id:"uclchem.analysis.total_element_abundance"}),(0,i.kt)("h4",{id:"total_element_abundance"},"total","_","element","_","abundance"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"def total_element_abundance(element, df)\n")),(0,i.kt)("p",null,"Calculates that the total elemental abundance of a species as a function of time. Allows you to check conservation."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"element")," ",(0,i.kt)("em",{parentName:"li"},"str")," - Name of element"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"df")," ",(0,i.kt)("em",{parentName:"li"},"pandas.DataFrame")," - DataFrame from ",(0,i.kt)("inlineCode",{parentName:"li"},"read_output_file()"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pandas.Series")," - Total abundance of element for all time steps in df.")),(0,i.kt)("a",{id:"uclchem.analysis.check_element_conservation"}),(0,i.kt)("h4",{id:"check_element_conservation"},"check","_","element","_","conservation"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},'def check_element_conservation(df, element_list=["H", "N", "C", "O"])\n')),(0,i.kt)("p",null,"Check the conservation of major element by comparing total abundance at start and end of model"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"df")," ",(0,i.kt)("em",{parentName:"li"},"pandas.DataFrame")," - UCLCHEM output in format from ",(0,i.kt)("inlineCode",{parentName:"li"},"read_output_file")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"element_list")," ",(0,i.kt)("em",{parentName:"li"},"list, optional")," - List of elements to check. Defaults to ",'["H", "N", "C", "O"]',".")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"dict")," - Dictionary containing the change in the total abundance of each element as a fraction of initial value")),(0,i.kt)("a",{id:"uclchem.tests"}),(0,i.kt)("h1",{id:"uclchemtests"},"uclchem.tests"),(0,i.kt)("a",{id:"uclchem.tests.test_ode_conservation"}),(0,i.kt)("h4",{id:"test_ode_conservation"},"test","_","ode","_","conservation"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},'def test_ode_conservation(element_list=["H", "N", "C", "O"])\n')),(0,i.kt)("p",null,"Test whether the ODEs conserve elements. Useful to run each time you change network.\nIntegrator errors may still cause elements not to be conserved but they cannot be conserved\nif the ODEs are not correct."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Arguments"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"element_list")," ",(0,i.kt)("em",{parentName:"li"},"list, optional")," - A list of elements for which to check the conservation. Defaults to ",'["H", "N", "C", "O"]',".")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"dict")," - A dictionary of the elements in element list with values representing the total rate of change of each element.")))}d.isMDXComponent=!0}}]);