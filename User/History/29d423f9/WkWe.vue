<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img src="~@/assets/images/account-logo.png" alt="" />
        </div>
        <div class="view-account-top-desc">兽药商城管理系统</div>
      </div>
      <div class="view-account-form">
        <n-form ref="formRef" label-placement="left" size="large" :model="formInline" :rules="rules">
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="请输入用户名">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input v-model:value="formInline.password" type="password" showPasswordOn="click" placeholder="请输入密码">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
              </div>
              <div class="flex-initial order-last">
                <a href="javascript:">忘记密码</a>
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block> 登录 </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial">
                <span>其它登录方式</span>
              </div>
              <div class="flex-initial mx-2">
                <a href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoGithub />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial mx-2">
                <a href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoFacebook />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial" style="margin-left: auto">
                <a href="javascript:">注册账号</a>
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import { useMessage } from 'naive-ui'
  import md5 from 'js-md5'
  import { getCaptcha } from '@/api/login/login'
  import { ILogin } from '@/api/login/types'
  export default defineComponent({
    setup() {
      const formRef = ref()
      const message = useMessage()
      const loading = ref(false)
      const codeTime = ref(0) // 验证码重新发送时间
      const loginWay = ref(true) // 登录方式，true是账号密码登录，false是手机号验证码登录
      const passwordShow = ref(false) // 密码查看
      const formInline = reactive({
        username: '',
        password: ''
      })
      const rulesAccount = {
        username: {
          required: true,
          trigger: 'blur',
          validator: (rule, value) => {
            if (loginWay.value) {
              rule.type = 'string'
              if (!value && loginWay.value) {
                return new Error('请输入用户名')
              }
            } else {
              rule.len = 11
              rule.type = 'number'
              if (!value) {
                return new Error('请输入手机号')
              } else {
                if (!validatePhone(value)) {
                  return new Error('请输入格式正确的手机号')
                }
              }
            }
          }
        },
        password: {
          required: true,
          trigger: 'blur',
          validator: (_rule, value) => {
            if (!value && loginWay.value) {
              return new Error('请输入密码')
            } else if (validatePhone(formInline.username) && !value && !loginWay.value) {
              return new Error('请输入验证码')
            }
          }
        }
      }

      const userStore = useUserStore()
      const router = useRouter()
      const handleSubmit = async (e) => {
        e.preventDefault()
        if (loading.value === true) {
          return true
        }

        formRef.value.validate(async (errors) => {
          if (!errors) {
            const { username, password } = formInline
            message.loading('登录中...')
            loading.value = true
            const params: ILogin = {
              username,
              password: loginWay.value ? md5(password) : password
            }
            userStore
              .login(params, loginWay.value)
              .then(() => {
                router.replace({
                  path: '/middle-ground'
                })
              })
              .finally(() => {
                loading.value = false
              })
          }
        })
      }

      // 清空验证
      const clearValidate = () => {
        formRef.value?.restoreValidation()
      }

      // 手机号格式
      const validatePhone = (value) => {
        const reg = /^1((3[0-9])|(4[1579])|(5[0-9])|(6[6])|(7[0-9])|(8[0-9])|(9[0-9]))\d{8}$/
        if (!reg.test(value.trim())) {
          return false
        } else {
          return true
        }
      }

      // 获取验证码
      const getCode = async () => {
        if (validatePhone(formInline.username.trim())) {
          getCaptcha({ phone: formInline.username }).then(
            () => {
              codeTime.value = 60
              getCountdown()
            },
            () => {
              codeTime.value = 60
              getCountdown()
            }
          )
        } else {
          await formRef.value?.validate()
        }
      }
      // 获取倒计时
      const getCountdown = async () => {
        if (codeTime.value > 0) {
          codeTime.value--
          setTimeout(getCountdown, 1000)
        } else {
          codeTime.value === 0
        }
      }
      // 切换登录方式，账号密码登录或者 手机号验证码登录
      const changeLoginWay = () => {
        loginWay.value = !loginWay.value
        formInline.username = ''
        formInline.password = ''
        clearValidate()
      }
      return {
        codeTime,
        passwordShow,
        loginWay,
        formInline,
        rulesAccount,
        loading,
        formRef,
        handleSubmit,
        getCode,
        changeLoginWay
      }
    }
  })
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      flex: 1;
      padding: 32px 0;
      width: 384px;
      margin: 0 auto;
    }

    &-top {
      padding: 32px 0;
      text-align: center;

      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>
