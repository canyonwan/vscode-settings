<script setup lang="ts">
  import { queryUnlawfulActTagTree } from '@/api/cause-manage/browse'
  import type { IUnlawfulActTagLeaf, ISearchUnlawfulActTree } from '@/api/cause-manage/types'
  import { NEllipsis, NButton, NIcon, NSpace, NTag } from 'naive-ui'
  import UnlawfulActDetail from './components/unlawful-act-detail.vue'
  import { caseProgramType, punishProgramType, checkTargetType } from './components/options'
  import { Search, ChevronForward } from '@vicons/ionicons5'
  import { IUnlawfulActWithWorkFlow } from '@/api/workflow/types'

  const emit = defineEmits(['submitHandler'])

  const props = defineProps({
    caseTypeId: String,
    targetType: String,
    allowSelect: Boolean
  })

  const treeData = ref<IUnlawfulActTagLeaf[]>([])
  const searchState = reactive<ISearchUnlawfulActTree>({
    causeSubTagIdList: [],
    caseTypeId: '',
    targetType: ''
  })

  async function getTreeData() {
    searchState.caseTypeId = props.caseTypeId
    searchState.targetType = props.targetType
    const res = await queryUnlawfulActTagTree(searchState)
    treeData.value = processTree(res)
  }

  function processTree(data: IUnlawfulActTagLeaf[]): IUnlawfulActTagLeaf[] {
    if (data.length > 0) {
      for (const item of data) {
        if (item.list && item.list.length > 0) {
          processTree(item.list)
          for (const ele of item.list) {
            ele['parentCodeTemp'] = item.code
            ele['parentIdTemp'] = item.id
          }
        } else {
          delete item.list
        }
      }
    }
    return data
  }

  function viewDetail(id: string, parentId: string) {
    searchState.caseTypeId = props.caseTypeId
    searchState.targetType = props.targetType
    searchState.causeSubTagIdList = [id]
    parentId && searchState.causeSubTagIdList!.push(parentId)
  }

  function renderPrefix({ option }) {
    if (option.list && option.list.length > 0) {
      return h(NEllipsis, { style: 'max-width: 900px;font-weight: bold' }, { default: () => `${option.name}` })
    } else {
      return h('div', { class: 'flex py-1' }, [
        // TODO ???????????????????????????
        h('img', { src: 'https://dummyimage.com/80x80/000/fff', class: 'mr-2' }),
        h(
          NSpace,
          { vertical: true, justify: 'space-evenly' },
          {
            default: () => [
              h(NTag, { bordered: false, type: 'success', size: 'small' }, { default: () => `${option.parentCodeTemp ? option.parentCodeTemp : ''}${option.code}` }),
              h(NEllipsis, { style: 'max-width: 200px' }, { default: () => option.name })
            ]
          }
        )
      ])
    }
  }

  function renderSuffix({ option }) {
    if (!option.list || option.list.length <= 0) return h(NIcon, { component: ChevronForward, onClick: () => viewDetail(option.id, option.parentIdTemp) })
  }

  const setupData = ref<IUnlawfulActWithWorkFlow[]>([])

  function submitHandler(values: IUnlawfulActWithWorkFlow[]) {
    setupData.value = values
  }

  function onSubmit() {
    emit('submitHandler', setupData.value)
  }

  const nodeProps = ({ option }) => {
    return {
      onClick() {
        viewDetail(option.id, option.parentIdTemp)
      }
    }
  }

  onMounted(() => getTreeData())
</script>
<template>
  <div>
    <n-card class="cause-browse">
      <n-form label-width="auto" label-placement="left">
        <n-grid :cols="12" :x-gap="24">
          <n-form-item-gi span="3" label="??????????????????">
            <n-input v-model:value="searchState.name" clearable placeholder="???????????????????????????" />
          </n-form-item-gi>
          <n-form-item-gi span="2" label="??????????????????">
            <n-select v-model:value="searchState.targetType" :options="checkTargetType" clearable placeholder="??????????????????" />
          </n-form-item-gi>
          <n-form-item-gi span="2" label="????????????">
            <n-select v-model:value="searchState.caseTypeId" :options="caseProgramType" clearable placeholder="????????????" />
          </n-form-item-gi>
          <n-form-item-gi span="2" label="??????????????????">
            <n-select v-model:value="searchState.programTypeId" :options="punishProgramType" clearable placeholder="??????????????????" />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-button type="primary" @click="getTreeData">
              <template #icon>
                <n-icon :component="Search" size="16" />
              </template>
              ??????
            </n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>

      <n-divider />

      <template v-if="treeData?.length === 0">
        <n-empty style="min-height: 400px" class="justify-center" description="????????????" />
      </template>
      <div v-else class="grid grid-cols-3 gap-6">
        <div class="tree-box p-3">
          <n-tree
            default-expand-all
            expand-on-click
            block-line
            key-field="id"
            children-field="list"
            :node-props="nodeProps"
            :render-prefix="renderPrefix"
            :render-suffix="renderSuffix"
            :data="treeData"
          />
        </div>
        <template v-if="searchState.causeSubTagIdList.length === 0">
        nte

        </template>
        <unlawful-act-detail v-else class="tree-box col-span-2" :cause-tag-ids="searchState.causeSubTagIdList" :allow-select="props.allowSelect" @onSubmit="submitHandler" />
      </div>
    </n-card>
    <div class="float-right my-4" v-if="allowSelect">
      <n-button type="primary" @click="onSubmit">??????</n-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .cause-browse {
    height: calc(100vh - 110px);
    .tree-box {
      border-radius: 10px;
      background-color: #142c4b;
      height: calc(100vh - 110px - 136px);
      overflow: auto;
    }
  }
</style>
