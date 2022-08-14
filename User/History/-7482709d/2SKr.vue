<template>
  <div class="text-center doc-12">
    <!-- 行政处罚案件结案报告 -->
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
          <td height="50">{{ docData.approvalKeyData!['causeKey'].defaultValue }}</td>
          <td colspan="2">
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
          <td height="50">{{ docData.approvalKeyData!['caseSourceKey'].defaultValue }}</td>
          <td>
            <!-- 案件来源 -->
            <span>
              {{ docData.approvalKeyData!['caseSourceValue'].defaultValue }}
            </span>
          </td>
        </tr>
        <doc-party
          v-if="docData.approvalKeyData && Object.keys(docData.approvalKeyData!).length > 0"
          :document-approval-data="docData.approvalKeyData!"
          :is-edit="documentData.currentApprovalLevel === 1 && documentData.isEdit"
        />
        <tr>
          <td>{{ docData.approvalKeyData!['happenCaseDateKey'].defaultValue }}</td>
          <td>
            <span>
              {{ docData.approvalKeyData!['happenCaseDate'].defaultValue }}
            </span>
          </td>
          <td height="50">{{ docData.approvalKeyData!['happenCaseAddressKey'].defaultValue }}</td>
          <td colspan="2">
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['happenCaseAddress'].defaultValue" type="textarea" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['happenCaseAddress'].defaultValue }}
            </span>
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['registerDatekey'].defaultValue }}</td>
          <td>
            <!-- <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['registerDate'].defaultValue" type="text" class="min-w-7" /> -->
            <span>
              {{ docData.approvalKeyData!['registerDate'].defaultValue }}
            </span>
          </td>
          <td height="50">{{ docData.approvalKeyData!['undertakerAndCodeKey'].defaultValue }}</td>
          <td colspan="2">
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['undertakerAndCode'].defaultValue" type="textarea" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['undertakerAndCode'].defaultValue }}
            </span>
          </td>
        </tr>
        <!-- 结案情形 -->
        <tr>
          <td height="50">{{ docData.approvalKeyData!['caseOverSituationKey'].defaultValue }}</td>
          <td colspan="4">
            <doc-column key="caseOverSituation" :case-column-source="docData.approvalKeyData!['caseOverSituation']" :is-edit="documentData.isEdit" :is-single-select="false" />
          </td>
        </tr>
        <!-- 行政处罚决定书文号 -->
        <tr>
          <td height="100">{{ docData.approvalKeyData!['docCodeKey'].defaultValue }}</td>
          <td colspan="4">
            {{ docData.approvalKeyData!['docCode'].defaultValue }}
          </td>
        </tr>
        <!-- 行政处罚内容 -->
        <tr>
          <td height="50">{{ docData.approvalKeyData!['punishDecisionContentKey'].defaultValue }}</td>
          <td colspan="4">
            <!-- <n-input
              v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit"
              v-model:value="docData.approvalKeyData!['punishDecisionContent'].defaultValue"
              type="textarea"
              class="min-w-7"
            /> -->
            <span>
              {{ docData.approvalKeyData!['punishDecisionContent'].defaultValue }}
            </span>
          </td>
        </tr>
        <tr>
          <!-- 行政处罚决定执行方式 -->
          <td height="50">{{ docData.approvalKeyData!['executeTypeKey'].defaultValue }}</td>
          <td colspan="1">
            <doc-column key="executeType" :case-column-source="docData.approvalKeyData!['executeType']" :is-edit="documentData.isEdit" :is-single-select="false" />
          </td>
          <td height="50">{{ docData.approvalKeyData!['confiscateHandleSituationKey'].defaultValue }}</td>
          <td colspan="2">
            <n-input
              v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit"
              v-model:value="docData.approvalKeyData!['confiscateHandleSituation'].defaultValue"
              type="textarea"
              class="min-w-7"
            />
            <span v-else>
              {{ docData.approvalKeyData!['confiscateHandleSituation'].defaultValue }}
            </span>
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
        <tr>
          <td height="50">{{ docData.approvalKeyData!['remarkKey'].defaultValue }}</td>
          <td colspan="4">
            <n-input v-if="documentData.isEdit" v-model:value="docData.approvalKeyData!['remarks'].defaultValue" type="textarea" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['remarks'].defaultValue }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import { IDocumentData } from '@/api/document/types'
  import ApprovalLevel from '../components/approval-level.vue'
  import CauseAttr from '../components/cause-attr.vue'
  import DocParty from '../components/doc-party.vue'
  import DocColumn from '../components/doc-column.vue'
  import { cloneDeep } from 'lodash-es'
  export default defineComponent({
    name: 'DOC12',
    components: { ApprovalLevel, CauseAttr, DocParty, DocColumn },
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
          console.log(state.docData, 'doc12-行政处罚案件结案报告')
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
