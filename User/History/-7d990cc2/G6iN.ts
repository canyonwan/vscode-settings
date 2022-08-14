import AMapLoader from '@amap/amap-jsapi-loader'
// init map
export async function setupMap() {
  const mapInstance = shallowRef()
  const aMap = ref()

  const AMap = await AMapLoader.load({
    key: 'e0b0885f73d46663aa84588491985dfb',
    version: '2.0',
    plugins: ['AMap.CitySearch'],
    AMapUI: { version: '1.1' }
  })

  aMap.value = AMap
  mapInstance.value = new AMap.Map('container', { zoom: 15, resizeEnable: true })

  return { mapInstance, aMap }
}
