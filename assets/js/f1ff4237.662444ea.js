"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4910],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(n),h=a,m=d["".concat(l,".").concat(h)]||d[h]||p[h]||o;return n?r.createElement(m,i(i({ref:t},c),{},{components:n})):r.createElement(m,i({ref:t},c))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1090:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],s={id:"dev-python-wrap",title:"Writing The Python Interface"},l=void 0,u={unversionedId:"dev-python-wrap",id:"version-v3.3.1/dev-python-wrap",title:"Writing The Python Interface",description:"The python interface is a relatively complex bit of code, a lot of work is put on the development side to make the user side a smooth experience. Writing the core of UCLCHEM in Fortran gives great performance benefits but compiling it to python with F2PY has its peculiarities. Here, we discuss the steps needed to adjust the code.",source:"@site/versioned_docs/version-v3.3.1/dev-python-wrap.md",sourceDirName:".",slug:"/dev-python-wrap",permalink:"/docs/dev-python-wrap",draft:!1,tags:[],version:"v3.3.1",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1697189829,formattedLastUpdatedAt:"Oct 13, 2023",frontMatter:{id:"dev-python-wrap",title:"Writing The Python Interface"},sidebar:"docs",previous:{title:"Overview of the Code",permalink:"/docs/dev-overview"},next:{title:"Debugging",permalink:"/docs/dev-debugging"}},c={},p=[{value:"The Fortran Side",id:"the-fortran-side",level:2},{value:"The Python Side",id:"the-python-side",level:2},{value:"Tips and Tricks",id:"tips-and-tricks",level:2}],d={toc:p};function h(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The python interface is a relatively complex bit of code, a lot of work is put on the development side to make the user side a smooth experience. Writing the core of UCLCHEM in Fortran gives great performance benefits but compiling it to python with F2PY has its peculiarities. Here, we discuss the steps needed to adjust the code."),(0,o.kt)("h2",{id:"the-fortran-side"},"The Fortran Side"),(0,o.kt)("p",null,"The fortran side is the more difficult. We define a module in ",(0,o.kt)("inlineCode",{parentName:"p"},"src/fortran_src/wrap.f90")," which is a Fortran module that F2PY will turn into a python module. Any subroutine declared in ",(0,o.kt)("inlineCode",{parentName:"p"},"wrap.f90")," will become a function in the Python module."),(0,o.kt)("p",null,"The most likely change you'll want to make is to add a physics module so we'll look at cloud as an example. In ",(0,o.kt)("inlineCode",{parentName:"p"},"wrap.f90")," cloud is declared:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-fortran"},"    SUBROUTINE cloud(dictionary, outSpeciesIn,abundance_out,successFlag)\n        USE cloud_mod\n\n        CHARACTER(LEN=*) :: dictionary, outSpeciesIn\n        DOUBLE PRECISION :: abundance_out(500)\n        INTEGER :: successFlag\n        !f2py intent(in) dictionary,outSpeciesIn\n        !f2py intent(out) abundance_out,successFlag\n        ...\n    END SUBROUTINE\n")),(0,o.kt)("p",null,"where we've dropped the bulk of the code since we only care about the declaration. Once compiled, you will be able to call this function using ",(0,o.kt)("inlineCode",{parentName:"p"},"uclchem.wrap.cloud(dictionary,outSpeciesIn)"),"."),(0,o.kt)("p",null,"This works because we've done two things. First, we've declared both the two inputs and the two outputs as arguments in Fortran in the normal way. Both inputs and outputs of a subroutine are declared as arguments in Fortran, usually with an ",(0,o.kt)("inlineCode",{parentName:"p"},"INTENT(IN)")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"INTENT(OUT)")," statement, although that is unnecessary. We then declare the intent of those argument for F2PY using the comments that start ",(0,o.kt)("inlineCode",{parentName:"p"},"!f2py")," to tell F2PY which arguments should be arguments of the corresponding python function and which should be outputs."),(0,o.kt)("h2",{id:"the-python-side"},"The Python Side"),(0,o.kt)("p",null,"We could leave it at that. However, for ease of use, we write pure python functions in the uclchem module which call the underlying wrap functions rather than having users directly access the f2py functions. For example, in ",(0,o.kt)("inlineCode",{parentName:"p"},"uclchem.model"),", we define a cloud function which calls ",(0,o.kt)("inlineCode",{parentName:"p"},"wrap.cloud"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-python"},'\ndef cloud(param_dict=None, out_species=None):\n    """Run cloud model from UCLCHEM\n\n    Args:\n        param_dict (dict,optional): A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.\n        out_species (list, optional): A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.\n\n    Returns:\n        int,list: A integer which is negative if the model failed to run, or a list of abundances of all species in `outSpecies`\n    """\n    n_out,param_dict,out_species=_reform_inputs(param_dict,out_species)\n    abunds, success_flag = wrap.cloud(dictionary=param_dict, outspeciesin=out_species)\n    if success_flag < 0 or n_out == 0:\n        return success_flag\n    else:\n        return abunds[: n_out]\n')),(0,o.kt)("p",null,"This allows us to make some arguments optional using python's keyword arguments. It also lets us write docstrings from which we can generate documentation for the functions. Finally, it lets us tidy up the output! For example, arrays passed too and from the Fortran subroutines must be of fixed length so in this function, we cut the output abundance array down to just the elements the user actually wanted."),(0,o.kt)("h2",{id:"tips-and-tricks"},"Tips and Tricks"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Once imported, all values are initialized in UCLCHEM. Calling a subroutine multiple times does not reset variables. That is to say that if your Fortran modules declare variables with an initial value, those variables will not return to those initial values. Instead, you'll notice all our modules reset their variables manually in the initialize functions such as initializePhysics.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Debugging your fortran code can be greatly complicated by the F2PY interface. Consider compiling the fortran source to test any code changes before trying to compile the python version.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Python handles errors much more gracefully than Fortran. We have tried to use ",(0,o.kt)("inlineCode",{parentName:"p"},"successFlag")," as a return from most subroutines as a way to tell Python that the Fortran run failed. It can be a pain to set up the chain of successFlag returns from modules in Fortran but if you use something like Fortran's ",(0,o.kt)("inlineCode",{parentName:"p"},"STOP"),", you'll likely kill your python in a way that won't let you use ",(0,o.kt)("inlineCode",{parentName:"p"},"try:, except:")," statements to handle it."))))}h.isMDXComponent=!0}}]);