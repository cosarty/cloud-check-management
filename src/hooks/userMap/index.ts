import { Ref } from 'vue'

type MapInjectType = {
  loadScript: () => Promise<void>
  loadCurrentLocal: (lng?: number, lat?: number) => Promise<any>
  LocalSearch: () => Promise<void>
  mapLoading: Readonly<Ref<boolean>>
  circleOverlay: (radius: number, lng: number, lat: number) => Promise<void>
}

const useMap = (
  id: string,
  searchEvent: any,
  isLock = false,
): MapInjectType => {
  let BMap: any
  let mapImp: any // 地图示例
  const mapLoading = ref(false)
  let circle: any

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
          'https://api.map.baidu.com/api?v=3.0&ak=tz41vQfNBXy68lBpXgV80OjAg5LQgKY5&callback=init'
        // 此处需要注意：申请ak时，一定要应用类别一定要选浏览器端，不能选服务端，不然地图会报ak无效
        //   初始化挂载百度地图
        ;(window as any).init = () => {
          ;({ BMap } = window as any)
          resolve()
          mapLoading.value = false
        }

        document.head.appendChild(script)
      } else if ((window as any).BMap) {
        console.log(1)
        ;({ BMap } = window as any)
        resolve()
      }
    })
  // .then(async () => {
  // if (!mapImp && document.getElementById(id)) {
  //   await nextTick()
  //   createImp()
  // }
  // })

  // 创建实例
  const createImp = () => {
    ;({ BMap } = window as any)

    mapImp = new BMap.Map(id)
    // // 启用滚轮放大缩小，默认禁用
    mapImp.enableScrollWheelZoom(true)
    // 启用地图惯性拖拽，默认禁用
    mapImp.enableContinuousZoom(true)
    // 启用地图拖拽，默认启用
    mapImp.enableDragging(true)
    mapImp.addEventListener('click', function (e: any) {
      let clickpt = e.point // 点击的坐标
      if (isLock) return
      mapImp.clearOverlays() // 移除地图上的标注
      let marker = new BMap.Marker(clickpt) // 创建标注
      mapImp.addOverlay(marker) // 将标注添加到地图中
      mapImp.panTo(clickpt)
      mapImp.centerAndZoom(clickpt)
      // 搜索点击后的地址信息
      let myGeo = new BMap.Geocoder()
      // 根据坐标得到地址描述
      myGeo.getLocation(
        new BMap.Point(clickpt.lng, clickpt.lat),
        function (result: any) {
          if (result) {
            // console.log('result: ', result)
          }
        },
      )
    })

    // const cityControl = new BMap.CityListControl({
    /* 
  	控件的停靠位置（可选，默认左上角）
  	BMAP_ANCHOR_TOP_RIGHT 右上角
  	BMAP_ANCHOR_BOTTOM_LEFT 左下角
  	BMAP_ANCHOR_BOTTOM_RIGHT 右下角
    */
    // anchor: BMAP_ANCHOR_TOP_LEFT,
    // 控件基于停靠位置的偏移量（可选）
    //   offset: new BMap.Size(10, 5),
    // })
    // 将控件添加到地图上
    // mapImp.addControl(cityControl)
  }

  // 获取当前定位信息
  const loadCurrentLocal = (lng?: number, lat?: number) =>
    new Promise<void>(async resolve => {
      if (!document.head.contains(document.getElementById('loadmap')))
        await loadScript()

      await nextTick()
      // 创建实例
      createImp()

      mapLoading.value = true

      if (lng && lat) {
        var myGeo = new BMap.Geocoder()
        myGeo.getLocation(new BMap.Point(lng, lat), (result: any) => {
          var mk = new BMap.Marker({ lng, lat })
          mapImp.centerAndZoom(new BMap.Point(lng, lat), 18)
          mapImp.addOverlay(mk)
          mapImp.panTo({ lng, lat })
          mapImp.panBy(0, 0)
          mapLoading.value = false
          // 获取当前定位信息
          resolve(result)

          if (result) {
            // alert(result.address)
          }
        })
        return
      }
      var geolocation = new BMap.Geolocation()
      // 开启SDK辅助定位
      // geolocation.enableSDKLocation()
      geolocation.getCurrentPosition(async function (r: any) {
        await nextTick()
        var mk = new BMap.Marker(r.point)

        // alert('您的位置：' + r.point.lng + ',' + r.point.lat)
        // console.log('您的位置：' + r.point.lng + ',' + r.point.lat)
        // 创建地理编码实例
        var myGeo = new BMap.Geocoder()

        const aaa = mapImp.getDistance(
          new BMap.Point(r.point.lng, r.point.lat),
          new BMap.Point(119.27839795210372, 26.084229526919582),
        )

        console.log('aaa: ', aaa)
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          // 根据坐标得到地址描述
          myGeo.getLocation(
            new BMap.Point(r.point.lng, r.point.lat),
            (result: any) => {
              mapImp.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 18)
              mapImp.addOverlay(mk)
              mapImp.panTo(r.point)
              mapImp.panBy(0, 0)
              mapLoading.value = false
              // 获取当前定位信息
              resolve(result)

              if (result) {
                // alert(result.address)
              }
            },
          )
        } else {
          alert(' 定位失败')
        }
      })
    })

  // 地址搜索
  const LocalSearch = async () => {
    if (isLock) return

    if (!mapImp) createImp()

    await nextTick()

    let Aco = new BMap.Autocomplete({
      // 输入框的id
      input: 'searchAddres',
      location: mapImp,
    })

    Aco.addEventListener('onhighlight', function (e: any) {
      // console.log('onhighlight: ', e)
      //鼠标放在下拉列表上的事件
    })
    Aco.addEventListener('onconfirm', function (e: any) {
      // console.log('onconfirm: ', e)
      //鼠标点击下拉列表后的事件
      let _value = e.item.value
      var myValue =
        _value.province +
        _value.city +
        _value.district +
        _value.street +
        _value.business
      setPlace(myValue)
    })
  }

  // 绘制区域  半径
  const circleOverlay = async (radius: number, lng: number, lat: number) => {
    if (!mapImp) return
    if (circle) {
      mapImp.removeOverlay(circle)
    }

    circle = new BMap.Circle(new BMap.Point(lng, lat), radius, {
      strokeColor: 'blue',
      strokeWeight: 6,
      strokeOpacity: 0.5,
    })
    mapImp.addOverlay(circle)
  }

  // 设置位置
  const setPlace = (value: any) => {
    //清除地图上所有覆盖物
    mapImp.clearOverlays()
    var local = new BMap.LocalSearch(mapImp, {
      //智能搜索
      onSearchComplete: function () {
        let getpo = local.getResults().getPoi(0).point //获取第一个智能搜索的结果
        searchEvent({ info: local.getResults(), getpo })
        mapImp.centerAndZoom(getpo, 18)
        mapImp.addOverlay(new BMap.Marker(getpo)) //添加标注
      },
    })
    local.search(value)
  }
  return {
    loadScript,
    mapLoading: readonly(mapLoading),
    loadCurrentLocal,
    LocalSearch,
    circleOverlay,
  }
}

export default useMap
