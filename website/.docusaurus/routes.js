import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'f57'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'ddb'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '845'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '66b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '929'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'd8b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', 'b3d'),
    exact: true
  },
  {
    path: '/3dpdr',
    component: ComponentCreator('/3dpdr', 'fbd'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'a75'),
    exact: true
  },
  {
    path: '/blog/2018/02/05/david-grains',
    component: ComponentCreator('/blog/2018/02/05/david-grains', '70c'),
    exact: true
  },
  {
    path: '/blog/2018/03/27/audrey-coms',
    component: ComponentCreator('/blog/2018/03/27/audrey-coms', 'e4f'),
    exact: true
  },
  {
    path: '/blog/2018/06/20/izaskun-phosphorus',
    component: ComponentCreator('/blog/2018/06/20/izaskun-phosphorus', '3c8'),
    exact: true
  },
  {
    path: '/blog/2018/07/12/felix-collapse',
    component: ComponentCreator('/blog/2018/07/12/felix-collapse', '038'),
    exact: true
  },
  {
    path: '/blog/2019/04/19/serena-nitrogen-frac',
    component: ComponentCreator('/blog/2019/04/19/serena-nitrogen-frac', '4ee'),
    exact: true
  },
  {
    path: '/blog/2019/07/08/felix-ambipolar',
    component: ComponentCreator('/blog/2019/07/08/felix-ambipolar', '790'),
    exact: true
  },
  {
    path: '/blog/2019/08/13/serena-carbon-frac',
    component: ComponentCreator('/blog/2019/08/13/serena-carbon-frac', 'aad'),
    exact: true
  },
  {
    path: '/blog/2019/12/10/tom-shock',
    component: ComponentCreator('/blog/2019/12/10/tom-shock', '804'),
    exact: true
  },
  {
    path: '/blog/2020/02/14/New-Website',
    component: ComponentCreator('/blog/2020/02/14/New-Website', '6e6'),
    exact: true
  },
  {
    path: '/blog/2020/12/07/milena-nitrogen-solis',
    component: ComponentCreator('/blog/2020/12/07/milena-nitrogen-solis', 'e7b'),
    exact: true
  },
  {
    path: '/blog/2022/02/06/holdship-hits',
    component: ComponentCreator('/blog/2022/02/06/holdship-hits', '828'),
    exact: true
  },
  {
    path: '/blog/2022/04/14/crir-ngc253',
    component: ComponentCreator('/blog/2022/04/14/crir-ngc253', '4c3'),
    exact: true
  },
  {
    path: '/blog/2022/04/29/uclchem-v3',
    component: ComponentCreator('/blog/2022/04/29/uclchem-v3', '5ef'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '9ae'),
    exact: true
  },
  {
    path: '/blog/page/2',
    component: ComponentCreator('/blog/page/2', 'a6a'),
    exact: true
  },
  {
    path: '/emulators',
    component: ComponentCreator('/emulators', 'c95'),
    exact: true
  },
  {
    path: '/help',
    component: ComponentCreator('/help', 'cb7'),
    exact: true
  },
  {
    path: '/othersoftware',
    component: ComponentCreator('/othersoftware', '3f0'),
    exact: true
  },
  {
    path: '/ucl_pdr',
    component: ComponentCreator('/ucl_pdr', 'aa8'),
    exact: true
  },
  {
    path: '/users',
    component: ComponentCreator('/users', '06f'),
    exact: true
  },
  {
    path: '/docs/next',
    component: ComponentCreator('/docs/next', '4b5'),
    routes: [
      {
        path: '/docs/next/',
        component: ComponentCreator('/docs/next/', 'ead'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/bulk',
        component: ComponentCreator('/docs/next/bulk', '508'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/category/chemistry',
        component: ComponentCreator('/docs/next/category/chemistry', 'bd6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/category/developer',
        component: ComponentCreator('/docs/next/category/developer', 'a3e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/category/getting-started',
        component: ComponentCreator('/docs/next/category/getting-started', 'a42'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/category/tutorials',
        component: ComponentCreator('/docs/next/category/tutorials', 'e3c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/chemical_analysis',
        component: ComponentCreator('/docs/next/chemical_analysis', 'a15'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/desorb',
        component: ComponentCreator('/docs/next/desorb', '94f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/dev-debugging',
        component: ComponentCreator('/docs/next/dev-debugging', '21d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/dev-overview',
        component: ComponentCreator('/docs/next/dev-overview', 'f69'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/dev-python-wrap',
        component: ComponentCreator('/docs/next/dev-python-wrap', 'cd5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/dev-web',
        component: ComponentCreator('/docs/next/dev-web', '58c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/first_model',
        component: ComponentCreator('/docs/next/first_model', '6ea'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/gas',
        component: ComponentCreator('/docs/next/gas', '7db'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/grain',
        component: ComponentCreator('/docs/next/grain', '649'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/hydro',
        component: ComponentCreator('/docs/next/hydro', 'a9f'),
        exact: true
      },
      {
        path: '/docs/next/modelling_objects',
        component: ComponentCreator('/docs/next/modelling_objects', '598'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/network',
        component: ComponentCreator('/docs/next/network', '956'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/parameters',
        component: ComponentCreator('/docs/next/parameters', '70c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/physics-cloud',
        component: ComponentCreator('/docs/next/physics-cloud', '719'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/physics-collapse',
        component: ComponentCreator('/docs/next/physics-collapse', 'f22'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/physics-core',
        component: ComponentCreator('/docs/next/physics-core', 'cb2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/physics-hotcore',
        component: ComponentCreator('/docs/next/physics-hotcore', '652'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/physics-shocks',
        component: ComponentCreator('/docs/next/physics-shocks', '2d5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/pythonapi',
        component: ComponentCreator('/docs/next/pythonapi', '144'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/running_a_grid',
        component: ComponentCreator('/docs/next/running_a_grid', 'c01'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/trouble-compile',
        component: ComponentCreator('/docs/next/trouble-compile', '863'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/trouble-integration',
        component: ComponentCreator('/docs/next/trouble-integration', '7de'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/docs/v3.1.0',
    component: ComponentCreator('/docs/v3.1.0', 'a46'),
    routes: [
      {
        path: '/docs/v3.1.0/',
        component: ComponentCreator('/docs/v3.1.0/', 'e39'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/bulk',
        component: ComponentCreator('/docs/v3.1.0/bulk', '412'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/category/chemistry',
        component: ComponentCreator('/docs/v3.1.0/category/chemistry', 'c8f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/category/developer',
        component: ComponentCreator('/docs/v3.1.0/category/developer', 'b09'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/category/getting-started',
        component: ComponentCreator('/docs/v3.1.0/category/getting-started', '0e4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/category/tutorials',
        component: ComponentCreator('/docs/v3.1.0/category/tutorials', 'ae1'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/chemical_analysis',
        component: ComponentCreator('/docs/v3.1.0/chemical_analysis', '52b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/desorb',
        component: ComponentCreator('/docs/v3.1.0/desorb', '2ca'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/dev-debugging',
        component: ComponentCreator('/docs/v3.1.0/dev-debugging', '346'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/dev-overview',
        component: ComponentCreator('/docs/v3.1.0/dev-overview', 'a5a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/dev-python-wrap',
        component: ComponentCreator('/docs/v3.1.0/dev-python-wrap', 'c71'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/dev-web',
        component: ComponentCreator('/docs/v3.1.0/dev-web', '894'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/first_model',
        component: ComponentCreator('/docs/v3.1.0/first_model', '098'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/gas',
        component: ComponentCreator('/docs/v3.1.0/gas', '857'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/grain',
        component: ComponentCreator('/docs/v3.1.0/grain', '899'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/hydro',
        component: ComponentCreator('/docs/v3.1.0/hydro', '4a7'),
        exact: true
      },
      {
        path: '/docs/v3.1.0/modelling_objects',
        component: ComponentCreator('/docs/v3.1.0/modelling_objects', 'a78'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/network',
        component: ComponentCreator('/docs/v3.1.0/network', 'e1e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/parameters',
        component: ComponentCreator('/docs/v3.1.0/parameters', 'b52'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/physics-cloud',
        component: ComponentCreator('/docs/v3.1.0/physics-cloud', '514'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/physics-collapse',
        component: ComponentCreator('/docs/v3.1.0/physics-collapse', 'c40'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/physics-core',
        component: ComponentCreator('/docs/v3.1.0/physics-core', '16b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/physics-hotcore',
        component: ComponentCreator('/docs/v3.1.0/physics-hotcore', '4a5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/physics-shocks',
        component: ComponentCreator('/docs/v3.1.0/physics-shocks', '956'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/pythonapi',
        component: ComponentCreator('/docs/v3.1.0/pythonapi', '76c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/running_a_grid',
        component: ComponentCreator('/docs/v3.1.0/running_a_grid', 'ad8'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/trouble-compile',
        component: ComponentCreator('/docs/v3.1.0/trouble-compile', 'e83'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/v3.1.0/trouble-integration',
        component: ComponentCreator('/docs/v3.1.0/trouble-integration', '30d'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '16b'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'bd5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/bulk',
        component: ComponentCreator('/docs/bulk', '15c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/chemistry',
        component: ComponentCreator('/docs/category/chemistry', '356'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/developer',
        component: ComponentCreator('/docs/category/developer', '1c7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/getting-started',
        component: ComponentCreator('/docs/category/getting-started', '066'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/tutorials',
        component: ComponentCreator('/docs/category/tutorials', 'ef4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/chemical_analysis',
        component: ComponentCreator('/docs/chemical_analysis', 'd91'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/desorb',
        component: ComponentCreator('/docs/desorb', '01e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-debugging',
        component: ComponentCreator('/docs/dev-debugging', 'd05'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-overview',
        component: ComponentCreator('/docs/dev-overview', '16d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-python-wrap',
        component: ComponentCreator('/docs/dev-python-wrap', '18b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-web',
        component: ComponentCreator('/docs/dev-web', '42a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/first_model',
        component: ComponentCreator('/docs/first_model', '8bc'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/gas',
        component: ComponentCreator('/docs/gas', '77c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/grain',
        component: ComponentCreator('/docs/grain', '683'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/hydro',
        component: ComponentCreator('/docs/hydro', 'f7a'),
        exact: true
      },
      {
        path: '/docs/modelling_objects',
        component: ComponentCreator('/docs/modelling_objects', '35c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/network',
        component: ComponentCreator('/docs/network', '23f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/parameters',
        component: ComponentCreator('/docs/parameters', 'b10'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-cloud',
        component: ComponentCreator('/docs/physics-cloud', '238'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-collapse',
        component: ComponentCreator('/docs/physics-collapse', 'c0c'),
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
        component: ComponentCreator('/docs/physics-hotcore', '287'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-shocks',
        component: ComponentCreator('/docs/physics-shocks', '962'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/pythonapi',
        component: ComponentCreator('/docs/pythonapi', '1fc'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/running_a_grid',
        component: ComponentCreator('/docs/running_a_grid', 'faf'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/trouble-compile',
        component: ComponentCreator('/docs/trouble-compile', '75f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/trouble-integration',
        component: ComponentCreator('/docs/trouble-integration', 'c8a'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e1e'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
