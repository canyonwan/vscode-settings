<template>
  <div class="text-center doc-7">
    <!-- 陈述申辩/听证复核意见书 -->
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

          <td height="50">{{ docData.approvalKeyData!['docCodeKey'].defaultValue }}</td>
          <td>
            {{ docData.approvalKeyData!['docCode'].defaultValue }}
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['reviewCategoryKey'].defaultValue }}</td>
          <td colspan="2">
            <doc-column key="reviewCategory" :case-column-source="docData.approvalKeyData!['reviewCategory']" :is-edit="documentData.isEdit" :is-single-select="false" />
          </td>
          <td height="50">{{ docData.approvalKeyData!['undertakerKey'].defaultValue }}</td>
          <td>
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['undertaker'].defaultValue" type="text" />
            <span v-else>
              {{ docData.approvalKeyData!['undertaker'].defaultValue }}
            </span>
          </td>
        </tr>
        <doc-party
          v-if="docData.approvalKeyData && Object.keys(docData.approvalKeyData!).length > 0"
          :document-approval-data="docData.approvalKeyData!"
          :is-edit="documentData.currentApprovalLevel === 1 && documentData.isEdit"
        />
        <tr>
          <td height="50">{{ docData.approvalKeyData!['originalHandlingOpinionsKey'].defaultValue }}</td>
          <td colspan="4">
            {{ docData.approvalKeyData!['punishType'].defaultValue }}
            <template v-if="docData.approvalKeyData!['punishSuggest（filter）_1']">
              {{ smalltoBIG(docData.approvalKeyData!['punishSuggest（filter）_1'].defaultValue as unknown as number) }}
            </template>
            {{ docData.approvalKeyData!['punishSuggest（filter）_2'].defaultValue }}
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['rationaleKey'].defaultValue }}</td>
          <td colspan="4">
            <n-input v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit" v-model:value="docData.approvalKeyData!['rationale'].defaultValue" type="textarea" />
            <span v-else>
              {{ docData.approvalKeyData!['rationale'].defaultValue }}
            </span>
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['whetherChangeContentKey'].defaultValue }}</td>
          <td colspan="1">
            <doc-column key="whetherChangeContent" :case-column-source="docData.approvalKeyData!['whetherChangeContent']" :is-edit="documentData.isEdit" />
            <!-- <template v-if="documentData.currentApprovalLevel === 1 && documentData.isEdit && docData.approvalKeyData!['whetherChangeContent'].defaultValue === '是'">
              <n-input-group-label class="text-left" v-if="docData.approvalKeyData!['changeContent'].description">{{ docData.approvalKeyData!['changeContent'].description }}:</n-input-group-label>
              <n-input
                :autosize="{ minRows: 3 }"
                v-model:value="docData.approvalKeyData!['changeContent'].defaultValue"
                type="textarea"
                :placeholder="`请输入${docData.approvalKeyData!['changeContent'].description}`"
              />
            </template>
            <span v-else-if="!documentData.isEdit && docData.approvalKeyData!['whetherChangeContent'].defaultValue === '是'">
              {{ docData.approvalKeyData!['changeContent'].defaultValue }}
            </span> -->
          </td>
          <td>{{ docData.approvalKeyData!['changeAttributesKey'].defaultValue }}</td>
          <td colspan="2">
            <doc-column
              key="changeAttributes"
              :case-column-source="docData.approvalKeyData!['changeAttributes']"
              :is-edit="documentData.isEdit && docData.approvalKeyData!['whetherChangeContent'].defaultValue === '是'"
              :is-single-select="false"
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
    <div class="mt-2 text-left">
      <!-- <n-input-group-label v-if="docData.approvalKeyData!['statementDefenseAndHearing'].description">{{ docData.approvalKeyData!['statementDefenseAndHearing'].description }}:</n-input-group-label> -->
      <n-input
        v-if="documentData.isEdit"
        v-model:value="docData.approvalKeyData!['statementDefenseAndHearing'].defaultValue"
        type="textarea"
        :autosize="{ minRows: 3 }"
        :placeholder="`${docData.approvalKeyData!['statementDefenseAndHearing'].description}`"
      />
      <span v-else>
        {{ docData.approvalKeyData!['statementDefenseAndHearing'].defaultValue }}
      </span>
    </div>
  </div>
</template>
<script lang="ts">
  import { IDocumentData } from '@/api/document/types'
  import ApprovalLevel from '../components/approval-level.vue'
  import DocParty from '../components/doc-party.vue'
  import CauseAttr from '../components/cause-attr.vue'
  import DocColumn from '../components/doc-column.vue'
  import { cloneDeep } from 'lodash-es'
  import { smalltoBIG } from '@/utils'
  import { useMessage } from 'naive-ui'
  export default defineComponent({
    name: 'DOC7',
    components: { ApprovalLevel, DocParty, CauseAttr, DocColumn },
    props: {
      documentData: {
        // 文书数据
        type: Object as PropType<IDocumentData>,
        required: true
      }
    },
    setup(props) {
      const message = useMessage()
      const state = reactive({
        docData: {} as IDocumentData,
        currentSignUserId: '' // 当前签字的userid
      })
      watch(
        () => props.documentData,
        () => {
          state.docData = cloneDeep(props.documentData)
          console.log(state.docData, 'doc7-陈述申辩/听证复核意见书')
        },
        { immediate: true, deep: true }
      )
      watch(
        () => state.docData.approvalKeyData!['whetherChangeContent'].defaultValue,
        () => {
          if (state.docData.approvalKeyData!['whetherChangeContent'].defaultValue === '否') {
            state.docData.approvalKeyData!['statementDefenseAndHearing'].defaultValue = state.docData.approvalKeyData!['defaultWord'].defaultValue
          } else if (state.docData.approvalKeyData!['whetherChangeContent'].defaultValue === '无') {
            state.docData.approvalKeyData!['statementDefenseAndHearing'].defaultValue = ''
          } else if (state.docData.approvalKeyData!['whetherChangeContent'].defaultValue === '是') {
            state.docData.approvalKeyData!['statementDefenseAndHearing'].defaultValue = ''
            message.warning(state.docData.approvalKeyData!['chooseTip'].defaultValue)
          }
        }
      )
      return {
        ...toRefs(state),
        smalltoBIG
        // updateServiceType
      }
    }
  })
</script>

<style lang="less" scoped></style>
