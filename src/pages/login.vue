<template>
	<div class="h-full min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
		<div class="h-full lg:h-auto max-w-screen-lg bg-white shadow-xl sm:rounded-xl flex flex-1">
			<div class="flex-1 bg-gray-50 text-center hidden lg:flex rounded-l-xl">
				<div class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat zfile-login-logo"/>
			</div>
			<div class="w-full lg:w-1/2 xl:w-1/2 mt-10 p-6 sm:p-12">
				<div class="mt-0 flex flex-col items-center">
					<h1 class="text-2xl mt-0 xl:text-3xl font-extrabold box animate__animated animate__fadeInDown">
						<img class="w-16 cursor-pointer"
						     @click="openLink('https://github.com/zhaojun1998/zfile')"
						     src="../assets/icons/logo-sharing.png" />
					</h1>
					<div class="w-full flex-1">

            <div class="my-12 relative">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t text-gray-600" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-sm leading-none text-gray-600 tracking-wide font-medium">
                  {{ isLogin ? '用户登录' : '用户注册' }}
                </span>
              </div>
            </div>

            <el-form v-if="isLogin" @submit.prevent ref="loginFormRef" :rules="formRules" :model="formData"
						        class="zfile-login-form" size="large">
							<el-form-item class="box animate__animated animate__fadeInUp" prop="username">
								<el-input placeholder="用户账号" :prefix-icon="User" v-model.trim="formData.username"/>
							</el-form-item>

							<el-form-item class="box animate__animated animate__fadeInUp" prop="password">
								<el-input placeholder="用户密码" type="password" show-password :prefix-icon="Key" v-model.trim="formData.password"/>
							</el-form-item>

							<el-form-item v-if="loginVerifyMode === '2fa'" class="box animate__animated animate__fadeInUp" prop="verifyCode">
								<el-input placeholder="双因素认证验证码" :prefix-icon="Check" v-model.trim="formData.verifyCode"/>
							</el-form-item>

							<el-form-item v-else-if="loginVerifyMode === 'image'" class="box animate__animated animate__fadeInUp" prop="verifyCode">
								<div class="flex space-x-5 w-full">
									<el-input class="flex-1" placeholder="请输入验证码" :prefix-icon="PhotoIcon" v-model.trim="formData.verifyCode"/>
									<el-image :src="loginVerifyCodeImgData?.imgBase64" @click="loadLoginVerifyCodeImgData()"></el-image>
								</div>
							</el-form-item>

<!--							<el-form-item class="box animate__animated animate__fadeInUp float-right">-->
<!--								<el-tooltip class="item" effect="dark" placement="left">-->
<!--									<template #content>-->
<!--										将配置文件 application.properties 中 zfile.debug 修改为 true, 重启后访问首页即可重置密码 <br>-->
<!--										<a target="_blank" class="text-blue-400" href="https://docs.zfile.vip/question#reset-pwd">点击可前往文档查看操作方式</a>-->
<!--									</template>-->
<!--									<el-link :icon="QuestionFilled" :underline="false" class="zfile-float-right">忘记密码</el-link>-->
<!--								</el-tooltip>-->
<!--							</el-form-item>-->

							<el-form-item class="clear-right">
								<el-button :loading="loading" class="w-full mb-3" native-type="submit" type="primary"
									:icon="CheckBadgeIcon" @click="submitForm">登录</el-button>
								<div class="text-center">
									还没有账号？
									<el-button type="text" @click="isLogin = false">立即注册</el-button>
								</div>
							</el-form-item>
						</el-form>

						<el-form v-else @submit.prevent ref="registerFormRef" :rules="registerRules" :model="registerData"
							class="zfile-login-form" size="large">
							<el-form-item class="box animate__animated animate__fadeInUp" prop="username">
								<el-input placeholder="设置用户账号" :prefix-icon="User" v-model.trim="registerData.username"/>
							</el-form-item>

							<el-form-item class="box animate__animated animate__fadeInUp" prop="password">
								<el-input placeholder="设置密码" type="password" show-password :prefix-icon="Key"
									v-model.trim="registerData.password"/>
							</el-form-item>

							<el-form-item class="box animate__animated animate__fadeInUp" prop="confirmPassword">
								<el-input placeholder="确认密码" type="password" show-password :prefix-icon="Key"
									v-model.trim="registerData.confirmPassword"/>
							</el-form-item>

							<el-form-item class="clear-right">
								<el-button :loading="registerLoading" class="w-full mb-3" native-type="submit"
									type="primary" :icon="CheckBadgeIcon" @click="submitRegister">注册</el-button>
								<div class="text-center">
									已有账号？
									<el-button type="text" @click="isLogin = true">立即登录</el-button>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {checkLoginReq, loginReq, loginVerifyImgReq, loginVerifyModeReq, registerReq} from '~/api/login'

import { User, Key, QuestionFilled, Check } from '@element-plus/icons-vue'
import { CheckBadgeIcon } from '@heroicons/vue/24/solid'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import {installStatusReq} from "~/api/install";
let router = useRouter();
let loading = ref(false);
let loginFormRef = ref();

let formData = ref({
	username: 'huijia',
	password: '123456',
	verifyCode: '',
	verifyCodeUUID: '',
});

const openLink = (link) => {
	// window.open(link)
}

let formRules = ref({
	username: [
		{required: true, message: '账号不能为空', trigger: ['change', 'blur']},
	],
	password: [
		{required: true, message: '密码不能为空', trigger: ['change', 'blur']},
	]
});

const submitForm = () => {
	loginFormRef.value.validate((checked) => {
		if (checked) {
			loading.value = true;
			loginReq(formData.value).then((response) => {
				window.localStorage.setItem("sharing-token", response.data);
				ElMessage({
					message: "登录成功",
					type: 'success',
					duration: 1000,
					onClose() {

						router.push('/admin')
					}
				});
			}).catch(() => {
				loading.value = false;
				loadLoginVerifyCodeImgData()
			});
		} else {
			ElMessage.warning("请输入账号密码!")
		}
	})
}

const loginVerifyMode = ref('');

loginVerifyModeReq().then((res) => {
	loginVerifyMode.value = res.data;
})

const loginVerifyCodeImgData = ref({});

const loadLoginVerifyCodeImgData = () => {
	loginVerifyImgReq().then((res) => {
		loginVerifyCodeImgData.value = res.data;
		formData.value.verifyCodeUUID = res.data.uuid;
	});
};
loadLoginVerifyCodeImgData();

const isLogin = ref(true);
const registerFormRef = ref();
const registerLoading = ref(false);
const registerData = ref({
	username: '',
	password: '',
	confirmPassword: ''
});

const registerRules = ref({
	username: [
		{ required: true, message: '账号不能为空', trigger: ['change', 'blur'] },
		{ min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: ['change', 'blur'] }
	],
	password: [
		{ required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
		{ min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: ['change', 'blur'] }
	],
	confirmPassword: [
		{ required: true, message: '请确认密码', trigger: ['change', 'blur'] },
		{
			validator: (rule, value, callback) => {
				if (value !== registerData.value.password) {
					callback(new Error('两次输入的密码不一致'));
				} else {
					callback();
				}
			},
			trigger: ['change', 'blur']
		}
	]
});

const submitRegister = () => {
	registerFormRef.value.validate((valid) => {
		if (valid) {
			registerLoading.value = true;
			registerReq({
				userName: registerData.value.username,
				password: registerData.value.password
			}).then((response) => {
				// 检查响应状态
				if (response.data) {
					ElMessage({
						message: "注册成功，请登录",
						type: 'success',
						duration: 1500
					});

					registerData.value = {
						username: '',
						password: '',
						confirmPassword: ''
					};
				}
			}).catch(error => {
				// 处理错误情况
				console.error('注册失败:', error);
				ElMessage({
					message: error.response?.data?.message || "注册失败，请重试",
					type: 'error',
					duration: 1500
				});
			}).finally(() => {
				registerLoading.value = false;
				isLogin.value = true;
			});
		}
	});
};

onMounted(() => {
	installStatusReq().then((response) => {
		if (!response.data) {
			router.push('/install')
		}
	});

	// 如果已登录, 则自动跳转到 admin.
	checkLoginReq().then((response) => {
		if (response.data) {
			router.push('/admin')
		}
	});
})

</script>

<style lang="scss" scoped>

.zfile-login-logo {
	background-image: url('~/assets/icons/admin-login.svg');
}

.zfile-login-form {
	:deep(.el-form-item--large) {
		margin-bottom: 30px;
		&:last-child {
			margin-bottom: 0;
		}
	}

	--zfile-login-input-height: 45px;
	:deep(.el-input__inner) {
		height: var(--zfile-login-input-height);
	}

	:deep(.el-button--large) {
		--el-button-size: var(--zfile-login-input-height);
		height: var(--el-button-size);
	}


	 // 防止谷歌浏览器记住密码后样式错乱
 	:deep(input:-internal-autofill-selected) {
		-webkit-text-fill-color: var(--el-input-text-color, var(--el-text-color-regular));
		transition: background-color 1000s ease-out 0.5s;
	}
}
</style>
