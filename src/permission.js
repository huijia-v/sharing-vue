import useUserStore from '~/composables/admin/user/user'
import { router } from '~/modules/router'

const token = window.localStorage.getItem('sharing-token')
const useUser = useUserStore();
const whiteList = ['/login', '/register']
router.beforeEach((to, from, next) => {
	if (token) {
		if (to.path === '/login') {
			next({ path: '/admin' })
		} else {
			useUser.getInfo().then((res) => {
				console.log('getInfo: ', res)
				if (res.data.code === 0) {
					next()
				} else {
					next({ path: '/login' })
				}
			})
		}
	} else {
		if ((whiteList.indexOf(to.path) !== -1)) {
			next();
		} else {
			next({path: '/login'})
		}
	}
})
