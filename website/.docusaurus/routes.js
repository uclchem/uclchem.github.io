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
    component: ComponentCreator('/blog', '503'),
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
    path: '/blog/2025/07/29/uclchem-anno-2025',
    component: ComponentCreator('/blog/2025/07/29/uclchem-anno-2025', '3b8'),
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
    component: ComponentCreator('/blog/page/2', 'b67'),
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
    component: ComponentCreator('/docs', '527'),
    routes: [
      {
        path: '/docs/next',
        component: ComponentCreator('/docs/next', 'd78'),
        routes: [
          {
            path: '/docs/next',
            component: ComponentCreator('/docs/next', 'd55'),
            routes: [
              {
                path: '/docs/next/',
                component: ComponentCreator('/docs/next/', '7f3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/next/2a_modelling_objects_on_disk', '9db'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/next/2b_modelling_objects_in_memory', 'f33'),
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
                component: ComponentCreator('/docs/next/chemical_analysis', '57c'),
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
                component: ComponentCreator('/docs/next/dev-web', 'bbc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/first_model',
                component: ComponentCreator('/docs/next/first_model', '467'),
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
                component: ComponentCreator('/docs/next/network', 'ff6'),
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
                component: ComponentCreator('/docs/next/parameters', '118'),
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
                component: ComponentCreator('/docs/next/pythonapi', '29f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/running_a_grid',
                component: ComponentCreator('/docs/next/running_a_grid', '339'),
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
        path: '/docs/v3.5.0',
        component: ComponentCreator('/docs/v3.5.0', '786'),
        routes: [
          {
            path: '/docs/v3.5.0',
            component: ComponentCreator('/docs/v3.5.0', '27e'),
            routes: [
              {
                path: '/docs/v3.5.0/',
                component: ComponentCreator('/docs/v3.5.0/', '268'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/v3.5.0/2a_modelling_objects_on_disk', '83d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/v3.5.0/2b_modelling_objects_in_memory', 'bc2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/bulk',
                component: ComponentCreator('/docs/v3.5.0/bulk', 'ba0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/category/chemistry',
                component: ComponentCreator('/docs/v3.5.0/category/chemistry', '60d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/category/developer',
                component: ComponentCreator('/docs/v3.5.0/category/developer', '28e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/category/getting-started',
                component: ComponentCreator('/docs/v3.5.0/category/getting-started', '4d2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/category/tutorials',
                component: ComponentCreator('/docs/v3.5.0/category/tutorials', 'dae'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/chemical_analysis',
                component: ComponentCreator('/docs/v3.5.0/chemical_analysis', 'dbb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/desorb',
                component: ComponentCreator('/docs/v3.5.0/desorb', 'b7a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/dev-debugging',
                component: ComponentCreator('/docs/v3.5.0/dev-debugging', 'a85'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/dev-overview',
                component: ComponentCreator('/docs/v3.5.0/dev-overview', '2dc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/dev-python-wrap',
                component: ComponentCreator('/docs/v3.5.0/dev-python-wrap', '2b8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/dev-web',
                component: ComponentCreator('/docs/v3.5.0/dev-web', '101'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/first_model',
                component: ComponentCreator('/docs/v3.5.0/first_model', 'a93'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/gas',
                component: ComponentCreator('/docs/v3.5.0/gas', '81a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/grain',
                component: ComponentCreator('/docs/v3.5.0/grain', 'dd8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/hydro',
                component: ComponentCreator('/docs/v3.5.0/hydro', '5b6'),
                exact: true
              },
              {
                path: '/docs/v3.5.0/network',
                component: ComponentCreator('/docs/v3.5.0/network', '81a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/notation',
                component: ComponentCreator('/docs/v3.5.0/notation', '00e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/parameters',
                component: ComponentCreator('/docs/v3.5.0/parameters', '332'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/physics-cloud',
                component: ComponentCreator('/docs/v3.5.0/physics-cloud', '8e8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/physics-collapse',
                component: ComponentCreator('/docs/v3.5.0/physics-collapse', 'e34'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/physics-core',
                component: ComponentCreator('/docs/v3.5.0/physics-core', 'a74'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/physics-hotcore',
                component: ComponentCreator('/docs/v3.5.0/physics-hotcore', 'aa5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/physics-shocks',
                component: ComponentCreator('/docs/v3.5.0/physics-shocks', '7d0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/pythonapi',
                component: ComponentCreator('/docs/v3.5.0/pythonapi', '03c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/running_a_grid',
                component: ComponentCreator('/docs/v3.5.0/running_a_grid', '078'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/trouble-compile',
                component: ComponentCreator('/docs/v3.5.0/trouble-compile', '8f0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.0/trouble-integration',
                component: ComponentCreator('/docs/v3.5.0/trouble-integration', '70e'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      },
      {
        path: '/docs/v3.5.1',
        component: ComponentCreator('/docs/v3.5.1', 'bf1'),
        routes: [
          {
            path: '/docs/v3.5.1',
            component: ComponentCreator('/docs/v3.5.1', 'a20'),
            routes: [
              {
                path: '/docs/v3.5.1/',
                component: ComponentCreator('/docs/v3.5.1/', 'ac4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/v3.5.1/2a_modelling_objects_on_disk', '81c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/v3.5.1/2b_modelling_objects_in_memory', '3b4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/bulk',
                component: ComponentCreator('/docs/v3.5.1/bulk', 'f34'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/category/chemistry',
                component: ComponentCreator('/docs/v3.5.1/category/chemistry', '1f9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/category/developer',
                component: ComponentCreator('/docs/v3.5.1/category/developer', '6ad'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/category/getting-started',
                component: ComponentCreator('/docs/v3.5.1/category/getting-started', '00f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/category/tutorials',
                component: ComponentCreator('/docs/v3.5.1/category/tutorials', '760'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/chemical_analysis',
                component: ComponentCreator('/docs/v3.5.1/chemical_analysis', 'b25'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/desorb',
                component: ComponentCreator('/docs/v3.5.1/desorb', '768'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/dev-debugging',
                component: ComponentCreator('/docs/v3.5.1/dev-debugging', '3ec'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/dev-overview',
                component: ComponentCreator('/docs/v3.5.1/dev-overview', '447'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/dev-python-wrap',
                component: ComponentCreator('/docs/v3.5.1/dev-python-wrap', '65e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/dev-web',
                component: ComponentCreator('/docs/v3.5.1/dev-web', '161'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/first_model',
                component: ComponentCreator('/docs/v3.5.1/first_model', '5a1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/gas',
                component: ComponentCreator('/docs/v3.5.1/gas', '24d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/grain',
                component: ComponentCreator('/docs/v3.5.1/grain', '39a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/hydro',
                component: ComponentCreator('/docs/v3.5.1/hydro', '7f4'),
                exact: true
              },
              {
                path: '/docs/v3.5.1/network',
                component: ComponentCreator('/docs/v3.5.1/network', 'ed6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/notation',
                component: ComponentCreator('/docs/v3.5.1/notation', '1d6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/parameters',
                component: ComponentCreator('/docs/v3.5.1/parameters', '652'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/physics-cloud',
                component: ComponentCreator('/docs/v3.5.1/physics-cloud', 'ab0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/physics-collapse',
                component: ComponentCreator('/docs/v3.5.1/physics-collapse', '09a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/physics-core',
                component: ComponentCreator('/docs/v3.5.1/physics-core', '1c8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/physics-hotcore',
                component: ComponentCreator('/docs/v3.5.1/physics-hotcore', '4ec'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/physics-shocks',
                component: ComponentCreator('/docs/v3.5.1/physics-shocks', 'c89'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/pythonapi',
                component: ComponentCreator('/docs/v3.5.1/pythonapi', '63c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/running_a_grid',
                component: ComponentCreator('/docs/v3.5.1/running_a_grid', '664'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/trouble-compile',
                component: ComponentCreator('/docs/v3.5.1/trouble-compile', '812'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.1/trouble-integration',
                component: ComponentCreator('/docs/v3.5.1/trouble-integration', '5a3'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      },
      {
        path: '/docs/v3.5.2',
        component: ComponentCreator('/docs/v3.5.2', '55c'),
        routes: [
          {
            path: '/docs/v3.5.2',
            component: ComponentCreator('/docs/v3.5.2', '96b'),
            routes: [
              {
                path: '/docs/v3.5.2/',
                component: ComponentCreator('/docs/v3.5.2/', '9cf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/v3.5.2/2a_modelling_objects_on_disk', '380'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/v3.5.2/2b_modelling_objects_in_memory', 'c76'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/bulk',
                component: ComponentCreator('/docs/v3.5.2/bulk', '4e8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/category/chemistry',
                component: ComponentCreator('/docs/v3.5.2/category/chemistry', 'e65'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/category/developer',
                component: ComponentCreator('/docs/v3.5.2/category/developer', '798'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/category/getting-started',
                component: ComponentCreator('/docs/v3.5.2/category/getting-started', 'f87'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/category/tutorials',
                component: ComponentCreator('/docs/v3.5.2/category/tutorials', '51e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/chemical_analysis',
                component: ComponentCreator('/docs/v3.5.2/chemical_analysis', '7ed'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/desorb',
                component: ComponentCreator('/docs/v3.5.2/desorb', 'ceb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/dev-debugging',
                component: ComponentCreator('/docs/v3.5.2/dev-debugging', '32f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/dev-overview',
                component: ComponentCreator('/docs/v3.5.2/dev-overview', 'e8b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/dev-python-wrap',
                component: ComponentCreator('/docs/v3.5.2/dev-python-wrap', '687'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/dev-web',
                component: ComponentCreator('/docs/v3.5.2/dev-web', '60c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/first_model',
                component: ComponentCreator('/docs/v3.5.2/first_model', 'be1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/gas',
                component: ComponentCreator('/docs/v3.5.2/gas', 'bea'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/grain',
                component: ComponentCreator('/docs/v3.5.2/grain', '7a6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/hydro',
                component: ComponentCreator('/docs/v3.5.2/hydro', 'f6a'),
                exact: true
              },
              {
                path: '/docs/v3.5.2/network',
                component: ComponentCreator('/docs/v3.5.2/network', 'ab9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/notation',
                component: ComponentCreator('/docs/v3.5.2/notation', '45f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/parameters',
                component: ComponentCreator('/docs/v3.5.2/parameters', '0af'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/physics-cloud',
                component: ComponentCreator('/docs/v3.5.2/physics-cloud', '4ea'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/physics-collapse',
                component: ComponentCreator('/docs/v3.5.2/physics-collapse', '4a7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/physics-core',
                component: ComponentCreator('/docs/v3.5.2/physics-core', '53e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/physics-hotcore',
                component: ComponentCreator('/docs/v3.5.2/physics-hotcore', '8aa'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/physics-shocks',
                component: ComponentCreator('/docs/v3.5.2/physics-shocks', 'de5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/pythonapi',
                component: ComponentCreator('/docs/v3.5.2/pythonapi', '27b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/running_a_grid',
                component: ComponentCreator('/docs/v3.5.2/running_a_grid', '4e3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/trouble-compile',
                component: ComponentCreator('/docs/v3.5.2/trouble-compile', '0a5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.2/trouble-integration',
                component: ComponentCreator('/docs/v3.5.2/trouble-integration', '8e1'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      },
      {
        path: '/docs/v3.5.3',
        component: ComponentCreator('/docs/v3.5.3', 'dec'),
        routes: [
          {
            path: '/docs/v3.5.3',
            component: ComponentCreator('/docs/v3.5.3', '423'),
            routes: [
              {
                path: '/docs/v3.5.3/',
                component: ComponentCreator('/docs/v3.5.3/', '9ce'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/v3.5.3/2a_modelling_objects_on_disk', '2ba'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/v3.5.3/2b_modelling_objects_in_memory', '4e2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/bulk',
                component: ComponentCreator('/docs/v3.5.3/bulk', 'fe2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/category/chemistry',
                component: ComponentCreator('/docs/v3.5.3/category/chemistry', '40d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/category/developer',
                component: ComponentCreator('/docs/v3.5.3/category/developer', '8cf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/category/getting-started',
                component: ComponentCreator('/docs/v3.5.3/category/getting-started', '687'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/category/tutorials',
                component: ComponentCreator('/docs/v3.5.3/category/tutorials', 'abc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/chemical_analysis',
                component: ComponentCreator('/docs/v3.5.3/chemical_analysis', 'd40'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/desorb',
                component: ComponentCreator('/docs/v3.5.3/desorb', '8cb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/dev-debugging',
                component: ComponentCreator('/docs/v3.5.3/dev-debugging', 'dbf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/dev-overview',
                component: ComponentCreator('/docs/v3.5.3/dev-overview', '67f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/dev-python-wrap',
                component: ComponentCreator('/docs/v3.5.3/dev-python-wrap', '4ba'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/dev-web',
                component: ComponentCreator('/docs/v3.5.3/dev-web', '7e6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/first_model',
                component: ComponentCreator('/docs/v3.5.3/first_model', 'df6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/gas',
                component: ComponentCreator('/docs/v3.5.3/gas', '9dc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/grain',
                component: ComponentCreator('/docs/v3.5.3/grain', 'f4b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/hydro',
                component: ComponentCreator('/docs/v3.5.3/hydro', '28f'),
                exact: true
              },
              {
                path: '/docs/v3.5.3/network',
                component: ComponentCreator('/docs/v3.5.3/network', 'c52'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/notation',
                component: ComponentCreator('/docs/v3.5.3/notation', '9f4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/parameters',
                component: ComponentCreator('/docs/v3.5.3/parameters', 'c07'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/physics-cloud',
                component: ComponentCreator('/docs/v3.5.3/physics-cloud', 'd6f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/physics-collapse',
                component: ComponentCreator('/docs/v3.5.3/physics-collapse', '498'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/physics-core',
                component: ComponentCreator('/docs/v3.5.3/physics-core', '271'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/physics-hotcore',
                component: ComponentCreator('/docs/v3.5.3/physics-hotcore', 'b42'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/physics-shocks',
                component: ComponentCreator('/docs/v3.5.3/physics-shocks', 'e83'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/pythonapi',
                component: ComponentCreator('/docs/v3.5.3/pythonapi', 'ce8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/running_a_grid',
                component: ComponentCreator('/docs/v3.5.3/running_a_grid', '6e1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/trouble-compile',
                component: ComponentCreator('/docs/v3.5.3/trouble-compile', '1bd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/v3.5.3/trouble-integration',
                component: ComponentCreator('/docs/v3.5.3/trouble-integration', '627'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      },
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'a91'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '5c8'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '4f8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/2a_modelling_objects_on_disk', 'dfe'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/2b_modelling_objects_in_memory', '21c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/bulk',
                component: ComponentCreator('/docs/bulk', '1aa'),
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
                component: ComponentCreator('/docs/chemical_analysis', 'e20'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/desorb',
                component: ComponentCreator('/docs/desorb', 'f36'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-debugging',
                component: ComponentCreator('/docs/dev-debugging', '1cd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-overview',
                component: ComponentCreator('/docs/dev-overview', 'd8e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-python-wrap',
                component: ComponentCreator('/docs/dev-python-wrap', 'fd4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-web',
                component: ComponentCreator('/docs/dev-web', 'e58'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/first_model',
                component: ComponentCreator('/docs/first_model', '7ac'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/gas',
                component: ComponentCreator('/docs/gas', 'dd9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/grain',
                component: ComponentCreator('/docs/grain', '174'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/hydro',
                component: ComponentCreator('/docs/hydro', '47b'),
                exact: true
              },
              {
                path: '/docs/network',
                component: ComponentCreator('/docs/network', 'b1d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/notation',
                component: ComponentCreator('/docs/notation', 'e43'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/parameters',
                component: ComponentCreator('/docs/parameters', '4a3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-cloud',
                component: ComponentCreator('/docs/physics-cloud', 'b99'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-collapse',
                component: ComponentCreator('/docs/physics-collapse', 'a1a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-core',
                component: ComponentCreator('/docs/physics-core', 'b37'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-hotcore',
                component: ComponentCreator('/docs/physics-hotcore', 'c78'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-shocks',
                component: ComponentCreator('/docs/physics-shocks', '431'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/pythonapi',
                component: ComponentCreator('/docs/pythonapi', '09e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/running_a_grid',
                component: ComponentCreator('/docs/running_a_grid', '7a8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-compile',
                component: ComponentCreator('/docs/trouble-compile', '9d9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-integration',
                component: ComponentCreator('/docs/trouble-integration', '578'),
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
