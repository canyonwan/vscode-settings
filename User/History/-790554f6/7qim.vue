<template>
  <div class="fixed z-50 w-full h-24 bg-no-repeat bg-cover header-main">
    <div class="flex px-24">
      <div class="flex-1 my-6 text-sm text-blue-200"> {{ `${year}/${month}/${day}&nbsp;&nbsp;&nbsp;&nbsp;星期${week}&nbsp;&nbsp;&nbsp;${hour}:${minute}` }} </div>
      <div class="flex-shrink my-3">
        <img src="@/assets/images/home/home_logo.png" class="inline-block w-10 mr-3 h-11" />
        <div class="inline-block text-2xl font-medium text-white align-middle xl:text-3xl lg:text-2xl md:text-lg sm:text-sm">行政执法云管理平台</div>
      </div>
      <div class="flex-1 my-6 text-sm text-right text-blue-200">
        <div class="inline-block px-16 cursor-pointer" v-if="userStore.getToken" @click="jumpToInform">
          <n-badge :value="unReadMessageCount" :max="99">
            <n-icon :component="NotificationNew" size="24" color="#fff" />
          </n-badge>
        </div>
        <div class="inline-block text-white">
          <n-dropdown trigger="hover" @select="avatarSelect" :options="avatarOptions" v-if="userStore.getToken">
            {{ `欢迎您，${userStore.getUserInfo.realName || userStore.getUserInfo.orgName}` }}
          </n-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTime } from '@/hooks/use-time'
  import { useUserStore } from '@/store/modules/user'
  import { NButton, useDialog, useMessage, useNotification } from 'naive-ui'
  import { useRouter } from 'vue-router'
  import { TABS_ROUTES } from '@/store/mutation-types'
  import { queryMessageUnreadCount } from '@/api/infrom'
  import { NotificationNew } from '@vicons/carbon'

  const userStore = useUserStore()
  const { year, month, day, hour, minute, week } = useTime()
  const router = useRouter()

  const unReadMessageCount = ref<number>(0)

  const message = useMessage()
  const dialog = useDialog()

  const avatarOptions = [
    {
      label: '退出登录',
      key: 2
    }
  ]

  // 头像下拉菜单
  const avatarSelect = (key: number) => {
    switch (key) {
      case 1:
        router.push({ name: 'Setting' })
        break
      case 2:
        doLogout()
        break
    }
  }

  // 退出登录
  const doLogout = () => {
    dialog.info({
      title: '提示',
      content: '您确定要退出登录吗',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.logout().then(() => {
          message.success('成功退出登录')
          // 移除标签页
          localStorage.removeItem(TABS_ROUTES)
          router
            .replace({
              name: 'Login',
              query: {
                // redirect: route.fullPath
              }
            })
            .finally(() => location.reload())
        })
      },
      onNegativeClick: () => {}
    })
  }

  function jumpToInform() {
    router.push({ name: 'InformSon' })
  }

  const notification = useNotification()

  async function getUnreadMessageCount() {
    const res = await queryMessageUnreadCount()
    unReadMessageCount.value = res
    if (res === unReadMessageCount.value)
      const n = notification.create({
        title: '通知',
        content: `你有${unReadMessageCount.value}条通知等待查看`,
        duration: 6000,
        closable: true,
        action: () =>
          h(
            NButton,
            {
              text: true,
              type: 'primary',
              onClick: () => {
                jumpToInform()
                n.destroy()
                // n.destroy()
              }
            },
            {
              default: () => '点击查看'
            }
          )
      })
  }

  getUnreadMessageCount()

  const interval = setInterval(() => {
    userStore.token ? getUnreadMessageCount() : clearInterval(interval)
  }, 30000)

  onBeforeUnmount(() => clearInterval(interval))
</script>

<style lang="less" scoped>
  .header-main {
    background-image: url('../../../assets/images/header_bg.png');
    background-size: 100% 100%;
  }
</style>
