"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3089],{8665:(e,t,a)=>{a.d(t,{Z:()=>b});var r=a(3366),l=a(7294),n=a(6010),i=a(2600),m=a(9960);const s="sidebar_a9qW",o="sidebarItemTitle_uKok",c="sidebarItemList_Kvuv",d="sidebarItem_CF0Q",g="sidebarItemLink_miNk",u="sidebarItemLinkActive_RRTD";var p=a(5999);function v(e){var t=e.sidebar;return 0===t.items.length?null:l.createElement("nav",{className:(0,n.Z)(s,"thin-scrollbar"),"aria-label":(0,p.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},l.createElement("div",{className:(0,n.Z)(o,"margin-bottom--md")},t.title),l.createElement("ul",{className:c},t.items.map((function(e){return l.createElement("li",{key:e.permalink,className:d},l.createElement(m.Z,{isNavLink:!0,to:e.permalink,className:g,activeClassName:u},e.title))}))))}var E=["sidebar","toc","children"];function b(e){var t=e.sidebar,a=e.toc,m=e.children,s=(0,r.Z)(e,E),o=t&&t.items.length>0;return l.createElement(i.Z,s,l.createElement("div",{className:"container margin-vert--lg"},l.createElement("div",{className:"row"},o&&l.createElement("aside",{className:"col col--3"},l.createElement(v,{sidebar:t})),l.createElement("main",{className:(0,n.Z)("col",{"col--7":o,"col--9 col--offset-1":!o}),itemScope:!0,itemType:"http://schema.org/Blog"},m),a&&l.createElement("div",{className:"col col--2"},a))))}},2754:(e,t,a)=>{a.r(t),a.d(t,{default:()=>v});var r=a(7294),l=a(2263),n=a(8665),i=a(8561),m=a(5999),s=a(1750);function o(e){var t=e.metadata,a=t.previousPage,l=t.nextPage;return r.createElement("nav",{className:"pagination-nav","aria-label":(0,m.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"})},r.createElement("div",{className:"pagination-nav__item"},a&&r.createElement(s.Z,{permalink:a,title:r.createElement(m.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)"},"Newer Entries")})),r.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},l&&r.createElement(s.Z,{permalink:l,title:r.createElement(m.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)"},"Older Entries")})))}var c=a(5979),d=a(4739),g=a(6010);function u(e){var t=e.metadata,a=(0,l.Z)().siteConfig.title,n=t.blogDescription,i=t.blogTitle,m="/"===t.permalink?a:i;return r.createElement(r.Fragment,null,r.createElement(c.d,{title:m,description:n}),r.createElement(d.Z,{tag:"blog_posts_list"}))}function p(e){var t=e.metadata,a=e.items,l=e.sidebar;return r.createElement(n.Z,{sidebar:l},a.map((function(e){var t=e.content;return r.createElement(i.Z,{key:t.metadata.permalink,frontMatter:t.frontMatter,assets:t.assets,metadata:t.metadata,truncated:t.metadata.truncated},r.createElement(t,null))})),r.createElement(o,{metadata:t}))}function v(e){return r.createElement(c.FG,{className:(0,g.Z)(c.kM.wrapper.blogPages,c.kM.page.blogListPage)},r.createElement(u,e),r.createElement(p,e))}},8561:(e,t,a)=>{a.d(t,{Z:()=>k});var r=a(7294),l=a(6010),n=a(5999),i=a(9960),m=a(4996),s=a(5979),o=a(8780),c=a(7459),d=a(6753);const g="blogPostTitle_rzP5",u="blogPostData_Zg1s",p="blogPostDetailsFull_h6_j";var v=a(8727);const E="image_o0gy";function b(e){return e.href?r.createElement(i.Z,e):r.createElement(r.Fragment,null,e.children)}function h(e){var t=e.author,a=t.name,l=t.title,n=t.url,i=t.imageURL,m=t.email,s=n||m&&"mailto:"+m||void 0;return r.createElement("div",{className:"avatar margin-bottom--sm"},i&&r.createElement("span",{className:"avatar__photo-link avatar__photo"},r.createElement(b,{href:s},r.createElement("img",{className:E,src:i,alt:a}))),a&&r.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},r.createElement("div",{className:"avatar__name"},r.createElement(b,{href:s,itemProp:"url"},r.createElement("span",{itemProp:"name"},a))),l&&r.createElement("small",{className:"avatar__subtitle",itemProp:"description"},l)))}const f="authorCol_FlmR",N="imageOnlyAuthorRow_trpF",_="imageOnlyAuthorCol_S2np";function Z(e){var t=e.authors,a=e.assets;if(0===t.length)return null;var n=t.every((function(e){return!e.name}));return r.createElement("div",{className:(0,l.Z)("margin-top--md margin-bottom--sm",n?N:"row")},t.map((function(e,t){var i;return r.createElement("div",{className:(0,l.Z)(!n&&"col col--6",n?_:f),key:t},r.createElement(h,{author:Object.assign({},e,{imageURL:null!=(i=a.authorsImageUrls[t])?i:e.imageURL})}))})))}function k(e){var t,a,E=(a=(0,s.c2)().selectMessage,function(e){var t=Math.ceil(e);return a(t,(0,n.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:t}))}),b=(0,m.C)().withBaseUrl,h=e.children,f=e.frontMatter,N=e.assets,_=e.metadata,k=e.truncated,P=e.isBlogPostPage,T=void 0!==P&&P,w=_.date,I=_.formattedDate,y=_.permalink,R=_.tags,A=_.readingTime,L=_.title,M=_.editUrl,C=_.authors,x=null!=(t=N.image)?t:f.image,F=!T&&k,U=R.length>0,B=T?"h1":"h2";return r.createElement("article",{className:T?void 0:"margin-bottom--xl",itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},r.createElement("header",null,r.createElement(B,{className:g,itemProp:"headline"},T?L:r.createElement(i.Z,{itemProp:"url",to:y},L)),r.createElement("div",{className:(0,l.Z)(u,"margin-vert--md")},r.createElement("time",{dateTime:w,itemProp:"datePublished"},I),void 0!==A&&r.createElement(r.Fragment,null," \xb7 ",E(A))),r.createElement(Z,{authors:C,assets:N})),x&&r.createElement("meta",{itemProp:"image",content:b(x,{absolute:!0})}),r.createElement("div",{id:T?o.blogPostContainerID:void 0,className:"markdown",itemProp:"articleBody"},r.createElement(c.Z,null,h)),(U||k)&&r.createElement("footer",{className:(0,l.Z)("row docusaurus-mt-lg",T&&p)},U&&r.createElement("div",{className:(0,l.Z)("col",{"col--9":F})},r.createElement(v.Z,{tags:R})),T&&M&&r.createElement("div",{className:"col margin-top--sm"},r.createElement(d.Z,{editUrl:M})),F&&r.createElement("div",{className:(0,l.Z)("col text--right",{"col--3":U})},r.createElement(i.Z,{to:_.permalink,"aria-label":(0,n.I)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:L})},r.createElement("b",null,r.createElement(n.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))))))}}}]);