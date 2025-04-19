import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Welcome from '../views/Welcome/Index.vue'

import ForgetPassword from '../views/UserCenter/ForgetPassword.vue'

import UserSuperAdmin from '../views/UserSuperAdmin/Index.vue'

import UserAdmin from '../views/UserAdmin/Index.vue'

import Index from '../views/Index.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/experiment/welcome',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/user/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },

    {
      path: '/superAdmin/user-management',
      name: 'user-management_superAdmin',
      component: UserSuperAdmin,
    },
    {
      path: '/admin/user-management',
      name: 'user-management_admin',
      component: UserAdmin,
    },
    {
      path: '/',
      alias: ["/home", "/index"],
      name: 'Index',
      component: Index
    },
  ]
})

router.beforeEach((to, from, next) => {
  const userInfoRaw = localStorage.getItem('userInfo');
  let userInfo = {};

  try {
    userInfo = JSON.parse(userInfoRaw || '{}');
  } catch (e) {
    console.error('userInfo 解析失败', e);
  }

  if (to.path.startsWith('/superAdmin/user-management')) {
    console.log(userInfo);
    if (userInfo && userInfo.role === 'superadmin') {
      next(); // 放行
    } else {
      next('/'); // 或跳转到无权限提示页
    }
  } else {
    next(); // 其他页面不限制
  }
});







export default router
