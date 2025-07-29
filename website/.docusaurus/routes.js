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
    component: ComponentCreator('/docs', '102'),
    routes: [
      {
        path: '/docs/next',
        component: ComponentCreator('/docs/next', '3e4'),
        routes: [
          {
            path: '/docs/next',
            component: ComponentCreator('/docs/next', '345'),
            routes: [
              {
                path: '/docs/next/',
                component: ComponentCreator('/docs/next/', '7f3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/next/2a_modelling_objects_on_disk', '100'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/next/2b_modelling_objects_in_memory', '375'),
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
                component: ComponentCreator('/docs/next/chemical_analysis', '642'),
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
                component: ComponentCreator('/docs/next/first_model', '1d4'),
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
                component: ComponentCreator('/docs/next/parameters', 'fff'),
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
                component: ComponentCreator('/docs/next/pythonapi', '4f5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/next/running_a_grid',
                component: ComponentCreator('/docs/next/running_a_grid', '534'),
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
        path: '/docs',
        component: ComponentCreator('/docs', 'ed0'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '5c8'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '3cd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2a_modelling_objects_on_disk',
                component: ComponentCreator('/docs/2a_modelling_objects_on_disk', 'f73'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/2b_modelling_objects_in_memory',
                component: ComponentCreator('/docs/2b_modelling_objects_in_memory', '232'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/bulk',
                component: ComponentCreator('/docs/bulk', '3d8'),
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
                component: ComponentCreator('/docs/chemical_analysis', '8dc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/desorb',
                component: ComponentCreator('/docs/desorb', '1ed'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-debugging',
                component: ComponentCreator('/docs/dev-debugging', 'c80'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-overview',
                component: ComponentCreator('/docs/dev-overview', '07a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-python-wrap',
                component: ComponentCreator('/docs/dev-python-wrap', '336'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/dev-web',
                component: ComponentCreator('/docs/dev-web', 'bff'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/first_model',
                component: ComponentCreator('/docs/first_model', 'd8d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/gas',
                component: ComponentCreator('/docs/gas', '232'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/grain',
                component: ComponentCreator('/docs/grain', 'c18'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/hydro',
                component: ComponentCreator('/docs/hydro', '76e'),
                exact: true
              },
              {
                path: '/docs/network',
                component: ComponentCreator('/docs/network', '42e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/notation',
                component: ComponentCreator('/docs/notation', 'dc4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/parameters',
                component: ComponentCreator('/docs/parameters', '8ed'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-cloud',
                component: ComponentCreator('/docs/physics-cloud', '982'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-collapse',
                component: ComponentCreator('/docs/physics-collapse', 'c54'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-core',
                component: ComponentCreator('/docs/physics-core', '040'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-hotcore',
                component: ComponentCreator('/docs/physics-hotcore', '74e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/physics-shocks',
                component: ComponentCreator('/docs/physics-shocks', 'f84'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/pythonapi',
                component: ComponentCreator('/docs/pythonapi', 'caa'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/running_a_grid',
                component: ComponentCreator('/docs/running_a_grid', '7cd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-compile',
                component: ComponentCreator('/docs/trouble-compile', 'e17'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/trouble-integration',
                component: ComponentCreator('/docs/trouble-integration', '157'),
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
