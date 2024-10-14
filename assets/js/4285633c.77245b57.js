"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5649],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>h});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),u=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return o.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(n),h=r,m=d["".concat(s,".").concat(h)]||d[h]||p[h]||a;return n?o.createElement(m,i(i({ref:t},c),{},{components:n})):o.createElement(m,i({ref:t},c))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var u=2;u<a;u++)i[u]=n[u];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1693:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>l,metadata:()=>u,toc:()=>p});var o=n(7462),r=n(3366),a=(n(7294),n(3905)),i=["components"],l={id:"dev-debugging",title:"Debugging"},s=void 0,u={unversionedId:"dev-debugging",id:"version-v3.4.0/dev-debugging",title:"Debugging",description:"UCLCHEM is a complex code and many things can go wrong. Here, we'll list some of the things that often go wrong when you modify the code as well as a few helpful steps to trace down bugs.",source:"@site/versioned_docs/version-v3.4.0/dev-debugging.md",sourceDirName:".",slug:"/dev-debugging",permalink:"/docs/dev-debugging",draft:!1,tags:[],version:"v3.4.0",frontMatter:{id:"dev-debugging",title:"Debugging"},sidebar:"docs",previous:{title:"Writing The Python Interface",permalink:"/docs/dev-python-wrap"},next:{title:"Maintaining the Website",permalink:"/docs/dev-web"}},c={},p=[{value:"Finding the error",id:"finding-the-error",level:2},{value:"Makefile",id:"makefile",level:3},{value:"Python",id:"python",level:3},{value:"Non-fatal errors",id:"non-fatal-errors",level:2},{value:"Common Error Sources",id:"common-error-sources",level:2},{value:"Variable Reset",id:"variable-reset",level:3}],d={toc:p};function h(e){var t=e.components,n=(0,r.Z)(e,i);return(0,a.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"UCLCHEM is a complex code and many things can go wrong. Here, we'll list some of the things that often go wrong when you modify the code as well as a few helpful steps to trace down bugs."),(0,a.kt)("h2",{id:"finding-the-error"},"Finding the error"),(0,a.kt)("p",null,"An unfortunate side effect of the python installation process and running the code in python is that underlying errors can go missing. If you get an error it is often best to go as close to the source as you can. That means compiling the code with the makefile and running it through a python script or, failing that, the binary."),(0,a.kt)("h3",{id:"makefile"},"Makefile"),(0,a.kt)("p",null,"You'll find the source code and makefile in ",(0,a.kt)("inlineCode",{parentName:"p"},"src/fortran_src"),", if you run"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"cd src/fortran_src\nmake clean\nmake python\n")),(0,a.kt)("p",null,"you'll build the python wrap from scratch and you'll get any compilation errors printed to screen directly. These compilation errors should print when ",(0,a.kt)("inlineCode",{parentName:"p"},"pip install .")," fails but they can be lost in the python errors and often won't be as helpfully coloured as the direct output from ",(0,a.kt)("inlineCode",{parentName:"p"},"make"),". You can also go into the Makefile and change the compiler flags. Switching the optimization flags out for debugging flags will make the error easier to find. You'll find them in the Makefile:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-makefile"},"#Unforgiving debugging flags\n#FFLAGS =-g -fbacktrace -Wall -fcheck=all\n#Fast optimizing flags\nFFLAGS = -O3 -fPIC -ffree-line-length-0\n")),(0,a.kt)("p",null,"where you simply switch over which ",(0,a.kt)("inlineCode",{parentName:"p"},"FFLAGS")," is commented out."),(0,a.kt)("p",null,"You can also test for errors that come from the python interface by using ",(0,a.kt)("inlineCode",{parentName:"p"},"make")," instead of ",(0,a.kt)("inlineCode",{parentName:"p"},"make python"),". This will build a uclchem binary which you can simply run with the default parameters,"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"cd src/fortran_src\nmake\ncd ../../\n./uclchem CLOUD examples/phase1.inp\n")),(0,a.kt)("p",null,"Where phase1.inp is a parameter file written in a json like format and CLOUD is the type of model we'd like to run. Better yet, if you use the debugging flags to build this, you can run it in gdb."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"gdb uclchem\nrun CLOUD examples/phase1.inp\n")),(0,a.kt)("p",null,"We can't go into detail on gdb is here but it's a terminal based debugger that can be used to trace down the error. It will often let you look at values of variables at the point where the code broke and give more information than the standard fortran outputs."),(0,a.kt)("h3",{id:"python"},"Python"),(0,a.kt)("p",null,"It's mentioned at several points in the docs but if you habitually run your UCLCHEM codes in jupyter notebooks, you'll find that error messages are often hidden from you. Any debugging should really be done via python script."),(0,a.kt)("h2",{id:"non-fatal-errors"},"Non-fatal errors"),(0,a.kt)("p",null,"Many errors will not stop the code compiling but are catastrophic. For example, you could introduce a new procedure that is valid Fortran but does not do what you want it to do. In these cases, you'll have to hunt the problem down yourself. We recommend running the test cases in ",(0,a.kt)("inlineCode",{parentName:"p"},"scripts/run_uclchem_tests.py")," and comparing the output to the ones in the example using the plot created by ",(0,a.kt)("inlineCode",{parentName:"p"},"scripts/plot_uclchem_tests.py"),". Sometimes, they'll be different because you introduced a change that you know will effect the chemistry. For example, you might have changed a desorption process and find the ice abundances change which is totally fine. However, if you see a change that is unexpected, you can investigate."),(0,a.kt)("p",null,"There's no better way to debug these errors than to simply print a lot of things to screen. It can seem silly but adding a bunch of write statements to your code is often the fastest way to track down what is going wrong."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-fortran"},'IF (myParam .gt. criticalValue) THEN\n    write(*,*) "here!"\n    !do stuff\nELSE\n    write(*,*) "if not trigged because myParam is", myParam\n    !do other stuff\nEND IF\n\n!do some processing\nCALL myNewSubroutine\nwrite(*,*) "myParam", myParam, "at code point x"\n\n')),(0,a.kt)("p",null,"Additions to the code like above will check the logic of your code is going the way you expect and that parameters aren't taking surprise values. If you have absolutely no suspicions about which part of your code is going wrong, you can use the subroutine ",(0,a.kt)("inlineCode",{parentName:"p"},"simpleDebug")," which is in the IO module (",(0,a.kt)("inlineCode",{parentName:"p"},"io.f90"),"). That prints a statement of your choice as well as many of the parameters."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-fortran"},'!do some processing\nCALL myNewSubroutine\nCALL simpleDebug("Param values after myNewSubroutine")\n')),(0,a.kt)("h2",{id:"common-error-sources"},"Common Error Sources"),(0,a.kt)("h3",{id:"variable-reset"},"Variable Reset"),(0,a.kt)("p",null,"If you notice errors that only occur when you run the code more than once in a python script, then a common source is the initial value that variables take in the code. Variable initialization done at the declaration stage of a module only happens once. That is why the vast majority of variables that are not fortran parameters (constants) are set to an initial value by defaultparameters.f90 or in the initialization subroutines of the physics-core, chemistry, and physics modules."),(0,a.kt)("p",null,"It's very common when editing the code or adding new variables to forget to do this and then to see unusual behaviour when you run multiple models in a row in python."))}h.isMDXComponent=!0}}]);