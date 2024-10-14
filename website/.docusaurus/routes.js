import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/3dpdr',
    component: ComponentCreator('/3dpdr', '3b8'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'b8f'),
    exact: true
  },
  {
    path: '/blog/2018/02/05/david-grains',
    component: ComponentCreator('/blog/2018/02/05/david-grains', '20c'),
    exact: true
  },
  {
    path: '/blog/2018/03/27/audrey-coms',
    component: ComponentCreator('/blog/2018/03/27/audrey-coms', '9cc'),
    exact: true
  },
  {
    path: '/blog/2018/06/20/izaskun-phosphorus',
    component: ComponentCreator('/blog/2018/06/20/izaskun-phosphorus', '69b'),
    exact: true
  },
  {
    path: '/blog/2018/07/12/felix-collapse',
    component: ComponentCreator('/blog/2018/07/12/felix-collapse', '214'),
    exact: true
  },
  {
    path: '/blog/2019/04/19/serena-nitrogen-frac',
    component: ComponentCreator('/blog/2019/04/19/serena-nitrogen-frac', 'fd2'),
    exact: true
  },
  {
    path: '/blog/2019/07/08/felix-ambipolar',
    component: ComponentCreator('/blog/2019/07/08/felix-ambipolar', '82a'),
    exact: true
  },
  {
    path: '/blog/2019/08/13/serena-carbon-frac',
    component: ComponentCreator('/blog/2019/08/13/serena-carbon-frac', '373'),
    exact: true
  },
  {
    path: '/blog/2019/12/10/tom-shock',
    component: ComponentCreator('/blog/2019/12/10/tom-shock', '626'),
    exact: true
  },
  {
    path: '/blog/2020/02/14/New-Website',
    component: ComponentCreator('/blog/2020/02/14/New-Website', '61e'),
    exact: true
  },
  {
    path: '/blog/2020/12/07/milena-nitrogen-solis',
    component: ComponentCreator('/blog/2020/12/07/milena-nitrogen-solis', '25a'),
    exact: true
  },
  {
    path: '/blog/2022/02/06/holdship-hits',
    component: ComponentCreator('/blog/2022/02/06/holdship-hits', 'd70'),
    exact: true
  },
  {
    path: '/blog/2022/04/14/crir-ngc253',
    component: ComponentCreator('/blog/2022/04/14/crir-ngc253', '23f'),
    exact: true
  },
  {
    path: '/blog/2022/04/29/uclchem-v3',
    component: ComponentCreator('/blog/2022/04/29/uclchem-v3', 'dd8'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/page/2',
    component: ComponentCreator('/blog/page/2', '20c'),
    exact: true
  },
  {
    path: '/emulators',
    component: ComponentCreator('/emulators', '78f'),
    exact: true
  },
  {
    path: '/help',
    component: ComponentCreator('/help', '96d'),
    exact: true
  },
  {
    path: '/othersoftware',
    component: ComponentCreator('/othersoftware', 'd8b'),
    exact: true
  },
  {
    path: '/ucl_pdr',
    component: ComponentCreator('/ucl_pdr', 'a50'),
    exact: true
  },
  {
    path: '/uclchemcmc',
    component: ComponentCreator('/uclchemcmc', '3bb'),
    exact: true
  },
  {
    path: '/users',
    component: ComponentCreator('/users', 'dc8'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'a9b'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'f83'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'fdf'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '81b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/2a_modelling_objects_on_disk', '748'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/2b_modelling_objects_in_memory', 'dcc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/bulk',
                component: ComponentCreator('/docs/bulk', 'c65'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/category/chemistry',
                component: ComponentCreator('/docs/category/chemistry', 'c77'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/category/developer',
                component: ComponentCreator('/docs/category/developer', '926'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/category/getting-started',
                component: ComponentCreator('/docs/category/getting-started', '45a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/category/tutorials',
                component: ComponentCreator('/docs/category/tutorials', '97e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/chemical_analysis',
                component: ComponentCreator('/docs/chemical_analysis', '72a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/desorb',
                component: ComponentCreator('/docs/desorb', 'd2d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-debugging',
                component: ComponentCreator('/docs/dev-debugging', '15b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-overview',
                component: ComponentCreator('/docs/dev-overview', 'd79'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-python-wrap',
                component: ComponentCreator('/docs/dev-python-wrap', '99f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-web',
                component: ComponentCreator('/docs/dev-web', '0ac'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/first_model',
                component: ComponentCreator('/docs/first_model', 'bab'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/gas',
                component: ComponentCreator('/docs/gas', 'e24'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/grain',
                component: ComponentCreator('/docs/grain', '6c1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/hydro',
                component: ComponentCreator('/docs/hydro', '97b'),
                exact: true
              },
              {
                path: '/docs/network',
                component: ComponentCreator('/docs/network', '01b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/notation',
                component: ComponentCreator('/docs/notation', '19a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/parameters',
                component: ComponentCreator('/docs/parameters', '204'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-cloud',
                component: ComponentCreator('/docs/physics-cloud', '688'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-collapse',
                component: ComponentCreator('/docs/physics-collapse', '454'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-core',
                component: ComponentCreator('/docs/physics-core', '7c8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-hotcore',
                component: ComponentCreator('/docs/physics-hotcore', 'd36'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-shocks',
                component: ComponentCreator('/docs/physics-shocks', 'd5a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/pythonapi',
                component: ComponentCreator('/docs/pythonapi', '9e8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/running_a_grid',
                component: ComponentCreator('/docs/running_a_grid', '470'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-compile',
                component: ComponentCreator('/docs/trouble-compile', 'acc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-integration',
                component: ComponentCreator('/docs/trouble-integration', '486'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
