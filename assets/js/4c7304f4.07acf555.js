"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[2764],{3905:(e,t,l)=>{l.d(t,{Zo:()=>d,kt:()=>m});var n=l(7294);function r(e,t,l){return t in e?Object.defineProperty(e,t,{value:l,enumerable:!0,configurable:!0,writable:!0}):e[t]=l,e}function a(e,t){var l=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),l.push.apply(l,n)}return l}function o(e){for(var t=1;t<arguments.length;t++){var l=null!=arguments[t]?arguments[t]:{};t%2?a(Object(l),!0).forEach((function(t){r(e,t,l[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(l)):a(Object(l)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(l,t))}))}return e}function s(e,t){if(null==e)return{};var l,n,r=function(e,t){if(null==e)return{};var l,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)l=a[n],t.indexOf(l)>=0||(r[l]=e[l]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)l=a[n],t.indexOf(l)>=0||Object.prototype.propertyIsEnumerable.call(e,l)&&(r[l]=e[l])}return r}var i=n.createContext({}),u=function(e){var t=n.useContext(i),l=t;return e&&(l="function"==typeof e?e(t):o(o({},t),e)),l},d=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var l=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=u(l),m=r,k=p["".concat(i,".").concat(m)]||p[m]||c[m]||a;return l?n.createElement(k,o(o({ref:t},d),{},{components:l})):n.createElement(k,o({ref:t},d))}));function m(e,t){var l=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=l.length,o=new Array(a);o[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var u=2;u<a;u++)o[u]=l[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,l)}p.displayName="MDXCreateElement"},7544:(e,t,l)=>{l.r(t),l.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>m,frontMatter:()=>s,metadata:()=>u,toc:()=>c});var n=l(7462),r=l(3366),a=(l(7294),l(3905)),o=["components"],s={},i="Running a Grid",u={unversionedId:"running_a_grid",id:"running_a_grid",title:"Running a Grid",description:"A common task is to run UCLCHEM over a grid of parameter combinations. This notebook sets up a simple approach to doing so for regular grids.",source:"@site/docs/running_a_grid.md",sourceDirName:".",slug:"/running_a_grid",permalink:"/docs/running_a_grid",tags:[],version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1651678755,formattedLastUpdatedAt:"5/4/2022",frontMatter:{},sidebar:"docs",previous:{title:"Advanced Physical Modelling",permalink:"/docs/modelling_objects"},next:{title:"Chemical Analysis",permalink:"/docs/chemical_analysis"}},d={},c=[{value:"A Simple Grid",id:"a-simple-grid",level:2},{value:"Define Parameter Space",id:"define-parameter-space",level:3},{value:"Set up the model",id:"set-up-the-model",level:3},{value:"Run Grid",id:"run-grid",level:3},{value:"The Simple Way",id:"the-simple-way",level:4},{value:"The Fast Way",id:"the-fast-way",level:4},{value:"Checking Your Grid",id:"checking-your-grid",level:2},{value:"Complex Grid",id:"complex-grid",level:2},{value:"Summary",id:"summary",level:2}],p={toc:c};function m(e){var t=e.components,l=(0,r.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},p,l,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"running-a-grid"},"Running a Grid"),(0,a.kt)("p",null,"A common task is to run UCLCHEM over a grid of parameter combinations. This notebook sets up a simple approach to doing so for regular grids."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"import uclchem\nimport numpy as np\nimport pandas as pd\nfrom multiprocessing import Pool\nimport os\n")),(0,a.kt)("h2",{id:"a-simple-grid"},"A Simple Grid"),(0,a.kt)("h3",{id:"define-parameter-space"},"Define Parameter Space"),(0,a.kt)("p",null,"First, we define our parameter space. We do this by using numpy and pandas to produce a table of all possible combinations of some parameters of interest."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'# This part can be substituted with any choice of grid\n#here we just vary the density, temperature and zeta \ntemperatures = np.linspace(10, 50, 3)\ndensities = np.logspace(4,6,3)\nzetas = np.logspace(1, 3, 3)\n\n#meshgrid will give all combinations, then we shape into columns and put into a table\nparameterSpace = np.asarray(np.meshgrid(temperatures,densities,zetas)).reshape(3, -1)\nmodel_table=pd.DataFrame(parameterSpace.T, columns=[\'temperature\',\'density\',\'zeta\'])\n\n#keep track of where each model output will be saved and make sure that folder exists\nmodel_table["outputFile"]=model_table.apply(lambda row: f"../grid_folder/{row.temperature}_{row.density}_{row.zeta}.csv", axis=1)\nprint(f"{model_table.shape[0]} models to run")\nif not os.path.exists("../grid_folder"):\n    os.makedirs("../grid_folder")\n')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"27 models to run\n")),(0,a.kt)("h3",{id:"set-up-the-model"},"Set up the model"),(0,a.kt)("p",null,"Next, we need a function that will run our model. We write a quick function that takes a row from our dataframe and uses it to populate a parameter dictionary for UCLCHEM and then run a cloud model. We can then map our dataframe to that function."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'def run_model(row):\n    #basic set of parameters we\'ll use for this grid. \n    ParameterDictionary = {"endatfinaldensity":False,\n                           "freefall": False,\n                           "initialDens": row.density,\n                           "initialTemp": row.temperature,\n                           "zeta": row.zeta,\n                           "outputFile": row.outputFile,\n                           "finalTime":1.0e6,\n                           "baseAv":10}\n    result = uclchem.model.cloud(param_dict=ParameterDictionary)\n    return result[0]#just the integer error code\n')),(0,a.kt)("h3",{id:"run-grid"},"Run Grid"),(0,a.kt)("h4",{id:"the-simple-way"},"The Simple Way"),(0,a.kt)("p",null,"We can use pandas apply to simply pass each row to our helper function in turn. This will take some time since we're running the models one by one. I'll use the ",(0,a.kt)("inlineCode",{parentName:"p"},"head")," function just to run five rows as an example here."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"result=model_table.head().apply(run_model, axis=1)\n")),(0,a.kt)("h4",{id:"the-fast-way"},"The Fast Way"),(0,a.kt)("p",null,"Alternatively, we can use multiprocessing to run the models in parallel. That will allow us to run many models simulataneously and make use of all the cores available on our machine."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"def pool_func(x):\n    i,row=x\n    return run_model(row)\n\nwith Pool(processes=6) as pool:\n    results = pool.map(pool_func, model_table.iterrows())\n")),(0,a.kt)("h2",{id:"checking-your-grid"},"Checking Your Grid"),(0,a.kt)("p",null,"After running, we should do two things. First, let's add ",(0,a.kt)("inlineCode",{parentName:"p"},"results")," to our dataframe as a new column. Positive results mean a successful UCLCHEM run and negative ones are unsuccessful. Then we can run each model through ",(0,a.kt)("inlineCode",{parentName:"p"},"check_element_conservation")," to check the integration was successful. We'll use both these things to flag models that failed in some way."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"def element_check(output_file):\n    df=uclchem.analysis.read_output_file(output_file)\n    #get conservation values\n    conserves=uclchem.analysis.check_element_conservation(df)\n    #check if any error is greater than 1%\n    return all([float(x[:-1])<1 for x in conserves.values()])\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'model_table["run_result"]=results\nmodel_table["elements_conserved"]=model_table["outputFile"].map(element_check)\n#check both conditions are met\nmodel_table["Successful"]=(model_table.run_result>=0) & (model_table.elements_conserved)\n')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"model_table.head()\n")),(0,a.kt)("div",null,(0,a.kt)("table",{border:"1",class:"dataframe"},(0,a.kt)("thead",null,(0,a.kt)("tr",null,(0,a.kt)("th",null),(0,a.kt)("th",null,"temperature"),(0,a.kt)("th",null,"density"),(0,a.kt)("th",null,"zeta"),(0,a.kt)("th",null,"outputFile"),(0,a.kt)("th",null,"run_result"),(0,a.kt)("th",null,"elements_conserved"),(0,a.kt)("th",null,"Successful"))),(0,a.kt)("tbody",null,(0,a.kt)("tr",null,(0,a.kt)("th",null,"0"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"../grid_folder/10.0_10000.0_10.0.csv"),(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"True"),(0,a.kt)("td",null,"True")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"1"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"100.0"),(0,a.kt)("td",null,"../grid_folder/10.0_10000.0_100.0.csv"),(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"True"),(0,a.kt)("td",null,"True")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"2"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"1000.0"),(0,a.kt)("td",null,"../grid_folder/10.0_10000.0_1000.0.csv"),(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"True"),(0,a.kt)("td",null,"True")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"3"),(0,a.kt)("td",null,"30.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"../grid_folder/30.0_10000.0_10.0.csv"),(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"True"),(0,a.kt)("td",null,"True")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"4"),(0,a.kt)("td",null,"30.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"100.0"),(0,a.kt)("td",null,"../grid_folder/30.0_10000.0_100.0.csv"),(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"True"),(0,a.kt)("td",null,"True"))))),(0,a.kt)("h2",{id:"complex-grid"},"Complex Grid"),(0,a.kt)("p",null,"The above was straightforward enough but what about a modelling a grid of shocks? Not only do we want to loop over relevant parameters, we also need to run a few preliminary models to give ourselves starting abundances. We'll start by defining two helper functions, one to run our preliminary cloud and one to run the shock."),(0,a.kt)("p",null,"Let's further imagine that we want to obtain the abundances of several species at the end of the model. We can use the ",(0,a.kt)("inlineCode",{parentName:"p"},"out_species")," parameter to specify which species we want to track and return them to our dataframe."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'out_species=["CO","H2O","CH3OH"]\n\ndef run_prelim(density):\n    #basic set of parameters we\'ll use for this grid. \n    ParameterDictionary = {"endatfinaldensity":True,\n                           "freefall": True,\n                           "initialDens":1e2,\n                           "finalDens": density,\n                           "initialTemp": 10.0,\n                           "abundSaveFile": f"../grid_folder/starts/{density:.0f}.csv",\n                           "baseAv":1}\n    result = uclchem.model.cloud(param_dict=ParameterDictionary)\n    return result\n\ndef run_model(row):\n    i,row=row # we know we\'re receiving the iterrows() tuple\n    #basic set of parameters we\'ll use for this grid. \n    ParameterDictionary = {"endatfinaldensity":False,\n                           "freefall": False,\n                           "initialDens": row.density,\n                           "initialTemp": 10.0,\n                           "outputFile": row.outputFile,\n                            "abundSaveFile": f"../grid_folder/starts/{row.density:.0f}.csv",\n                           "finalTime":1.0e5,\n                           "baseAv":1}\n    result = uclchem.model.cshock(row.shock_velocity,param_dict=ParameterDictionary,out_species=out_species)\n    #First check UCLCHEM\'s result flag to seeif it\'s positive, if it is return the abundances\n    if result[0]>0:\n        return result[:]\n    #if not, return NaNs because model failed\n    else:\n        return([np.nan]*len(out_species))\n')),(0,a.kt)("p",null,"Then we define our parameter space again. We'll create two folders, one to store a set of initial abundances for each starting density in our model and another to store our shock outputs."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'# This part can be substituted with any choice of grid\n# here we just combine various initial and final densities into an easily iterable array\nshock_velocities = np.linspace(10, 50, 3)\ndensities = np.logspace(4,6,3)\n\nparameterSpace = np.asarray(np.meshgrid(shock_velocities,densities)).reshape(2, -1)\nmodel_table=pd.DataFrame(parameterSpace.T, columns=[\'shock_velocity\',\'density\'])\nmodel_table["outputFile"]=model_table.apply(lambda row: f"../grid_folder/shocks/{row.shock_velocity}_{row.density}.csv", axis=1)\nprint(f"{model_table.shape[0]} models to run")\n\nfor folder in ["starts","shocks"]:\n    if not os.path.exists(f"../grid_folder/{folder}"):\n        os.makedirs(f"../grid_folder/{folder}")\n')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"9 models to run\n")),(0,a.kt)("p",null,"We can then run our preliminary models followed by our science models. The science models will return the abundances at the final time step of each run so we can unpack those directly to our dataframe."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"with Pool(processes=3) as pool:\n    results = pool.map(run_prelim, densities)\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'with Pool(processes=3) as pool:\n    results = pool.map(run_model, model_table.iterrows())\nmodel_table[["Dissipation Time"]+out_species]=results\n')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"model_table\n")),(0,a.kt)("div",null,(0,a.kt)("table",{border:"1",class:"dataframe"},(0,a.kt)("thead",null,(0,a.kt)("tr",null,(0,a.kt)("th",null),(0,a.kt)("th",null,"shock_velocity"),(0,a.kt)("th",null,"density"),(0,a.kt)("th",null,"outputFile"),(0,a.kt)("th",null,"Dissipation Time"),(0,a.kt)("th",null,"CO"),(0,a.kt)("th",null,"H2O"),(0,a.kt)("th",null,"CH3OH"))),(0,a.kt)("tbody",null,(0,a.kt)("tr",null,(0,a.kt)("th",null,"0"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/10.0_10000.0.csv"),(0,a.kt)("td",null,"1171.898734"),(0,a.kt)("td",null,"6.165653e-05"),(0,a.kt)("td",null,"2.956789e-06"),(0,a.kt)("td",null,"1.926991e-07")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"1"),(0,a.kt)("td",null,"30.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/30.0_10000.0.csv"),(0,a.kt)("td",null,"1171.898734"),(0,a.kt)("td",null,"2.354338e-05"),(0,a.kt)("td",null,"2.806336e-05"),(0,a.kt)("td",null,"1.885733e-08")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"2"),(0,a.kt)("td",null,"50.0"),(0,a.kt)("td",null,"10000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/50.0_10000.0.csv"),(0,a.kt)("td",null,"1171.898734"),(0,a.kt)("td",null,"1.629821e-05"),(0,a.kt)("td",null,"8.577171e-06"),(0,a.kt)("td",null,"1.808968e-08")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"3"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"100000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/10.0_100000.0.csv"),(0,a.kt)("td",null,"117.189873"),(0,a.kt)("td",null,"7.052087e-08"),(0,a.kt)("td",null,"9.284287e-10"),(0,a.kt)("td",null,"5.432348e-10")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"4"),(0,a.kt)("td",null,"30.0"),(0,a.kt)("td",null,"100000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/30.0_100000.0.csv"),(0,a.kt)("td",null,"117.189873"),(0,a.kt)("td",null,"5.367310e-11"),(0,a.kt)("td",null,"3.222560e-10"),(0,a.kt)("td",null,"3.419077e-10")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"5"),(0,a.kt)("td",null,"50.0"),(0,a.kt)("td",null,"100000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/50.0_100000.0.csv"),(0,a.kt)("td",null,"117.189873"),(0,a.kt)("td",null,"2.180494e-10"),(0,a.kt)("td",null,"3.432564e-10"),(0,a.kt)("td",null,"6.395643e-10")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"6"),(0,a.kt)("td",null,"10.0"),(0,a.kt)("td",null,"1000000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/10.0_1000000.0.csv"),(0,a.kt)("td",null,"11.718987"),(0,a.kt)("td",null,"2.126896e-10"),(0,a.kt)("td",null,"1.080413e-10"),(0,a.kt)("td",null,"1.445622e-11")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"7"),(0,a.kt)("td",null,"30.0"),(0,a.kt)("td",null,"1000000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/30.0_1000000.0.csv"),(0,a.kt)("td",null,"11.718987"),(0,a.kt)("td",null,"1.475333e-10"),(0,a.kt)("td",null,"6.466679e-11"),(0,a.kt)("td",null,"2.397719e-12")),(0,a.kt)("tr",null,(0,a.kt)("th",null,"8"),(0,a.kt)("td",null,"50.0"),(0,a.kt)("td",null,"1000000.0"),(0,a.kt)("td",null,"../grid_folder/shocks/50.0_1000000.0.csv"),(0,a.kt)("td",null,"11.718987"),(0,a.kt)("td",null,"2.539663e-10"),(0,a.kt)("td",null,"4.372364e-12"),(0,a.kt)("td",null,"2.132736e-12"))))),(0,a.kt)("h2",{id:"summary"},"Summary"),(0,a.kt)("p",null,"There are many ways to run grids of models and users will naturally develop their own methods. This notebook is just a simple example of how to run UCLCHEM for many parameter combinations whilst producing a useful output (the model_table) to keep track of all the combinations that were run. In a real script, we'd save the model file to csv at the end."),(0,a.kt)("p",null,"For much larger grids, it's recommended that you find a way to make your script robust to failure. Over a huge range of parameters, it is quite likely UCLCHEM will hit integration trouble for at least a few parameter combinations. Very occasionally, UCLCHEM will get caught in a loop where it fails to integrate and cannot adjust its strategy to manage it. This isn't a problem for small grids as the model can be stopped and the tolerances adjusted. However, for very large grids, you may end up locking all threads as they each get stuck on a different model. The best solution we've found for this case is to add a check so that models in your dataframe are skipped if their file already exists, this allows you to stop and restart the grid script as needed."))}m.isMDXComponent=!0}}]);