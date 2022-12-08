"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1841],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},h="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),h=c(r),u=o,f=h["".concat(l,".").concat(u)]||h[u]||d[u]||a;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[h]="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},8879:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>u,frontMatter:()=>s,metadata:()=>c,toc:()=>h});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],s={title:"Collapsing Prestellar Cores - a new physics module",author:"jonholdship"},l=void 0,c={permalink:"/blog/2018/07/12/felix-collapse",source:"@site/blog/2018-07-12-felix-collapse.md",title:"Collapsing Prestellar Cores - a new physics module",description:"Felix Priestley has used UCLCHEM to study the collapse of prestellar cores. In the process, he's created a new physics module collapse.f90 which follows a sphere of gas collapsing in different ways. The paper can be found here and the abstract is below.",date:"2018-07-12T00:00:00.000Z",formattedDate:"July 12, 2018",tags:[],readingTime:1.505,truncated:!1,authors:[{name:"jonholdship"}],frontMatter:{title:"Collapsing Prestellar Cores - a new physics module",author:"jonholdship"},prevItem:{title:"Nitrogen fractionation in external galaxies",permalink:"/blog/2019/04/19/serena-nitrogen-frac"},nextItem:{title:"The Chemistry of Phosphorus-bearing Molecules under Energetic Phenomena",permalink:"/blog/2018/06/20/izaskun-phosphorus"}},p={authorsImageUrls:[void 0]},h=[],d={toc:h};function u(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://fpriestley.github.io/"},"Felix Priestley")," has used UCLCHEM to study the collapse of prestellar cores. In the process, he's created a new physics module ",(0,a.kt)("inlineCode",{parentName:"p"},"collapse.f90")," which follows a sphere of gas collapsing in different ways. The ",(0,a.kt)("a",{parentName:"p",href:"https://arxiv.org/pdf/1806.01699.pdf"},"paper can be found here")," and the abstract is below."),(0,a.kt)("p",null,"Peptide bonds (N-C = O) play a key role in metabolic processes since they link amino acids into peptide chains or proteins. Recently, several molecules containing peptide-like bonds have been detected across multiple environments in the interstellar medium, growing the need to fully understand their chemistry and their role in forming larger pre-biotic molecules. We present a comprehensive study of the chemistry of three molecules containing peptide-like bonds: HNCO, NH2CHO, and CH3NCO. We also included other CHNO isomers (HCNO, HOCN) and C2H3NO isomers (CH3OCN, CH3CNO) to the study. We have used the UCLCHEM gas-grain chemical code and included in our chemical network all possible formation/destruction pathways of these peptide-like molecules recently investigated either by theoretical calculations or in laboratory experiments. Our predictions are compared to observations obtained towards the proto-star IRAS 16293-2422 and the L1544 pre-stellar core. Our results show that some key reactions involving the CHNO and C2H3NO isomers need to be modified to match the observations. Consistently with recent laboratory findings, hydrogenation is unlikely to produce NH2CHO on grain surfaces, while a combination of radical-radical surface reactions and gas-phase reactions is a better alternative. In addition, better results are obtained for NH2CHO when a slightly higher activation energy of 25 K is considered for the gas-phase reaction NH2 + H2CO \u2192 NH2CHO + H. Finally, our modelling shows that the observed correlation between NH2CHO and HNCO in star-forming regions may come from the fact that HNCO and NH2CHO react to temperature in the same manner rather than from a direct chemical link between the two species."))}u.isMDXComponent=!0}}]);