<template>
  <div class="text-center doc-8">
    <!-- 电子技术监控设备记录审核表 -->
    <h1 class="law-document-tittle">
      {{ docData.approvalKeyData!['orgName'].defaultValue }} <br />
      {{ docData.approvalKeyData!['headTitle'].defaultValue }}
    </h1>
    <table class="law-document-content">
      <colgroup>
        <col width="120" />
        <col width="120" />
        <col width="200" />
        <col width="120" />
        <col width="200" />
      </colgroup>
      <tbody>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['caseNameKey'].defaultValue }}</td>
          <td colspan="4">
            <!-- 检查对象 -->
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['targetNameValue'].defaultValue" type="text" />
            <span v-else>
              {{ docData.approvalKeyData!['targetNameValue'].defaultValue }}
            </span>
            <!-- 违法行为 -->
            <span v-if="docData.approvalKeyData!['targetNameValue2']">{{ docData.approvalKeyData!['targetNameValue2'].defaultValue }}</span>
            <cause-attr
              :class="documentData.currentApprovalLevel === 1 && documentData.isEdit ? '' : 'inline'"
              key="causeAttrDataCause"
              :dockey-config="docData.configOutputList"
              :model-keys="['causeAttrDataCause']"
              :is-edit="documentData.currentApprovalLevel === 1 && documentData.isEdit"
            /><span v-if="docData.approvalKeyData!['causeSuffix']">{{ docData.approvalKeyData!['causeSuffix'].defaultValue }}</span>
          </td>
        </tr>
        <tr>
          <td rowspan="2">{{ docData.approvalKeyData!['equipmentConditionKey'].defaultValue }}</td>
          <td>{{ docData.approvalKeyData!['equipmentNameKey'].defaultValue }}</td>
          <td>
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['equipmentName'].defaultValue" type="text" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['equipmentName'].defaultValue }}
            </span>
          </td>
          <td height="50">{{ docData.approvalKeyData!['equipmentNumberKey'].defaultValue }}</td>
          <td>
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['equipmentNumber'].defaultValue" type="text" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['equipmentNumber'].defaultValue }}
            </span>
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['settingLocationKey'].defaultValue }}</td>
          <td>
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['settingLocation'].defaultValue" type="text" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['settingLocation'].defaultValue }}
            </span>
          </td>
          <td height="50">{{ docData.approvalKeyData!['publicityKey'].defaultValue }}</td>
          <td>
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['publicity'].defaultValue" type="text" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['publicity'].defaultValue }}
            </span>
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['getTimeKey'].defaultValue }}</td>
          <td colspan="4">
            <n-date-picker
              v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit"
              v-model:value="docData.approvalKeyData!['getTime'].otherId![0]"
              type="date"
              format="yyyy-MM-dd"
              clearable
            />
            <span v-else>
              {{ docData.approvalKeyData!['getTime'].defaultValue }}
            </span>
          </td>
        </tr>
        <!-- 记录内容以及证明事项 -->
        <tr>
          <td height="100">{{ docData.approvalKeyData!['contentMatterKey'].defaultValue }}</td>
          <td colspan="4">
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['recordContent'].defaultValue" type="textarea" />
            <span v-else>
              {{ docData.approvalKeyData!['recordContent'].defaultValue }}
            </span>
          </td>
        </tr>
        <!-- 是否经过法制和技术审核 -->
        <tr>
          <td rowspan="6" height="100">{{ docData.approvalKeyData!['whetherPassApproveKey'].defaultValue }}</td>
          <td colspan="3">{{ docData.approvalKeyData!['isApproveKey'].defaultValue }}</td>
          <td>
            <doc-column key="isApprove" :case-column-source="docData.approvalKeyData!['isApprove']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3">{{ docData.approvalKeyData!['isContentReallyKey'].defaultValue }}</td>
          <td>
            <doc-column key="isContentReally" :case-column-source="docData.approvalKeyData!['isContentReally']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3">{{ docData.approvalKeyData!['isSettingReasonableKey'].defaultValue }}</td>
          <td>
            <doc-column key="isSettingReasonable" :case-column-source="docData.approvalKeyData!['isSettingReasonable']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3">{{ docData.approvalKeyData!['isObviousSignsKey'].defaultValue }}</td>
          <td>
            <doc-column key="isObviousSigns" :case-column-source="docData.approvalKeyData!['isObviousSigns']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3">{{ docData.approvalKeyData!['isSettingLocationOpenKey'].defaultValue }}</td>
          <td>
            <doc-column key="isSettingLocationOpen" :case-column-source="docData.approvalKeyData!['isSettingLocationOpen']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3">{{ docData.approvalKeyData!['isNonConformanceFoundKey'].defaultValue }}</td>
          <td>
            <doc-column key="isNonConformanceFound" :case-column-source="docData.approvalKeyData!['isNonConformanceFound']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <approval-level
          v-if="
            docData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalConfigDataOutputs &&
            docData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalConfigDataOutputs.length > 0
          "
          :is-edit="documentData.isEdit"
          :document-approval-data="docData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalConfigDataOutputs"
        />
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import { IDocumentData } from '@/api/document/types'
  import ApprovalLevel from '../components/approval-level.vue'
  import CauseAttr from '../components/cause-attr.vue'
  import DocColumn from '../components/doc-column.vue'
  import { cloneDeep } from 'lodash-es'
  export default defineComponent({
    name: 'DOC8',
    components: { ApprovalLevel, CauseAttr, DocColumn },
    props: {
      documentData: {
        // 文书数据
        type: Object as PropType<IDocumentData>,
        required: true
      }
    },
    setup(props) {
      const state = reactive({
        docData: {} as IDocumentData,
        currentSignUserId: '' // 当前签字的userid
      })
      watch(
        () => props.documentData,
        () => {
          state.docData = cloneDeep(props.documentData)
          if (state.docData.approvalKeyData!['getTime'].otherId && state.docData.approvalKeyData!['getTime'].otherId?.length === 0) {
            state.docData.approvalKeyData!['getTime'].otherId.push(
              state.docData.approvalKeyData!['getTime'].columnValue.length > 0 ? state.docData.approvalKeyData!['getTime'].columnValue[0].value : null
            )
          }
          console.log(state.docData, 'doc8-电子技术监控设备记录审核表')
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
