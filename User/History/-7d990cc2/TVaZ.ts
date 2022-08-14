import AMapLoader from '@amap/amap-jsapi-loader'
// init map
export function setupMap() {
  const mapInstance = shallowRef()
  const aMap = ref()

  const AMap = AMapLoader.load({
    key: 'e0b0885f73d46663aa84588491985dfb',
    version: '2.0',
    plugins: ['AMap.CitySearch'],
    AMapUI: { version: '1.1' }
  }).then((AMap) => {
    //
  })

  if (AMap) {
    aMap.value = AMap
    mapInstance.value = new AMap.Map('container', { zoom: 15, resizeEnable: true })
  }

  return { mapInstance, aMap }
}
