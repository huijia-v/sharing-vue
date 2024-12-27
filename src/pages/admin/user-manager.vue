<template>
	<div>
		<z-form>
			<template #form-title> 用户管理</template>
			<template #form-sub-title> 此页面展示用户信息</template>
			<transition>
				<div v-show="showSearch" class="mb-[10px]">
					<el-card shadow="hover">
						<el-form
							ref="queryFormRef"
							:model="queryParams"
							:inline="true"
							label-width="68px"
						>
							<el-form-item label="用户名称" prop="userName">
								<el-input
									v-model="queryParams.userName"
									placeholder="请输入用户名称"
									clearable
									style="width: 240px"
									@keyup.enter="handleQuery"
								/>
							</el-form-item>
							<el-form-item label="手机号码" prop="phonenumber">
								<el-input
									v-model="queryParams.phonenumber"
									placeholder="请输入手机号码"
									clearable
									style="width: 240px"
									@keyup.enter="handleQuery"
								/>
							</el-form-item>

							<el-form-item label="状态" prop="status">
								<el-select
									v-model="queryParams.status"
									placeholder="用户状态"
									clearable
									style="width: 240px"
								>
									<el-option
										v-for="dict in sys_normal_disable"
										:key="dict.value"
										:label="dict.label"
										:value="dict.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item label="创建时间" style="width: 308px">
								<el-date-picker
									v-model="dateRange"
									value-format="YYYY-MM-DD"
									type="daterange"
									range-separator="-"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
								></el-date-picker>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" :icon="Search" @click="handleQuery"
								>搜索
								</el-button>
								<el-button :icon="Refresh" @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-form>
					</el-card>
				</div>
			</transition>

			<el-card shadow="hover">
				<template #header>
					<el-row :gutter="10">
						<el-col :span="1.5">
							<el-button type="primary" plain :icon="Plus" @click="handleAdd()"
							>新增
							</el-button>
						</el-col>
						<el-col :span="1.5">
							<el-button
								type="success"
								plain
								:disabled="single"
								:icon="Edit"
								@click="handleUpdate()"
							>
								修改
							</el-button>
						</el-col>
						<el-col :span="1.5">
							<el-button
								type="danger"
								plain
								:disabled="multiple"
								:icon="Delete"
								@click="handleDelete()"
							>
								删除
							</el-button>
						</el-col>

						<right-toolbar
							v-model:showSearch="showSearch"
							:columns="columns"
							:search="true"
							@queryTable="getList"
						></right-toolbar>
					</el-row>
				</template>

				<el-table
					v-loading="loading"
					:data="userList"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="50" align="center"/>
					<el-table-column
						v-if="columns[0].visible"
						key="userId"
						label="用户编号"
						align="center"
						prop="userId"
					/>
					<el-table-column
						v-if="columns[7].visible"
						key="avatar"
						label="头像"
						align="center"
						width="100"
					>
						<template #default="scope">
							<el-avatar
								:size="40"
								:src="scope.row.avatar || defaultAvatar"
								@error="() => true"
							>
							</el-avatar>
						</template>
					</el-table-column>
					<el-table-column
						v-if="columns[1].visible"
						key="userName"
						label="用户名称"
						align="center"
						prop="userName"
						:show-overflow-tooltip="true"
					/>
					<el-table-column
						v-if="columns[2].visible"
						key="nickName"
						label="用户昵称"
						align="center"
						prop="nickName"
						:show-overflow-tooltip="true"
					/>
					<el-table-column
						v-if="columns[4].visible"
						key="phonenumber"
						label="手机号码"
						align="center"
						prop="phonenumber"
						width="120"
					/>
					<el-table-column
						v-if="columns[5].visible"
						key="status"
						label="状态"
						align="center"
					>
						<template #default="scope">
							<el-switch
								v-model="scope.row.status"
								active-value="0"
								inactive-value="1"
								@change="handleStatusChange(scope.row)"
							></el-switch>
						</template>
					</el-table-column>

					<el-table-column
						v-if="columns[6].visible"
						label="创建时间"
						align="center"
						prop="createTime"
						width="160"
					>
						<template #default="scope">
							<span>{{ scope.row.createTime }}</span>
						</template>
					</el-table-column>


					<el-table-column
						label="操作"
						fixed="right"
						width="180"
						class-name="small-padding fixed-width"
					>
						<template #default="scope">
							<el-tooltip
								v-if="scope.row.userId !== 1"
								content="修改"
								placement="top"
							>
								<el-button
									link
									:icon="Edit"
									type="primary"
									@click="handleUpdate(scope.row)"
								></el-button>
							</el-tooltip>
							<el-tooltip
								v-if="scope.row.userId !== 1"
								content="删除"
								placement="top"
							>
								<el-button
									link
									:icon="Delete"
									type="primary"
									@click="handleDelete(scope.row)"
								></el-button>
							</el-tooltip>

							<el-tooltip
								v-if="scope.row.userId !== 1"
								content="重置密码"
								placement="top"
							>
								<el-button
									link
									:icon="Key"
									type="primary"
									@click="handleResetPwd(scope.row)"
								></el-button>
							</el-tooltip>

							<el-tooltip
								v-if="scope.row.userId !== 1"
								content="分配角色"
								placement="top"
							>
								<el-button
									link
									:icon="CircleCheck"
									type="primary"
									@click="handleAuthRole(scope.row)"
								></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>

				<pagination
					v-show="total > 0"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					:total="total"
					@pagination="getList"
				/>
			</el-card>

			<!-- 添加或修改用户配置对话框 -->
			<el-dialog
				ref="formDialogRef"
				v-model="dialog.visible"
				:title="dialog.title"
				width="600px"
				append-to-body
				@close="closeDialog"
			>
				<el-form
					ref="userFormRef"
					:model="form"
					:rules="rules"
					label-width="80px"
				>
					<el-row>
						<el-col :span="24">
							<el-form-item label="头像" prop="avatar">
								<el-upload
									class="avatar-uploader"
									:action="uploadUrl"
									:show-file-list="false"
									:on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload"
									:headers="uploadHeaders"
								>
									<img v-if="form.avatar" :src="form.avatar" class="avatar"/>
									<el-icon v-else class="avatar-uploader-icon">
										<Plus/>
									</el-icon>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="用户昵称" prop="nickName">
								<el-input
									v-model="form.nickName"
									placeholder="请输入用户昵称"
									maxlength="30"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="手机号码" prop="phonenumber">
								<el-input
									v-model="form.phonenumber"
									placeholder="请输入手机号码"
									maxlength="11"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="邮箱" prop="email">
								<el-input
									v-model="form.email"
									placeholder="请输入邮箱"
									maxlength="50"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item
								v-if="form.userId == undefined"
								label="用户名称"
								prop="userName"
							>
								<el-input
									v-model="form.userName"
									placeholder="请输入用户名称"
									maxlength="30"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item
								v-if="form.userId == undefined"
								label="用户密码"
								prop="password"
							>
								<el-input
									v-model="form.password"
									placeholder="请输入用户密码"
									type="password"
									maxlength="20"
									show-password
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="用户性别">
								<el-select v-model="form.sex" placeholder="请选择">
									<el-option
										v-for="dict in sys_user_sex"
										:key="dict.value"
										:label="dict.label"
										:value="dict.value"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="状态">
								<el-radio-group v-model="form.status">
									<el-radio
										v-for="dict in sys_normal_disable"
										:key="dict.value"
										:label="dict.value"
									>{{ dict.label }}
									</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="角色">
								<el-select v-model="form.roleIds" multiple placeholder="请选择">
									<el-option
										v-for="item in roleOptions"
										:key="item.roleId"
										:label="item.roleName"
										:value="item.roleId"
										:disabled="item.status == '1'"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="备注">
								<el-input
									v-model="form.remark"
									type="textarea"
									placeholder="请输入内容"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<template #footer>
					<div class="dialog-footer">
						<el-button type="primary" @click="submitForm">确 定</el-button>
						<el-button @click="cancel()">取 消</el-button>
					</div>
				</template>
			</el-dialog>
		</z-form>
	</div>
</template>


<script setup lang="ts">
import {
	listUser,
	deleteUser,
	changeUserStatus,
	getUser,
	getProfile,
	updateUser,
	resetPwd,
	addUser,
} from '~/api/admin-user'
import {to} from 'await-to-js'
import type * as ep from 'element-plus'
import {addDateRange} from '~/composables/admin/user/userTool'
import {
	RoleVO,
	UserForm,
	UserVO,
	FieldOption,
} from '~/composables/admin/user/userTypes'
import {router} from '~/modules/router'
import {
	Delete,
	Edit,
	Key,
	CircleCheck,
	Search,
	Refresh,
	Plus,
} from '@element-plus/icons-vue'
import defaultAvatar from '~/assets/image/avator.png'

const loading = ref(false)
const ids = ref<Array<number | string>>([])
const showSearch = ref(true)
const queryParams = ref({
	pageNum: 1,
	pageSize: 10,
	userName: '',
	phonenumber: '',
	status: '',
})
const total = ref(0)
const userList = ref<UserVO[]>()
const dateRange = ref<[ep.DateModelType, ep.DateModelType]>(['', ''])
/** 查询用户列表 */
const getList = async () => {
	loading.value = true
	const res = await listUser(addDateRange(queryParams.value, dateRange.value))
	loading.value = false
	userList.value = res.data.rows
	total.value = res.data.total
}

/** 搜索按钮操作 */
const handleQuery = () => {
	queryParams.value.pageNum = 1
	getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
	dateRange.value = ['', '']
	queryFormRef.value?.resetFields()
	queryParams.value.pageNum = 1
	queryParams.value.deptId = undefined
	handleQuery()
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserVO) => {
	const userIds = row?.userId || ids.value
	const [err] = await to(
		ElMessageBox.confirm(
			'是否确认删除用户编号为"' + userIds + '"的数据项？'
		) as any
	)
	if (!err) {
		await deleteUser(userIds)
		await getList()
		ElMessage.success('删除成功')
	}
}

/** 用户状态修改  */
const handleStatusChange = async (row: UserVO) => {
	let text = row.status === '0' ? '启用' : '停用'
	try {
		await ElMessageBox.confirm(
			'确认要"' + text + '""' + row.userName + '"用户吗?'
		)
		await changeUserStatus(row.userId, row.status)
		ElMessage.success(text + '成功')
	} catch (err) {
		row.status = row.status === '0' ? '1' : '0'
	}
}
const initFormData: UserForm = {
	userId: undefined,
	userName: '',
	nickName: undefined,
	password: '',
	phonenumber: undefined,
	email: undefined,
	sex: undefined,
	status: '0',
	remark: '',
	postIds: [],
	roleIds: [],
	avatar: '',
}
/** 重置操作表单 */
const reset = () => {
	form.value = {...initFormData}
	userFormRef.value?.resetFields()
}
const dialog = reactive({
	title: '',
	visible: false,
})
const form = ref({
	userId: undefined,
	deptId: undefined,
	userName: '',
	nickName: undefined,
	password: '',
	phonenumber: undefined,
	email: undefined,
	sex: undefined,
	status: '0',
	remark: '',
	postIds: [],
	roleIds: [],
	avatar: '',
})
const rules = ref({
	userName: [
		{required: true, message: '用户名称不能为空', trigger: 'blur'},
		{
			min: 2,
			max: 20,
			message: '用户名称长度必须介于 2 和 20 之间',
			trigger: 'blur',
		},
	],
	nickName: [{required: true, message: '用户昵称不能为空', trigger: 'blur'}],
	password: [
		{required: true, message: '用户密码不能为空', trigger: 'blur'},
		{
			min: 5,
			max: 20,
			message: '用户密码长度必须介于 5 和 20 之间',
			trigger: 'blur',
		},
	],
	email: [
		{
			type: 'email',
			message: '请输入正确的邮箱地址',
			trigger: ['blur', 'change'],
		},
	],
	phonenumber: [
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: '请输入正确的手机号码',
			trigger: 'blur',
		},
	],
})

const sys_user_sex = ref([
	{
		label: '男',
		value: '0',
	},
	{
		label: '女',
		value: '1',
	},
])
const sys_normal_disable = ref([
	{
		label: '正常',
		value: '0',
	},
	{
		label: '停用',
		value: '1',
	},
])

// 列显隐信息
const columns = ref<FieldOption[]>([
	{key: 0, label: `用户编号`, visible: false, children: []},
	{key: 1, label: `用户名称`, visible: true, children: []},
	{key: 2, label: `用户昵称`, visible: true, children: []},
	{key: 3, label: `部门`, visible: true, children: []},
	{key: 4, label: `手机号码`, visible: true, children: []},
	{key: 5, label: `状态`, visible: true, children: []},
	{key: 6, label: `创建时间`, visible: true, children: []},
	{key: 7, label: `头像`, visible: true, children: []},
])

const roleOptions = ref<RoleVO[]>([])
const initPassword = ref<String>('')
const single = ref(true)
const multiple = ref(true)
/** 新增按钮操作 */
const handleAdd = async () => {
	reset()
	const {data} = await getUser()
	dialog.visible = true
	dialog.title = '新增用户'
	roleOptions.value = data.roles
	form.value.password = initPassword.value.toString()
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserForm) => {
	reset()
	const userId = row?.userId || ids.value[0]
	const {data} = await getUser(userId)
	dialog.visible = true
	dialog.title = '修改用户'
	Object.assign(form.value, data.user)
	console.log('data.roles', data.roles)
	roleOptions.value = data.roles;
	console.log('roleOptions', roleOptions.value)
	form.value.postIds = data.postIds
	form.value.roleIds = data.roleIds
	form.value.password = ''
}
const userFormRef = ref<InstanceType<typeof ep.ElForm>>()
const formDialogRef = ref<InstanceType<typeof ep.ElDialog>>()
const queryFormRef = ref<InstanceType<typeof ep.ElForm>>()
/** 提交按钮 */
const submitForm = () => {
	userFormRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			form.value.userId
				? await updateUser(form.value)
				: await addUser(form.value)
			ElMessage.success('操作成功')
			dialog.visible = false
			await getList()
		}
	})
}

/** 取消按钮 */
const cancel = () => {
	dialog.visible = false
	reset()
}

/**
 * 关闭用户弹窗
 */
const closeDialog = () => {
	dialog.visible = false
	resetForm()
}

/**
 * 重置表单
 */
const resetForm = () => {
	userFormRef.value?.resetFields()
	userFormRef.value?.clearValidate()

	form.value.id = undefined
	form.value.status = '1'
}

/** 跳转角色分配 */
const handleAuthRole = (row: UserVO) => {
	const userId = row.userId
	router.push('/admin/user/auth/' + userId)
}

/** 重置密码按钮操作 */
const handleResetPwd = async (row: UserVO) => {
	const [err, res] = await to(
		ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			closeOnClickModal: false,
			inputPattern: /^.{5,20}$/,
			inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
		})
	)
	if (!err) {
		await resetPwd(row.userId, res.value)
		ElMessage.success('修改成功，新密码是：' + res.value)
	}
}

const uploadUrl = '/api/file/upload' // 替换为实际的上传接口
const uploadHeaders = computed(() => ({
	Authorization: localStorage.getItem('sharing-token')
}))

const handleAvatarSuccess = (response: any, file: File) => {
	form.value.avatar = response.data // 假设返回的数据中包含文件URL
}

const beforeAvatarUpload = (file: File) => {
	const isImage = file.type.startsWith('image/')
	const isLt2M = file.size / 1024 / 1024 < 2

	if (!isImage) {
		ElMessage.error('上传头像图片只能是图片格式!')
		return false
	}
	if (!isLt2M) {
		ElMessage.error('上传头像图片大小不能超过 2MB!')
		return false
	}
	return true
}

onMounted(() => {
	getList() // 初始化列表数据
	initPassword.value = 123456
	// proxy?.getConfigKey("sys.user.initPassword").then(response => {
	// 	initPassword.value = response.data;
	// })
})
</script>


<route lang="yaml">
meta:
 layout: admin
 name: 用户管理
</route>

<style scoped>
.avatar-uploader {
	text-align: center;
}

.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
}

.avatar {
	width: 100px;
	height: 100px;
	display: block;
}
</style>
