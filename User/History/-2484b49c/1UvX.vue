<template>
  <div class="text-center doc-6">
    <!-- 案件调查终结审批表 -->
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
          <td colspan="4">
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
        <doc-party
          v-if="docData.approvalKeyData && Object.keys(docData.approvalKeyData!).length > 0"
          :document-approval-data="docData.approvalKeyData!"
          :is-edit="documentData.currentApprovalLevel === 1 && documentData.isEdit"
        />
        <tr>
          <td height="50">{{ docData.approvalKeyData!['registerDatekey'].defaultValue }}</td>
          <td colspan="4">
            {{ docData.approvalKeyData!['registerDate'].defaultValue }}
          </td>
        </tr>
        <!-- 违法事实和证据 -->
        <tr>
          <td height="100">{{ docData.approvalKeyData!['illegalFactualEvidenceKey'].defaultValue }}</td>
          <td colspan="4">
            <cause-attr
              key="illegalFactualEvidence"
              :dockey-config="docData.configOutputList"
              :model-keys="docData.approvalKeyData!['illegalFactualEvidence'].groupWordModelKey || []"
              :is-edit="documentData.currentApprovalLevel === 1 && documentData.isEdit"
            />
          </td>
        </tr>
        <tr>
          <td height="100">{{ docData.approvalKeyData!['reasonsFilingKey'].defaultValue }}</td>
          <td colspan="4">
            <cause-attr
              key="caseDetailsReason"
              :dockey-config="docData.configOutputList"
              :model-keys="docData.approvalKeyData!['caseDetailsReason'].groupWordModelKey || []"
              :is-edit="documentData.currentApprovalLevel === 1 && documentData.isEdit"
            />
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
  import DocParty from '../components/doc-party.vue'
  import { cloneDeep } from 'lodash-es'
  export default defineComponent({
    name: 'DOC6',
    components: { ApprovalLevel, CauseAttr, DocParty },
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
          console.log(state.docData, 'doc6')
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
