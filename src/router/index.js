import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Welcome from '../views/Welcome/Index.vue'

import ForgetPassword from '../views/UserCenter/ForgetPassword.vue'

import UserSuperAdmin from '../views/UserSuperAdmin/Index.vue'

import UserAdmin from '../views/UserAdmin/Index.vue'

import QuestionManagement from '../views/QuestionManagement/Index.vue'

import AnswerManagement from '../views/AnswerManagement/Index.vue'

import Index from '../views/Index.vue'
import Counter from '../views/Dumb/Counter.vue'
import FileList from '../views/FileManage/FileList.vue'
import FileReview from '../views/FileManage/FileReview.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      name: 'Welcome',
      component: Welcome,
      children: [
        {
          path: 'notice',
          name: 'Notice',
          // component: Counter
        },
        {
          path: 'file_list',
          name: 'FileList',
          component: FileList
        },
        {
          path: 'file_review/:fileID',
          name: 'FileReview',
          component: FileReview
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
          path: '/admin/question-management',
          name: 'question-management',
          component: QuestionManagement,
        },
        {
          path: '/admin/answer-management',
          name: 'answer-management',
          component: AnswerManagement,
          props: (route) => ({
            questionId: route.query.questionId,
            questionTitle: route.query.questionTitle,
          })
        },
        {
          path: '/user-management-entry',
          name: 'UserManagementEntry',
          beforeEnter: (to, from, next) => {
            const role = JSON.parse(localStorage.getItem('userInfo'))?.role;
            if (role === 'SUPERADMIN') {
              next({ name: 'user-management_superAdmin' });
            } else {
              next({ name: 'user-management_admin' });
            }
          },
        },
      ]
    },
    // {
    //   path: '/experiment/welcome',
    //   name: 'Welcome',
    //   component: Welcome
    // },
    {
      path: '/user/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    // {
    //   path: '/superAdmin/user-management',
    //   name: 'user-management_superAdmin',
    //   component: UserSuperAdmin,
    // },
    // {
    //   path: '/admin/user-management',
    //   name: 'user-management_admin',
    //   component: UserAdmin,
    // },
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    // {
    //   path: '/',
    //   alias: ["/home", "/index"],
    //   name: 'Index',
    //   component: Index
    // },
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
    // console.log(userInfo);
    if (userInfo && userInfo.role === 'SUPERADMIN') {
      next(); // 放行
    } else {
      next('/'); // 或跳转到无权限提示页
    }
  } else if (to.path.startsWith('/admin/user-management')) {
    if (userInfo && userInfo.role === 'ADMIN') {
      next(); // 放行
    } else {
      next('/'); // 或跳转到无权限提示页
    }
  } else {
    next(); // 其他页面不限制
  }
});







export default router
