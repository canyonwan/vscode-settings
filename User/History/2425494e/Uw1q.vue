<script setup lang="ts">
  import { queryUnlawfulActList } from '@/api/cause-manage/browse'
  import { useModal } from '@/components/modal'
  import type { ISearchUnlawfulActTree, IUnlawfulActItem, ICaseType } from '@/api/cause-manage/types'
  import type { IUnlawfulActWithWorkFlow } from '@/api/workflow/types'
  import { useDialog } from 'naive-ui'

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
    // 判断当前的违法行为是否已经添加过一个了,如果已经有了 则不再重复添加违法行为id, 直接往处置方式列表里添加
    // const rowIndex = setupData.value.findIndex((l) => row.id === l.causeSubId)
    const rowIndex = setupData.value.findIndex((l) => row.groupId === l.groupId)
    // 当前点击的是否已经选中过了
    // 找到和当前点的方式相同的index和item
    const wayIndex = selectedWays.value.findIndex((f) => f.id === way.id)
    const wayItem = selectedWays.value.find((f) => f.id === way.id)

    // 这一行点击过 如果当前点击的方式是否已经存在了 就把以前的删掉, 加入现在的
    // 即 1.违法行为已经存在了
    if (rowIndex > -1) {
      // 2.当前点击的处置方式是否也选择过了
      if (wayIndex > -1 && wayItem) {
        const clickedIdx = setupData.value[rowIndex].caseTypeAndProgramTypeList.findIndex((a) => a.caseTypeId === wayItem!.id)
        selectedWays.value.splice(wayIndex, 1)
        // 当前点击的和之前添加的是一样的item 则删掉
        setupData.value[rowIndex].caseTypeAndProgramTypeList.splice(clickedIdx, 1)
        if (setupData.value[rowIndex].caseTypeAndProgramTypeList.length === 0) setupData.value.splice(rowIndex, 1)
        way === wayItem ? selectedWays.value.splice(wayIndex, 1) : selectedWays.value.push(way)
      } else {
        selectedWays.value.push(way)
        setupData.value[rowIndex].caseTypeAndProgramTypeList.push({
          caseTypeId: way.id,
          programTypeId: way.programTypeId!,
          programTypeName: way.programTypeName
        })
      }
    } else {
      // 点的这一行没有点击过 要先判断当前点击的row.lawList和setupData.value的lawIds比较是否全等, 全等就要给出提示
      // 这一行没有点击过 但要判断当前点击的way是否已经有了
      // setupData.value.forEach((s) => {
      //   s.lawIds === row.lawList
      // })
      // const even = setupData.value.every((even) => {
      //   return (
      //     even.lawIds?.sort().toString() ===
      //     row.lawList
      //       .map((law) => law.id)
      //       .sort()
      //       .toString()
      //   )
      // })

      const every = setupData.value.every((f) => {
        return (
          f.lawIds?.sort().toString() ===
          row.lawList
            .map((law) => law.id)
            .sort()
            .toString()
        )
      })
      if (!every) {
        dialog.warning({
          title: '提示',
          content: '当前选中项已有？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            setupData.value = []
            selectedWays.value = []
            selectedWays.value.push(way)
            setupData.value.push({
              causeSubId: row.id,
              groupId: row.groupId,
              lawIds: row.lawList.map((law) => law.id),
              caseTypeAndProgramTypeList: selectedWays.value.map((i) => {
                return {
                  caseTypeId: i.id,
                  programTypeId: i.programTypeId!,
                  programTypeName: i.programTypeName
                }
              })
            })

            console.log('%c [ last ]-112', 'font-size:13px; background:#0095FF; color:white;', setupData.value)
          },
          onNegativeClick: () => {
            return
          }
        })
      } else {
        if (wayIndex > -1 && wayItem) {
          // 当前这个way已经点击过了 需要从lastIds找到这个way
          let targetParentIndex = -1
          let targetSonIndex = -1

          setupData.value.forEach((i) => {
            targetSonIndex = i.caseTypeAndProgramTypeList.findIndex((a) => a.caseTypeId === way.id)
            if (targetSonIndex > -1) {
              targetParentIndex = setupData.value.findIndex((p) => p.causeSubId === i.causeSubId)
            }
          })
          selectedWays.value.splice(wayIndex, 1)
          selectedWays.value.push(way) // 为了显示
          setupData.value[targetParentIndex].caseTypeAndProgramTypeList.splice(targetSonIndex, 1)
          if (setupData.value[targetParentIndex].caseTypeAndProgramTypeList.length === 0) {
            setupData.value.splice(targetParentIndex, 1)
          }
          // 删除以前的 添加现在的
          setupData.value.push({
            causeSubId: row.id,
            groupId: row.groupId,
            lawIds: row.lawList.map((law) => law.id),
            caseTypeAndProgramTypeList: Array.of({
              caseTypeId: way.id,
              programTypeId: way.programTypeId!,
              programTypeName: way.programTypeName
            })
          })
        } else {
          selectedWays.value.push(way)
          setupData.value.push({
            causeSubId: row.id,
            groupId: row.groupId,
            lawIds: row.lawList.map((law) => law.id),
            caseTypeAndProgramTypeList: selectedWays.value.map((i) => {
              return {
                caseTypeId: i.id,
                programTypeId: i.programTypeId!,
                programTypeName: i.programTypeName
              }
            })
          })
        }
      }
    }
    emit('onSubmit', setupData.value)
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
