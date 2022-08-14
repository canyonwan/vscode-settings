/**
 * 登录接口类
 */
export interface ILogin {
  username: string
  password: string
}

export interface IUserInfoMock {
  userId: string
  username: string
  realName: string
  avatar: string
  desc: string
  password: string
  token: string
  permissions: IUserPermissionMock[]
}

export interface IUserPermissionMock {
  label: string
  value: string
}
