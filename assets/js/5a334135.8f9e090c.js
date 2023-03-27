"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7950],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=c(n),g=o,f=d["".concat(s,".").concat(g)]||d[g]||p[g]||a;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8797:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>g,frontMatter:()=>l,metadata:()=>c,toc:()=>p});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],l={id:"trouble-integration",title:"Integration"},s=void 0,c={unversionedId:"trouble-integration",id:"version-v3.2.0/trouble-integration",title:"Integration",description:"My code just keeps running",source:"@site/versioned_docs/version-v3.2.0/trouble-integration.md",sourceDirName:".",slug:"/trouble-integration",permalink:"/docs/trouble-integration",tags:[],version:"v3.2.0",frontMatter:{id:"trouble-integration",title:"Integration"},sidebar:"docs",previous:{title:"Compilation Issues",permalink:"/docs/trouble-compile"},next:{title:"Core Physics",permalink:"/docs/physics-core"}},u={},p=[{value:"My code just keeps running",id:"my-code-just-keeps-running",level:2},{value:"Crashing/Stalling Model Runs",id:"crashingstalling-model-runs",level:2}],d={toc:p};function g(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"my-code-just-keeps-running"},"My code just keeps running"),(0,a.kt)("p",null,"If you're working in jupyter notebooks, fortran output will often not be printed to the cell outputs until the cell finishes running. This can be a real problem if the integration is failing because UCLCHEM may be printing warnings to the screen but you won't see them. If your code is running for a few minutes in a notebook, you may want to export the code to a python script and run it. The uclchem output will print to the console and you will see the integration errors piling up."),(0,a.kt)("h2",{id:"crashingstalling-model-runs"},"Crashing/Stalling Model Runs"),(0,a.kt)("p",null,"Chemical ODEs are infamously stiff and, as such, difficult to solve. There's also no single solver configuration we can use that will guarantee an efficient and accurate solution to every single problem. In particular, if you have a very large network or one with very fast reactions, you may find the integrator stuggles. "),(0,a.kt)("p",null,'You\'ll know the integrator is struggling if you find you get a lot of printed messages stating "ISTATE = -n" (where n is some integer). If the model run completes and there is nothing obviously wrong (eg oscillations) then its likely the solution is fine and your network/parameter combination is at the edge of what the solver can handle. If it takes a very long time or never completes, there is an issue.'),(0,a.kt)("p",null,"One good method to check the validity of your solution is to use the element conservation functions in the ",(0,a.kt)("a",{parentName:"p",href:"/docs/pythonapi#uclchem.analysis.check_element_conservation"},"python module"),". The integrator typically fails to conserve elemental abundances when the integration has accumulated too large an error. Thus, checking for conservation can reassure you that the integration was successful even if the integrator struggled."),(0,a.kt)("p",null,"To fix this, your first port of call should be the ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol_factor"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol_min")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"reltol")," parameters. The comments in ",(0,a.kt)("inlineCode",{parentName:"p"},"src/fortran_src/dvode.f90")," give a fantastic overview of the integrator but in essence, DVODE takes two parameters: ",(0,a.kt)("inlineCode",{parentName:"p"},"reltol")," should set the decimal place accuracy of your abundances and ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol")," the overall error you'll accept. In UCLCHEM, reltol is just a number but we use DVODE's option of making ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol")," a vector with one value per species instead of a single value. This allows us to change the error tolerance depending on the species abundances. ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol")," will take the value of ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol_factor")," times the species abundance or ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol_min"),", whichever is larger."),(0,a.kt)("p",null,"Changing the tolerances is a dark art and it isn't necessarily the case that smaller values = more accuracy and larger values = faster integration. Trying a few values (particularly of ",(0,a.kt)("inlineCode",{parentName:"p"},"abstol_factor"),") is always a good first step when you hit integrator problems."),(0,a.kt)("p",null,"If that doesn't work, you should investigate whether your network is reasonable. Duplicated reactions and bad rate coefficients can result in reactions going too quickly and breaking the integrator."))}g.isMDXComponent=!0}}]);