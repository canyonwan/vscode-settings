<template>
  <a-card class="message-center" :bodyStyle="{ paddingTop: '10px' }">
    <a-tabs :activeKey="currentKey" :animated="false" @change="onTabChange">
      <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.name" />
      <template #tabBarExtraContent>
        <a-button type="primary" class="mg-left-top button-color-warning" shape="round" @click="onMessageAdd">
          <template #icon><PlusCircleOutlined /></template>
          创建消息/通知
        </a-button>
      </template>
    </a-tabs>
    <message-list ref="messageListRef" :currentKey="currentKey" />
  </a-card>
  <a-modal v-model:visible="showMessageAddModal" title="创建消息、通知" :footer="null" width="70%" :bodyStyle="{ paddingLeft: '50px', paddingRight: '50px' }">
    <template #closeIcon><CloseCircleFilled /></template>
    <message-add @closeModal="showMessageAddModal = false" @okSave="onSaveOkMessage"></message-add>
  </a-modal>
</template>

<script lang="ts">
import { tabList } from '@/views/message-center/components/column-field'
import { CloseCircleFilled, PlusCircleOutlined } from '@ant-design/icons-vue'
import { Tabs } from 'ant-design-vue'
import { defineComponent, nextTick, reactive, ref, toRefs } from 'vue'
import MessageAdd from './components/message-add.vue'
import MessageList from './components/message-list.vue'

export default defineComponent({
  name: 'MessageCenter',
  components: {
    'a-tabs': Tabs,
    'a-tab-pane': Tabs.TabPane,
    PlusCircleOutlined,
    CloseCircleFilled,
    MessageAdd,
    MessageList
  },
  setup() {
    const messageListRef = ref()
    const state = reactive({
      showMessageAddModal: false,
      tabList: tabList,
      currentKey: '2'
    })

    const onTabChange = (key: string) => {
      state.currentKey = key
      messageListRef.value.timeList = []
      nextTick(() => {
        messageListRef.value.onSearch()
      })
    }

    const onSaveOkMessage = () => {
      state.showMessageAddModal = false
      messageListRef.value.onSearch()
    }

    const onMessageAdd = () => (state.showMessageAddModal = true)

    return {
      messageListRef,
      ...toRefs(state),
      onSaveOkMessage,
      onMessageAdd,
      onTabChange
    }
  }
})
</script>
