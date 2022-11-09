"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4723],{3905:(e,t,o)=>{o.d(t,{Zo:()=>u,kt:()=>m});var n=o(7294);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function l(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),h=c(o),m=r,d=h["".concat(s,".").concat(m)]||h[m]||p[m]||a;return o?n.createElement(d,i(i({ref:t},u),{},{components:o})):n.createElement(d,i({ref:t},u))}));function m(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=o.length,i=new Array(a);i[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var c=2;c<a;c++)i[c]=o[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,o)}h.displayName="MDXCreateElement"},3802:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>p});var n=o(7462),r=o(3366),a=(o(7294),o(3905)),i=["components"],l={id:"trouble-compile",title:"Compilation Issues"},s=void 0,c={unversionedId:"trouble-compile",id:"trouble-compile",title:"Compilation Issues",description:"Given that UCLCHEM is supplied as source code, used across many machine types, and is a fairly complex model, things will occasionally go wrong. We've collected here some of the most common problems and hope they resolve most issues.",source:"@site/docs/trouble-compile.md",sourceDirName:".",slug:"/trouble-compile",permalink:"/docs/trouble-compile",tags:[],version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1653309538,formattedLastUpdatedAt:"5/23/2022",frontMatter:{id:"trouble-compile",title:"Compilation Issues"},sidebar:"docs",previous:{title:"Chemical Analysis",permalink:"/docs/chemical_analysis"},next:{title:"Integration",permalink:"/docs/trouble-integration"}},u={},p=[{value:"Pip fails",id:"pip-fails",level:2},{value:"Windows Trouble",id:"windows-trouble",level:2},{value:"Mac Trouble",id:"mac-trouble",level:2},{value:"Architectures",id:"architectures",level:2}],h={toc:p};function m(e){var t=e.components,o=(0,r.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},h,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Given that UCLCHEM is supplied as source code, used across many machine types, and is a fairly complex model, things will occasionally go wrong. We've collected here some of the most common problems and hope they resolve most issues."),(0,a.kt)("h2",{id:"pip-fails"},"Pip fails"),(0,a.kt)("p",null,"Pip is a package manager for Python. It is used to install and manage Python packages but we're hijacking its set up process to ask it to compile UCLCHEM. If the compilation goes wrong, the error message is often a bit useless. Please go to ",(0,a.kt)("inlineCode",{parentName:"p"},"src/fortran_src")," in your terminal and type ",(0,a.kt)("inlineCode",{parentName:"p"},"make python"),". You will get a more useful error which you can then try to debug or send to the team."),(0,a.kt)("p",null,"Installing via pip may fail if your environment is not set up. Whilst pip will check that you have the necessary python libraries installed, it will not check that you have the necessary compilers. In order to compile you need gfortran which is packaged with the ",(0,a.kt)("a",{parentName:"p",href:"https://gcc.gnu.org/"},"gnu compiler")," suite. You also need make which is part of the GNU toolset. You can likely install these things through your operating system's package manager rather than from their websites."),(0,a.kt)("p",null,"Advanced users who do not wish to change compiler may want to check the Makefile. It can be found in ",(0,a.kt)("inlineCode",{parentName:"p"},"src/fortran_src/Makefile"),". There are variables to control the choice of compiler, compilation flags and the F2PY flags which tell numpy.f2py which fortran compiler was used. These can all be altered if you do not wish to use gfortran."),(0,a.kt)("h2",{id:"windows-trouble"},"Windows Trouble"),(0,a.kt)("p",null,"UCLCHEM was written on a GNU/Linux machine and therefore makes a lot of assumptions about how your environment is set up. Whilst these assumptions hold for basically all Linux (and most Mac) distributions, Windows users often run into trouble. You can attempt to install a GNU toolset through packages like MinGW but the most straightforward way we've found for Windows users is to use the Windows Subsystem for linux."),(0,a.kt)("p",null,"Open a powershell as an administrator and type ",(0,a.kt)("inlineCode",{parentName:"p"},"wsl --install")," to install the Windows Subsystem for Linux. It will then ask you to reboot. Once you've done this, you'll find Ubuntu in your Windows App Store. Installing this Ubuntu app will give you access to a terminal that is indistinguishable from one running on a Linux system but it will have access to all your Windows files. You can set up your linux environment with all necessary tools:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt update\nsudo apt install make\nsudo apt install python3-pip\nsudo apt install gfortran\n")),(0,a.kt)("p",null,"and then you'll find your files in ",(0,a.kt)("inlineCode",{parentName:"p"},"/mnt"),". For example, your C: drive can be accessed via ",(0,a.kt)("inlineCode",{parentName:"p"},"cd /mnt/c"),". With the above tools installed, you'll be able to follow our basic install instructions and run UCLCHEM via your Ubuntu installation."),(0,a.kt)("h2",{id:"mac-trouble"},"Mac Trouble"),(0,a.kt)("p",null,"A problem Mac users commonly come across is that fortran codes compile but do not run because the gfortran libraries are not in the expected location. If you get an error like:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"Exception has occurred: ImportErrordlopen(/usr/local/lib/python3.9/site-packages/uclchemwrap.cpython-39-darwin.so, 2): Library not loaded: /usr/local/opt/gcc/lib/gcc/10/libgfortran.5.dylib   Referenced from: /usr/local/lib/python3.9/site-packages/uclchemwrap.cpython-39-darwin.so   Reason: image not found\n")),(0,a.kt)("p",null,"then this is likely what has happened to you. You can fix it by following the instructions in this",(0,a.kt)("a",{parentName:"p",href:"https://stackoverflow.com/questions/57207357/dyld-library-not-loaded-usr-local-gfortran-lib-libgfortran-3-dylib-reason-im"},"this Stackoverflow post"),". "),(0,a.kt)("p",null,"However, the underlying problem is that Apple would prefer you do not use GNU compilers. As Mac OS updates come in, the exact issue may change. You will usually find many stackoverflow posts about your problem if you search for people having similar errors with gfortran on Mac. Many members of the UCLCHEM group also use Mac so do get in touch if you cannot find a solution.xit"),(0,a.kt)("h2",{id:"architectures"},"Architectures"),(0,a.kt)("p",null,"F2PY defaults to x86_64 architecture. This is fine for most users, but if you are using a different architecture, you may need to specify this in the Makefile. To do so, edit ",(0,a.kt)("inlineCode",{parentName:"p"},"src/fortran_src/Makfile")," so that the line that reads"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"python3 -m numpy.f2py -c --fcompiler=${f2pyFC}\n")),(0,a.kt)("p",null,"is replaced with"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"python3 -m numpy.f2py -c --fcompiler=${f2pyFC} --arch=my_arch\n")),(0,a.kt)("p",null,"where my_arch is the architecture you are using."))}m.isMDXComponent=!0}}]);