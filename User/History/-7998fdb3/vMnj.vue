<template>
  <div class="view-account">
    <div class="view-account-container">
      <div class="view-account-name"> 用户登录 </div>
      <div class="view-account-form">
        <div class="form-body">
          <n-form ref="formRef" label-placement="left" size="large" :model="formInline" :rules="rulesAccount" :show-require-mark="false">
            <n-form-item path="username">
              <div class="form-item">
                <template v-if="loginWay">
                  <img class="form-label-icon" src="../../assets/images/login/login_account.svg" />
                  <div class="form-label">用户名</div>
                  <input class="form-input" type="text" placeholder="请输入用户名" v-model="formInline.username" />
                </template>
                <template v-else>
                  <img class="form-label-icon" src="../../assets/images/login/login_phone.svg" />
                  <div class="form-label">手机号</div>
                  <input class="form-input" placeholder="请输入手机号" v-model="formInline.username" />
                </template>
              </div>
            </n-form-item>
            <n-form-item path="password">
              <div class="form-item">
                <template v-if="loginWay">
                  <img class="form-label-icon" src="../../assets/images/login/login_password.svg" />
                  <div class="form-label">密码</div>
                  <input class="form-input" type="password" style="width: 280px" placeholder="请输入密码" v-model="formInline.password" v-if="!passwordShow" />
                  <input class="form-input" type="text" style="width: 280px" placeholder="请输入密码" v-model="formInline.password" v-else />
                  <n-icon @click="passwordShow = !passwordShow" class="password-icon">
                    <EyeInvisibleOutlined v-if="!passwordShow" />
                    <EyeOutlined v-else />
                  </n-icon>
                </template>
                <template v-else>
                  <img class="form-label-icon" src="../../assets/images/login/login_code.svg" />
                  <div class="form-label">验证码</div>
                  <input class="form-input" style="width: 210px" placeholder="请输入验证码" v-model="formInline.password" />
                  <div class="form-button-code" @click="getCode" v-if="codeTime === 0"> 获取验证码 </div>
                  <div class="form-button-code" v-else>
                    {{ `重新发送(${codeTime})` }}
                  </div>
                </template>
                <!-- <div class="form-button-code" @click="handleSubmit">忘记密码</div> -->
              </div>
            </n-form-item>
          </n-form>

          <div class="form-button-submit" @click="handleSubmit"> <n-spin :show="loading" size="small"> 登&nbsp;&nbsp;录2 </n-spin></div>
          <div class="login_change">
            <span @click="changeLoginWay">
              <n-icon size="18" color="#84D4FD">
                <SwapOutlined />
              </n-icon>
              {{ loginWay ? '手机登录' : '密码登录' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import { useMessage } from 'naive-ui'
  import { SwapOutlined, EyeInvisibleOutlined, EyeOutlined } from '@vicons/antd'
  import type { ILogin } from '@/api/login/type'
  import md5 from 'js-md5'
  import { getCaptcha } from '@/api/login/login'
  import { validatePhone } from '@/utils/validate'
  export default defineComponent({
    components: {
      EyeOutlined,
      EyeInvisibleOutlined,
      SwapOutlined
      // NCountdown
    },
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
    background-image: url('../../assets/images/login/login_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    align-items: center;
    justify-content: center;

    &-container {
      display: flex;
      align-items: center;
      justify-items: center;
      flex-direction: column;
      // margin: 5% 25%;
      height: 550px;
      width: 880px;
      background-image: url('../../assets/images/login/login_center_bg.svg');
      background-size: 100% 100%;

      .view-account-name {
        font-size: 25px;
        font-weight: bold;
        color: #fff;
        margin-top: 27px;
      }

      .view-account-form {
        flex: 1;
        display: flex;
        align-items: center;

        .form-body {
          display: flex;
          flex-direction: column;
          width: 400px;

          ::v-deep(.n-form-item .n-form-item-feedback-wrapper) {
            margin-bottom: 15px;

            .n-form-item-feedback.n-form-item-feedback--error {
              padding-left: 105px;
            }
          }

          .form-item {
            color: #fff;
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            line-height: 30px;
            margin-bottom: 5px;

            .form-input {
              font-size: 14px;
              width: 300px;
              border-bottom: 1px solid #5bbafc;
              background-color: transparent !important;
              outline: none;
              box-shadow: inset 0 0 0 1000px #07396a !important;
              color: #fff !important;
              // -webkit-transition-delay: 99999s;
              // -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;

              // input:-webkit-autofill,
              // input:-webkit-autofill:hover,
              // input:-webkit-autofill:focus,
              // input:-webkit-autofill:active {
              //   box-shadow: inset 0 0 0 1000px #07396a !important;
              //   color: #fff !important;
              // }
            }
            ::-webkit-input-placeholder {
              color: #fff;
              font-weight: 400;
              padding-left: 10px;
              opacity: 0.8;
            }

            .form-label-icon {
              margin-right: 15px;
              width: 15px;
              height: 20px;
            }

            .form-label {
              font-size: 18px;
              padding-right: 15px;
              min-width: 75px;
              font-weight: bold;
              letter-spacing: 2px;
              text-shadow: 0 2px 6px #2e97ff;
            }

            .password-icon {
              border-bottom: 1px solid #5bbafc;
              color: #5bbafc;
              font-size: 18px;
              height: 31px;
              padding-top: 5px;
              cursor: pointer;
            }

            // .form-tip {
            //   font-size: 13px;
            //   color: #fff;
            //   padding-left: 10px;
            // }

            .form-button-code {
              font-size: 12px;
              font-weight: 600;
              color: #083665;
              height: 30px;
              background-image: url('../../assets/images/login/login_code_button.svg');
              background-size: 100% 100%;
              width: 95px;
              text-align: center;
              cursor: pointer;
            }
          }

          .form-button-submit {
            display: flex;
            justify-content: center;
            width: 100%;
            color: #def2ff;
            padding: 12px 0;
            background-image: url('../../assets/images/login/login_button.svg');
            background-size: 100% 100%;
            cursor: pointer;
          }

          .login_change {
            height: 20px;
            font-size: 12px;
            margin-top: 15px;
            color: #84d4fd;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login/login_bg.png');
      background-repeat: no-repeat;
      // background-position: 50%;
      background-size: cover;
    }
  }
</style>
