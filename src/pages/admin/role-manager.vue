<script setup lang="ts">
import {RoleVO} from '~/composables/admin/user/userTypes'
import type * as ep from 'element-plus'
import {addDateRange} from '~/composables/admin/user/userTool'
import {listRole, delRole, changeRoleStatus, getRole, addRole, updateRole} from '~/api/admin-user'
import {router} from '~/modules/router'
import {parseTime} from "../../utils/common";
import {
	Delete,
	Edit,
	User,
	Search,
	Refresh,
	Plus,
} from '@element-plus/icons-vue'
const roleList = ref<RoleVO[]>()
const loading = ref(true)
const showSearch = ref(true)
const ids = ref<Array<string | number>>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const dateRange = ref<[ep.DateModelType, ep.DateModelType]>(['', ''])
const queryFormRef = ref<InstanceType<typeof ep.ElForm>>()
const roleFormRef = ref<InstanceType<typeof ep.ElForm>>()
// const menuOptions = ref<MenuTreeOption[]>([])
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const deptExpand = ref(true)
const deptNodeAll = ref(false)
// const deptOptions = ref<DeptTreeOption[]>([])
const openDataScope = ref(false)
const sys_normal_disable = ref([
	{
		label: '停用',
		value: '1',
	},
	{
		label: '正常',
		value: '0',
	},
])
const queryParams = ref({
	pageNum: 1,
	pageSize: 10,
	roleName: '',
	roleKey: '',
	status: '',
})

const rules = ref({
	roleName: [{required: true, message: '角色名称不能为空', trigger: 'blur'}],
	roleKey: [{required: true, message: '权限字符不能为空', trigger: 'blur'}],
	roleSort: [{required: true, message: '角色顺序不能为空', trigger: 'blur'}],
})

// eslint-disable-next-line no-undef
const dialog = reactive<DialogOption>({
	visible: false,
	title: '',
})

const initForm = {
	roleId: undefined,
	roleSort: 1,
	status: '0',
	roleName: '',
	roleKey: '',
	menuCheckStrictly: true,
	deptCheckStrictly: true,
	remark: '',
	dataScope: '1',
	menuIds: [],
	deptIds: [],
}
const form = ref({
	roleId: undefined,
	roleSort: 1,
	status: '0',
	roleName: '',
	roleKey: '',
	menuCheckStrictly: true,
	deptCheckStrictly: true,
	remark: '',
	dataScope: '1',
	menuIds: [],
	deptIds: [],
})
/**
 * 查询角色列表
 */
const getList = () => {
	loading.value = true
	listRole(addDateRange(queryParams.value, dateRange.value)).then((res) => {
		console.log('res:', res)
		roleList.value = res.data.rows
		total.value = res.data.total
		loading.value = false
	})
}

/**
 * 搜索按钮操作
 */
const handleQuery = () => {
	queryParams.value.pageNum = 1
	getList()
}

/** 重置 */
const resetQuery = () => {
	dateRange.value = ['', '']
	queryFormRef.value?.resetFields()
	handleQuery()
}
/**删除按钮操作 */
const handleDelete = async (row?: RoleVO) => {
	const roleids = row?.roleId || ids.value
	await ElMessageBox.confirm('是否确认删除角色编号为' + roleids + '数据项目')
	await delRole(roleids)
	getList()
	ElMessage.success('删除成功')
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: RoleVO[]) => {
	ids.value = selection.map((item: RoleVO) => item.roleId)
	single.value = selection.length != 1
	multiple.value = !selection.length
}

/** 角色状态修改 */
const handleStatusChange = async (row: RoleVO) => {
	let text = row.status === '0' ? '启用' : '停用'
	try {
		await ElMessageBox.confirm(
			'确认要"' + text + '""' + row.roleName + '"角色吗?'
		)
		await changeRoleStatus(row.roleId, row.status)
		ElMessage.success(text + '成功')
	} catch {
		row.status = row.status === '0' ? '1' : '0'
	}
}

/** 分配用户 */
const handleAuthUser = (row: RoleVO) => {
	router.push('/system/role-auth/user/' + row.roleId)
}

/** 查询菜单树结构 */
// const getMenuTreeselect = async () => {
// 	const res = await menuTreeselect()
// 	menuOptions.value = res.data
// }

/** 重置新增的表单以及其他数据  */
const reset = () => {
	// menuRef.value?.setCheckedKeys([]);
	menuExpand.value = false
	menuNodeAll.value = false
	deptExpand.value = true
	deptNodeAll.value = false
	form.value = { ...initForm }
	roleFormRef.value?.resetFields()
}

/** 添加角色 */
const handleAdd = () => {
	reset()
	// getMenuTreeselect();
	dialog.visible = true
	dialog.title = '添加角色'
}
/** 修改角色 */
const handleUpdate = async (row?: RoleVO) => {
	reset()
	const roleId = row?.roleId || ids.value[0]
	const {data} = await getRole(roleId)
	Object.assign(form.value, data)
	form.value.roleSort = Number(form.value.roleSort)
	// const res = await getRoleMenuTreeselect(roleId)
	dialog.title = '修改角色'
	dialog.visible = true
	// res.checkedKeys.forEach((v) => {
	// 	nextTick(() => {
	// 		menuRef.value?.setChecked(v, true, false)
	// 	})
	// })
}
/** 根据角色ID查询菜单树结构 */
// const getRoleMenuTreeselect = (roleId: string | number) => {
// 	return roleMenuTreeselect(roleId).then((res): RoleMenuTree => {
// 		menuOptions.value = res.data.menus
// 		return res.data
// 	})
// }
/** 根据角色ID查询部门树结构 */
// const getRoleDeptTreeSelect = async (roleId: string | number) => {
// 	const res = await deptTreeSelect(roleId)
// 	deptOptions.value = res.data.depts
// 	return res.data
// }
/** 树权限（展开/折叠）*/
// const handleCheckedTreeExpand = (value: boolean, type: string) => {
// 	if (type == 'menu') {
// 		let treeList = menuOptions.value
// 		for (let i = 0; i < treeList.length; i++) {
// 			if (menuRef.value) {
// 				menuRef.value.store.nodesMap[treeList[i].id].expanded = value
// 			}
// 		}
// 	} else if (type == 'dept') {
// 		let treeList = deptOptions.value
// 		for (let i = 0; i < treeList.length; i++) {
// 			if (deptRef.value) {
// 				deptRef.value.store.nodesMap[treeList[i].id].expanded = value
// 			}
// 		}
// 	}
// }
/** 树权限（全选/全不选） */
// const handleCheckedTreeNodeAll = (value: any, type: string) => {
// 	if (type == 'menu') {
// 		menuRef.value?.setCheckedNodes(value ? (menuOptions.value as any) : [])
// 	} else if (type == 'dept') {
// 		deptRef.value?.setCheckedNodes(value ? (deptOptions.value as any) : [])
// 	}
// }
/** 树权限（父子联动） */
// const handleCheckedTreeConnect = (value: any, type: string) => {
// 	if (type == 'menu') {
// 		form.value.menuCheckStrictly = value
// 	} else if (type == 'dept') {
// 		form.value.deptCheckStrictly = value
// 	}
// }
/** 所有菜单节点数据 */
// const getMenuAllCheckedKeys = (): any => {
// 	// 目前被选中的菜单节点
// 	let checkedKeys = menuRef.value?.getCheckedKeys()
// 	// 半选中的菜单节点
// 	let halfCheckedKeys = menuRef.value?.getHalfCheckedKeys()
// 	if (halfCheckedKeys) {
// 		checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys)
// 	}
// 	return checkedKeys
// }
/** 提交按钮 */
const submitForm = () => {
	roleFormRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			// form.value.menuIds = getMenuAllCheckedKeys()
			form.value.roleId
				? await updateRole(form.value)
				: await addRole(form.value)
			ElMessage.success('操作成功')
			dialog.visible = false
			getList()
		}
	})
}
/** 取消按钮 */
const cancel = () => {
	reset()
	dialog.visible = false
}
/** 选择角色权限范围触发 */
// const dataScopeSelectChange = (value: string) => {
// 	if (value !== '2') {
// 		deptRef.value?.setCheckedKeys([])
// 	}
// }
/** 分配数据权限操作 */
// const handleDataScope = async (row: RoleVO) => {
// 	const response = await getRole(row.roleId)
// 	Object.assign(form.value, response.data)
// 	const res = await getRoleDeptTreeSelect(row.roleId)
// 	openDataScope.value = true
// 	dialog.title = '分配数据权限'
// 	await nextTick(() => {
// 		deptRef.value?.setCheckedKeys(res.checkedKeys)
// 	})
// }
// /** 提交按钮（数据权限） */
// const submitDataScope = async () => {
// 	if (form.value.roleId) {
// 		form.value.deptIds = getDeptAllCheckedKeys()
// 		await dataScope(form.value)
// 		proxy?.$modal.msgSuccess('修改成功')
// 		openDataScope.value = false
// 		getList()
// 	}
// }
// /** 取消按钮（数据权限）*/
// const cancelDataScope = () => {
// 	dataScopeRef.value?.resetFields()
// 	form.value = {...initForm}
// 	openDataScope.value = false
// }

onMounted(() => {
	getList()
})
</script>

<template>
	<div>
		<z-form>
			<template #form-title> 角色管理</template>
			<template #form-sub-title> 此页面展示角色信息</template>

			<transition>
				<div v-show="showSearch" class="mb-[10px]">
					<el-card shadow="hover">
						<el-form
							ref="queryFormRef"
							:model="queryParams"
							:inline="true"
							label-width="68px"
						>
							<el-form-item label="角色名称" prop="roleName">
								<el-input
									v-model="queryParams.roleName"
									placeholder="请输入角色名称"
									clearable
									style="width: 240px"
									@keyup.enter="handleQuery"
								/>
							</el-form-item>
							<el-form-item label="权限字符" prop="roleKey">
								<el-input
									v-model="queryParams.roleKey"
									placeholder="请输入权限字符"
									clearable
									style="width: 240px"
									@keyup.enter="handleQuery"
								/>
							</el-form-item>
							<el-form-item label="状态" prop="status">
								<el-select
									v-model="queryParams.status"
									placeholder="角色状态"
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
									:default-time="[
										new Date(2000, 1, 1, 0, 0, 0),
										new Date(2000, 1, 1, 23, 59, 59),
									]"
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
							<el-button
								v-hasPermi="['system:role:add']"
								type="primary"
								plain
								:icon="Plus"
								@click="handleAdd()"
							>新增
							</el-button>
						</el-col>
						<el-col :span="1.5">
							<el-button
								v-hasPermi="['system:role:edit']"
								type="success"
								plain
								:disabled="single"
								:icon="Edit"
								@click="handleUpdate()"
							>修改
							</el-button>
						</el-col>
						<el-col :span="1.5">
							<el-button
								v-hasPermi="['system:role:delete']"
								type="danger"
								plain
								:disabled="ids.length === 0"
								@click="handleDelete()"
							>删除
							</el-button>
						</el-col>
						<el-col :span="1.5">
							<el-button
								v-hasPermi="['system:role:export']"
								type="warning"
								plain
								:icon="Download"
								@click="handleExport"
							>
								导出
							</el-button>
						</el-col>
						<right-toolbar
							v-model:showSearch="showSearch"
							@queryTable="getList"
						></right-toolbar>
					</el-row>
				</template>

				<el-table
					ref="roleTableRef"
					v-loading="loading"
					:data="roleList"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="55" align="center"/>
					<el-table-column
						v-if="false"
						label="角色编号"
						prop="roleId"
						width="120"
					/>
					<el-table-column
						label="角色名称"
						prop="roleName"
						:show-overflow-tooltip="true"
						width="150"
					/>
					<el-table-column
						label="权限字符"
						prop="roleKey"
						:show-overflow-tooltip="true"
						width="200"
					/>
					<el-table-column label="显示顺序" prop="roleSort" width="100"/>
					<el-table-column label="状态" align="center" width="100">
						<template #default="scope">
							<el-switch
								v-model="scope.row.status"
								active-value="0"
								inactive-value="1"
								@change="handleStatusChange(scope.row)"
							></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" align="center" prop="createTime">
						<template #default="scope">
							<span>{{ parseTime(scope.row.createTime) }}</span>
						</template>
					</el-table-column>

					<el-table-column fixed="right" label="操作" width="180">
						<template #default="scope">
							<el-tooltip
								v-if="scope.row.roleId !== 1"
								content="修改"
								placement="top"
							>
								<el-button
									link
									type="primary"
									:icon="Edit"
									@click="handleUpdate(scope.row)"
								></el-button>
							</el-tooltip>
							<el-tooltip
								v-if="scope.row.roleId !== 1"
								content="删除"
								placement="top"
							>
								<el-button
									link
									type="primary"
									:icon="Delete"
									@click="handleDelete(scope.row)"
								></el-button>
							</el-tooltip>
<!--							<el-tooltip-->
<!--								v-if="scope.row.roleId !== 1"-->
<!--								content="数据权限"-->
<!--								placement="top"-->
<!--							>-->
<!--								<el-button-->
<!--									v-hasPermi="['system:role:edit']"-->
<!--									link-->
<!--									type="primary"-->
<!--									icon="CircleCheck"-->
<!--									@click="handleDataScope(scope.row)"-->
<!--								></el-button>-->
<!--							</el-tooltip>-->
							<el-tooltip
								v-if="scope.row.roleId !== 1"
								content="分配用户"
								placement="top"
							>
								<el-button
									link
									type="primary"
									:icon="User"
									@click="handleAuthUser(scope.row)"
								></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>

				<pagination
					v-if="total > 0"
					v-model:total="total"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					@pagination="getList"
				/>
			</el-card>

			<el-dialog
				v-model="dialog.visible"
				:title="dialog.title"
				width="500px"
				append-to-body
			>
				<el-form
					ref="roleFormRef"
					:model="form"
					:rules="rules"
					label-width="100px"
				>
					<el-form-item label="角色名称" prop="roleName">
						<el-input v-model="form.roleName" placeholder="请输入角色名称"/>
					</el-form-item>
					<el-form-item prop="roleKey">
						<template #label>
							<span>
								<el-tooltip
									content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
									placement="top"
								>
									<el-icon><question-filled /></el-icon>
								</el-tooltip>
								权限字符
							</span>
						</template>
						<el-input v-model="form.roleKey" placeholder="请输入权限字符"/>
					</el-form-item>
					<el-form-item label="角色顺序" prop="roleSort">
						<el-input-number
							v-model="form.roleSort"
							controls-position="right"
							:min="0"
						/>
					</el-form-item>
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
					<el-form-item label="备注">
						<el-input
							v-model="form.remark"
							type="textarea"
							placeholder="请输入内容"
						></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<div class="dialog-footer">
						<el-button type="primary" @click="submitForm">确 定</el-button>
						<el-button @click="cancel">取 消</el-button>
					</div>
				</template>
			</el-dialog>

		</z-form>
	</div>
</template>

<style scoped lang="scss"></style>

<route lang="yaml">
meta:
 layout: admin
 name: 角色管理
</route>
