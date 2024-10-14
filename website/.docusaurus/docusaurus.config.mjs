/*
 * AUTOGENERATED - DON'T EDIT
 * Your edits in this file will be overwritten in the next build!
 * Modify the docusaurus.config.js file at your site's root instead.
 */
export default {
  "title": "UCLCHEM",
  "tagline": "A Gas-Grain Chemical Code for astrochemical modelling",
  "url": "https://uclchem.github.io",
  "baseUrl": "/",
  "organizationName": "uclchem",
  "projectName": "uclchem.github.io",
  "stylesheets": [
    {
      "href": "https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.css",
      "type": "text/css"
    }
  ],
  "scripts": [
    "https://buttons.github.io/buttons.js"
  ],
  "favicon": "img/uclchem-logo.jpg",
  "customFields": {
    "users": [
      {
        "caption": "Jon Holdship",
        "image": "https://avatars0.githubusercontent.com/u/11349588?s=460&v=4",
        "infoLink": "https://github.com/jonholdship",
        "pinned": true
      }
    ],
    "repoUrl": "https://github.com/uclchem/uclchem"
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "path": "../website/docs",
          "sidebarPath": "/Users/gijsv/uclchem/uclchem.github.io/website/sidebars.js",
          "remarkPlugins": [
            null
          ],
          "rehypePlugins": [
            null
          ],
          "versions": {
            "current": {
              "label": "Develop 🚧"
            }
          }
        },
        "blog": {
          "path": "blog",
          "blogSidebarTitle": "All posts",
          "blogSidebarCount": "ALL"
        },
        "theme": {
          "customCss": [
            "/Users/gijsv/uclchem/uclchem.github.io/website/src/css/custom.css"
          ]
        },
        "googleAnalytics": {
          "trackingID": "UA-186542401-1",
          "anonymizeIP": true
        }
      }
    ]
  ],
  "themeConfig": {
    "prism": {
      "additionalLanguages": [
        "fortran"
      ],
      "theme": {
        "plain": {
          "color": "#F8F8F2",
          "backgroundColor": "#282A36"
        },
        "styles": [
          {
            "types": [
              "prolog",
              "constant",
              "builtin"
            ],
            "style": {
              "color": "rgb(189, 147, 249)"
            }
          },
          {
            "types": [
              "inserted",
              "function"
            ],
            "style": {
              "color": "rgb(80, 250, 123)"
            }
          },
          {
            "types": [
              "deleted"
            ],
            "style": {
              "color": "rgb(255, 85, 85)"
            }
          },
          {
            "types": [
              "changed"
            ],
            "style": {
              "color": "rgb(255, 184, 108)"
            }
          },
          {
            "types": [
              "punctuation",
              "symbol"
            ],
            "style": {
              "color": "rgb(248, 248, 242)"
            }
          },
          {
            "types": [
              "string",
              "char",
              "tag",
              "selector"
            ],
            "style": {
              "color": "rgb(255, 121, 198)"
            }
          },
          {
            "types": [
              "keyword",
              "variable"
            ],
            "style": {
              "color": "rgb(189, 147, 249)",
              "fontStyle": "italic"
            }
          },
          {
            "types": [
              "comment"
            ],
            "style": {
              "color": "rgb(98, 114, 164)"
            }
          },
          {
            "types": [
              "attr-name"
            ],
            "style": {
              "color": "rgb(241, 250, 140)"
            }
          }
        ]
      },
      "magicComments": [
        {
          "className": "theme-code-block-highlighted-line",
          "line": "highlight-next-line",
          "block": {
            "start": "highlight-start",
            "end": "highlight-end"
          }
        }
      ]
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
          "to": "/uclchemcmc",
          "label": "UCLCHEMCMC",
          "position": "left"
        },
        {
          "to": "/othersoftware",
          "label": "Other",
          "position": "left"
        },
        {
          "type": "docsVersionDropdown",
          "position": "right",
          "dropdownItemsBefore": [],
          "dropdownItemsAfter": []
        }
      ],
      "hideOnScroll": false
    },
    "image": "img/undraw_online.svg",
    "footer": {
      "links": [],
      "copyright": "Copyright © 2023 Leiden University",
      "logo": {
        "src": "img/uclchem-logo.jpg"
      },
      "style": "light"
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false
    },
    "docs": {
      "versionPersistence": "localStorage",
      "sidebar": {
        "hideable": false,
        "autoCollapseCategories": false
      }
    },
    "blog": {
      "sidebar": {
        "groupByYear": true
      }
    },
    "metadata": [],
    "tableOfContents": {
      "minHeadingLevel": 2,
      "maxHeadingLevel": 3
    }
  },
  "baseUrlIssueBanner": true,
  "i18n": {
    "defaultLocale": "en",
    "path": "i18n",
    "locales": [
      "en"
    ],
    "localeConfigs": {}
  },
  "future": {
    "experimental_storage": {
      "type": "localStorage",
      "namespace": false
    },
    "experimental_router": "browser"
  },
  "onBrokenAnchors": "warn",
  "onDuplicateRoutes": "warn",
  "staticDirectories": [
    "static"
  ],
  "plugins": [],
  "themes": [],
  "headTags": [],
  "clientModules": [],
  "titleDelimiter": "|",
  "noIndex": false,
  "markdown": {
    "format": "mdx",
    "mermaid": false,
    "mdx1Compat": {
      "comments": true,
      "admonitions": true,
      "headingIds": true
    },
    "anchors": {
      "maintainCase": false
    }
  }
};
