
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug','3f1'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config','1b8'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content','20c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData','3a0'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata','819'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry','b42'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes','995'),
    exact: true
  },
  {
    path: '/3dpdr',
    component: ComponentCreator('/3dpdr','bac'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog','c1d'),
    exact: true
  },
  {
    path: '/blog/2018/02/05/david-grains',
    component: ComponentCreator('/blog/2018/02/05/david-grains','ffc'),
    exact: true
  },
  {
    path: '/blog/2018/03/27/audrey-coms',
    component: ComponentCreator('/blog/2018/03/27/audrey-coms','0e8'),
    exact: true
  },
  {
    path: '/blog/2018/06/20/izaskun-phosphorus',
    component: ComponentCreator('/blog/2018/06/20/izaskun-phosphorus','686'),
    exact: true
  },
  {
    path: '/blog/2018/07/12/felix-collapse',
    component: ComponentCreator('/blog/2018/07/12/felix-collapse','925'),
    exact: true
  },
  {
    path: '/blog/2019/04/19/serena-nitrogen-frac',
    component: ComponentCreator('/blog/2019/04/19/serena-nitrogen-frac','170'),
    exact: true
  },
  {
    path: '/blog/2019/07/08/felix-ambipolar',
    component: ComponentCreator('/blog/2019/07/08/felix-ambipolar','36e'),
    exact: true
  },
  {
    path: '/blog/2019/08/13/serena-carbon-frac',
    component: ComponentCreator('/blog/2019/08/13/serena-carbon-frac','2f6'),
    exact: true
  },
  {
    path: '/blog/2019/12/10/tom-shock',
    component: ComponentCreator('/blog/2019/12/10/tom-shock','326'),
    exact: true
  },
  {
    path: '/blog/2020/02/14/New-Website',
    component: ComponentCreator('/blog/2020/02/14/New-Website','79d'),
    exact: true
  },
  {
    path: '/blog/2020/12/07/milena-nitrogen-solis',
    component: ComponentCreator('/blog/2020/12/07/milena-nitrogen-solis','849'),
    exact: true
  },
  {
    path: '/blog/2022/02/06/holdship-hits',
    component: ComponentCreator('/blog/2022/02/06/holdship-hits','e72'),
    exact: true
  },
  {
    path: '/blog/2022/04/14/crir-ngc253',
    component: ComponentCreator('/blog/2022/04/14/crir-ngc253','eff'),
    exact: true
  },
  {
    path: '/blog/2022/04/29/uclchem-v3',
    component: ComponentCreator('/blog/2022/04/29/uclchem-v3','128'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive','be5'),
    exact: true
  },
  {
    path: '/blog/page/2',
    component: ComponentCreator('/blog/page/2','7a9'),
    exact: true
  },
  {
    path: '/emulators',
    component: ComponentCreator('/emulators','eb1'),
    exact: true
  },
  {
    path: '/help',
    component: ComponentCreator('/help','5eb'),
    exact: true
  },
  {
    path: '/othersoftware',
    component: ComponentCreator('/othersoftware','84c'),
    exact: true
  },
  {
    path: '/ucl_pdr',
    component: ComponentCreator('/ucl_pdr','6c1'),
    exact: true
  },
  {
    path: '/users',
    component: ComponentCreator('/users','76f'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs','94a'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/','90a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/bulk',
        component: ComponentCreator('/docs/bulk','2c5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/chemistry',
        component: ComponentCreator('/docs/category/chemistry','356'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/developer',
        component: ComponentCreator('/docs/category/developer','1c7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/getting-started',
        component: ComponentCreator('/docs/category/getting-started','066'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/category/tutorials',
        component: ComponentCreator('/docs/category/tutorials','ef4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/chemical_analysis',
        component: ComponentCreator('/docs/chemical_analysis','b5d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/desorb',
        component: ComponentCreator('/docs/desorb','bf3'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-debugging',
        component: ComponentCreator('/docs/dev-debugging','221'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-overview',
        component: ComponentCreator('/docs/dev-overview','e3a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-python-wrap',
        component: ComponentCreator('/docs/dev-python-wrap','df8'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/dev-web',
        component: ComponentCreator('/docs/dev-web','211'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/first_model',
        component: ComponentCreator('/docs/first_model','bae'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/gas',
        component: ComponentCreator('/docs/gas','846'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/grain',
        component: ComponentCreator('/docs/grain','cb2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/hydro',
        component: ComponentCreator('/docs/hydro','a65'),
        exact: true
      },
      {
        path: '/docs/modelling_objects',
        component: ComponentCreator('/docs/modelling_objects','f1a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/network',
        component: ComponentCreator('/docs/network','949'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/parameters',
        component: ComponentCreator('/docs/parameters','0b4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-cloud',
        component: ComponentCreator('/docs/physics-cloud','f83'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-collapse',
        component: ComponentCreator('/docs/physics-collapse','0c7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-core',
        component: ComponentCreator('/docs/physics-core','a05'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-hotcore',
        component: ComponentCreator('/docs/physics-hotcore','c60'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/physics-shocks',
        component: ComponentCreator('/docs/physics-shocks','85a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/pythonapi',
        component: ComponentCreator('/docs/pythonapi','5c8'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/running_a_grid',
        component: ComponentCreator('/docs/running_a_grid','146'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/trouble-compile',
        component: ComponentCreator('/docs/trouble-compile','6d8'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/trouble-integration',
        component: ComponentCreator('/docs/trouble-integration','15d'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/','ed9'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
