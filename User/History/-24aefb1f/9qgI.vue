<template>
  <div class="doc-3">
    <h1 class="law-document-tittle">
      {{ docData.approvalKeyData!['orgName'] ? docData.approvalKeyData!['orgName'].defaultValue : '' }} <br />
      {{ docData.approvalKeyData!['headTitle'] ? docData.approvalKeyData!['headTitle'].defaultValue : '' }}
    </h1>
    <doc-number v-if="docData.approvalKeyData!['docCodePrefix']" :doc-data="docData" :is-edit="isNoPreview" />
    <div class="law-document-content">
      <template v-if="docData.approvalKeyData!['basicInformation']">
        <!-- 分组占位字段，需要按照违法行为分组 -->
        <cause-attr
          key="basicInformation"
          :dockey-config="docData.configOutputList"
          :model-keys="docData.approvalKeyData!['basicInformation'].groupWordModelKey || []"
          :is-edit="isNoPreview"
          :type="'text'"
        />
      </template>
      <div class="text-left" v-else-if="docData.approvalKeyData!['assistInqueryOrg']">
        <n-input v-if="isNoPreview" v-model:value="docData.approvalKeyData!['assistInqueryOrg'].defaultValue" type="text" class="min-w-7" autosize />
        <span class="data-underline" v-else>
          {{ docData.approvalKeyData!['assistInqueryOrg'].defaultValue }}
        </span>
        ：
      </div>
      <div class="text-left" v-else-if="docData.approvalKeyData![docData.documentModelTypeId !== '1000053'?'targetNameValue' : 'orgName2']">
        <n-input
          v-if="isNoPreview"
          v-model:value="docData.approvalKeyData![docData.documentModelTypeId !== '1000053'?'targetNameValue' : 'orgName2'].defaultValue"
          type="text"
          class="min-w-7"
          autosize
        />
        <span class="data-underline" v-else>
          {{ docData.approvalKeyData![docData.documentModelTypeId !== '1000053' ? 'targetNameValue' : 'orgName2'].defaultValue }}
        </span>
        ：
      </div>
      <div class="doc-text">
        <template v-for="(item, index) in docData.configOutputList" :key="index">
          <template v-if="!item.keyAttributeValues?.includes(5) && !item.keyAttributeValues?.includes(6) && item.whetherUse === 1">
            <!-- 配置判断缩进2 字符 -->
            <span class="pl-8" v-if="item.keyAttributeValues?.includes(9) && !isNoPreview" :key="index"></span>

            <!-- 字段配置不是正文和 分组占位内容才渲染 -->
            <div v-if="item.keyAttributeValues?.includes(3)" class="font-semibold text-center" :key="index">
              <!-- 表格标题渲染表格定位 -->
              {{ item.defaultValue }}
              <!-- 渲染表格数据 -->
              <doc-table :doc-table-config="docData.coreForm" :doc-table-data="docData.coreFormData" :is-edit="isNoPreview" v-if="docData.coreForm && docData.coreForm.length > 0" />
            </div>
            <template v-else-if="item.documentModelDataTypeId === '1000007'">
              <!-- 分组占位字段，需要按照违法行为分组 不用区分编辑不编辑 -->
              <cause-attr class="inline" :key="item.wordModelKey" :dockey-config="docData.configOutputList" :model-keys="item.groupWordModelKey || []" :is-edit="isNoPreview" />
            </template>
            <template v-else-if="item.documentModelDataTypeId === '1000010'">
              <!-- 签字处理  不用区分编辑不编辑-->
              <doc-sign :key="item.wordModelKey" position="justify-start" :is-edit="isNoPreview" v-model:doc-sign-data="item.columnValue" />
            </template>
            <template v-else-if="item.documentModelDataTypeId === '1000012'">
              <!-- 金额类的处理， 不需要区分编辑不编辑 -->
              <doc-money v-model:money="item.defaultValue" :is-edit="isNoPreview" />
            </template>
            <template v-else-if="item.documentModelDataTypeId === '1000015'">
              <!-- 时间 -->
              <n-date-picker v-if="isNoPreview" v-model:value="item.otherId![0]" type="date" format="yyyy-MM-dd" clearable />
              <span v-else>
                {{ item.defaultValue }}
              </span>
            </template>
            <!-- 非文书固定字段渲染 编辑时候 并且字段没配置不可编辑 -->
            <template v-else-if="isNoPreview && !item.keyAttributeValues?.includes(8)">
              <template v-if="item.documentModelDataTypeId === '1000001'">
                <!-- 下拉框选择多选并可编辑 -->
                <doc-select-complete :key="item.wordModelKey" :option-data="item.columnValue" :placeholder="item.defaultValue" v-model:default-value="item.defaultValue" :is-edit="isNoPreview" />
              </template>
              <template v-else-if="item.documentModelDataTypeId === '1000002' || item.documentModelDataTypeId === '1000003'">
                <doc-select-no-edit :key="item.wordModelKey" :case-column-source="item" :is-edit="isNoPreview" :is-single-select="item.documentModelDataTypeId === '1000003'" />
              </template>
              <!-- 下拉选择，并修改 -->
              <doc-select-edit v-else-if="item.columnValue && item.columnValue.length" :caseColumnSource="item" :is-edit="isNoPreview" />
              <!-- 存在描述信息渲染成标题类 -->
              <n-input-group v-else-if="item.description">
                <n-input-group-label>{{ item.description }}:</n-input-group-label>
                <n-input class="min-w-7" autosize v-model:value="item.defaultValue" :type="item.keyAttributeValues?.includes(10) ? 'textarea' : 'text'" />
              </n-input-group>
              <n-input
                v-model:value="item.defaultValue"
                v-else
                :type="item.keyAttributeValues?.includes(10) ? 'textarea' : 'text'"
                class="min-w-7"
                autosize
                :placeholder="'请输入' + item.chineseName"
              />
            </template>
            <template v-else>
              <span :class="{ 'data-underline': item.keyAttributeValues?.includes(2), 'font-semibold': item.keyAttributeValues?.includes(13) }">
                <template v-if="item.defaultValue.includes('\n')">
                  <span v-for="(text, index2) in item.defaultValue.split('\n')" :key="index2">{{ text }}</span>
                </template>
                <template v-else>
                  {{ item.defaultValue }}
                </template>
                {{ item.keyAttributeValues?.includes(7) ? '：' : '' }}
              </span>
            </template>
            <!-- 符号判断 -->
            <template v-if="item.keyAttributeValues?.includes(11)">
              <span>，</span>
            </template>
            <template v-else-if="item.keyAttributeValues?.includes(12)">
              <span>。</span>
            </template>
            <!-- 换行属性 -->
            <template v-if="item.keyAttributeValues?.includes(1) || item.keyAttributeValues?.includes(4)">
              <br />
              <span class="pl-8" v-if="!isNoPreview && item.keyAttributeValues?.includes(1)"></span>
            </template>
          </template>
        </template>
      </div>
      <div class="text-right" v-if="docData.approvalKeyData!['orgName2'] && docData.documentModelTypeId !== '1000053'">
        {{ docData.approvalKeyData!['orgName2'].defaultValue }}
        （印章）
      </div>
      <div class="text-right"
        >{{ docData.approvalKeyData!['beginYear'].defaultValue }} 年{{ docData.approvalKeyData!['beginMonth'].defaultValue }}月{{ docData.approvalKeyData!['beginDay'].defaultValue }}日
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { IDocumentData } from '@/api/document/types'
  import DocNumber from '../components/doc-number.vue'
  import DocTable from '../components/doc-table.vue'
  import CauseAttr from '../components/cause-attr.vue'
  import DocSign from '../components/doc-sign.vue'
  import { cloneDeep } from 'lodash-es'
  import DocSelectComplete from '../components/doc-select-complete.vue'
  import DocSelectNoEdit from '../components/doc-select-no-edit.vue'
  import DocMoney from '../components/doc-money.vue'
  import DocSelectEdit from '../components/doc-select-edit.vue'
  export default defineComponent({
    name: 'DOC3',
    components: { DocNumber, DocTable, CauseAttr, DocSign, DocSelectComplete, DocMoney, DocSelectNoEdit, DocSelectEdit },
    props: {
      documentData: {
        // 文书数据
        type: Object as PropType<IDocumentData>,
        required: true
      },
      isNoPreview: {
        // 文书预览模式
        type: Boolean,
        required: true
      }
    },
    // emits: ['update:approvalKeyData'],
    setup(props) {
      const state = reactive({
        docData: {} as IDocumentData
      })
      // onMounted(() => {
      //   state.docData = props.documentData
      // })
      // state.docData = { ...props.documentData }
      watch(
        () => props.documentData,
        () => {
          state.docData = cloneDeep(props.documentData)
          console.log(state.docData, 'doc3')
        },
        { immediate: true, deep: true }
      )
      return {
        ...toRefs(state)
      }
    }
  })
</script>

<style lang="less" scoped></style>
