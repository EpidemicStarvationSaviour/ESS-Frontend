// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  //https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          layout: false,
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          layout: false,
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      routes: [
        {
          path: '/dashboard',
          redirect: '/dashboard/workplace',
        },
        {
          name: 'workplace',
          icon: 'smile',
          path: '/dashboard/workplace',
          component: './dashboard/workplace',
        },
      ],
    },
    {
      name: 'exception',
      icon: 'warning',
      path: '/exception',
      hideInMenu: true,
      routes: [
        {
          path: '/exception',
          redirect: '/exception/403',
        },
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        {
          path: '/account',
          redirect: '/account/center',
        },
        {
          name: 'center',
          icon: 'smile',
          path: '/account/center',
          component: './account/center',
        },
        {
          name: 'settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
        },
        {
          name: '????????????',
          icon: 'smile',
          path: '/account/join',
          component: './account/Join',
          access: 'canSeeJoingroup',
        },
      ],
    },
    {
      path: '/users',
      name: '????????????',
      icon: 'smile',
      routes: [
        {
          name: '????????????',
          icon: 'smile',
          path: '/users/user-list',
          component: './users/UserList',
          access: 'canSysAdmin',
        },
        {
          name: '????????????',
          icon: 'smile',
          path: '/users/commodity',
          component: './users/Commdity',
          access: 'canSysAdmin',
        },
      ],
    },
    {
      path: '/commodity',
      name: '????????????',
      icon: 'profile',
      routes: [
        {
          name: '????????????',
          icon: 'profile',
          path: '/commodity/commodity',
          access: 'canSupplier',
          component: './commodity/Commodity',
        },
      ],
    },
    {
      path: '/order',
      name: '????????????',
      icon: 'profile',
      routes: [
        {
          name: '????????????',
          icon: 'profile',
          path: '/order/ListCardList',
          access: 'canSupplier',
          component: './order/ListCardList',
        },
      ],
    },
    {
      path: '/',
      redirect: '/dashboard/workplace',
    },
    {
      name: '????????????',
      icon: 'smile',
      path: '/group',
      access: 'canAgent',
      routes: [
        {
          name: '????????????',
          icon: 'smile',
          path: '/group/create',
          component: './group/Create',
          access: 'canAgent',
        },
        {
          name: '????????????',
          icon: 'smile',
          path: '/group/detail/:id',
          hideInMenu: true,
          component: './group/DetailPage',
          access: 'canAgent',
        },
        {
          name: '????????????',
          icon: 'smile',
          path: '/group/list',
          component: './group/ListCardList',
          access: 'canAgent',
        },
      ],
      access: 'canAgent',
    },
    {
      name: '????????????',
      icon: 'smile',
      path: '/mygroup',
      component: './group/ListCardList',
      access: 'canSeeMygroup',
    },
    {
      name: '????????????',
      icon: 'smile',
      path: '/rider',
      access: 'canLogistics',
      routes: [
        {
          name: '????????????',
          icon: 'smile',
          path: '/rider/list',
          component: './rider/Home',
          access: 'canLogistics',
        },
        {
          name: '????????????',
          icon: 'smile',
          path: '/rider/detail/:id',
          hideInMenu: true,
          component: './rider/DetailPage',
          access: 'canLogistics',
        },
      ],
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh ?????????
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // ???????????????????????????
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
