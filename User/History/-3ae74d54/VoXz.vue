<script setup lang="ts">
  import { useGetAddress } from '@/views/tool-group/components/useMapPlugin'
  import { useMapLoader } from './src/composables/useMapLoader'

  const { mapInstance, aMap, mapLoading } = useMapLoader()

  mapInstance.value.on('click', async (e: any) => {
    const lnglat = e.lnglat
    console.log('%c [ lnglat ]-10', 'font-size:13px; background:#0095FF; color:white;', lnglat)
    // form.longitude = lnglat.lng.toString()
    // form.latitude = lnglat.lat.toString()
    // const res = await useGetAddress(aMap, mapInstance.value, [lnglat.lng, lnglat.lat])
    // form.address = res
  })
</script>
<template>
  <n-spin size="medium" :show="mapLoading">
    <div id="container" class="w-full h-80 mb-5"></div>
  </n-spin>
</template>
