import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Welcome from '../views/Welcome/Index.vue'

import ForgetPassword from '../views/UserCenter/ForgetPassword.vue'
import Index from '../views/Index.vue'
import FileList from '../views/FileManage/FileList.vue'

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
			  component: FileList
			},
			{
				path: 'file_list',
				name: 'FileList',
				component: FileList
			},
			{
				path: 'user_manage',
				name: 'UserManage',
				component: FileList
			},
			{
				path: 'admin_manage',
				name: 'AdminManage',
				component: FileList
			},
		  ]
		},
		{
		path: '/user/forgetPassword',
		name: 'ForgetPassword',
		component: ForgetPassword
		},
		{
		path: '/',
		name: 'Index',
		component: Index,
		}
	]
})

export default router
