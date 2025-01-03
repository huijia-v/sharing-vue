import { useRequest } from 'vue-request'

export const testRequest = () => {
	const { data, loading, error } = useRequest({
		url: '/api/post',
		method: 'post',
	})
	return { data, loading, error }
}


export const getProfile = () => {
	return useRequest({
		url: '/admin/system/profile',
		method: 'get',
	})
}
