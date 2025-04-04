import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Welcome from '../views/Welcome/Index.vue'

import ForgetPassword from '../views/UserCenter/ForgetPassword.vue'
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
			  component: Counter
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
				path: 'user_manage',
				name: 'UserManage',
				component: Counter
			},
			{
				path: 'admin_manage',
				name: 'AdminManage',
				component: Counter
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
