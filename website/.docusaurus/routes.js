import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
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
    path: '/uclchemcmc',
    component: ComponentCreator('/uclchemcmc', '324'),
    exact: true
  },
  {
    path: '/users',
    component: ComponentCreator('/users', '06f'),
    exact: true
  },
  {
    path: '/docs/next',
    component: ComponentCreator('/docs/next', '26d'),
    routes: [
      {
        path: '/docs/next/',
        component: ComponentCreator('/docs/next/', 'ead'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/2a_modelling_objects_on_disk',
        component: ComponentCreator('/docs/next/2a_modelling_objects_on_disk', 'bec'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/2b_modelling_objects_in_memory',
        component: ComponentCreator('/docs/next/2b_modelling_objects_in_memory', '419'),
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
        component: ComponentCreator('/docs/next/chemical_analysis', 'cdf'),
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
        component: ComponentCreator('/docs/next/first_model', '728'),
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
        path: '/docs/next/network',
        component: ComponentCreator('/docs/next/network', '956'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/notation',
        component: ComponentCreator('/docs/next/notation', '19f'),
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
        component: ComponentCreator('/docs/next/running_a_grid', '927'),
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
    path: '/docs',
    component: ComponentCreator('/docs', '909'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'c09'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/2a_modelling_objects_on_disk',
        component: ComponentCreator('/docs/2a_modelling_objects_on_disk', '69b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/2b_modelling_objects_in_memory',
        component: ComponentCreator('/docs/2b_modelling_objects_in_memory', 'e08'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/bulk',
        component: ComponentCreator('/docs/bulk', '9fe'),
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
        component: ComponentCreator('/docs/chemical_analysis', '26a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/desorb',
        component: ComponentCreator('/docs/desorb', '6c9'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-debugging',
        component: ComponentCreator('/docs/dev-debugging', '0ee'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-overview',
        component: ComponentCreator('/docs/dev-overview', 'ee3'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-python-wrap',
        component: ComponentCreator('/docs/dev-python-wrap', 'cd3'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-web',
        component: ComponentCreator('/docs/dev-web', 'c09'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/first_model',
        component: ComponentCreator('/docs/first_model', '69c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/gas',
        component: ComponentCreator('/docs/gas', '580'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/grain',
        component: ComponentCreator('/docs/grain', '5af'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/hydro',
        component: ComponentCreator('/docs/hydro', '968'),
        exact: true
      },
      {
        path: '/docs/network',
        component: ComponentCreator('/docs/network', 'db5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/notation',
        component: ComponentCreator('/docs/notation', '78e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/parameters',
        component: ComponentCreator('/docs/parameters', '939'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-cloud',
        component: ComponentCreator('/docs/physics-cloud', 'edc'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-collapse',
        component: ComponentCreator('/docs/physics-collapse', '67e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-core',
        component: ComponentCreator('/docs/physics-core', '310'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-hotcore',
        component: ComponentCreator('/docs/physics-hotcore', 'b89'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-shocks',
        component: ComponentCreator('/docs/physics-shocks', 'fbe'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/pythonapi',
        component: ComponentCreator('/docs/pythonapi', 'c87'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/running_a_grid',
        component: ComponentCreator('/docs/running_a_grid', 'e9c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/trouble-compile',
        component: ComponentCreator('/docs/trouble-compile', '937'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/trouble-integration',
        component: ComponentCreator('/docs/trouble-integration', 'd9f'),
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
