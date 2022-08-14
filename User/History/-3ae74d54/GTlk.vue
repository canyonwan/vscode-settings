<script setup lang="ts">
  import { useGetAddress } from '@/views/tool-group/components/useMapPlugin'
  import { useMapLoader } from './src/composables/useMapLoader'

  const { mapInstance, aMap, mapLoading } = useMapLoader()

  const emit = defineEmits(['chooseAddressHandler'])

  watch(
    () => mapInstance.value,
    () => {
      if (mapInstance.value) {
        mapInstance.value.on('click', async (e: any) => {
          const lnglat = e.lnglat
          const address = await useGetAddress(aMap.value, mapInstance.value, [lnglat.lng, lnglat.lat])
          emit('chooseAddressHandler', address, [lnglat.lng, lnglat.lat])
          // form.longitude = lnglat.lng.toString()
          // form.latitude = lnglat.lat.toString()
          // form.address = res
        })
      }
    },
    { immediate: true }
  )
</script>
<template>
  <n-spin size="medium" :show="mapLoading">
    <div id="container" class="w-full h-80 mb-5"></div>
  </n-spin>
</template>
