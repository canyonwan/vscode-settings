<template>
  <div class="text-center doc-10">
    <!-- 行政处罚决定公开情况 -->
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
          <td height="50" colspan="2">{{ docData.approvalKeyData!['fixed1'].defaultValue }}</td>
          <td colspan="3">
            {{ docData.approvalKeyData!['docCode'].defaultValue }}
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['fixed2'].defaultValue }}</td>
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
        <tr>
          <td height="100">{{ docData.approvalKeyData!['fixed3'].defaultValue }}</td>
          <td colspan="4">
            <doc-column :case-column-source="docData.approvalKeyData!['publicSituation']" :is-edit="isNoPreview" :is-single-select="false" />
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['fixed4'].defaultValue }}</td>
          <td colspan="4">
            <n-input v-if="isNoPreview" v-model:value="docData.approvalKeyData!['publicWebsite'].defaultValue" type="text" class="min-w-7" />
            <span v-else>
              {{ docData.approvalKeyData!['publicWebsite'].defaultValue }}
            </span>
          </td>
        </tr>
        <tr>
          <td height="300">{{ docData.approvalKeyData!['fixed5'].defaultValue }}</td>
          <td colspan="4">
            <doc-upload :case-column-source="docData.approvalKeyData!['publicScreenshot']" :is-edit="isNoPreview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import { IDocumentData } from '@/api/document/types'
  import DocColumn from '../components/doc-column.vue'
  import { cloneDeep } from 'lodash-es'
  import DocUpload from '../components/doc-upload.vue'
  export default defineComponent({
    name: 'DOC10',
    components: { DocColumn, DocUpload },
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
    setup(props) {
      const state = reactive({
        docData: {} as IDocumentData,
        currentSignUserId: '' // 当前签字的userid
      })
      watch(
        () => props.documentData,
        () => {
          state.docData = cloneDeep(props.documentData)
          console.log(state.docData, 'doc10-行政处罚决定公开情况')
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
