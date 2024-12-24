import {
	listUser,
	listRole,
	updateUser,
	addRole,
	updateRole,
	addUser,
} from '~/api/admin-user'
import { useRequest } from 'vue-request'
import common from "~/common";

export default function useUserManager() {
	// 加载请求
	const {
		data,
		loading: dataLoading,
		reload,
	} = useRequest(listUser(), {
		formatResult: (res) => {
			return res.data
		},
	})

	// 保存请求
	const { loading: saveLoading, run } = useRequest(updateUser(), {
		manual: true,
		onSuccess() {
			ElMessage({
				message: '保存成功',
				type: 'success',
			})
		},
	})

	const saveData = () => {
		run(data.value)
	}

	return {
		data, dataLoading, reload,
		saveData, saveLoading
	}
}
