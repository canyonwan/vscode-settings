import { IMapAddress } from '@/api/common/types'
import { useMessage } from 'naive-ui'

/**
 * 高精度定位
 * @param {*} AMap
 * @param {*} map
 */
export const highAccuracyGeolocation = (AMap, map) => {
  // 初始化后定位到本地(高精度定位，chrome会失败，firefox能成功)
  const geolocation = new AMap.Geolocation({
    // 是否使用高精度定位，默认：true
    enableHighAccuracy: true,
    // 设置定位超时时间，默认：5s
    timeout: 10000,
    // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
    buttonOffset: new AMap.Pixel(10, 20),
    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    zoomToAccuracy: true,
    //  定位按钮的排放位置,  RB表示右下
    buttonPosition: 'RB'
  })

  map.addControl(geolocation)
  geolocation.getCityInfo()
  // geolocation.on('complete', onComplete)
  // geolocation.on('error', onError)

  // function onComplete(data) {
  //   // data是具体的定位信息
  // }

  // function onError(data) {
  //   // 定位出错
  // }
}

export const useGetAddress = async (AMap, map, lnglat: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const message = useMessage()
    let marker: any

    const addr = ref('')

    AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({
        radius: 1000 //范围，默认：500
      })
      const markers: any[] = []

      if (!marker) {
        marker = new AMap.Marker({
          map: map,
          position: lnglat
        })
        if (markers.length > 0) {
          // markers.length = 0
          map.remove(markers)
        }
        markers.push(marker)
        // map.add(marker)
        // marker.setPosition(lnglat)
      }

      geocoder.getAddress(lnglat, (status, result: IMapAddress) => {
        if (status === 'complete' && result.regeocode) {
          addr.value = result.regeocode.formattedAddress
          resolve(addr.value)
        } else {
          reject()
          message.error('根据经纬度查询地址失败')
        }
      })
    })
  })
}
