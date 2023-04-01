import { Ref } from 'vue'

type MapInjectType = {
  loadScript: () => Promise<void>
  loadCurrentLocal: () => Promise<any>
  LocalSearch: () => Promise<void>
  mapLoading: Readonly<Ref<boolean>>
}

const useMap = (id: string): MapInjectType => {
  let BMap: any
  let mapImp: any // 地图示例
  const mapLoading = ref(false)

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
      console.log('e: ', e)
      var clickpt = e.point // 点击的坐标
      mapImp.clearOverlays() // 移除地图上的标注
      var marker = new BMap.Marker(clickpt) // 创建标注
      mapImp.addOverlay(marker) // 将标注添加到地图中
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
  const loadCurrentLocal = () =>
    new Promise<void>(async resolve => {
      if (!document.head.contains(document.getElementById('loadmap')))
        await loadScript()

      await nextTick()
      // 创建实例
      createImp()

      mapLoading.value = true
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
      console.log('_value: ', _value)
      var myValue =
        _value.province +
        _value.city +
        _value.district +
        _value.street +
        _value.business
      setPlace(myValue)
    })
  }

  // 设置位置
  const setPlace = (value: any) => {
    //清除地图上所有覆盖物
    mapImp.clearOverlays()
    var local = new BMap.LocalSearch(mapImp, {
      //智能搜索
      onSearchComplete: function () {
        console.log('local.getResults(): ', local.getResults())

        var getpo = local.getResults().getPoi(0).point //获取第一个智能搜索的结果
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
  }
}

export default useMap
