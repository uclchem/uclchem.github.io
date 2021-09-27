
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/',
  component: ComponentCreator('/','deb'),
  exact: true,
},
{
  path: '/3dpdr',
  component: ComponentCreator('/3dpdr','055'),
  exact: true,
},
{
  path: '/blog',
  component: ComponentCreator('/blog','456'),
  exact: true,
},
{
  path: '/blog/2018/02/05/david-grains',
  component: ComponentCreator('/blog/2018/02/05/david-grains','fc3'),
  exact: true,
},
{
  path: '/blog/2018/03/27/audrey-coms',
  component: ComponentCreator('/blog/2018/03/27/audrey-coms','384'),
  exact: true,
},
{
  path: '/blog/2018/06/20/izaskun-phosphorus',
  component: ComponentCreator('/blog/2018/06/20/izaskun-phosphorus','336'),
  exact: true,
},
{
  path: '/blog/2018/07/12/felix-collapse',
  component: ComponentCreator('/blog/2018/07/12/felix-collapse','5e6'),
  exact: true,
},
{
  path: '/blog/2019/04/19/serena-nitrogen-frac',
  component: ComponentCreator('/blog/2019/04/19/serena-nitrogen-frac','c08'),
  exact: true,
},
{
  path: '/blog/2019/07/08/felix-ambipolar',
  component: ComponentCreator('/blog/2019/07/08/felix-ambipolar','dd7'),
  exact: true,
},
{
  path: '/blog/2019/08/13/serena-carbon-frac',
  component: ComponentCreator('/blog/2019/08/13/serena-carbon-frac','0fe'),
  exact: true,
},
{
  path: '/blog/2019/12/10/tom-shock',
  component: ComponentCreator('/blog/2019/12/10/tom-shock','119'),
  exact: true,
},
{
  path: '/blog/2020/02/14/New-Website',
  component: ComponentCreator('/blog/2020/02/14/New-Website','db1'),
  exact: true,
},
{
  path: '/blog/2020/12/07/milena-nitrogen-solis',
  component: ComponentCreator('/blog/2020/12/07/milena-nitrogen-solis','261'),
  exact: true,
},
{
  path: '/help',
  component: ComponentCreator('/help','416'),
  exact: true,
},
{
  path: '/othersoftware',
  component: ComponentCreator('/othersoftware','e56'),
  exact: true,
},
{
  path: '/ucl_pdr',
  component: ComponentCreator('/ucl_pdr','218'),
  exact: true,
},
{
  path: '/users',
  component: ComponentCreator('/users','9b3'),
  exact: true,
},
{
  path: '/docs',
  component: ComponentCreator('/docs','8d7'),
  
  routes: [
{
  path: '/docs/',
  component: ComponentCreator('/docs/','480'),
  exact: true,
},
{
  path: '/docs/bulk',
  component: ComponentCreator('/docs/bulk','e5e'),
  exact: true,
},
{
  path: '/docs/cloud',
  component: ComponentCreator('/docs/cloud','d10'),
  exact: true,
},
{
  path: '/docs/collapse',
  component: ComponentCreator('/docs/collapse','b7b'),
  exact: true,
},
{
  path: '/docs/desorb',
  component: ComponentCreator('/docs/desorb','ac3'),
  exact: true,
},
{
  path: '/docs/gas',
  component: ComponentCreator('/docs/gas','238'),
  exact: true,
},
{
  path: '/docs/grain',
  component: ComponentCreator('/docs/grain','ab6'),
  exact: true,
},
{
  path: '/docs/hydro',
  component: ComponentCreator('/docs/hydro','a65'),
  exact: true,
},
{
  path: '/docs/network',
  component: ComponentCreator('/docs/network','105'),
  exact: true,
},
{
  path: '/docs/parameters',
  component: ComponentCreator('/docs/parameters','0b1'),
  exact: true,
},
{
  path: '/docs/physics',
  component: ComponentCreator('/docs/physics','217'),
  exact: true,
},
{
  path: '/docs/pythonapi',
  component: ComponentCreator('/docs/pythonapi','76a'),
  exact: true,
},
{
  path: '/docs/pythoncompiling',
  component: ComponentCreator('/docs/pythoncompiling','36c'),
  exact: true,
},
{
  path: '/docs/pythonstart',
  component: ComponentCreator('/docs/pythonstart','1e2'),
  exact: true,
},
{
  path: '/docs/shocks',
  component: ComponentCreator('/docs/shocks','efe'),
  exact: true,
},
{
  path: '/docs/trouble',
  component: ComponentCreator('/docs/trouble','2e2'),
  exact: true,
},
{
  path: '/docs/uclpdr',
  component: ComponentCreator('/docs/uclpdr','694'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
