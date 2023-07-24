"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3065],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),h=o,m=u["".concat(s,".").concat(h)]||u[h]||d[h]||r;return n?a.createElement(m,i(i({ref:t},p),{},{components:n})):a.createElement(m,i({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:o,i[1]=l;for(var c=2;c<r;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},4808:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>h,frontMatter:()=>l,metadata:()=>c,toc:()=>u});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],l={id:"install",title:"Installation",slug:"/"},s=void 0,c={unversionedId:"install",id:"install",title:"Installation",description:"Prerequisites",source:"@site/docs/start-basicuse.md",sourceDirName:".",slug:"/",permalink:"/docs/next/",draft:!1,tags:[],version:"current",lastUpdatedBy:"Gijs Vermari\xebn",lastUpdatedAt:1678897922,formattedLastUpdatedAt:"Mar 15, 2023",frontMatter:{id:"install",title:"Installation",slug:"/"},sidebar:"docs",previous:{title:"Getting Started",permalink:"/docs/next/category/getting-started"},next:{title:"Creating a Network",permalink:"/docs/next/network"}},p={},u=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Obtaining UCLCHEM",id:"obtaining-uclchem",level:3},{value:"Software Requirements",id:"software-requirements",level:3},{value:"Apple and Windows",id:"apple-and-windows",level:3},{value:"Apple silicon/M1",id:"apple-siliconm1",level:3},{value:"Apple Intel",id:"apple-intel",level:3},{value:"Installation",id:"installation",level:2},{value:"Checking Your Install",id:"checking-your-install",level:2}],d={toc:u};function h(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,r.kt)("h3",{id:"obtaining-uclchem"},"Obtaining UCLCHEM"),(0,r.kt)("p",null,"You can visit our ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/uclchem/UCLCHEM"},"main page")," to get download links for the code, or ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/uclchem/UCLCHEM"},"our github"),". Alternatively, you can use git to clone the repo directly from terminal."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/uclchem/UCLCHEM.git\n")),(0,r.kt)("h3",{id:"software-requirements"},"Software Requirements"),(0,r.kt)("p",null,"You need to have the following software installed on your machine:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Python 3.x"),(0,r.kt)("li",{parentName:"ul"},"GNU Make"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://gcc.gnu.org/"},"GNU compilers"))),(0,r.kt)("p",null,"You will also need various python libraries but they will be installed if you follow the installation instructions below. Please note, UCLCHEM is installed by calling the ",(0,r.kt)("inlineCode",{parentName:"p"},"python3")," command. If you have Python 3.x but your system only recognizes ",(0,r.kt)("inlineCode",{parentName:"p"},"python")," as the command to use it, you should alias ",(0,r.kt)("inlineCode",{parentName:"p"},"python")," to ",(0,r.kt)("inlineCode",{parentName:"p"},"python3")," or update ",(0,r.kt)("inlineCode",{parentName:"p"},"src/fortran_src/Makefile")," to use ",(0,r.kt)("inlineCode",{parentName:"p"},"python")," anywhere it says ",(0,r.kt)("inlineCode",{parentName:"p"},"python3"),"."),(0,r.kt)("h3",{id:"apple-and-windows"},"Apple and Windows"),(0,r.kt)("p",null,"Mac users are encourage to use Xcode to get the GNU compilers and Windows users are most likely to have success with the Windows Subsystem for Linux. See our ",(0,r.kt)("a",{parentName:"p",href:"/docs/trouble-compile"},"troubleshooting")," page for more information if you encounter problems. For Mac users with Apple silicon special installations instructions are listed below the regular installation instructions."),(0,r.kt)("h3",{id:"apple-siliconm1"},"Apple silicon/M1"),(0,r.kt)("p",null,"For this use case we recommend the usage of the package manager conda (the installer for the minimal version can be found ",(0,r.kt)("a",{parentName:"p",href:"https://docs.conda.io/en/latest/miniconda.html"},"here"),").\nEnsure that you install the apple silicon/M1 version, together with Xcode."),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"If you are on MacOS Ventura (13.X), you need to use ",(0,r.kt)("inlineCode",{parentName:"p"},"conda install -c conda-forge gfortran=12.2"),". Since at least fortran version 12 is needed for Ventura.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"conda create -n uclchem_osx\nconda activate uclchem_osx\nconda config --env --set subdir osx-arm64\nconda install python=3.10\nconda install gfortran\n")),(0,r.kt)("p",null,"After this, one can continue with the installation instructions above and install. In order to use\nUCLCHEM in a new terminal session one has to use the command ",(0,r.kt)("inlineCode",{parentName:"p"},"conda activate uclchem_osx"),"."),(0,r.kt)("h3",{id:"apple-intel"},"Apple Intel"),(0,r.kt)("p",null,"Similar instructions as for M1, but now with the x86_64 instruction set. Again this requires Xcode."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"conda create -n uclchem_osx\nconda activate uclchem_osx\nconda config --env --set subdir osx-64\nconda install python=3.9\nconda install clang\nconda install gfortran\n")),(0,r.kt)("p",null,"After this, one can continue with the installation instructions above and install. In order to use\nUCLCHEM in a new terminal session one has to use the command ",(0,r.kt)("inlineCode",{parentName:"p"},"conda activate uclchem_osx"),"."),(0,r.kt)("p",null,"If you encounter further issues please check ",(0,r.kt)("a",{parentName:"p",href:"/docs/trouble-compile"},"troubleshooting"),"."),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)("p",null,"UCLCHEM is designed to be compiled to a python library. Despite this, we cannot distribute it as a python package via pypi or similar because the user needs to be able to recompile their own version in order to change the network. The chemical network is hard coded for efficiency so it is not possible to change the network without recompiling."),(0,r.kt)("p",null,"In order to compile UCLCHEM, you will simply need to do the folowing from the main directory of the repository:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd UCLCHEM\npip install -r requirements.txt\npip install .\n")),(0,r.kt)("p",null,"This will install the UCLCHEM library into your python environment, you can then import it and use it in your python scripts. If you get an error at this stage, it is very likely you do not have Cmake or gfortran installed. You must do this again every time you use ",(0,r.kt)("a",{parentName:"p",href:"/docs/network"},"Makerates"),"."),(0,r.kt)("p",null,"If it completes without error then, that's it! UCLCHEM is installed. We have tutorials on how to ",(0,r.kt)("a",{parentName:"p",href:"/docs/first_model"},"run your first model")," as well as more complex use cases. The rest of the 'Getting Started' section focuses on creating a network and the various parameters the user can control. "),(0,r.kt)("h2",{id:"checking-your-install"},"Checking Your Install"),(0,r.kt)("p",null,"We provide several ways to get acquainted with the code including a series of ",(0,r.kt)("a",{parentName:"p",href:"/docs/category/tutorials"},"tutorials"),". Alternatively, there are python scripts in ",(0,r.kt)("inlineCode",{parentName:"p"},"scripts/")," that can be used as templates for running your own models and comprehensive documentation on the ",(0,r.kt)("a",{parentName:"p",href:"/docs/pythonapi"},"python API")," and ",(0,r.kt)("a",{parentName:"p",href:"/docs/parameters"},"parameters"),"."),(0,r.kt)("p",null,"However, if you simply want to check whether your new network is working, you can use the ",(0,r.kt)("inlineCode",{parentName:"p"},"scripts/run_uclchem_tests.py")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"scripts/plot_uclchem_tests.py")," scripts. You can find outputs in the ",(0,r.kt)("inlineCode",{parentName:"p"},"examples/")," directory along with an explanation of what this does."))}h.isMDXComponent=!0}}]);