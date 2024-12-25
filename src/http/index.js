import axios from 'axios'
import { ElMessage } from 'element-plus'
import useGlobalConfigStore from '~/stores/global-config'
import { tansParams } from '~/composables/admin/user/userTool'
import cache from "~/http/cache";

// 创建 axios 的一个实例
const instance = axios.create({
	baseURL: useGlobalConfigStore().zfileConfig.baseUrl, //接口统一域名
	timeout: 0, //设置超时
	headers: {
		'Content-Type': 'application/json;charset=UTF-8;',
	},
})

// 请求拦截器
instance.interceptors.request.use(
	(config) => {
		// 每次发送请求之前判断是否存在 token，如果存在，则统一在 http 请求的 header 都加上 token，不用每次请求都手动添加了
		const token = window.localStorage.getItem('sharing-token')
		// 非外部链接，才增加 token 到请求头
		if (!config.url.startsWith('http')) {
			token && (config.headers['sharing-token'] = token)
			config.headers['axios-request'] = true
		}
		// console.log('开始请求的 url 为：', config.url, '\n时间为：', new Date().getTime())
		// requestTimeCache[config.url] = new Date().getTime();
		// get请求映射params参数
		if (config.method === 'get' && config.params) {
			let url = config.url + '?' + tansParams(config.params)
			url = url.slice(0, -1)
			config.params = {}
			config.url = url
		}
		if (config.method === 'post' || config.method === 'put') {
			const requestObj = {
				url: config.url,
				data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
				time: new Date().getTime()
			}
			const sessionObj = cache.session.getJSON('sessionObj')
			if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
				cache.session.setJSON('sessionObj', requestObj)
			} else {
				const s_url = sessionObj.url;                // 请求地址
				const s_data = sessionObj.data;              // 请求数据
				const s_time = sessionObj.time;              // 请求时间
				const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
				if (
					s_data === requestObj.data &&
					requestObj.time - s_time < interval &&
					s_url === requestObj.url
				) {
					const message = '数据正在处理，请勿重复提交';
					console.warn(`[${s_url}]: ` + message)
					return Promise.reject(new Error(message))
				} else {
					cache.session.setJSON('sessionObj', requestObj)
				}
			}
		}
		return config
	},
	(error) =>
		// 对请求错误做些什么
		Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
	(response) => {
		// console.log('结束请求的 url 为：', response.config.url, '\n时间为：', new Date().getTime(), '\n耗时为：', new Date().getTime() - requestTimeCache[response.config.url])

		// 如果不需要话执行响应拦截器, 直接返回
		if (response.config.responseIntercept === false) {
			return response
		}

		if (response.data.code !== 0) {
			if (response.data.code === 401) {
				router.push('/login')
			}

			if (response.config.showDefaultMsg !== false) {
				if (response.data.code === 400) {
					let errorObj = response.data.data

					let keys = Object.keys(errorObj)

					let message
					if (keys.length > 1) {
						message = '非法参数！<br>'
						keys.forEach((key) => {
							message += `字段[${key}]: ${errorObj[key]}<br>`
						})
					} else {
						message = errorObj[keys[0]]
					}

					ElMessage({
						type: 'error',
						dangerouslyUseHTMLString: true,
						grouping: true,
						message: message,
					})
				} else {
					ElMessage({
						type: 'error',
						dangerouslyUseHTMLString: true,
						grouping: true,
						message: response.data.msg,
					})
				}
			}

			return Promise.reject(response)
		}
		return response.data
	},
	(error) => {
		// 响应错误
		if (error.response && error.response.status) {
			const responseDataCode = error.response.data.code

			if (responseDataCode === 401) {
				window.location.href = '/login'
			}

			if (error.response.config.showDefaultMsg !== false) {
				if (responseDataCode) {
					ElMessage({
						type: 'error',
						grouping: true,
						message: error.response.data.msg,
					})
				} else {
					ElMessage({
						type: 'error',
						grouping: true,
						message: '请求失败，请联系管理员',
					})
				}
			}
			return Promise.reject(error)
		}
		return Promise.reject(error)
	}
)

export default instance
