const math = require('remark-math');
const katex = require('rehype-katex');
module.exports={
  title: "UCLCHEM",
  tagline: "A Gas-Grain Chemical Code for astrochemical modelling",
  url: "https://uclchem.github.io",
  baseUrl: "/",
  organizationName: "uclchem",
  projectName: "uclchem.github.io",
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.css',
      type: 'text/css'
    },
  ],
  scripts: [
    "https://buttons.github.io/buttons.js"
  ],
  favicon: "img/uclchem-logo.jpg",
  customFields: {
    "users": [
      {
        "caption": "Jon Holdship",
        "image": "https://avatars0.githubusercontent.com/u/11349588?s=460&v=4",
        "infoLink": "https://github.com/jonholdship",
        "pinned": true
      }
    ],
    repoUrl: "https://github.com/uclchem/uclchem"
  },
 onBrokenLinks: "log",
  onBrokenMarkdownLinks: "log",
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "path": "../website/docs",
          sidebarPath: require.resolve('./sidebars.js'),
          "remarkPlugins": [math],
          "rehypePlugins": [katex],
          "versions":{
            "current":{
              label: "Develop 🚧"
	    },
	  },
        },
        "blog": {
          "path": "blog",
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL'
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
        googleAnalytics: {
          trackingID: 'UA-186542401-1',
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
         },
      }
    ]
  ],
  themeConfig: {
   
    prism: {
        additionalLanguages: ['fortran'],
        theme: require('prism-react-renderer').themes.dracula,
    },
    "navbar": {
      "title": "UCLCHEM",
      "logo": {
        "src": "img/uclchem-logo.jpg"
      },
      "items": [
        {
          "to": "docs/",
          "label": "Docs",
          "position": "left"
        },
                {
          "to": "/blog",
          "label": "Blog",
          "position": "left"
        },
        {
          "to": "/",
          "label": "UCLCHEM",
          "position": "left"
        },
        {
          "href": "/3dpdr",
          "label": "3D-PDR",
          "position": "left"
        },
        {
          "href": "/emulators",
          "label": "Emulators",
          "position": "left"
        },
        {
          "to": "/ucl_pdr",
          "label": "UCLPDR",
          "position": "left"
        },
        {
          "to":"/uclchemcmc",
          "label":"UCLCHEMCMC",
          "position":"left"
        },
        {
          "to":"/othersoftware",
          "label":"Other",
          "position":"left"
        },
	{"type":'docsVersionDropdown',
	"position":"right"}
      ]
    },
    "image": "img/undraw_online.svg",
    "footer": {
      "links": [],
      "copyright": "Copyright © 2023 Leiden University",
      "logo": {
        "src": "img/uclchem-logo.jpg"
      }
    }
  }
}
