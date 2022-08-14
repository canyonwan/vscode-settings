import { defineStore } from 'pinia'
import { createStorage } from '@/utils/storage'
import { store } from '@/store'
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { login, refreshAuth } from '@/api/login/login'
const Storage = createStorage({ storage: localStorage })
import { storage } from '@/utils/storage'
import type { IPersonnelInfo } from '@/api/user/types'
import { getUserInfo } from '@/api/user/personnel'
import type { ILogin } from '@/api/login/type'

export interface IUserState {
  token: string
  refreshToken: string
  username: string
  welcome: string
  avatar: string
  permissions: any[]
  info: IPersonnelInfo
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: Storage.get(ACCESS_TOKEN, ''),
    refreshToken: Storage.get(REFRESH_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: Storage.get(CURRENT_USER, {})
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getAvatar(): string {
      return this.avatar
    },
    getNickname(): string {
      return this.username
    },
    getPermissions(): [any][] {
      return this.permissions
    },
    getUserInfo(): IPersonnelInfo {
      return this.info as IPersonnelInfo
    },
    getIsUser(): boolean {
      // 返回是否是 使用用户
      return !!this.info.orgId
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setRefreshToken(token: string) {
      this.refreshToken = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setUserInfo(info) {
      this.info = info
    },
    // 登录
    async login(userInfo: ILogin, loginWay: boolean) {
      try {
        const result = await login(userInfo, loginWay)
        const ex = 7 * 24 * 60 * 60 * 1000
        storage.set(ACCESS_TOKEN, result.token, ex)
        storage.set(REFRESH_TOKEN, result.refreshToken, ex)
        storage.set(IS_LOCKSCREEN, false)
        this.setToken(result.token)
        this.setRefreshToken(result.refreshToken)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 刷新token
    async tokenPassiveRefresh() {
      return new Promise((resolve, reject) => {
        refreshAuth()
          .then((result) => {
            const ex = 7 * 24 * 60 * 60 * 1000
            storage.set(ACCESS_TOKEN, result.token, ex)
            storage.set(REFRESH_TOKEN, result.refreshToken, ex)
            this.setToken(result.token)
            this.setRefreshToken(result.refreshToken)
            resolve(result.token)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetInfo() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const result = res
            if (result.frontEndPermissionsInfo && result.frontEndPermissionsInfo.length) {
              const permissionsList = result.frontEndPermissionsInfo
              that.setPermissions(permissionsList)
            } else {
              // reject(new Error('getInfo: permissionsList must be a non-null array !'))
            }
            that.setUserInfo(result.userInfo)
            // that.setAvatar(result.avatar)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 登出
    async logout() {
      this.setPermissions([])
      this.setUserInfo('')
      this.setToken('')
      this.setRefreshToken('')
      storage.remove(ACCESS_TOKEN)
      storage.remove(REFRESH_TOKEN)
      return Promise.resolve('')
    }
  }
})

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store)
}
