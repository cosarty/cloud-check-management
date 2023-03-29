<template>
  <div id="allmap"></div>
</template>

<script>
export default defineComponent({
  auth: 'admin',
  name: 'admin',
  hideMenu: true,
  coverRouter: true,
})
</script>

<script setup>
onMounted(() => {
  // 注意要带window，不然会报错（注意官方api,会有改动，之前是Bmap,后面3.0版本改为了BMap,最好查文档或者打印一下window）
  var map = new BMapGL.Map('allmap')
  map.centerAndZoom(new window.BMapGL.Point(114.048529, 22.757597), 13)

  map.enableScrollWheelZoom(true)
  var scaleCtrl = new BMapGL.ScaleControl() // 添加比例尺控件
  map.addControl(scaleCtrl)
  var zoomCtrl = new BMapGL.ZoomControl() // 添加缩放控件
  map.addControl(zoomCtrl)

  var geolocation = new BMapGL.Geolocation()
  // 开启SDK辅助定位
  // geolocation.enableSDKLocation()
  geolocation.getCurrentPosition(function (r) {
    console.log('r: ', r)
    var mk = new BMapGL.Marker(r.point)
    map.addOverlay(mk)
    map.panTo(r.point)
    // alert('您的位置：' + r.point.lng + ',' + r.point.lat)
    // console.log('您的位置：' + r.point.lng + ',' + r.point.lat)

    // 创建地理编码实例
    var myGeo = new BMapGL.Geocoder()
    map.centerAndZoom(new BMapGL.Point(r.point.lng, r.point.lat), 12)
    // 根据坐标得到地址描述
    myGeo.getLocation(
      new BMapGL.Point(r.point.lng, r.point.lat),
      function (result) {
        console.log('result: ', result)
        if (result) {
          // alert(result.address)
        }
      },
    )
  })
})

// var a = ['114.066392,22.748699', '114.07991,22.640074']
</script>

<style lang="scss" scoped>
#allmap {
  // 注意给dom宽高，不然地图不出来
  width: 100%;
  height: 100%;
}
</style>
