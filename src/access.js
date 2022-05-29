/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

// 1:商家; 2:骑手; 3:居民 4:团长，
const Supplier = 1;
const Logistics = 2;
const Purchaser = 3;
const Agent = 4;
const SysAdmin = 5;
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canSupplier: currentUser && (currentUser.user_role === Supplier),     // 是否是商家
    canLogistics: currentUser && (currentUser.user_role === Logistics),   // 是否是骑手
    canPurchaser: currentUser && (currentUser.user_role === Purchaser),   // 是否是居民
    canAgent: currentUser && (currentUser.user_role === Agent),           // 是否是团长
    canSysAdmin: currentUser && currentUser.userType === SysAdmin,        // 是否是系统管理员
  };
}
