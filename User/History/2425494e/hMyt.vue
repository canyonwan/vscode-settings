<script setup lang="ts">
  import { queryUnlawfulActList } from '@/api/cause-manage/browse'
  import { useModal } from '@/components/modal'
  import type { ISearchUnlawfulActTree, IUnlawfulActItem, ICaseType } from '@/api/cause-manage/types'
  import type { IUnlawfulActWithWorkFlow } from '@/api/workflow/types'
  import { useDialog } from 'naive-ui'
  import useSelectCaseTypes from './useSelectCaseTypes'

  const emit = defineEmits(['onCancel', 'onSubmit'])
  const dialog = useDialog()

  const props = withDefaults(defineProps<{ causeTagIds: string[]; allowSelect: boolean }>(), {
    allowSelect: false
  })

  const searchState = reactive<ISearchUnlawfulActTree>({
    causeSubTagIdList: []
  })
  const loading = ref(false)
  const currentComp = shallowRef()
  const groupId = ref<string>('')
  const selectedWays = ref<ICaseType[]>([])
  const unlawfulActList = ref<IUnlawfulActItem[]>([])

  const [modalRegister, { openModal }] = useModal({ displayDirective: 'if', title: '证据列表' })

  const setupData = ref<IUnlawfulActWithWorkFlow[]>([])

  async function getDetail() {
    loading.value = true
    searchState.causeSubTagIdList = props.causeTagIds
    unlawfulActList.value = await queryUnlawfulActList(searchState)
    loading.value = false
  }

  // row: 每个违法行为  way: 每个处置方式
  function selectCaseType(row: IUnlawfulActItem, way: ICaseType) {
    const { setupData: data, selectedWays: s } = useSelectCaseTypes(row, way)
    setupData.value = data.value
selectedWays.value
  }

  function openEvidence(id: string) {
    openModal()
    currentComp.value = defineAsyncComponent(() => import('@/views/cause-browse/components/evidence-list.vue'))
    groupId.value = id
  }

  watch(
    () => props.causeTagIds,
    () => {
      setupData.value.length > 0 && (setupData.value.length = 0)
      getDetail()
    }
  )
</script>
<template>
  <div class="unlawful-act px-3">
    <n-spin :show="loading">
      <n-card class="my-4" v-for="i in unlawfulActList" :key="i.id">
        <div class="flex items-center mb-6">
          <div class="font-medium text-lg mr-2">{{ i.name }}</div>
          <n-tag type="success" :bordered="false" size="small">{{ i.identifier }}</n-tag>
        </div>
        <div v-for="item in i.lawList" :key="item.id" class="pb-4 font-bold">
          {{ `《${item.lawName}》` }}
        </div>
        <!-- <n-grid cols="7" v-for="item in baseAttrState['1000000']" :key="item.attrId"> -->
        <template v-for="item in i.attrAndDataList" :key="item.attrId">
          <n-grid cols="12" v-if="['1000000', '1000001'].includes(item.attrId)" class="pb-4">
            <n-gi span="1">
              {{ item.attrName + '：' }}
            </n-gi>
            <n-gi span="10">
              <div v-for="ele in item.attrData" :key="ele.id" class="font-bold">
                {{ ele.content }}
              </div>
            </n-gi>
          </n-grid>
        </template>
        <div class="py-4">
          <div v-if="allowSelect">选择处置方式：</div>
          <n-space v-for="caseType in i.caseTypeList" :key="caseType.id" class="py-2">
            {{ `${caseType.name}：` }}
            <span
              v-for="way in caseType.list"
              :key="way.id"
              @click="allowSelect ? selectCaseType(i, way) : () => null"
              :class="{ selected: selectedWays.includes(way), 'cursor-pointer': allowSelect }"
              class="py-1 px-2 rounded bg-darkPrimary"
            >
              {{ way.name }}
            </span>
          </n-space>
        </div>
        <div>证据列表： <n-button type="primary" ghost size="small" class="ml-2" @click="openEvidence(i.groupId)">查看证据</n-button> </div>
        <basic-modal @register="modalRegister" style="width: 70%">
          <component :is="currentComp" :group-id="groupId" />
        </basic-modal>
      </n-card>
    </n-spin>
  </div>
</template>
<style lang="less" scoped>
  .unlawful-act {
    .selected {
      background-color: #3f94c9;
    }
  }
</style>
