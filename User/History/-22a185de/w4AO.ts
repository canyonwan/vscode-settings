import { defineStore } from 'pinia'
import { createStorage } from '@/utils/Storage'
import { store } from '@/store'
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { ResultEnum } from '@/enums/httpEnum'

const Storage = createStorage({ storage: localStorage })
import { login } from '@/api/login/login'
import { getUserInfo } from '@/api/system/user'
import { storage } from '@/utils/Storage'
import { refreshAuth } from '@/api/login/login'

export interface IUserState {
  token: string
  refreshToken: string
  username: string
  welcome: string
  avatar: string
  permissions: any[]
  info: any
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
    getAvatar(): string {
      return this.avatar
    },
    getNickname(): string {
      return this.username
    },
    getPermissions(): [any][] {
      return this.permissions
    },
    getUserInfo(): object {
      return this.info
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setRefreshToken(token: string) {
      this.refreshToken = token
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setUserInfo(info) {
      this.info = info
    },
    // 登录
    async login(userInfo, loginWay) {
      try {
        const response = await login(userInfo, loginWay)
        const { result, code } = response
        if (code === ResultEnum.SUCCESS) {
          const ex = 7 * 24 * 60 * 60 * 1000
          storage.set(ACCESS_TOKEN, result.token, ex)
          storage.set(CURRENT_USER, result, ex)
          storage.set(IS_LOCKSCREEN, false)
          this.setToken(result.token)
          this.setUserInfo(result)
        }
        return Promise.resolve(response)
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
          .then((result) => {
            // TAG
            // const result = res
            // const { result } = res
            if (result.permissions && result.permissions.length) {
              const permissionsList = result.permissions
              that.setPermissions(permissionsList)
              that.setUserInfo(result)
            } else {
              reject(new Error('getInfo: permissionsList must be a non-null array !'))
            }
            that.setAvatar(result.avatar)
            resolve(result)
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
      storage.remove(ACCESS_TOKEN)
      storage.remove(CURRENT_USER)
      return Promise.resolve('')
    }
  }
})

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store)
}
