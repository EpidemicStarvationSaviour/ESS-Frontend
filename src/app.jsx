import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const registerPath = '/user/register';
const registerResultPath = '/user/register-result';

const nonLoginPath = ['/user/login', '/user/register'];

/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      console.log(msg);
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; 
  // 如果是登录页面，不执行
  if (nonLoginPath.indexOf(history.location.pathname) === -1) {
    // const currentUser = await fetchUserInfo();
    const currentUser = {
      user_id: 123123, // 用户唯一标识符
      user_phone: '15833333333', // 用户联系方式
      user_name: 'cxz', // 用户名
      user_role: 4, // 用户身份。1:商家; 2:骑手; 3:居民; 4:团长
      user_address: [
        {
          id: 1, //address id
          lat: 123.111,
          lng: 39.123,
          province: '河南省',
          city: '三门峡市',
          area: '湖滨区',
          detail: '六峰路绿江中央广场2号楼3单元109',
          is_default: true,
        },
        {
          id: 2, //address id
          lat: 123.111,
          lng: 39.123,
          province: '河南省',
          city: '三门峡市',
          area: '湖滨区',
          detail: '六峰路绿江中央广场2号楼3单元109',
          is_default: false,
        },
      ], // 商家的唯一地址，居民、团长的默认收货地址
      user_created_time: 123123, // 用户注册时间
      user_updated_time: 123123213,
    };
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && nonLoginPath.indexOf(location.pathname) === -1) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank" key="1">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="2">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
