<template>
  <div class="matter-count">
    <a-row :gutter="10">
      <a-col :span="11">
        <a-card hoverable :bodyStyle="{ padding: '0px 10px 10px 10px' }">
          <div class="form-group">
            请示事项&nbsp;&nbsp;
            <a-radio-group v-model:value="askMe" button-style="solid" @change="askChange" v-if="user.isJustice && user.districtType === 3">
              <a-radio-button :value="true">我发起的</a-radio-button>
              <a-radio-button :value="false">交给我的</a-radio-button>
            </a-radio-group>
            &nbsp;&nbsp;<span class="send-time">发起时间：</span><a-range-picker v-model:value="askTimeR" style="width: 220px" allowClear @change="askChange" />
          </div>
          <a-spin :spinning="askLoading">
            <a-row :gutter="10" class="panel" type="flex">
              <a-col flex="180px">
                <div class="panel-item" :class="{ 'select-item': selectIndex === 1 }" @click="selectType(1)">
                  待办事项
                  <div class="number number1">{{ askCountData[0] }}<span class="ge">个</span></div>
                </div>
              </a-col>
              <a-col flex="180px">
                <div class="panel-item" :class="{ 'select-item': selectIndex === 2 }" @click="selectType(2)">
                  办结事项
                  <div class="number number2">{{ askCountData[1] }}<span class="ge">个</span></div>
                </div>
              </a-col>
            </a-row>
          </a-spin>
        </a-card>
      </a-col>
      <a-col :span="13">
        <a-card hoverable :bodyStyle="{ padding: '0px 10px 10px 10px' }">
          <div class="form-group">
            通知事项&nbsp;&nbsp;
            <a-radio-group v-model:value="noticeMe" button-style="solid" @change="noticeChange" v-if="user.isJustice && user.districtType === 3">
              <a-radio-button :value="true">我发起的</a-radio-button>
              <a-radio-button :value="false">交给我的</a-radio-button>
            </a-radio-group>
            &nbsp;&nbsp;<span class="send-time">发起时间：</span><a-range-picker v-model:value="noticeTimeR" style="width: 220px" allowClear @change="noticeChange" />
          </div>
          <a-spin :spinning="noticeLoading">
            <a-row :gutter="10" class="panel" type="flex">
              <a-col flex="180px">
                <div class="panel-item" :class="{ 'select-item': selectIndex === 3 }" @click="selectType(3)">
                  未办结事项
                  <div class="number number1">{{ noticeCountData[0] }}<span class="ge">个</span></div>
                </div>
              </a-col>
              <a-col flex="180px">
                <div class="panel-item" :class="{ 'select-item': selectIndex === 4 }" @click="selectType(4)">
                  已办结事项
                  <div class="number number2">{{ noticeCountData[1] }}<span class="ge">个</span></div>
                </div>
              </a-col>
            </a-row>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, getCurrentInstance } from 'vue'
import { DatePicker, Radio } from 'ant-design-vue'
import { findMyAskForAndInformCount, SearchDataType } from '@/api/matter'
import { StateType, UserType } from '@/@types/index'
import { useStore } from 'vuex'
import { TimeRangeValueType } from '@/api/subject/law-test'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'MatterCount',
  components: {
    'a-range-picker': DatePicker.RangePicker,
    'a-radio-group': Radio.Group,
    'a-radio-button': Radio.Button
  },
  setup(props, context) {
    const internalInstance = getCurrentInstance()
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const state = reactive({
      searchData: {} as SearchDataType,
      askTimeR: [] as any as TimeRangeValueType,
      noticeTimeR: [],
      askCountData: [],
      noticeCountData: [],
      askMe: false, // 是否我发送
      noticeMe: true, // 是否我发起的
      askLoading: false,
      noticeLoading: false,
      selectIndex: 1
    })
    const askChange = () => {
      // 请示事项时间的修改
      state.searchData.isInform = false
      state.searchData.isLaunchMySelf = state.askMe
      if (state.askTimeR) {
        state.searchData.beginTime = dayjs(state.askTimeR[0]).format('YYYY-MM-DD 00:00:00')
        state.searchData.endTime = dayjs(state.askTimeR[1]).format('YYYY-MM-DD 23:59:59')
      } else {
        state.searchData.beginTime = undefined
        state.searchData.endTime = undefined
      }
      state.askLoading = true
      findMyAskForAndInformCount(state.searchData).then(
        (result) => {
          state.askCountData = result.data
          state.askLoading = false
          selectType(0)
        },
        () => {
          state.askLoading = false
        }
      )
    }
    const noticeChange = () => {
      // 请示事项时间的修改
      state.searchData.isInform = true
      state.searchData.isLaunchMySelf = state.noticeMe
      if (state.noticeTimeR) {
        state.searchData.beginTime = internalInstance?.appContext.config.globalProperties.$parseTime(state.noticeTimeR[0], '{y}-{m}-{d} 00:00:00')
        state.searchData.endTime = internalInstance?.appContext.config.globalProperties.$parseTime(state.noticeTimeR[1], '{y}-{m}-{d} 23:59:59')
      } else {
        state.searchData.beginTime = undefined
        state.searchData.endTime = undefined
      }
      state.noticeLoading = true
      findMyAskForAndInformCount(state.searchData).then(
        (result) => {
          state.noticeCountData = result.data
          state.noticeLoading = false
          selectType(0)
        },
        () => {
          state.noticeLoading = false
        }
      )
    }
    const selectType = (type: number) => {
      if (type) {
        state.selectIndex = type
      }
      if (state.selectIndex === 1) {
        // 请示代办
        context.emit('updateSearch', { isInform: false, isMeSend: state.askMe, beginTime: state.searchData.beginTime, endTime: state.searchData.endTime, isFinished: false })
      } else if (state.selectIndex === 2) {
        // 请示办结
        context.emit('updateSearch', { isInform: false, isMeSend: state.askMe, beginTime: state.searchData.beginTime, endTime: state.searchData.endTime, isFinished: true })
      } else if (state.selectIndex === 3) {
        // 通知代办
        context.emit('updateSearch', { isInform: true, isMeSend: state.noticeMe, beginTime: state.searchData.beginTime, endTime: state.searchData.endTime, isFinished: false })
      } else {
        // 通知办结
        context.emit('updateSearch', { isInform: true, isMeSend: state.noticeMe, beginTime: state.searchData.beginTime, endTime: state.searchData.endTime, isFinished: true })
      }
    }
    if (user.isJustice) {
      // 是司法局
      state.askMe = false
      state.noticeMe = true
    } else {
      // 不是司法局
      state.askMe = true
      state.noticeMe = false
    }
    askChange()
    noticeChange()
    return {
      user,
      askChange,
      noticeChange,
      selectType,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.matter-count {
  .send-time {
    font-size: 14px;
  }
  .panel {
    margin-top: 10px;
    .panel-item {
      font-weight: bold;
      padding: 15px;
      border: solid 1px #e4edfd; // #bae7ff
      font-size: 20px;
      border-radius: 10px;
      .add-m {
        padding-top: 10px;
        color: #fa8c16;
        // font-size: 30px;
        .add {
          font-size: 38px;
        }
      }
      .number {
        font-family: @font-familyC;
        padding-top: 10px;
        font-size: 26px;
        .ge {
          font-size: 18px;
          margin-left: 10px;
        }
      }
      .number1 {
        color: #fa8c16;
        .ge {
          color: #ffc069;
        }
      }
      .number2 {
        color: #1890ff;
        .ge {
          color: #bae7ff;
        }
      }
    }
    .panel-item:hover {
      border-color: #1461ee;
    }
    .select-item {
      border-color: #1461ee;
      border-width: 2px;
    }
  }
}
</style>
