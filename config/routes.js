export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
          {
            name: 'projList',
            path: '/user/projList',
            component: './project/detail/projList/index.jsx',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'metrics',
    icon: 'project',
    path: '/project',
    footerRender:false ,
    component: './project/detail/newModel/index.jsx'
  },
  {
    name: 'fraud',
    icon: 'table',
    path: '/fraud',
    footerRender:false ,
    component: './project/detail/fraud/index.jsx',
  },
  {
    path: '/',
    redirect: '/user/projList',
  },
  {
    component: './404',
  },
];
