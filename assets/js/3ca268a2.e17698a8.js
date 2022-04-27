"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3065],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=s(n),h=o,d=m["".concat(c,".").concat(h)]||m[h]||u[h]||i;return n?r.createElement(d,a(a({ref:t},p),{},{components:n})):r.createElement(d,a({ref:t},p))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var s=2;s<i;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4808:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>c,default:()=>h,frontMatter:()=>l,metadata:()=>s,toc:()=>u});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),a=["components"],l={id:"install",title:"Installation",slug:"/"},c=void 0,s={unversionedId:"install",id:"install",title:"Installation",description:"Obtaining UCLCHEM",source:"@site/docs/start-basicuse.md",sourceDirName:".",slug:"/",permalink:"/docs/",tags:[],version:"current",frontMatter:{id:"install",title:"Installation",slug:"/"},sidebar:"docs",previous:{title:"Getting Started",permalink:"/docs/category/getting-started"},next:{title:"Creating a Network",permalink:"/docs/network"}},p={},u=[{value:"Obtaining UCLCHEM",id:"obtaining-uclchem",level:2},{value:"Compiling",id:"compiling",level:2}],m={toc:u};function h(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"obtaining-uclchem"},"Obtaining UCLCHEM"),(0,i.kt)("p",null,"You can visit our ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/uclchem/UCLCHEM"},"main page")," to get download links for the code, or ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/uclchem/UCLCHEM"},"our github"),". Alternatively, you can use git to clone the repo directly from terminal."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/uclchem/UCLCHEM.git\n")),(0,i.kt)("h2",{id:"compiling"},"Compiling"),(0,i.kt)("p",null,"UCLCHEM is designed to be compiled to a python library. Despite this, we cannot distribute it as a python package via pypi or similar because the user needs to be able to recompile their own version in order to change the network. The chemical network is hard coded for efficiency so it is not possible to change the network without recompiling."),(0,i.kt)("p",null,"In order to compile UCLCHEM, you will simply need to do the folowing from the main directory of the repository:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"pip install .\n")),(0,i.kt)("p",null,"This will install the UCLCHEM library into your python environment, you can then import it and use it in your python scripts. If you get an error at this stage, it is very likely you do not have Cmake or gfortran installed."),(0,i.kt)("p",null,"If it completes without error then, that's it! UCLCHEM is installed. We have tutorials on how to ",(0,i.kt)("a",{parentName:"p",href:"/docs/first_model"},"run your first model")," as well as more complex use cases. The rest of the 'Getting Started' section focuses on creating a network and the various parameters the user can control. We also have comprehensive documentation on the ",(0,i.kt)("a",{parentName:"p",href:"/docs/pythonapi"},"python API"),"."))}h.isMDXComponent=!0}}]);