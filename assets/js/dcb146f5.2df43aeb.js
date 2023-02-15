"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4355],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>k});var l=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,l,a=function(e,t){if(null==e)return{};var n,l,a={},r=Object.keys(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=l.createContext({}),u=function(e){var t=l.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=u(e.components);return l.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},p=l.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,i=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=u(n),k=a,h=p["".concat(i,".").concat(k)]||p[k]||c[k]||r;return n?l.createElement(h,o(o({ref:t},d),{},{components:n})):l.createElement(h,o({ref:t},d))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var u=2;u<r;u++)o[u]=n[u];return l.createElement.apply(null,o)}return l.createElement.apply(null,n)}p.displayName="MDXCreateElement"},23:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>k,frontMatter:()=>s,metadata:()=>u,toc:()=>c});var l=n(7462),a=n(3366),r=(n(7294),n(3905)),o=["components"],s={},i="Running Your First Models",u={unversionedId:"first_model",id:"version-3.1.0/first_model",title:"Running Your First Models",description:"In this notebook, we demonstrate the basic use of UCLCHEM's python module by running a simple model and then using the analysis functions to examine the output.",source:"@site/versioned_docs/version-3.1.0/first_model.md",sourceDirName:".",slug:"/first_model",permalink:"/docs/first_model",tags:[],version:"3.1.0",frontMatter:{},sidebar:"docs",previous:{title:"Tutorials",permalink:"/docs/category/tutorials"},next:{title:"Advanced Physical Modelling",permalink:"/docs/modelling_objects"}},d={},c=[{value:"A Simple Cloud",id:"a-simple-cloud",level:2},{value:"Checking the output",id:"checking-the-output",level:2},{value:"Plotting Results",id:"plotting-results",level:2}],p={toc:c};function k(e){var t=e.components,s=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,l.Z)({},p,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"running-your-first-models"},"Running Your First Models"),(0,r.kt)("p",null,"In this notebook, we demonstrate the basic use of UCLCHEM's python module by running a simple model and then using the analysis functions to examine the output."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},"import uclchem\n")),(0,r.kt)("h2",{id:"a-simple-cloud"},"A Simple Cloud"),(0,r.kt)("p",null,"UCLCHEM's ",(0,r.kt)("inlineCode",{parentName:"p"},"cloud()")," model is a spherical cloud of isothermal gas. We can keep a constant density or have it increase over time following a freefall equation. This model is generally useful whenever you want to model a homogeneous cloud of gas under constant conditions. For example, in the inner parts of a molecular cloud where Av ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mo",{parentName:"mrow"},"\u2273")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"\\gtrsim")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.95916em",verticalAlign:"-0.22958em"}}),(0,r.kt)("span",{parentName:"span",className:"mrel amsrm"},"\u2273")))))," 10 there are very few depth dependent processes. You may wish to model the whole of this UV shielded portion of the cloud with a single ",(0,r.kt)("inlineCode",{parentName:"p"},"cloud()")," model."),(0,r.kt)("p",null,"Due to the large number of parameters in a chemical model and the way fortran and python interaction, we find it is easiest to do parameter input through python dictionaries. In this block, we define param_dict which contains the parameters we wish to modify for this run. Every ",(0,r.kt)("inlineCode",{parentName:"p"},"uclchem.model")," function accepts a dictionary as an optional argument. Every parameter has a default value which is overriden if that parameter is specified in this dictionary. You can find a complete list of modifiable parameters and their default values in ",(0,r.kt)("a",{parentName:"p",href:"/docs/parameters"},"our parameter docs"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},'# set a parameter dictionary for phase 1 collapse model\n\nout_species = ["SO","CO"]\nparam_dict = {\n    "endAtFinalDensity": False,#stop at finalTime\n    "freefall": False,#don\'t increase density in freefall\n    "initialDens": 1e4, #starting density\n    "initialTemp": 10.0,#temperature of gas\n    "finalTime": 1.0e6, #final time\n    "rout":0.1, #radius of cloud in pc\n    "baseAv":1.0, #visual extinction at cloud edge.\n    "outputFile": "../examples/test-output/static-full.dat",#full UCLCHEM output\n    "abundSaveFile": "../examples/test-output/startstatic.dat",#save final abundances to file\n}\nresult = uclchem.model.cloud(param_dict=param_dict,out_species=out_species)\nprint(result)\n\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"[1, 3.331065659699488e-11, 3.576305642378658e-05]\n")),(0,r.kt)("h2",{id:"checking-the-output"},"Checking the output"),(0,r.kt)("p",null,"At the end of the previous cell, we printed ",(0,r.kt)("inlineCode",{parentName:"p"},"result")," which is a list returned by every UCLCHEM model function. The first element is always an integer which will be positive if the code completed and negative otherwise. You can send negative values to ",(0,r.kt)("inlineCode",{parentName:"p"},"uclchem.utils.check_error()")," to get a more detailed error message."),(0,r.kt)("p",null,"The subsequent elements are the final abundances of any species listed in ",(0,r.kt)("inlineCode",{parentName:"p"},"out_species"),", in this case we have the abundance of SO and CO. This is useful when we want to use UCLCHEM as part of something like an MCMC procedure, obtaining abundances for given parameters. However, we also write the final abundances of all species to ",(0,r.kt)("inlineCode",{parentName:"p"},"abundSaveFile")," and the abundances of all species at every time step in ",(0,r.kt)("inlineCode",{parentName:"p"},"outputFile")," so it is not necessary to acquire abundances in this way."),(0,r.kt)("p",null,"The output file is just a simple csv with some header rows, UCLCHEM has a utility function to read that file into a pandas dataframe. Let's load it up and look at it."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},'result_df=uclchem.analysis.read_output_file("../examples/test-output/static-full.dat")\nresult_df.head()\n')),(0,r.kt)("div",null,(0,r.kt)("table",{border:"1",class:"dataframe"},(0,r.kt)("thead",null,(0,r.kt)("tr",null,(0,r.kt)("th",null),(0,r.kt)("th",null,"Time"),(0,r.kt)("th",null,"Density"),(0,r.kt)("th",null,"gasTemp"),(0,r.kt)("th",null,"av"),(0,r.kt)("th",null,"zeta"),(0,r.kt)("th",null,"point"),(0,r.kt)("th",null,"H"),(0,r.kt)("th",null,"#H"),(0,r.kt)("th",null,"H+"),(0,r.kt)("th",null,"@H"),(0,r.kt)("th",null,"..."),(0,r.kt)("th",null,"HS2+"),(0,r.kt)("th",null,"HSO2+"),(0,r.kt)("th",null,"H2S2+"),(0,r.kt)("th",null,"H2S2"),(0,r.kt)("th",null,"#H2S2"),(0,r.kt)("th",null,"@H2S2"),(0,r.kt)("th",null,"E-"),(0,r.kt)("th",null,"BULK"),(0,r.kt)("th",null,"SURFACE"),(0,r.kt)("th",null,"radfield"))),(0,r.kt)("tbody",null,(0,r.kt)("tr",null,(0,r.kt)("th",null,"0"),(0,r.kt)("td",null,"0.000000e+00"),(0,r.kt)("td",null,"10000.0"),(0,r.kt)("td",null,"10.0"),(0,r.kt)("td",null,"2.9287"),(0,r.kt)("td",null,"1.0"),(0,r.kt)("td",null,"1"),(0,r.kt)("td",null,"0.5"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"..."),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"0.000182"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.0")),(0,r.kt)("tr",null,(0,r.kt)("th",null,"1"),(0,r.kt)("td",null,"1.000000e-07"),(0,r.kt)("td",null,"10000.0"),(0,r.kt)("td",null,"10.0"),(0,r.kt)("td",null,"2.9287"),(0,r.kt)("td",null,"1.0"),(0,r.kt)("td",null,"1"),(0,r.kt)("td",null,"0.5"),(0,r.kt)("td",null,"5.680300e-13"),(0,r.kt)("td",null,"1.789040e-17"),(0,r.kt)("td",null,"4.269620e-20"),(0,r.kt)("td",null,"..."),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"0.000182"),(0,r.kt)("td",null,"5.629010e-20"),(0,r.kt)("td",null,"7.488850e-13"),(0,r.kt)("td",null,"1.0")),(0,r.kt)("tr",null,(0,r.kt)("th",null,"2"),(0,r.kt)("td",null,"1.000000e-06"),(0,r.kt)("td",null,"10000.0"),(0,r.kt)("td",null,"10.0"),(0,r.kt)("td",null,"2.9287"),(0,r.kt)("td",null,"1.0"),(0,r.kt)("td",null,"1"),(0,r.kt)("td",null,"0.5"),(0,r.kt)("td",null,"5.646510e-12"),(0,r.kt)("td",null,"1.789080e-16"),(0,r.kt)("td",null,"4.219000e-18"),(0,r.kt)("td",null,"..."),(0,r.kt)("td",null,"1.631720e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000020e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"0.000182"),(0,r.kt)("td",null,"5.562330e-18"),(0,r.kt)("td",null,"7.444370e-12"),(0,r.kt)("td",null,"1.0")),(0,r.kt)("tr",null,(0,r.kt)("th",null,"3"),(0,r.kt)("td",null,"1.000000e-05"),(0,r.kt)("td",null,"10000.0"),(0,r.kt)("td",null,"10.0"),(0,r.kt)("td",null,"2.9287"),(0,r.kt)("td",null,"1.0"),(0,r.kt)("td",null,"1"),(0,r.kt)("td",null,"0.5"),(0,r.kt)("td",null,"5.641430e-11"),(0,r.kt)("td",null,"1.789520e-15"),(0,r.kt)("td",null,"4.212520e-16"),(0,r.kt)("td",null,"..."),(0,r.kt)("td",null,"7.762720e-29"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000050e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000010e-30"),(0,r.kt)("td",null,"0.000182"),(0,r.kt)("td",null,"5.554260e-16"),(0,r.kt)("td",null,"7.438940e-11"),(0,r.kt)("td",null,"1.0")),(0,r.kt)("tr",null,(0,r.kt)("th",null,"4"),(0,r.kt)("td",null,"1.000000e-04"),(0,r.kt)("td",null,"10000.0"),(0,r.kt)("td",null,"10.0"),(0,r.kt)("td",null,"2.9287"),(0,r.kt)("td",null,"1.0"),(0,r.kt)("td",null,"1"),(0,r.kt)("td",null,"0.5"),(0,r.kt)("td",null,"5.480630e-10"),(0,r.kt)("td",null,"1.793810e-14"),(0,r.kt)("td",null,"4.079690e-14"),(0,r.kt)("td",null,"..."),(0,r.kt)("td",null,"7.864380e-27"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000070e-30"),(0,r.kt)("td",null,"1.000000e-30"),(0,r.kt)("td",null,"1.000150e-30"),(0,r.kt)("td",null,"0.000182"),(0,r.kt)("td",null,"5.425070e-14"),(0,r.kt)("td",null,"7.351600e-10"),(0,r.kt)("td",null,"1.0")))),(0,r.kt)("p",null,"5 rows \xd7 321 columns")),(0,r.kt)("p",null,"We can also test whether the model run went well by checking for element conservation. We do this because integrator errors often show up as a failure to conserve elemental abundances. "),(0,r.kt)("p",null,"We can use ",(0,r.kt)("inlineCode",{parentName:"p"},"check_element_conservation()")," to test whether we conserve elements in this run. This function returns a dictionary where each entry gives the change in the total abundance of an element as a percentage of the original abundance. In an ideal case, these values are 0\\% indicating the total abundance at the end of the model is exactly the same as the total at the start."),(0,r.kt)("p",null,"Changes of less than 1\\% are fine for many cases but if they are too high, you could consider changing the ",(0,r.kt)("inlineCode",{parentName:"p"},"reltol")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"abstol")," parameters that control the integrator accuracy. They are error tolerance so smaller values lead to smaller errors and (usually) longer integration times. The default values were chosen by running a large grid of models and choosing the tolerances with the lowest average run time from those that conserved elements well and rarely failed. Despite this, there are no one-size-fits-all perfect tolerances and you may run into issues with different networks or models."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},'conservation=uclchem.analysis.check_element_conservation(result_df,element_list=["H","N","C","O","S"])\nprint("Percentage change in total abundances:")\nprint(conservation)\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"Percentage change in total abundances:\n{'H': '0.001%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%', 'S': '0.000%'}\n")),(0,r.kt)("h2",{id:"plotting-results"},"Plotting Results"),(0,r.kt)("p",null,"Finally, you will want to plot your results. This can be done with any plotting library but UCLCHEM does provide a few functions to make quick plots. Note the use of $ symbols in the species list below, this gets the total ice abundance of a species. For two phase models, this is just the surface abudance but for three phase it is the sum of surface and bulk."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},'species=["H","H2","$H","$H2","H2O","$H2O","CO","$CO","$CH3OH","CH3OH"]\nfig,ax=uclchem.analysis.create_abundance_plot(result_df,species,figsize=(10,7))\nax=ax.set(xscale="log",ylim=(1e-15,1),xlim=(1e3,1e6))\n')),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"png",src:n(7896).Z,width:"712",height:"496"})),(0,r.kt)("p",null,"and that's it! You've run your first UCLCHEM model, checked that the element conservation is correct, and plotted the abundances."))}k.isMDXComponent=!0},7896:(e,t,n)=>{n.d(t,{Z:()=>l});const l=n.p+"assets/images/first_model_9_0-fff8b0e800895dbb0e755cc2b9459720.png"}}]);