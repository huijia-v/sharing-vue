import { defineStore } from 'pinia'
import avatarUrl from '~/assets/image/profile.jpg'
import { getInfo } from '~/api/admin-user'
const useUserStore = defineStore('user', {
	state: () => ({
		id: '',
		name: '',
		avatar: '',
		roles: [],
		permissions: [],
	}),
	actions: {
		// 获取用户信息
		getInfo() {
			return new Promise((resolve, reject) => {
				getInfo()
					.then((res) => {
						console.log('getInfo', res)
						const user = res.data.user
						const avatar =
							user.avatar == '' || user.avatar == null ? avatarUrl : user.avatar
						if (res.data.roles && res.data.roles.length > 0) {
							// 验证返回的roles是否是一个非空数组
							this.roles = res.data.roles
							this.permissions = res.data.permissions
						} else {
							this.roles = ['ROLE_DEFAULT']
						}
						this.id = user.userId
						this.name = user.userName
						this.avatar = avatar
						resolve(res)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
	},
})

export default useUserStore
