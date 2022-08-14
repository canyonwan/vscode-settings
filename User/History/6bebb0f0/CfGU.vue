<template>
  <div class="select-region">
    <n-input-group>
      <n-select :style="{ width: '20%' }" v-model:value="regionIds.provinceId" :options="provinceOptions" :loading="loading" @update:value="chooseProvince" clearable />
      <n-select :style="{ width: '20%' }" v-model:value="regionIds.cityId" :options="cityOptions" :loading="loading" @update:value="chooseCity" clearable />
      <n-select :style="{ width: '20%' }" v-model:value="regionIds.countyId" :options="countyOptions" :loading="loading" @update:value="chooseCounty" clearable />
      <n-select :style="{ width: '20%' }" v-model:value="regionIds.townId" :options="townOptions" :loading="loading" @update:value="chooseTown" clearable />
      <n-select :style="{ width: '20%' }" v-model:value="regionIds.villageId" :options="villageOptions" @update:value="chooseVillage" clearable />
    </n-input-group>
  </div>
</template>

<script lang="ts">
  import { queryRegions } from '@/api/setting/region'
  import { getRegionIds } from '@/api/setting/region'
  import { IRegion } from './types'
  export default defineComponent({
    name: 'SelectRegion',
    props: {
      // districtId 地区最后一个id
      value: {
        type: String,
        default: ''
      }
    },
    emits: ['update:value'],
    setup(props, context) {
      const loading = ref(false)
      const laseId = ref()
      const regionIds = ref<IRegion>({
        provinceId: null,
        cityId: null,
        countyId: null,
        townId: null,
        villageId: null
      })
      const state = reactive({
        provinceOptions: [],
        cityOptions: [],
        countyOptions: [],
        townOptions: [],
        villageOptions: []
      })
      const queryRegionData = (id, regionLevel) => {
        // regionLevel 0省、1市、2县、3镇、4村
        loading.value = true
        queryRegions(id).then(
          (data) => {
            loading.value = false
            const regionData: any = data
            if (regionData.length) {
              regionData.map((item) => {
                item.label = item.name
                item.value = item.id
              })
            }
            if (regionLevel === 0) {
              state.provinceOptions = regionData
            } else if (regionLevel === 1) {
              state.cityOptions = regionData
            } else if (regionLevel === 2) {
              state.countyOptions = regionData
            } else if (regionLevel === 3) {
              state.townOptions = regionData
            } else if (regionLevel === 4) {
              state.villageOptions = regionData
            }
          },
          () => {
            loading.value = false
          }
        )
      }
      const updateValue = (val) => {
        laseId.value = val
        context.emit('update:value', val)
      }
      const getRegionId = (id) => {
        getRegionIds(id).then((data) => {
          const districtIdKeys = data.map(String).reverse()
          queryRegionData(0, 0)
          regionIds.value.provinceId = districtIdKeys[1] ? districtIdKeys[1] : null
          nextTick(() => {
            queryRegionData(regionIds.value.provinceId, 1)
            regionIds.value.cityId = districtIdKeys[2] ? districtIdKeys[2] : null
          })
          nextTick(() => {
            if (regionIds.value.cityId) {
              queryRegionData(regionIds.value.cityId, 2)
            }
            regionIds.value.countyId = districtIdKeys[3] ? districtIdKeys[3] : null
          })
          nextTick(() => {
            if (regionIds.value.countyId) {
              queryRegionData(regionIds.value.countyId, 3)
            }
            regionIds.value.townId = districtIdKeys[4] ? districtIdKeys[4] : null
          })
          nextTick(() => {
            if (regionIds.value.townId) {
              queryRegionData(regionIds.value.townId, 4)
            }
            regionIds.value.villageId = districtIdKeys[5] ? districtIdKeys[5] : null
          })
        })
      }
      watch(
        () => props.value,
        () => {
          if (props.value) {
            if (laseId.value !== props.value) {
              laseId.value = props.value
              getRegionId(props.value)
            }
          } else {
            laseId.value = props.value
            queryRegionData(0, 0)
            regionIds.value = {
              provinceId: null,
              cityId: null,
              countyId: null,
              townId: null,
              villageId: null
            }
            state.cityOptions = []
            state.countyOptions = []
            state.townOptions = []
            state.villageOptions = []
          }
        },
        { immediate: true }
      )
      const chooseProvince = (value) => {
        if (value) {
          regionIds.value.cityId = null
          regionIds.value.countyId = null
          regionIds.value.townId = null
          regionIds.value.villageId = null
          state.cityOptions = []
          state.countyOptions = []
          state.townOptions = []
          state.villageOptions = []
          updateValue(value)
          queryRegionData(value, 1)
        } else {
          regionIds.value.cityId = null
          regionIds.value.countyId = null
          regionIds.value.townId = null
          regionIds.value.villageId = null
          updateValue(value)
        }
      }
      const chooseCity = (value) => {
        if (value) {
          regionIds.value.countyId = null
          regionIds.value.townId = null
          regionIds.value.villageId = null
          state.countyOptions = []
          state.townOptions = []
          state.villageOptions = []
          updateValue(value)
          queryRegionData(value, 2)
        } else {
          console.log('else value', value)
          console.log('else cityId', regionIds.value.cityId)
          regionIds.value.countyId = null
          regionIds.value.townId = null
          regionIds.value.villageId = null
        }
      }
      const chooseCounty = (value) => {
        if (value) {
          regionIds.value.townId = null
          regionIds.value.villageId = null
          state.townOptions = []
          state.villageOptions = []
          updateValue(value)
          queryRegionData(value, 3)
        } else {
          regionIds.value.townId = null
          regionIds.value.villageId = null
        }
      }
      const chooseTown = (value) => {
        if (value) {
          regionIds.value.villageId = null
          state.villageOptions = []
          updateValue(value)
          queryRegionData(value, 4)
        } else {
          regionIds.value.villageId = null
        }
      }
      const chooseVillage = (value) => {
        if (value) {
          updateValue(value)
        }
      }
      return {
        loading,
        regionIds,
        ...toRefs(state),
        chooseProvince,
        chooseCity,
        chooseCounty,
        chooseTown,
        chooseVillage
      }
    }
  })
</script>
