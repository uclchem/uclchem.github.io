"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3155],{6868:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>l,default:()=>o,frontMatter:()=>d,metadata:()=>r,toc:()=>c});var s=t(2540),i=t(8453);const d={},l="Running Your First Models",r={id:"first_model",title:"Running Your First Models",description:"In this notebook, we demonstrate the basic use of UCLCHEM's python module by running a simple model and then using the analysis functions to examine the output. Otherwise, it is identical to notebook 3.",source:"@site/versioned_docs/version-v3.4.0/1_first_model.md",sourceDirName:".",slug:"/first_model",permalink:"/docs/first_model",draft:!1,unlisted:!1,tags:[],version:"v3.4.0",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1728914606e3,sidebarPosition:1,frontMatter:{},sidebar:"docs",previous:{title:"Tutorials",permalink:"/docs/category/tutorials"},next:{title:"Advanced Physical Modelling",permalink:"/docs/2a_modelling_objects_on_disk"}},a={},c=[{value:"A Simple Cloud",id:"a-simple-cloud",level:2},{value:"Checking the output",id:"checking-the-output",level:2},{value:"Plotting Results",id:"plotting-results",level:2}];function h(e){const n={a:"a",annotation:"annotation",code:"code",h1:"h1",h2:"h2",header:"header",img:"img",math:"math",mi:"mi",mn:"mn",mo:"mo",mrow:"mrow",p:"p",pre:"pre",semantics:"semantics",span:"span",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"running-your-first-models",children:"Running Your First Models"})}),"\n",(0,s.jsx)(n.p,{children:"In this notebook, we demonstrate the basic use of UCLCHEM's python module by running a simple model and then using the analysis functions to examine the output. Otherwise, it is identical to notebook 3."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",children:"import uclchem\nimport os\n"})}),"\n",(0,s.jsx)(n.h2,{id:"a-simple-cloud",children:"A Simple Cloud"}),"\n",(0,s.jsxs)(n.p,{children:["UCLCHEM's ",(0,s.jsx)(n.code,{children:"cloud()"})," model is a spherical cloud of isothermal gas. We can keep a constant density or have it increase over time following a freefall equation. This model is generally useful whenever you want to model a homogeneous cloud of gas under constant conditions. For example, in the inner parts of a molecular cloud where Av ",(0,s.jsxs)(n.span,{className:"katex",children:[(0,s.jsx)(n.span,{className:"katex-mathml",children:(0,s.jsx)(n.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,s.jsxs)(n.semantics,{children:[(0,s.jsx)(n.mrow,{children:(0,s.jsx)(n.mo,{children:"\u2273"})}),(0,s.jsx)(n.annotation,{encoding:"application/x-tex",children:"\\gtrsim"})]})})}),(0,s.jsx)(n.span,{className:"katex-html","aria-hidden":"true",children:(0,s.jsxs)(n.span,{className:"base",children:[(0,s.jsx)(n.span,{className:"strut",style:{height:"0.9592em",verticalAlign:"-0.2296em"}}),(0,s.jsx)(n.span,{className:"mrel amsrm",children:"\u2273"})]})})]})," 10 there are very few depth dependent processes. You may wish to model the whole of this UV shielded portion of the cloud with a single ",(0,s.jsx)(n.code,{children:"cloud()"})," model."]}),"\n",(0,s.jsxs)(n.p,{children:["Due to the large number of parameters in a chemical model and the way fortran and python interaction, we find it is easiest to do parameter input through python dictionaries. In this block, we define param_dict which contains the parameters we wish to modify for this run. Every ",(0,s.jsx)(n.code,{children:"uclchem.model"})," function accepts a dictionary as an optional argument. Every parameter has a default value which is overriden if that parameter is specified in this dictionary. You can find a complete list of modifiable parameters and their default values in ",(0,s.jsx)(n.a,{href:"/docs/parameters",children:"our parameter docs"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",children:'# set a parameter dictionary for phase 1 collapse model\n\nout_species = ["SO", "CO"]\nparam_dict = {\n    "endAtFinalDensity": False,  # stop at finalTime\n    "freefall": False,  # don\'t increase density in freefall\n    "initialDens": 1e4,  # starting density\n    "initialTemp": 10.0,  # temperature of gas\n    "finalTime": 1.0e6,  # final time\n    "rout": 0.1,  # radius of cloud in pc\n    "baseAv": 1.0,  # visual extinction at cloud edge.\n    "outputFile": "../examples/test-output/static-full.dat",  # full UCLCHEM output\n    "abundSaveFile": "../examples/test-output/startstatic.dat",  # save final abundances to file\n}\n# Ensure the output directory is present:\nif not os.path.exists("../examples/test-output/"):\n    os.makedirs("../examples/test-output/")\n\nresult = uclchem.model.cloud(param_dict=param_dict, out_species=out_species)\nprint(result)\n'})}),"\n",(0,s.jsx)(n.p,{children:"[0, 5.924825663977233e-10, 2.502104177460157e-05]"}),"\n",(0,s.jsx)(n.h2,{id:"checking-the-output",children:"Checking the output"}),"\n",(0,s.jsxs)(n.p,{children:["At the end of the previous cell, we printed ",(0,s.jsx)(n.code,{children:"result"})," which is a list returned by every UCLCHEM model function. The first element is always an integer which will be positive if the code completed and negative otherwise. You can send negative values to ",(0,s.jsx)(n.code,{children:"uclchem.utils.check_error()"})," to get a more detailed error message."]}),"\n",(0,s.jsxs)(n.p,{children:["The subsequent elements are the final abundances of any species listed in ",(0,s.jsx)(n.code,{children:"out_species"}),", in this case we have the abundance of SO and CO. This is useful when we want to use UCLCHEM as part of something like an MCMC procedure, obtaining abundances for given parameters. However, we also write the final abundances of all species to ",(0,s.jsx)(n.code,{children:"abundSaveFile"})," and the abundances of all species at every time step in ",(0,s.jsx)(n.code,{children:"outputFile"})," so it is not necessary to acquire abundances in this way."]}),"\n",(0,s.jsx)(n.p,{children:"The output file is just a simple csv with some header rows, UCLCHEM has a utility function to read that file into a pandas dataframe. Let's load it up and look at it."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",children:'result_df = uclchem.analysis.read_output_file("../examples/test-output/static-full.dat")\nresult_df.head()\n'})}),"\n",(0,s.jsxs)("div",{children:[(0,s.jsxs)("table",{border:"1",class:"dataframe",children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{}),(0,s.jsx)("th",{children:"Time"}),(0,s.jsx)("th",{children:"Density"}),(0,s.jsx)("th",{children:"gasTemp"}),(0,s.jsx)("th",{children:"dustTemp"}),(0,s.jsx)("th",{children:"av"}),(0,s.jsx)("th",{children:"radfield"}),(0,s.jsx)("th",{children:"zeta"}),(0,s.jsx)("th",{children:"point"}),(0,s.jsx)("th",{children:"H"}),(0,s.jsx)("th",{children:"#H"}),(0,s.jsx)("th",{children:"..."}),(0,s.jsx)("th",{children:"HOSO+"}),(0,s.jsx)("th",{children:"#HS2"}),(0,s.jsx)("th",{children:"@HS2"}),(0,s.jsx)("th",{children:"H2S2+"}),(0,s.jsx)("th",{children:"H2S2"}),(0,s.jsx)("th",{children:"#H2S2"}),(0,s.jsx)("th",{children:"@H2S2"}),(0,s.jsx)("th",{children:"E-"}),(0,s.jsx)("th",{children:"BULK"}),(0,s.jsx)("th",{children:"SURFACE"})]})}),(0,s.jsxs)("tbody",{children:[(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"0"}),(0,s.jsx)("td",{children:"0.000000e+00"}),(0,s.jsx)("td",{children:"10000.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"2.9287"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1"}),(0,s.jsx)("td",{children:"0.5"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"..."}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"0.000182"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"1"}),(0,s.jsx)("td",{children:"1.000000e-07"}),(0,s.jsx)("td",{children:"10000.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"2.9287"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1"}),(0,s.jsx)("td",{children:"0.5"}),(0,s.jsx)("td",{children:"5.680300e-13"}),(0,s.jsx)("td",{children:"..."}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"0.000182"}),(0,s.jsx)("td",{children:"5.613460e-20"}),(0,s.jsx)("td",{children:"7.478490e-13"})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"2"}),(0,s.jsx)("td",{children:"1.000000e-06"}),(0,s.jsx)("td",{children:"10000.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"2.9287"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1"}),(0,s.jsx)("td",{children:"0.5"}),(0,s.jsx)("td",{children:"5.646500e-12"}),(0,s.jsx)("td",{children:"..."}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000010e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"0.000182"}),(0,s.jsx)("td",{children:"5.546840e-18"}),(0,s.jsx)("td",{children:"7.434010e-12"})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"3"}),(0,s.jsx)("td",{children:"1.000000e-05"}),(0,s.jsx)("td",{children:"10000.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"2.9287"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1"}),(0,s.jsx)("td",{children:"0.5"}),(0,s.jsx)("td",{children:"5.641420e-11"}),(0,s.jsx)("td",{children:"..."}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000010e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000010e-30"}),(0,s.jsx)("td",{children:"1.000090e-30"}),(0,s.jsx)("td",{children:"1.000010e-30"}),(0,s.jsx)("td",{children:"0.000182"}),(0,s.jsx)("td",{children:"5.538790e-16"}),(0,s.jsx)("td",{children:"7.428570e-11"})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"4"}),(0,s.jsx)("td",{children:"1.000000e-04"}),(0,s.jsx)("td",{children:"10000.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"10.0"}),(0,s.jsx)("td",{children:"2.9287"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1.0"}),(0,s.jsx)("td",{children:"1"}),(0,s.jsx)("td",{children:"0.5"}),(0,s.jsx)("td",{children:"5.480700e-10"}),(0,s.jsx)("td",{children:"..."}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000150e-30"}),(0,s.jsx)("td",{children:"1.000000e-30"}),(0,s.jsx)("td",{children:"1.000020e-30"}),(0,s.jsx)("td",{children:"1.010820e-30"}),(0,s.jsx)("td",{children:"1.000150e-30"}),(0,s.jsx)("td",{children:"0.000182"}),(0,s.jsx)("td",{children:"5.409890e-14"}),(0,s.jsx)("td",{children:"7.341300e-10"})]})]})]}),(0,s.jsx)("p",{children:"5 rows \xd7 343 columns"})]}),"\n",(0,s.jsx)(n.p,{children:"We can also test whether the model run went well by checking for element conservation. We do this because integrator errors often show up as a failure to conserve elemental abundances."}),"\n",(0,s.jsxs)(n.p,{children:["We can use ",(0,s.jsx)(n.code,{children:"check_element_conservation()"})," to test whether we conserve elements in this run. This function returns a dictionary where each entry gives the change in the total abundance of an element as a percentage of the original abundance. In an ideal case, these values are 0% indicating the total abundance at the end of the model is exactly the same as the total at the start."]}),"\n",(0,s.jsxs)(n.p,{children:["Changes of less than 1% are fine for many cases but if they are too high, you could consider changing the ",(0,s.jsx)(n.code,{children:"reltol"})," and ",(0,s.jsx)(n.code,{children:"abstol"})," parameters that control the integrator accuracy. They are error tolerance so smaller values lead to smaller errors and (usually) longer integration times. The default values were chosen by running a large grid of models and choosing the tolerances with the lowest average run time from those that conserved elements well and rarely failed. Despite this, there are no one-size-fits-all perfect tolerances and you may run into issues with different networks or models."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",children:'conservation = uclchem.analysis.check_element_conservation(\n    result_df, element_list=["H", "N", "C", "O", "S"]\n)\nprint("Percentage change in total abundances:")\nprint(conservation)\n'})}),"\n",(0,s.jsx)(n.p,{children:"Percentage change in total abundances:\n{'H': '0.000%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%', 'S': '0.000%'}"}),"\n",(0,s.jsx)(n.h2,{id:"plotting-results",children:"Plotting Results"}),"\n",(0,s.jsx)(n.p,{children:"Finally, you will want to plot your results. This can be done with any plotting library but UCLCHEM does provide a few functions to make quick plots. Note the use of $ symbols in the species list below, this gets the total ice abundance of a species. For two phase models, this is just the surface abudance but for three phase it is the sum of surface and bulk."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",children:'species = ["H", "H2", "$H", "$H2", "H2O", "$H2O", "CO", "$CO", "$CH3OH", "CH3OH"]\nfig, ax = uclchem.analysis.create_abundance_plot(result_df, species, figsize=(10, 7))\nax = ax.set(xscale="log", ylim=(1e-15, 1), xlim=(1e3, 1e6))\n'})}),"\n",(0,s.jsxs)(n.p,{children:["H\nH2\n",(0,s.jsxs)(n.span,{className:"katex",children:[(0,s.jsx)(n.span,{className:"katex-mathml",children:(0,s.jsx)(n.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,s.jsxs)(n.semantics,{children:[(0,s.jsx)(n.mrow,{children:(0,s.jsx)(n.mi,{children:"H"})}),(0,s.jsx)(n.annotation,{encoding:"application/x-tex",children:"H\n    "})]})})}),(0,s.jsx)(n.span,{className:"katex-html","aria-hidden":"true",children:(0,s.jsxs)(n.span,{className:"base",children:[(0,s.jsx)(n.span,{className:"strut",style:{height:"0.6833em"}}),(0,s.jsx)(n.span,{className:"mord mathnormal",style:{marginRight:"0.08125em"},children:"H"})]})})]}),"H2\nH2O\n",(0,s.jsxs)(n.span,{className:"katex",children:[(0,s.jsx)(n.span,{className:"katex-mathml",children:(0,s.jsx)(n.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,s.jsxs)(n.semantics,{children:[(0,s.jsxs)(n.mrow,{children:[(0,s.jsx)(n.mi,{children:"H"}),(0,s.jsx)(n.mn,{children:"2"}),(0,s.jsx)(n.mi,{children:"O"}),(0,s.jsx)(n.mi,{children:"C"}),(0,s.jsx)(n.mi,{children:"O"})]}),(0,s.jsx)(n.annotation,{encoding:"application/x-tex",children:"H2O\n    CO\n    "})]})})}),(0,s.jsx)(n.span,{className:"katex-html","aria-hidden":"true",children:(0,s.jsxs)(n.span,{className:"base",children:[(0,s.jsx)(n.span,{className:"strut",style:{height:"0.6833em"}}),(0,s.jsx)(n.span,{className:"mord mathnormal",style:{marginRight:"0.08125em"},children:"H"}),(0,s.jsx)(n.span,{className:"mord",children:"2"}),(0,s.jsx)(n.span,{className:"mord mathnormal",style:{marginRight:"0.02778em"},children:"OCO"})]})})]}),"CO\n$CH3OH\nCH3OH"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"png",src:t(3978).A+"",width:"990",height:"690"})}),"\n",(0,s.jsx)(n.p,{children:"and that's it! You've run your first UCLCHEM model, checked that the element conservation is correct, and plotted the abundances."})]})}function o(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},3978:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/1_first_model_9_1-b2b08363a579d6bf4a23b4f6dbfb9663.png"},8453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>r});var s=t(3696);const i={},d=s.createContext(i);function l(e){const n=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),s.createElement(d.Provider,{value:n},e.children)}}}]);