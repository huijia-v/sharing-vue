<template>
	<div class="p-2">
		<el-row :gutter="20">
			<el-col :span="8" :xs="24">
				<el-card class="box-card">
					<template v-slot:header>
						<div class="clearfix">
							<span>个人信息</span>
						</div>
					</template>
					<div>
						<div class="text-center">
							<userAvatar/>
						</div>
						<ul class="list-group list-group-striped">
							<li class="list-group-item">
								<svg-icon icon-class="user"/>
								用户名称
								<div class="pull-right">{{ state.user.userName }}</div>
							</li>
							<li class="list-group-item">
								<svg-icon icon-class="phone"/>
								手机号码
								<div class="pull-right">{{ state.user.phonenumber }}</div>
							</li>
							<li class="list-group-item">
								<svg-icon icon-class="email"/>
								用户邮箱
								<div class="pull-right">{{ state.user.email }}</div>
							</li>
							<li class="list-group-item">
								<svg-icon icon-class="peoples"/>
								所属角色
								<div class="pull-right">{{ state.roleGroup }}</div>
							</li>
							<li class="list-group-item">
								<svg-icon icon-class="date"/>
								创建日期
								<div class="pull-right">{{ state.user.createTime }}</div>
							</li>
						</ul>
					</div>
				</el-card>
			</el-col>
			<el-col :span="16" :xs="24">
				<el-card>
					<template v-slot:header>
						<div class="clearfix">
							<span>基本资料</span>
						</div>
					</template>
					<el-tabs v-model="activeTab">
						<el-tab-pane label="基本资料" name="userinfo">
							<userInfo :user="userForm"/>
						</el-tab-pane>
						<el-tab-pane label="修改密码" name="resetPwd">
							<resetPwd/>
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup name="Profile" lang="ts">
import UserInfo from '~/pages/admin/user/userInfo.vue'
import {getProfile} from '~/api/admin-user'
import ResetPwd from '~/pages/admin/user/resetPwd.vue'
import UserAvatar from '~/pages/admin/user/userAvatar.vue'
import useUserStore from '~/composables/admin/user/user'
const activeTab = ref('userinfo')
const state = ref<Record<string, any>>({
	user: {},
	roleGroup: '',
	postGroup: '',
	auths: []
});

const userForm = ref({})
const getUser = async () => {
	const res = await getProfile()
	console.log('profile', res)
	console.log('profile', res.data)
	state.value.user = res.data.user;
	userForm.value = { ...res.data.user }
	state.value.roleGroup = res.data.roleGroup;
	state.value.postGroup = res.data.postGroup;
};

const getInfo = async () => {
	await useUserStore().getInfo()
}

// const getAuths = async () => {
// 	const res = await getAuthList();
// 	state.value.auths = res.data;
// };

onMounted(() => {
	getUser()
	getInfo()
	// getAuths();
})
</script>
