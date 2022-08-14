<template>
  <div class="enforcement-process">
    <!-- 执法流程 -->
    <div v-if="$props.orgInfo && $props.orgInfo.isJustice">请点击左侧列表，查看您要了解的执法流程</div>
    <div v-else>
      <spin :spinning="loading">
        <a-carousel arrows>
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
              <left-circle-outlined />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <right-circle-outlined />
            </div>
          </template>
          <div v-for="(item, index) in imageData" :key="index"><img class="image" :src="item.url" /></div>
        </a-carousel>
        {{ imageData }}
      </spin>
    </div>
  </div>
</template>

<script lang="ts">
import { Carousel } from 'ant-design-vue'
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue'
import { ISelectOrgParams } from '@/api/publicity-platform/types'
export default defineComponent({
  name: 'EnforcementProcess',
  components: {
    'a-carousel': Carousel,
    LeftCircleOutlined,
    RightCircleOutlined
  },
  props: {
    orgInfo: {
      type: Object as PropType<ISelectOrgParams>,
      default: () => {
        return {}
      }
    }
    // isJustice: {
    //   type: Boolean,
    //   default: false
    // }
  },
  setup(props) {
    const state = reactive({
      imageData: [
        {
          id: '1',
          url: require('@/assets/404.png')
        },
        {
          id: '2',
          url: require('@/assets/404.png')
        }
      ] as any,
      loading: false
    })
    const getData = () => {
      // state.loading = true
      // getProcess({ orgId: '' }).then(
      //   (data: any) => {
      //     state.loading = false
      //     state.imageData = data.data
      //   },
      //   () => {
      //     state.loading = false
      //   }
      // )
      state.imageData = [
        {
          id: '1',
          url: require('@/assets/404.png')
        }
      ]
    }
    watch(
      () => props.orgInfo,
      () => {
        if (!props.orgInfo.isJustice) {
          getData()
        }
      }
    )
    return {
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.enforcement-process {
  width: 930px;
  margin-top: 15px;
  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    // height: 500px;
    // line-height: 500px;
    background: #e9e9e9;
    overflow: hidden;
  }

  .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
    z-index: 1;
  }
  .ant-carousel :deep(.custom-slick-arrow:before) {
    display: none;
  }
  .ant-carousel :deep(.custom-slick-arrow:hover) {
    opacity: 0.5;
  }

  .ant-carousel :deep(.slick-slide h3) {
    color: #fff;
  }
  .image {
    max-width: 800px;
    height: auto;
  }
}
</style>
