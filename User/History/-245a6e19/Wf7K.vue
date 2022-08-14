<template>
  <div class="text-center doc-9">
    <!-- 法制审核意见表 -->
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
          <td height="50">{{ docData.approvalKeyData!['undertakeOrgKey'].defaultValue }}</td>
          <td colspan="4">
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['orgNameDetail'].defaultValue" type="text" />
            <span v-else>
              {{ docData.approvalKeyData!['orgNameDetail'].defaultValue }}
            </span>
          </td>
        </tr>
        <tr>
          <td>{{ docData.approvalKeyData!['submitterKey'].defaultValue }}</td>
          <td>
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['submitter'].defaultValue" type="text" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['submitter'].defaultValue }}
            </span>
          </td>
          <td height="50">{{ docData.approvalKeyData!['submitDateKey'].defaultValue }}</td>
          <td colspan="2">
            <n-date-picker
              v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit"
              v-model:value="docData.approvalKeyData!['submitDate'].otherId![0]"
              type="date"
              format="yyyy-MM-dd"
              clearable
            />
            <span v-else>
              {{ docData.approvalKeyData!['submitDate'].defaultValue }}
            </span>
          </td>
        </tr>
        <!-- 法制审核内容 -->
        <tr>
          <td rowspan="11" height="100">{{ docData.approvalKeyData!['legalReviewContentKey'].defaultValue }}</td>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherSubjectLegalKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherSubjectLegal" :case-column-source="docData.approvalKeyData!['whetherSubjectLegal']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherLawEnforcementQualificationKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherLawQualification" :case-column-source="docData.approvalKeyData!['whetherLawQualification']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherExceedAuthorityKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherExceedAuthority" :case-column-source="docData.approvalKeyData!['whetherExceedAuthority']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherFactClearKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherFactClear" :case-column-source="docData.approvalKeyData!['whetherFactClear']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherEvidenceLegalKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherEvidenceLegal" :case-column-source="docData.approvalKeyData!['whetherEvidenceLegal']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherLegalAccurateKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherLegalAccurate" :case-column-source="docData.approvalKeyData!['whetherLegalAccurate']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherAppropriateDiscretionKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherAppropriateDiscretion" :case-column-source="docData.approvalKeyData!['whetherAppropriateDiscretion']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherLegalProcedureKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherLegalProcedure" :case-column-source="docData.approvalKeyData!['whetherLegalProcedure']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherDocumentStardardKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherDocumentStardard" :case-column-source="docData.approvalKeyData!['whetherDocumentStardard']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherTransferKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherTransfer" :case-column-source="docData.approvalKeyData!['whetherTransfer']" :is-edit="documentData.isEdit" />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-left">{{ docData.approvalKeyData!['whetherFoundOtherIllegalContentsKey'].defaultValue }}</td>
          <td>
            <doc-column key="whetherFoundOtherIllegalContents" :case-column-source="docData.approvalKeyData!['whetherFoundOtherIllegalContents']" :is-edit="documentData.isEdit" />
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
          <td>{{ docData.approvalKeyData!['debatchingKey'].defaultValue }}</td>
          <td colspan="4">
            <div class="flex flex-1 pl-1">
              <div class="w-20">签名：</div>
              <div class="flex-1 text-left">
                <doc-sign
                  :key="docData.approvalKeyData!['debatchingSign'].wordModelKey"
                  position="justify-start"
                  :is-edit="documentData.currentApprovalLevel === 3 && documentData.isEdit"
                  v-model:doc-sign-data="docData.approvalKeyData!['debatchingSign'].columnValue"
                />
              </div>
            </div>
            <div class="flex justify-end pr-5">
              <n-date-picker
                :disabled="!(documentData.currentApprovalLevel === 3 && documentData.isEdit)"
                class="justify-end"
                v-if="documentData.isEdit"
                v-model:value="docData.approvalKeyData!['debatchingDate'].otherId![0]"
                type="date"
                format="yyyy年MM月dd日"
                clearable
                style="width: 200px"
              />
              <span v-else>
                {{ docData.approvalKeyData!['debatchingDate'].defaultValue }}
              </span>
            </div>
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
  import { cloneDeep } from 'lodash-es'
  import DocColumn from '../components/doc-column.vue'
  import DocSign from '../components/doc-sign.vue'
  export default defineComponent({
    name: 'DOC9',
    components: { ApprovalLevel, CauseAttr, DocColumn, DocSign },
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
          if (state.docData.approvalKeyData!['debatchingSign'].columnValue.length === 0) {
            state.docData.approvalKeyData!['debatchingDate'].otherId = [null]
          }
          if (state.docData.approvalKeyData!['submitDate'].otherId && state.docData.approvalKeyData!['submitDate'].otherId?.length === 0) {
            state.docData.approvalKeyData!['submitDate'].otherId.push(
              state.docData.approvalKeyData!['submitDate'].columnValue.length > 0 ? state.docData.approvalKeyData!['submitDate'].columnValue[0].value : null
            )
          }
          console.log(state.docData, 'doc9-法制审核意见表')
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
