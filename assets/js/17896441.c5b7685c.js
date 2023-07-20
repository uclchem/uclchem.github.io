"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7918],{1310:(e,t,a)=>{a.d(t,{Z:()=>E});var n=a(7462),l=a(7294),r=a(6010),i=a(5281),s=a(8425),o=a(8596),c=a(9960),d=a(5999),m=a(4996);function u(e){return l.createElement("svg",(0,n.Z)({viewBox:"0 0 24 24"},e),l.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}const v="breadcrumbHomeIcon_YNFT";function f(){var e=(0,m.Z)("/");return l.createElement("li",{className:"breadcrumbs__item"},l.createElement(c.Z,{"aria-label":(0,d.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:"breadcrumbs__link",href:e},l.createElement(u,{className:v})))}const h="breadcrumbsContainer_Z_bl";function b(e){var t=e.children,a=e.href,n="breadcrumbs__link";return e.isLast?l.createElement("span",{className:n,itemProp:"name"},t):a?l.createElement(c.Z,{className:n,href:a,itemProp:"item"},l.createElement("span",{itemProp:"name"},t)):l.createElement("span",{className:n},t)}function p(e){var t=e.children,a=e.active,i=e.index,s=e.addMicrodata;return l.createElement("li",(0,n.Z)({},s&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,r.Z)("breadcrumbs__item",{"breadcrumbs__item--active":a})}),t,l.createElement("meta",{itemProp:"position",content:String(i+1)}))}function E(){var e=(0,s.s1)(),t=(0,o.Ns)();return e?l.createElement("nav",{className:(0,r.Z)(i.k.docs.docBreadcrumbs,h),"aria-label":(0,d.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},l.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&l.createElement(f,null),e.map((function(t,a){var n=a===e.length-1;return l.createElement(p,{key:a,active:n,index:a,addMicrodata:!!t.href},l.createElement(b,{href:t.href,isLast:n},t.label))})))):null}},5154:(e,t,a)=>{a.r(t),a.d(t,{default:()=>Q});var n=a(7294),l=a(1944),r=a(9688),i=n.createContext(null);function s(e){var t=e.children,a=function(e){return(0,n.useMemo)((function(){return{metadata:e.metadata,frontMatter:e.frontMatter,assets:e.assets,contentTitle:e.contentTitle,toc:e.toc}}),[e])}(e.content);return n.createElement(i.Provider,{value:a},t)}function o(){var e=(0,n.useContext)(i);if(null===e)throw new r.i6("DocProvider");return e}function c(){var e,t=o(),a=t.metadata,r=t.frontMatter,i=t.assets;return n.createElement(l.d,{title:a.title,description:a.description,keywords:r.keywords,image:null!=(e=i.image)?e:r.image})}var d=a(6010),m=a(7524),u=a(49);function v(){var e=o().metadata;return n.createElement(u.Z,{previous:e.previous,next:e.next})}var f=a(3120),h=a(4364),b=a(5281),p=a(5999);function E(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt;return n.createElement(p.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function g(e){var t=e.lastUpdatedBy;return n.createElement(p.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function L(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt,l=e.lastUpdatedBy;return n.createElement("span",{className:b.k.common.lastUpdated},n.createElement(p.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(E,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:l?n.createElement(g,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}var N=a(4881),Z=a(6233);const k="lastUpdated_vwxv";function _(e){return n.createElement("div",{className:(0,d.Z)(b.k.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(Z.Z,e)))}function C(e){var t=e.editUrl,a=e.lastUpdatedAt,l=e.lastUpdatedBy,r=e.formattedLastUpdatedAt;return n.createElement("div",{className:(0,d.Z)(b.k.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(N.Z,{editUrl:t})),n.createElement("div",{className:(0,d.Z)("col",k)},(a||l)&&n.createElement(L,{lastUpdatedAt:a,formattedLastUpdatedAt:r,lastUpdatedBy:l})))}function x(){var e=o().metadata,t=e.editUrl,a=e.lastUpdatedAt,l=e.formattedLastUpdatedAt,r=e.lastUpdatedBy,i=e.tags,s=i.length>0,c=!!(t||a||r);return s||c?n.createElement("footer",{className:(0,d.Z)(b.k.docs.docFooter,"docusaurus-mt-lg")},s&&n.createElement(_,{tags:i}),c&&n.createElement(C,{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:r,formattedLastUpdatedAt:l})):null}var T=a(6043),H=a(3743),U=a(7462),y=a(3366);const A="tocCollapsibleButton_TO0P",w="tocCollapsibleButtonExpanded_MG3E";var M=["collapsed"];function I(e){var t=e.collapsed,a=(0,y.Z)(e,M);return n.createElement("button",(0,U.Z)({type:"button"},a,{className:(0,d.Z)("clean-btn",A,!t&&w,a.className)}),n.createElement(p.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page"))}const B="tocCollapsible_ETCw",O="tocCollapsibleContent_vkbj",S="tocCollapsibleExpanded_sAul";function V(e){var t=e.toc,a=e.className,l=e.minHeadingLevel,r=e.maxHeadingLevel,i=(0,T.u)({initialState:!0}),s=i.collapsed,o=i.toggleCollapsed;return n.createElement("div",{className:(0,d.Z)(B,!s&&S,a)},n.createElement(I,{collapsed:s,onClick:o}),n.createElement(T.z,{lazy:!0,className:O,collapsed:s},n.createElement(H.Z,{toc:t,minHeadingLevel:l,maxHeadingLevel:r})))}const D="tocMobile_ITEo";function P(){var e=o(),t=e.toc,a=e.frontMatter;return n.createElement(V,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:(0,d.Z)(b.k.docs.docTocMobile,D)})}var R=a(9407);function F(){var e=o(),t=e.toc,a=e.frontMatter;return n.createElement(R.Z,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:b.k.docs.docTocDesktop})}var j=a(2503),z=a(7525);function q(e){var t,a,l,r,i=e.children,s=(t=o(),a=t.metadata,l=t.frontMatter,r=t.contentTitle,l.hide_title||void 0!==r?null:a.title);return n.createElement("div",{className:(0,d.Z)(b.k.docs.docMarkdown,"markdown")},s&&n.createElement("header",null,n.createElement(j.Z,{as:"h1"},s)),n.createElement(z.Z,null,i))}var G=a(1310);const J="docItemContainer_Djhp",Y="docItemCol_VOVn";function K(e){var t,a,l,r,i,s,c=e.children,u=(t=o(),a=t.frontMatter,l=t.toc,r=(0,m.i)(),i=a.hide_table_of_contents,s=!i&&l.length>0,{hidden:i,mobile:s?n.createElement(P,null):void 0,desktop:!s||"desktop"!==r&&"ssr"!==r?void 0:n.createElement(F,null)});return n.createElement("div",{className:"row"},n.createElement("div",{className:(0,d.Z)("col",!u.hidden&&Y)},n.createElement(f.Z,null),n.createElement("div",{className:J},n.createElement("article",null,n.createElement(G.Z,null),n.createElement(h.Z,null),u.mobile,n.createElement(q,null,c),n.createElement(x,null)),n.createElement(v,null))),u.desktop&&n.createElement("div",{className:"col col--3"},u.desktop))}function Q(e){var t="docs-doc-id-"+e.content.metadata.unversionedId,a=e.content;return n.createElement(s,{content:e.content},n.createElement(l.FG,{className:t},n.createElement(c,null),n.createElement(K,null,n.createElement(a,null))))}},49:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7462),l=a(7294),r=a(5999),i=a(2244);function s(e){var t=e.previous,a=e.next;return l.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,r.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages",description:"The ARIA label for the docs pagination"})},t&&l.createElement(i.Z,(0,n.Z)({},t,{subLabel:l.createElement(r.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),a&&l.createElement(i.Z,(0,n.Z)({},a,{subLabel:l.createElement(r.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}},4364:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(7294),l=a(6010),r=a(5999),i=a(5281),s=a(4477);function o(e){var t=e.className,a=(0,s.E)();return a.badge?n.createElement("span",{className:(0,l.Z)(t,i.k.docs.docVersionBadge,"badge badge--secondary")},n.createElement(r.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:a.label}},"Version: {versionLabel}")):null}},3120:(e,t,a)=>{a.d(t,{Z:()=>b});var n=a(7294),l=a(6010),r=a(2263),i=a(9960),s=a(5999),o=a(143),c=a(5281),d=a(373),m=a(4477);var u={unreleased:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(s.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(s.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function v(e){var t=u[e.versionMetadata.banner];return n.createElement(t,e)}function f(e){var t=e.versionLabel,a=e.to,l=e.onClick;return n.createElement(s.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(i.Z,{to:a,onClick:l},n.createElement(s.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function h(e){var t,a=e.className,i=e.versionMetadata,s=(0,r.Z)().siteConfig.title,m=(0,o.gA)({failfast:!0}).pluginId,u=(0,d.J)(m).savePreferredVersionName,h=(0,o.Jo)(m),b=h.latestDocSuggestion,p=h.latestVersionSuggestion,E=null!=b?b:(t=p).docs.find((function(e){return e.id===t.mainDocId}));return n.createElement("div",{className:(0,l.Z)(a,c.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(v,{siteTitle:s,versionMetadata:i})),n.createElement("div",{className:"margin-top--md"},n.createElement(f,{versionLabel:p.label,to:E.path,onClick:function(){return u(p.name)}})))}function b(e){var t=e.className,a=(0,m.E)();return a.banner?n.createElement(h,{className:t,versionMetadata:a}):null}},9407:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(7462),l=a(3366),r=a(7294),i=a(6010),s=a(3743);const o="tableOfContents_bqdL";var c=["className"];function d(e){var t=e.className,a=(0,l.Z)(e,c);return r.createElement("div",{className:(0,i.Z)(o,"thin-scrollbar",t)},r.createElement(s.Z,(0,n.Z)({},a,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},3743:(e,t,a)=>{a.d(t,{Z:()=>p});var n=a(7462),l=a(3366),r=a(7294),i=a(6668),s=["parentIndex"];function o(e){var t=e.map((function(e){return Object.assign({},e,{parentIndex:-1,children:[]})})),a=Array(7).fill(-1);t.forEach((function(e,t){var n=a.slice(2,e.level);e.parentIndex=Math.max.apply(Math,n),a[e.level]=t}));var n=[];return t.forEach((function(e){var a=e.parentIndex,r=(0,l.Z)(e,s);a>=0?t[a].children.push(r):n.push(r)})),n}function c(e){var t=e.toc,a=e.minHeadingLevel,n=e.maxHeadingLevel;return t.flatMap((function(e){var t=c({toc:e.children,minHeadingLevel:a,maxHeadingLevel:n});return function(e){return e.level>=a&&e.level<=n}(e)?[Object.assign({},e,{children:t})]:t}))}function d(e){var t=e.getBoundingClientRect();return t.top===t.bottom?d(e.parentNode):t}function m(e,t){var a,n,l=t.anchorTopOffset,r=e.find((function(e){return d(e).top>=l}));return r?function(e){return e.top>0&&e.bottom<window.innerHeight/2}(d(r))?r:null!=(n=e[e.indexOf(r)-1])?n:null:null!=(a=e[e.length-1])?a:null}function u(){var e=(0,r.useRef)(0),t=(0,i.L)().navbar.hideOnScroll;return(0,r.useEffect)((function(){e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function v(e){var t=(0,r.useRef)(void 0),a=u();(0,r.useEffect)((function(){if(!e)return function(){};var n=e.linkClassName,l=e.linkActiveClassName,r=e.minHeadingLevel,i=e.maxHeadingLevel;function s(){var e=function(e){return Array.from(document.getElementsByClassName(e))}(n),s=function(e){for(var t=e.minHeadingLevel,a=e.maxHeadingLevel,n=[],l=t;l<=a;l+=1)n.push("h"+l+".anchor");return Array.from(document.querySelectorAll(n.join()))}({minHeadingLevel:r,maxHeadingLevel:i}),o=m(s,{anchorTopOffset:a.current}),c=e.find((function(e){return o&&o.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)}));e.forEach((function(e){!function(e,a){a?(t.current&&t.current!==e&&t.current.classList.remove(l),e.classList.add(l),t.current=e):e.classList.remove(l)}(e,e===c)}))}return document.addEventListener("scroll",s),document.addEventListener("resize",s),s(),function(){document.removeEventListener("scroll",s),document.removeEventListener("resize",s)}}),[e,a])}function f(e){var t=e.toc,a=e.className,n=e.linkClassName,l=e.isChild;return t.length?r.createElement("ul",{className:l?void 0:a},t.map((function(e){return r.createElement("li",{key:e.id},r.createElement("a",{href:"#"+e.id,className:null!=n?n:void 0,dangerouslySetInnerHTML:{__html:e.value}}),r.createElement(f,{isChild:!0,toc:e.children,className:a,linkClassName:n}))}))):null}const h=r.memo(f);var b=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function p(e){var t=e.toc,a=e.className,s=void 0===a?"table-of-contents table-of-contents__left-border":a,d=e.linkClassName,m=void 0===d?"table-of-contents__link":d,u=e.linkActiveClassName,f=void 0===u?void 0:u,p=e.minHeadingLevel,E=e.maxHeadingLevel,g=(0,l.Z)(e,b),L=(0,i.L)(),N=null!=p?p:L.tableOfContents.minHeadingLevel,Z=null!=E?E:L.tableOfContents.maxHeadingLevel,k=function(e){var t=e.toc,a=e.minHeadingLevel,n=e.maxHeadingLevel;return(0,r.useMemo)((function(){return c({toc:o(t),minHeadingLevel:a,maxHeadingLevel:n})}),[t,a,n])}({toc:t,minHeadingLevel:N,maxHeadingLevel:Z});return v((0,r.useMemo)((function(){if(m&&f)return{linkClassName:m,linkActiveClassName:f,minHeadingLevel:N,maxHeadingLevel:Z}}),[m,f,N,Z])),r.createElement(h,(0,n.Z)({toc:k,className:s,linkClassName:m},g))}}}]);