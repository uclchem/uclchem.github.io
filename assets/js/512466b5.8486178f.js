"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[2080],{3905:(e,a,t)=>{t.d(a,{Zo:()=>l,kt:()=>d});var s=t(7294);function n(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);a&&(s=s.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,s)}return t}function i(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?r(Object(t),!0).forEach((function(a){n(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function m(e,a){if(null==e)return{};var t,s,n=function(e,a){if(null==e)return{};var t,s,n={},r=Object.keys(e);for(s=0;s<r.length;s++)t=r[s],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(s=0;s<r.length;s++)t=r[s],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var o=s.createContext({}),p=function(e){var a=s.useContext(o),t=a;return e&&(t="function"==typeof e?e(a):i(i({},a),e)),t},l=function(e){var a=p(e.components);return s.createElement(o.Provider,{value:a},e.children)},c={inlineCode:"code",wrapper:function(e){var a=e.children;return s.createElement(s.Fragment,{},a)}},h=s.forwardRef((function(e,a){var t=e.components,n=e.mdxType,r=e.originalType,o=e.parentName,l=m(e,["components","mdxType","originalType","parentName"]),h=p(t),d=n,k=h["".concat(o,".").concat(d)]||h[d]||c[d]||r;return t?s.createElement(k,i(i({ref:a},l),{},{components:t})):s.createElement(k,i({ref:a},l))}));function d(e,a){var t=arguments,n=a&&a.mdxType;if("string"==typeof e||n){var r=t.length,i=new Array(r);i[0]=h;var m={};for(var o in a)hasOwnProperty.call(a,o)&&(m[o]=a[o]);m.originalType=e,m.mdxType="string"==typeof e?e:n,i[1]=m;for(var p=2;p<r;p++)i[p]=t[p];return s.createElement.apply(null,i)}return s.createElement.apply(null,t)}h.displayName="MDXCreateElement"},8332:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>m,metadata:()=>p,toc:()=>c});var s=t(7462),n=t(3366),r=(t(7294),t(3905)),i=["components"],m={id:"physics-shocks",title:"Shock Models"},o=void 0,p={unversionedId:"physics-shocks",id:"physics-shocks",title:"Shock Models",description:"Main Contributors: Izaskun Jimenez-Serra, Tom James, Jon Holdship",source:"@site/docs/physics-shocks.md",sourceDirName:".",slug:"/physics-shocks",permalink:"/docs/next/physics-shocks",draft:!1,tags:[],version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1651241879,formattedLastUpdatedAt:"Apr 29, 2022",frontMatter:{id:"physics-shocks",title:"Shock Models"},sidebar:"docs",previous:{title:"Hot Core",permalink:"/docs/next/physics-hotcore"},next:{title:"Collapse Models",permalink:"/docs/next/physics-collapse"}},l={},c=[{value:"Shock Profiles",id:"shock-profiles",level:2},{value:"C-Shocks",id:"c-shocks",level:3},{value:"J-shocks",id:"j-shocks",level:3},{value:"Dimensions",id:"dimensions",level:2},{value:"Sputtering",id:"sputtering",level:2}],h={toc:c};function d(e){var a=e.components,t=(0,n.Z)(e,i);return(0,r.kt)("wrapper",(0,s.Z)({},h,t,{components:a,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Main Contributors"),": Izaskun Jimenez-Serra, Tom James, Jon Holdship"),(0,r.kt)("h2",{id:"shock-profiles"},"Shock Profiles"),(0,r.kt)("p",null,"UCLCHEM uses two different shock parameterizations. These provide the physical properties of a gas through time as it is subjected to a shock. Whilst the most accurate MHD shock models solve the chemistry, MHD and radiative transfer problems simulataneously, few of these models include chemistry as detailed as UCLCHEM. We assume that the MHD models on which our parameterizations were validated used detailed enough chemistry that the shock profiles could be accurately calculated. This means that more detailed chemistry can be safely post-processed using UCLCHEM, a parameterization simply means the user can select parameters freely rather than from a preset selection of profiles from another code such as ",(0,r.kt)("a",{parentName:"p",href:"http://cdsads.u-strasbg.fr/abs/2015A&A...578A..63F"},"MHDvode"),"."),(0,r.kt)("h3",{id:"c-shocks"},"C-Shocks"),(0,r.kt)("p",null,"The C-shock is based on the parameterization by ",(0,r.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361:20078054"},"Jimenez-Serra et al. 2008"),". It parameterizes the density, temperature and velocity profiles of c-shocks as a function of shock velocity, initial gas density and magnetic field. These were validated against the results of the detailed shock modelling of ",(0,r.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1046/j.1365-8711.2003.06716.x"},"Flower et al. 2003"),". Details of it's use can be found in ",(0,r.kt)("a",{parentName:"p",href:"/docs/pythonapi#uclchem.model.cshock"},"the c-shock function docs"),"."),(0,r.kt)("p",null,"A key value in this model is the dissipation length, which is the distance over which the velocity of the ions and the neutrals equalizes. In some sense, this is the extent of the C-shock, although post-shock cooling does continue for some distance after. The C-shock function will return the dissipation time (see ",(0,r.kt)("a",{parentName:"p",href:"/docs/physics-shocks#dimensions"},"below"),") and will also uses shorter timesteps for a number of years equal to twice the dissipation time in order to fully resolve the shock. The number of these time steps is controlled by an optional parameter."),(0,r.kt)("h3",{id:"j-shocks"},"J-shocks"),(0,r.kt)("p",null,"jshock is a similar parameterization for j-shocks from ",(0,r.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361/201936536"},"James et al.")," validated against more recent results from MHDvode (",(0,r.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361/201525740"},"Flower et al. 2015"),"). See the ",(0,r.kt)("a",{parentName:"p",href:"/docs/pythonapi#uclchem.model.jshock"},"j-shock function docs")," for details."),(0,r.kt)("h2",{id:"dimensions"},"Dimensions"),(0,r.kt)("p",null,"Both shock models are intended to be run as single point models only and the code will return an error for ",(0,r.kt)("inlineCode",{parentName:"p"},"points > 1"),". However, you can look at the 1D profile of a shock by converting between time and distance. If we assume the shock is stationary, that is that it's structure is unchanged as it moves through a cloud of gas, then the points that are far away in time are the same as those far away in space."),(0,r.kt)("img",{src:"/img/shock.png",width:"600","margin-left":"40%"}),(0,r.kt)("p",null,"As an illustration, as a shock front moves through a cloud and first hits a parcel of gas, this is t=0 in our shock model output. 5000 years later, the shock front has moved on, thus the output of UCLCHEM at t=5000 years is the state of a parcel of gas that was first hit 5000 years ago and is now far behind the shock front."),(0,r.kt)("p",null,"By using the shock velocity, you can translate 5000 years to the distance between the parcel that was shocked 5000 years ago and the parcel that is just being reached by the shock front,"),(0,r.kt)("div",{className:"math math-display"},(0,r.kt)("span",{parentName:"div",className:"katex-display"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML",display:"block"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"z"),(0,r.kt)("mo",{parentName:"mrow"},"="),(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msub"},"v"),(0,r.kt)("mi",{parentName:"msub"},"s")),(0,r.kt)("mi",{parentName:"mrow"},"t")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"z= v_s t")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.43056em",verticalAlign:"0em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.04398em"}},"z"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2777777777777778em"}}),(0,r.kt)("span",{parentName:"span",className:"mrel"},"="),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2777777777777778em"}})),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.76508em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"v"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.151392em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"-0.03588em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"s")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"t")))))),(0,r.kt)("p",null,"Thus the history of a single point in a shocked cloud that is output by UCLCHEM can also be translated to a snapshot of a cloud that covers distance z."),(0,r.kt)("h2",{id:"sputtering"},"Sputtering"),(0,r.kt)("p",null,"The C-shock model uses the sputtering process described by ",(0,r.kt)("a",{parentName:"p",href:"https://dx.doi.org/10.1051/0004-6361:20078054"},"Jimenez-Serra et al. 2008"),". Briefly, we calculate the average energy imparted on the grains from a collision between the shocked gas and the grains. We then combine this with the collision rate and average yield for a given energy to calculate the sputtering rate which we integrate through time. In practice, this sputtering is so quick that it happens almost instantaneously at ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msub"},"t"),(0,r.kt)("mrow",{parentName:"msub"},(0,r.kt)("mi",{parentName:"mrow"},"s"),(0,r.kt)("mi",{parentName:"mrow"},"a"),(0,r.kt)("mi",{parentName:"mrow"},"t")))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"t_{sat}")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.76508em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"t"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.2805559999999999em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"s"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"a"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"t"))))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"})))))))))),", the saturation time. This is the time at which the silicon abundance stops increasing in more detailed models, used as a proxy for when the ices are fully sputtered. Thus it is likely that you will see a step change in the ice abundances where sputtering has not occurred yet in one time step and is complete in the second unless your timestep is very small."),(0,r.kt)("p",null,"The J-shock would begin with ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("msub",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msub"},"V"),(0,r.kt)("mi",{parentName:"msub"},"s"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"V_s")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.83333em",verticalAlign:"-0.15em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.22222em"}},"V"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.151392em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"-0.22222em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"s")))),(0,r.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,r.kt)("span",{parentName:"span"}))))))))))," as the initial drift velocity of the sputtering routine described above and would instantaneously sputter at t = 0 yr. Furthermore, temperatures typically reach a minimum of 1000 K meaning the thermal sublimation is almost complete. Thus, we do not need to worry about the sputtering process in the J-shock, we simply remove all grain material and add it to the gas at t = 0 yr."))}d.isMDXComponent=!0}}]);