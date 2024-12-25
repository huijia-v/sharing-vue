import axios from '~/http/request'
import {parseStrEmpty} from '~/composables/admin/user/userTool'

// 加载系统支持的所有存储引擎
export const listUser = (query) => {
	return axios({
		url: '/admin/system/user/list',
		method: 'get',
		data: query
	})
}

export const updateUser = (data) => {
	return axios({
		url: '/admin/system/user',
		method: 'put',
		data: data,
	})
}

export const addUser = (data) => {
	return axios({
		url: '/admin/system/user',
		method: 'post',
		data: data,
	})
}

export const deleteUser = (userId) => {
	return axios({
		url: '/admin/system/user/' + parseStrEmpty(userId),
		method: 'delete',
	})
}

export const getUser = (userId) => {
	return axios({
		url: '/admin/system/user/' + parseStrEmpty(userId),
		method: 'get',
	})
}

export const getProfile = () => {
	return axios({
		url: '/admin/system/profile',
		method: 'get',
	})
}
export const updateUserProfile = (data) => {
	return axios({
		url: '/admin/system/profile',
		method: 'put',
		data: data,
	})
};

export const getInfo = () => {
	return axios({
		url: '/admin/system/profile/getInfo',
		method: 'get',
	})
}
export const uploadAvatar = (data) => {
	return axios({
		url: '/admin/system/profile/avatar',
		method: 'post',
		data: data,
	})
}

export const changeUserStatus = (userId, status) => {
	const data = {
		userId,
		status,
	}
	return axios({
		url: '/admin/system/user/changeStatus',
		method: 'put',
		data: data,
	})
}

export const resetPwd = (userId, password) => {
	const data = {
		userId,
		password,
	}
	return axios({
		url: '/admin/system/user/resetPwd',
		method: 'put',
		data: data,
	})
}

/**
 * 个人中心修改密码
 * @param userId
 * @param password
 * @returns {Promise}
 */
export const updatePwd = (oldPassword, newPassword) => {
	const data = {
		oldPassword,
		newPassword,
	}
	return axios({
		url: '/admin/system/profile/updatePwd',
		method: 'put',
		data: data,
	})
}

export const listRole = (query) => {
	return axios({
		url: '/admin/system/role/list',
		method: 'get',
		data: query,
	})
}

export const addRole = (data) => {
	return axios({
		url: '/admin/system/role',
		method: 'post',
		data: data,
	})
}

export const updateRole = (data) => {
	return axios({
		url: '/admin/system/role',
		method: 'put',
		data: data,
	})
}

export const delRole = (roleId) => {
	return axios({
		url: '/admin/system/role/' + parseStrEmpty(roleId),
		method: 'delete',
	})
}

export const changeRoleStatus = (roleId, status) => {
	const data = {
		roleId,
		status,
	}
	return axios({
		url: '/admin/system/role/changeStatus',
		method: 'put',
		data: data,
	})
}

export const getRole = (roleId) => {
	return axios({
		url: '/admin/system/role/' + parseStrEmpty(roleId),
		method: 'get',
	})
}

// 查询授权角色
export function getAuthRole(userId) {
	return axios({
		url: '/admin/system/user/authRole/' + userId,
		method: 'get'
	})
}

// 保存授权角色
export function updateAuthRole(data) {
	return axios({
		url: '/admin/system/user/authRole',
		method: 'put',
		data: data
	})
}
