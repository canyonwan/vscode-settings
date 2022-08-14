<template>
  <div class="text-center doc-5">
    <!-- 当事人送达地址确认书 -->
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
          <td height="50">{{ docData.approvalKeyData!['docCodeKey'].defaultValue }}</td>
          <td colspan="4">
            <n-input v-if="isNoPreview" v-model:value="docData.approvalKeyData!['docCode'].defaultValue" :placeholder="'请输入' + docData.approvalKeyData!['docCodeKey'].defaultValue" type="text" />
            <template v-else>
              {{ docData.approvalKeyData!['docCode'].defaultValue }}
            </template>
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['causeKey'].defaultValue }}</td>
          <td colspan="4">
            <!-- 违法行为 -->
            <span v-if="docData.approvalKeyData!['targetNameValue2']">{{ docData.approvalKeyData!['targetNameValue2'].defaultValue }}</span>
            <cause-attr :class="isNoPreview ? '' : 'inline'" key="causeAttrDataCause" :dockey-config="docData.configOutputList" :model-keys="['causeAttrDataCause']" :is-edit="isNoPreview" /><span
              v-if="docData.approvalKeyData!['causeSuffix']"
              >{{ docData.approvalKeyData!['causeSuffix'].defaultValue }}</span
            >
          </td>
        </tr>
        <doc-party v-if="docData.approvalKeyData && Object.keys(docData.approvalKeyData!).length > 0" :document-approval-data="docData.approvalKeyData!" :is-edit="documentData.isEdit" />
        <!-- <tr>
          <td height="50">{{ docData.approvalKeyData!['partyInfoKey'].defaultValue }}</td>
          <td colspan="4">
            <cause-attr
              key="basicInformation"
              :dockey-config="docData.configOutputList"
              :model-keys="docData.approvalKeyData!['basicInformation'].groupWordModelKey || []"
              :is-edit="isNoPreview"
              :type="'text'"
            />
          </td>
        </tr> -->
        <tr>
          <td height="50">{{ docData.approvalKeyData!['notificationKey'].defaultValue }}</td>
          <td colspan="4">
            <div class="text-left">
              <div v-for="(text, index) in docData.approvalKeyData!['tellNotification'].defaultValue.split('\n')" :key="index">{{ text }}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td height="50" rowspan="7">{{ docData.approvalKeyData!['deliveryAddressAndTypeKey'].defaultValue }}</td>
          <td>
            {{ docData.approvalKeyData!['summonedPersonNameKey'].defaultValue }}
          </td>
          <td colspan="3" height="50">
            <n-input
              v-if="isNoPreview"
              v-model:value="docData.approvalKeyData!['summonedPersonName'].defaultValue"
              :placeholder="'请输入' + docData.approvalKeyData!['summonedPersonNameKey'].defaultValue"
              type="text"
            />
            <template v-else>
              {{ docData.approvalKeyData!['summonedPersonName'].defaultValue }}
            </template>
          </td>
        </tr>
        <tr>
          <td height="50">
            {{ docData.approvalKeyData!['certificateTypeKey'].defaultValue }}
          </td>
          <td>
            <n-input
              v-if="isNoPreview"
              v-model:value="docData.approvalKeyData!['summonedPersonCodeNameValue'].defaultValue"
              :placeholder="'请输入' + docData.approvalKeyData!['certificateTypeKey'].defaultValue"
              type="text"
            />
            <template v-else>
              {{ docData.approvalKeyData!['summonedPersonCodeNameValue'].defaultValue }}
            </template>
          </td>
          <td>
            {{ docData.approvalKeyData!['codeNumKey'].defaultValue }}
          </td>
          <td>
            <n-input
              v-if="isNoPreview"
              v-model:value="docData.approvalKeyData!['summonedPersonCertificateNoValue'].defaultValue"
              :placeholder="'请输入' + docData.approvalKeyData!['codeNumKey'].defaultValue"
              type="text"
            />
            <template v-else>
              {{ docData.approvalKeyData!['summonedPersonCertificateNoValue'].defaultValue }}
            </template>
          </td>
        </tr>
        <tr>
          <td height="50">
            {{ docData.approvalKeyData!['serviceAddressKey'].defaultValue }}
          </td>
          <td colspan="3">
            <n-input
              v-if="isNoPreview"
              v-model:value="docData.approvalKeyData!['serviceAddress'].defaultValue"
              :placeholder="'请输入' + docData.approvalKeyData!['serviceAddressKey'].defaultValue"
              type="text"
            />
            <template v-else>
              {{ docData.approvalKeyData!['serviceAddress'].defaultValue }}
            </template>
          </td>
        </tr>
        <tr>
          <td rowspan="2" height="50">
            {{ docData.approvalKeyData!['isElectronicDeliveryKey'].defaultValue }}
          </td>
          <td colspan="3" height="50">
            <n-radio-group v-model:value="docData.approvalKeyData!['whetherRejection'].defaultValue" :disabled="!isNoPreview" name="radiogroup">
              <n-space>
                <n-radio value="是"> 是 </n-radio>
                <n-radio value="否"> 否 </n-radio>
              </n-space>
            </n-radio-group>
          </td>
        </tr>
        <tr>
          <td colspan="3" height="50">
            <doc-column :case-column-source="docData.approvalKeyData!['electronicDeliveryKeyType']" :is-edit="isNoPreview" />
            <n-input v-if="isNoPreview" v-model:value="docData.approvalKeyData!['electronicDeliveryKeyTypeValue'].defaultValue" placeholder="请输入电子送达内容" type="text" />
            <div v-else>
              {{ docData.approvalKeyData!['electronicDeliveryKeyTypeValue'].defaultValue }}
            </div>
          </td>
        </tr>
        <tr>
          <td height="50">
            {{ docData.approvalKeyData!['phoneNumberKey'].defaultValue }}
          </td>
          <td>
            <n-input
              v-if="isNoPreview"
              v-model:value="docData.approvalKeyData!['summonedPersonTelephoneValue'].defaultValue"
              :placeholder="'请输入' + docData.approvalKeyData!['phoneNumberKey'].defaultValue"
              type="text"
            />
            <template v-else>
              {{ docData.approvalKeyData!['summonedPersonTelephoneValue'].defaultValue }}
            </template>
          </td>
          <td>
            {{ docData.approvalKeyData!['postalCodeKey'].defaultValue }}
          </td>
          <td>
            <n-input
              v-if="isNoPreview"
              v-model:value="docData.approvalKeyData!['summonedPersonPostalCodeValue'].defaultValue"
              :placeholder="'请输入' + docData.approvalKeyData!['postalCodeKey'].defaultValue"
              type="text"
            />
            <template v-else>
              {{ docData.approvalKeyData!['summonedPersonPostalCodeValue'].defaultValue }}
            </template>
          </td>
        </tr>
        <tr>
          <td height="50">
            {{ docData.approvalKeyData!['otherContactKey'].defaultValue }}
          </td>
          <td colspan="3">
            <n-input
              v-if="isNoPreview"
              v-model:value="docData.approvalKeyData!['summonedPersonOtherContactValue'].defaultValue"
              :placeholder="'请输入' + docData.approvalKeyData!['otherContactKey'].defaultValue"
              type="text"
            />
            <template v-else>
              {{ docData.approvalKeyData!['summonedPersonOtherContactValue'].defaultValue }}
            </template>
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['summonedPersonKey'].defaultValue }}</td>
          <td colspan="4">
            <div class="text-left"> <span class="pl-8"></span>{{ docData.approvalKeyData!['confirmationItems'].defaultValue }} </div>
            <div class="flex text-left">
              <div>
                {{ docData.approvalKeyData!['summonedPersonSignKey'].defaultValue }}
              </div>
              <div class="flex-1">
                <doc-sign key="summonedPersonSign" position="justify-start" :is-edit="isNoPreview" v-model:doc-sign-data="docData.approvalKeyData!['summonedPersonSign'].columnValue" />
              </div>
            </div>
            <div class="pr-3 text-right">
              <n-input v-if="isNoPreview" class="min-w-7" autosize v-model:value="docData.approvalKeyData!['beginYear'].defaultValue" type="text" />
              <template v-else>
                {{ docData.approvalKeyData!['beginYear'].defaultValue }}
              </template>
              年
              <n-input v-if="isNoPreview" class="min-w-7" autosize v-model:value="docData.approvalKeyData!['beginMonth'].defaultValue" type="text" />
              <template v-else>
                {{ docData.approvalKeyData!['beginMonth'].defaultValue }}
              </template>
              月
              <n-input v-if="isNoPreview" class="min-w-7" autosize v-model:value="docData.approvalKeyData!['beginDay'].defaultValue" type="text" />
              <template v-else>
                {{ docData.approvalKeyData!['beginDay'].defaultValue }}
              </template>
              日
            </div>
          </td>
        </tr>
        <tr>
          <td height="50">{{ docData.approvalKeyData!['remarkKey'].defaultValue }}</td>
          <td colspan="4">
            <n-input v-if="isNoPreview" v-model:value="docData.approvalKeyData!['remarks'].defaultValue" :placeholder="'请输入' + docData.approvalKeyData!['remarkKey'].defaultValue" type="textarea" />
            <div v-else class="text-left">
              {{ docData.approvalKeyData!['remarks'].defaultValue }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import { IDocumentData } from '@/api/document/types'
  import CauseAttr from '../components/cause-attr.vue'
  import DocColumn from '../components/doc-column.vue'
  import DocSign from '../components/doc-sign.vue'
  import DocParty from '../components/doc-party.vue'
  import { cloneDeep } from 'lodash-es'
  export default defineComponent({
    name: 'DOC5',
    components: { CauseAttr, DocColumn, DocSign, DocParty },
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
      watch(
        () => props.documentData,
        () => {
          state.docData = cloneDeep(props.documentData)
          console.log(state.docData, 'doc5')
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
