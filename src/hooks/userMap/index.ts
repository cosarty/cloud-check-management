import { Ref } from 'vue'

type MapInjectType = {
  loadScript: () => Promise<void>
  loadCurrentLocal: () => Promise<void>
  mapLoading: Readonly<Ref<boolean>>
}

let BMapGL: any
let mapImp: any // 地图示例
let loadCurrent: boolean = false // 是否正在加载
const useMap = (): MapInjectType => {
  const mapLoading = ref(false)
  const currentLocaltion = reactive<{
    city?: string
    district?: string
    province?: string
    lat?: number
    lng?: number
  }>({ city: '', district: '', province: '', lat: 0, lng: 0 })

  // 创建实例
  const loadScript = () =>
    new Promise<void>(async resolve => {
      if (!document.head.contains(document.getElementById('loadmap'))) {
        mapLoading.value = true
        //   挂载
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = 'loadmap' // 给script一个类名
        script.src =
          'https://api.map.baidu.com/api?type=webgl&v=2.0&ak=tz41vQfNBXy68lBpXgV80OjAg5LQgKY5&callback=init'
        // 此处需要注意：申请ak时，一定要应用类别一定要选浏览器端，不能选服务端，不然地图会报ak无效
        //   初始化挂载百度地图
        ;(window as any).init = () => {
          ;({ BMapGL } = window as any)
          resolve()
        }
        document.head.appendChild(script)
      } else if ((window as any).BMapGL) {
        ;({ BMapGL } = window as any)
        resolve()
      }
    }).then(async () => {
      if (!mapImp) {
        mapImp = new BMapGL.Map('allmap')
        mapImp.enableScrollWheelZoom(true)
        mapImp.enableContinuousZoom(true)
        mapImp.enableDragging(true)
        let scaleCtrl = new BMapGL.ScaleControl() // 添加比例尺控件
        mapImp.addControl(scaleCtrl)
        let zoomCtrl = new BMapGL.ZoomControl() // 添加缩放控件
        mapImp.addControl(zoomCtrl)
      }
    })

  const loadCurrentLocal = () =>
    new Promise<void>(resolve => {
      if (loadCurrent === false) {
        loadCurrent = true
        mapLoading.value = true

        var geolocation = new BMapGL.Geolocation()
        // 开启SDK辅助定位
        // geolocation.enableSDKLocation()
        geolocation.getCurrentPosition(async function (r: any) {
          console.log('r: ', r)
          await nextTick()
          var mk = new BMapGL.Marker(r.point)
          mapImp.addOverlay(mk)
          mapImp.panTo(r.point)
          // alert('您的位置：' + r.point.lng + ',' + r.point.lat)
          // console.log('您的位置：' + r.point.lng + ',' + r.point.lat)

          // 创建地理编码实例
          var myGeo = new BMapGL.Geocoder()
          console.log('mapImp: ', mapImp)

          mapImp.centerAndZoom(new BMapGL.Point(r.point.lng, r.point.lat), 16)
          // 根据坐标得到地址描述
          myGeo.getLocation(
            new BMapGL.Point(r.point.lng, r.point.lat),
            function (result: any) {
              console.log('result: ', result)
              mapLoading.value = false
              loadCurrent = false
              resolve()
              if (result) {
                // alert(result.address)
              }
            },
          )
        })
      }
    })

  return {
    loadScript,
    mapLoading: readonly(mapLoading),
    loadCurrentLocal,
  }
}

export default useMap
