import { RoleVO } from '@/api/system/role/types';


/**
 * 用户信息
 */
export interface UserInfo {
	user: UserVO
	roles: string[]
	permissions: string[]
}



/**
 * 用户返回对象
 */
export interface UserVO {
	userId: string | number
	userName: string
	nickName: string
	userType: string
	email: string
	phonenumber: string
  sex: string
  avatar: string
  status: string
  delFlag: string
  loginIp: string
  loginDate: string
  remark: string

  roles: RoleVO[]
  roleIds: any
  postIds: any
  roleId: any
  admin: boolean
}

// eslint-disable-next-line no-redeclare
export interface RoleVO {
	roleId: string | number
	roleName: string
	roleKey: string
	roleSort: number
	dataScope: string
	menuCheckStrictly: boolean
	deptCheckStrictly: boolean
	status: string
	delFlag: string
	remark?: any
	flag: boolean
	menuIds?: Array<string | number>
	deptIds?: Array<string | number>
	admin: boolean
}

/**
 * 界面字段隐藏属性
 */
export declare interface FieldOption {
	key: number
	label: string
	visible: boolean
	children?: Array<FieldOption>
}

/**
 * 用户表单类型
 */
export interface UserForm {
  id?: string;
  userId?: string;
  deptId?: number;
  userName: string;
  nickName?: string;
  password: string;
  phonenumber?: string;
  email?: string;
  sex?: string;
  status: string;
  remark?: string;
  postIds: string[];
  roleIds: string[];
  avatar?: string;
}

export interface UserInfoVO {
  user: UserVO;
  roles: RoleVO[];
  roleIds: string[];
  roleGroup: string;
  postGroup: string;
}

export interface ResetPwdForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 用户表单类型
 */
export interface UserForm {
	id?: string
	userId?: string
	deptId?: number
	userName: string
	nickName?: string
	password: string
	phonenumber?: string
	email?: string
	sex?: string
	status: string
	remark?: string
	postIds: string[]
	roleIds: string[]
	avatar?: string
}
