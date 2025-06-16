<script setup>
import { onMounted, onUnmounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { getAMap } from '@/assets/js/AMap.js';
import { buildGeoJSON, addScatter, addPulseLink } from '@/assets/js/Loca.js';

const props = defineProps(['height']);
const emit = defineEmits(['onMapPosSelected', 'onInitComplete']);

let map = null;
let marker = null;

const MapContainerID = 'map_container_' + Math.floor(Math.random() * 100000000);

onMounted(async () => {
  const AMap = await getAMap();
  marker = new AMap.Marker();
  map = new AMap.Map(MapContainerID, {
    zoom: 11.7,
    center: [113.97199630737305, 22.5807295363949],
    pitch: 40,
    viewMode: '3D',
  });

  let loca = (window.loca = new Loca.Container({
    map,
  }));

  // 红色呼吸点
  let pointsSource = buildGeoJSON([{
    properties: {},
    coordinates: [116.397428, 39.90923],
  }, {
    properties: {},
    coordinates: [115.482331, 38.867657]
  }
  ], 'Point')
  addScatter(loca, pointsSource, "breathRed", "preset" );
  let linesSource = buildGeoJSON([{
    properties: {
      type: 0,
      ratio: 0.0369,
      lineWidthRatio: 1,
    },
    coordinates: [
      [116.397428, 39.90923],
      [115.482331, 38.867657],
    ],
  }], 'LineString')
  addPulseLink(loca, linesSource, "pulseLink_1", "preset" );


  // 启动渲染动画
  loca.animate.start();
});
</script>

<template>
  <div :style="'width: 100%;height: ' + props.height" :id="MapContainerID"></div>
</template>

<style scoped></style>
