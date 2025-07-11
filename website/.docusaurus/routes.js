import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
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
    component: ComponentCreator('/docs', '43b'),
    routes: [
      {
        path: '/docs/next',
        component: ComponentCreator('/docs/next', '812'),
        routes: [
          {
            path: '/docs/next',
            component: ComponentCreator('/docs/next', '74c'),
            routes: [
              {
                path: '/docs/next/',
                component: ComponentCreator('/docs/next/', 'f9c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/next/2a_modelling_objects_on_disk', '621'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/next/2b_modelling_objects_in_memory', '1af'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/bulk',
                component: ComponentCreator('/docs/next/bulk', '09d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/category/chemistry',
                component: ComponentCreator('/docs/next/category/chemistry', '814'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/category/developer',
                component: ComponentCreator('/docs/next/category/developer', '9b0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/category/getting-started',
                component: ComponentCreator('/docs/next/category/getting-started', '457'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/category/tutorials',
                component: ComponentCreator('/docs/next/category/tutorials', '298'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/chemical_analysis',
                component: ComponentCreator('/docs/next/chemical_analysis', '47b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/desorb',
                component: ComponentCreator('/docs/next/desorb', '3e0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/dev-debugging',
                component: ComponentCreator('/docs/next/dev-debugging', 'b32'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/dev-overview',
                component: ComponentCreator('/docs/next/dev-overview', '877'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/dev-python-wrap',
                component: ComponentCreator('/docs/next/dev-python-wrap', '6c6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/dev-web',
                component: ComponentCreator('/docs/next/dev-web', 'd77'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/first_model',
                component: ComponentCreator('/docs/next/first_model', '0ef'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/gas',
                component: ComponentCreator('/docs/next/gas', '884'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/grain',
                component: ComponentCreator('/docs/next/grain', 'eaf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/hydro',
                component: ComponentCreator('/docs/next/hydro', '8a0'),
                exact: true
              },
              {
                path: '/docs/next/network',
                component: ComponentCreator('/docs/next/network', 'f26'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/notation',
                component: ComponentCreator('/docs/next/notation', '0b7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/parameters',
                component: ComponentCreator('/docs/next/parameters', '4f9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/physics-cloud',
                component: ComponentCreator('/docs/next/physics-cloud', 'e9f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/physics-collapse',
                component: ComponentCreator('/docs/next/physics-collapse', '587'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/physics-core',
                component: ComponentCreator('/docs/next/physics-core', '351'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/physics-hotcore',
                component: ComponentCreator('/docs/next/physics-hotcore', '91a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/physics-shocks',
                component: ComponentCreator('/docs/next/physics-shocks', 'f45'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/pythonapi',
                component: ComponentCreator('/docs/next/pythonapi', 'd9f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/running_a_grid',
                component: ComponentCreator('/docs/next/running_a_grid', 'f03'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/trouble-compile',
                component: ComponentCreator('/docs/next/trouble-compile', 'ccc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/trouble-integration',
                component: ComponentCreator('/docs/next/trouble-integration', '854'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      },
      {
        path: '/docs/v3.4.0',
        component: ComponentCreator('/docs/v3.4.0', 'f69'),
        routes: [
          {
            path: '/docs/v3.4.0',
            component: ComponentCreator('/docs/v3.4.0', '73b'),
            routes: [
              {
                path: '/docs/v3.4.0/',
                component: ComponentCreator('/docs/v3.4.0/', '98d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/v3.4.0/2a_modelling_objects_on_disk', '99a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/v3.4.0/2b_modelling_objects_in_memory', '06c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/bulk',
                component: ComponentCreator('/docs/v3.4.0/bulk', 'cfc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/category/chemistry',
                component: ComponentCreator('/docs/v3.4.0/category/chemistry', '310'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/category/developer',
                component: ComponentCreator('/docs/v3.4.0/category/developer', 'a6f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/category/getting-started',
                component: ComponentCreator('/docs/v3.4.0/category/getting-started', 'dc7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/category/tutorials',
                component: ComponentCreator('/docs/v3.4.0/category/tutorials', '71c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/chemical_analysis',
                component: ComponentCreator('/docs/v3.4.0/chemical_analysis', '790'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/desorb',
                component: ComponentCreator('/docs/v3.4.0/desorb', '32c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/dev-debugging',
                component: ComponentCreator('/docs/v3.4.0/dev-debugging', '1a7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/dev-overview',
                component: ComponentCreator('/docs/v3.4.0/dev-overview', '8d8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/dev-python-wrap',
                component: ComponentCreator('/docs/v3.4.0/dev-python-wrap', '684'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/dev-web',
                component: ComponentCreator('/docs/v3.4.0/dev-web', 'a82'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/first_model',
                component: ComponentCreator('/docs/v3.4.0/first_model', '041'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/gas',
                component: ComponentCreator('/docs/v3.4.0/gas', '1c9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/grain',
                component: ComponentCreator('/docs/v3.4.0/grain', 'c2f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/hydro',
                component: ComponentCreator('/docs/v3.4.0/hydro', 'c12'),
                exact: true
              },
              {
                path: '/docs/v3.4.0/network',
                component: ComponentCreator('/docs/v3.4.0/network', '40e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/notation',
                component: ComponentCreator('/docs/v3.4.0/notation', '33a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/parameters',
                component: ComponentCreator('/docs/v3.4.0/parameters', '429'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/physics-cloud',
                component: ComponentCreator('/docs/v3.4.0/physics-cloud', '119'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/physics-collapse',
                component: ComponentCreator('/docs/v3.4.0/physics-collapse', 'a59'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/physics-core',
                component: ComponentCreator('/docs/v3.4.0/physics-core', 'f3b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/physics-hotcore',
                component: ComponentCreator('/docs/v3.4.0/physics-hotcore', 'e22'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/physics-shocks',
                component: ComponentCreator('/docs/v3.4.0/physics-shocks', '58d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/pythonapi',
                component: ComponentCreator('/docs/v3.4.0/pythonapi', '199'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/running_a_grid',
                component: ComponentCreator('/docs/v3.4.0/running_a_grid', '85b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/trouble-compile',
                component: ComponentCreator('/docs/v3.4.0/trouble-compile', '9f5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.4.0/trouble-integration',
                component: ComponentCreator('/docs/v3.4.0/trouble-integration', 'a0d'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      },
      {
        path: '/docs',
        component: ComponentCreator('/docs', '561'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'd6d'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '9ad'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/2a_modelling_objects_on_disk', 'e0a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/2b_modelling_objects_in_memory', '634'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/bulk',
                component: ComponentCreator('/docs/bulk', 'b7d'),
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
                component: ComponentCreator('/docs/chemical_analysis', 'fa6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/desorb',
                component: ComponentCreator('/docs/desorb', 'bf9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-debugging',
                component: ComponentCreator('/docs/dev-debugging', '8ba'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-overview',
                component: ComponentCreator('/docs/dev-overview', '86c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-python-wrap',
                component: ComponentCreator('/docs/dev-python-wrap', '870'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-web',
                component: ComponentCreator('/docs/dev-web', 'ddf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/first_model',
                component: ComponentCreator('/docs/first_model', '278'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/gas',
                component: ComponentCreator('/docs/gas', '5a5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/grain',
                component: ComponentCreator('/docs/grain', '77c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/hydro',
                component: ComponentCreator('/docs/hydro', '2a6'),
                exact: true
              },
              {
                path: '/docs/network',
                component: ComponentCreator('/docs/network', '9f4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/notation',
                component: ComponentCreator('/docs/notation', 'ade'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/parameters',
                component: ComponentCreator('/docs/parameters', '013'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-cloud',
                component: ComponentCreator('/docs/physics-cloud', 'a39'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-collapse',
                component: ComponentCreator('/docs/physics-collapse', 'c2d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-core',
                component: ComponentCreator('/docs/physics-core', '3e7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-hotcore',
                component: ComponentCreator('/docs/physics-hotcore', '18b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-shocks',
                component: ComponentCreator('/docs/physics-shocks', '6d2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/pythonapi',
                component: ComponentCreator('/docs/pythonapi', 'a59'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/running_a_grid',
                component: ComponentCreator('/docs/running_a_grid', '8ab'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-compile',
                component: ComponentCreator('/docs/trouble-compile', '827'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-integration',
                component: ComponentCreator('/docs/trouble-integration', '80a'),
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
