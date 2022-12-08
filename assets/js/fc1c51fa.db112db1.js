"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6257],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},d="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(n),p=o,m=d["".concat(l,".").concat(p)]||d[p]||h[p]||i;return n?a.createElement(m,r(r({ref:t},c),{},{components:n})):a.createElement(m,r({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:o,r[1]=s;for(var u=2;u<i;u++)r[u]=n[u];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1418:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>p,frontMatter:()=>s,metadata:()=>u,toc:()=>d});var a=n(7462),o=n(3366),i=(n(7294),n(3905)),r=["components"],s={id:"dev-web",title:"Maintaining the Website"},l=void 0,u={unversionedId:"dev-web",id:"dev-web",title:"Maintaining the Website",description:"We use Docusaurus to maintain our website. The upside is that documentation and blog posts can all be created as simple markdown files. The downside is a slightly convoluted workflow which we explain here.",source:"@site/docs/dev-web.md",sourceDirName:".",slug:"/dev-web",permalink:"/docs/dev-web",tags:[],version:"current",lastUpdatedBy:"jonholdship",lastUpdatedAt:1652786813,formattedLastUpdatedAt:"5/17/2022",frontMatter:{id:"dev-web",title:"Maintaining the Website"},sidebar:"docs",previous:{title:"Debugging",permalink:"/docs/dev-debugging"}},c={},d=[{value:"Repository Structure",id:"repository-structure",level:2},{value:"Setting Up",id:"setting-up",level:2},{value:"Requirements",id:"requirements",level:3},{value:"Cloning",id:"cloning",level:3},{value:"Making Changes",id:"making-changes",level:2},{value:"Docs",id:"docs",level:3},{value:"Blog",id:"blog",level:3},{value:"Main pages",id:"main-pages",level:3},{value:"Pushing Changes",id:"pushing-changes",level:2}],h={toc:d};function p(e){var t=e.components,n=(0,o.Z)(e,r);return(0,i.kt)("wrapper",(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"We use ",(0,i.kt)("a",{parentName:"p",href:"https://docusaurus.io"},"Docusaurus")," to maintain our website. The upside is that documentation and blog posts can all be created as simple markdown files. The downside is a slightly convoluted workflow which we explain here."),(0,i.kt)("h2",{id:"repository-structure"},"Repository Structure"),(0,i.kt)("p",null,"The website is generated from a ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/uclchem/uclchem.github.io"},"dedicated repository")," which has two branches: ",(0,i.kt)("strong",{parentName:"p"},"master")," and ",(0,i.kt)("strong",{parentName:"p"},"docusaurus"),". Master is the branch from which the website is actually served and it is not to be edited by users. Instead, it is automatically generated from the source code by Docusaurus. ",(0,i.kt)("strong",{parentName:"p"},"Users modify the docusaurus branch.")),(0,i.kt)("h2",{id:"setting-up"},"Setting Up"),(0,i.kt)("h3",{id:"requirements"},"Requirements"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"You'll need ",(0,i.kt)("a",{parentName:"li",href:"https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable"},"yarn")," or npm installed to run docusaurus, we'll assume yarn as it's simplest but the ",(0,i.kt)("a",{parentName:"li",href:"https://docusaurus.io/docs"},"docusaurus docs")," explain how to use either."),(0,i.kt)("li",{parentName:"ul"},"You need to set up github to use SSH keys to authenticate your pushes. ",(0,i.kt)("a",{parentName:"li",href:"https://docs.github.com/en/authentication/connecting-to-github-with-ssh"},"The github docs explain this"))),(0,i.kt)("h3",{id:"cloning"},"Cloning"),(0,i.kt)("p",null,"To get a copy of the website and start looking around, you can do the following:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"git clone git@github.com:uclchem/uclchem.github.io.git\ncd uclchem.github.io\ngit checkout docusaurus\n")),(0,i.kt)("p",null,"which will clone the repository and move to the development branch. The parent directory is not particularly useful, most content is in ",(0,i.kt)("inlineCode",{parentName:"p"},"website/"),", users can run the site locally with:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"cd website\nyarn start\n")),(0,i.kt)("h2",{id:"making-changes"},"Making Changes"),(0,i.kt)("h3",{id:"docs"},"Docs"),(0,i.kt)("p",null,"The docs pages are generated from markdown files in ",(0,i.kt)("inlineCode",{parentName:"p"},"website/docs"),". There's a script in the ",(0,i.kt)("inlineCode",{parentName:"p"},"utils")," directory of the main UCLCHEM repository (",(0,i.kt)("inlineCode",{parentName:"p"},"utils/make_python_docs.sh"),") to automatically generate the parameters docs, the Python API reference, and the tutorial pages from the code and tutorial files. You need to supply the path to your uclchem.github.io repository to have it automatically move the files there. If you want to add or modify any other docs, you can just create or edit a markdown file."),(0,i.kt)("p",null,"The only docs that are actually included in the side are those listed in ",(0,i.kt)("inlineCode",{parentName:"p"},"website/sidebars.json"),". There's some structure to it but we define categories in a simple JSON format and then each cateogory has an items list where you can add new pages. If you want to add a completely new category, just compare the category declaration in this file with the docs online. The docs listed in sidebars.json should match the ",(0,i.kt)("inlineCode",{parentName:"p"},"id")," at the top of each markdown file."),(0,i.kt)("h3",{id:"blog"},"Blog"),(0,i.kt)("p",null,"We're attempting to add a blog post for each publication that uses UCLCHEM. Blog posts are again just markdown files which can be found in ",(0,i.kt)("inlineCode",{parentName:"p"},"website/blog"),". Everything in that directory is included in the blog, the date from the file name is used to order them."),(0,i.kt)("h3",{id:"main-pages"},"Main pages"),(0,i.kt)("p",null,"The other pages on the site are either js files in ",(0,i.kt)("inlineCode",{parentName:"p"},"website/src/pages")," or static html files in ",(0,i.kt)("inlineCode",{parentName:"p"},"website/static"),". Docusaurus does not like you to work with the static files so where possible, you should use the js files. We use very simple js where we just put the HTML we would put into a normal webpage into functions and then call the functions in the main part of the file to produce a simple HMTL page. It's best to use existing pages as templates."),(0,i.kt)("h2",{id:"pushing-changes"},"Pushing Changes"),(0,i.kt)("p",null,"Once you've made your edits, you do the following steps:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'# Let docusaurus update the website\nUSE_SSH=true GIT_USER=you_username yarn deploy\n\n# Push your changes to the docusaurus branch as normal\ngit add . -A\ngit commit -m "useful update message"\ngit push\n\n')),(0,i.kt)("p",null,"If your github is set up with to use private key authentication and ssh (highly recommended), docusaurus will build the website and push it to master for you when you use yarn deploy. You then push to docusaurus branch as normal to make sure others work from your changes."))}p.isMDXComponent=!0}}]);