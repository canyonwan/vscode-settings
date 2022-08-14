import AMapLoader from '@amap/amap-jsapi-loader'
import AMap from 'AMap'
// init map
export function setupMap() {
  const mapInstance = shallowRef()
  const aMap = ref()

  AMapLoader.load({
    key: 'e0b0885f73d46663aa84588491985dfb',
    version: '2.0',
    plugins: ['AMap.CitySearch'],
    AMapUI: { version: '1.1' }
  }).then((AMap) => {
    aMap.value = AMap
    mapInstance.value = new AMap.Map('container', { zoom: 15, resizeEnable: true })
    console.log('%c [ mapInstance.value ]-15', 'font-size:13px; background:#0095FF; color:white;', mapInstance.value)
  })

  return { mapInstance, aMap }
}
