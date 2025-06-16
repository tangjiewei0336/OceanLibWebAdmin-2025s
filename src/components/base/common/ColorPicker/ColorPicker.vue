<template>
  <a-flex :gap="2" vertical>
    <a-flex :gap="2">
      <a-input-group compact style="width-min: 160px">
        <a-input
          v-model:value="color.hex.value"
          size="small"
          placeholder="HEX颜色值"
          @change="color.hex.isSave = false"
          :style="color.hex.isSave ? 'width: 100%' : 'width: calc(100% - 47px)'"
          :readonly="readonly"
        />
        <a-button type="primary" size="small" v-if="!color.hex.isSave" @click="setColor('hex')">保存</a-button>
      </a-input-group>

      <a-input-group compact style="width-min: 160px">
        <a-input
          v-model:value="color.hex8.value"
          size="small"
          placeholder="HEX8颜色值"
          @change="color.hex8.isSave = false"
          :style="color.hex8.isSave ? 'width: 100%' : 'width: calc(100% - 47px)'"
          :readonly="readonly"
        />
        <a-button type="primary" size="small" v-if="!color.hex8.isSave" @click="setColor('hex8')">保存</a-button>
      </a-input-group>
    </a-flex>
    <a-flex :gap="2">
      <a-input-group compact style="width-min: 160px">
        <a-input
          v-model:value="color.rgb.value"
          size="small"
          placeholder="RGB颜色值"
          @change="color.rgb.isSave = false"
          :style="color.rgb.isSave ? 'width: 100%' : 'width: calc(100% - 47px)'"
          :readonly="readonly"
        />
        <a-button type="primary" size="small" v-if="!color.rgb.isSave" @click="setColor('rgb')">保存</a-button>
      </a-input-group>
      <a-input-group compact style="width-min: 160px">
        <a-input
          v-model:value="color.rgba.value"
          size="small"
          placeholder="RGBA颜色值"
          @change="color.rgba.isSave = false"
          :style="color.rgba.isSave ? 'width: 100%' : 'width: calc(100% - 47px)'"
          :readonly="readonly"
        />
        <a-button type="primary" size="small" v-if="!color.rgba.isSave" @click="setColor('rgba')">保存</a-button>
      </a-input-group>
    </a-flex>
    <div id="picker" ref="colorPicker" style="min-width: 320px" v-show="!readonly"></div>
  </a-flex>
</template>

<script setup>
import iro from '@jaames/iro';
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';

const props = defineProps(['color', 'readonly']);
const emit = defineEmits(['update:color']);

const colorPicker = ref();
const color = ref({
  hex: {
    value: null,
    isSave: true,
  },
  hex8: {
    value: null,
    isSave: true,
  },
  rgb: {
    value: null,
    isSave: true,
  },
  rgba: {
    value: null,
    isSave: true,
  },
});

let cp = null;

onMounted(() => {
  let nonEmptyColorKey = null;
  ['hex', 'hex8', 'rgb', 'rgba'].forEach((key) => {
    color.value[key].value = props.color[key];
    if (props.color[key] != null) {
      nonEmptyColorKey = key;
    }
  });
  watch(
    () => props.color,
    () => {
      ['hex', 'hex8', 'rgb', 'rgba'].forEach((key) => {
        color.value[key].value = props.color[key];
      });
      resetAllUnsave();
    }
  );
  cp = new iro.ColorPicker(colorPicker.value, {
    width: 200,
    margin: 2,
    layoutDirection: 'horizontal',
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          id: 'hue-slider',
          sliderType: 'hue',
        },
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'saturation',
        },
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'value',
        },
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'alpha',
        },
      },
    ],
  });
  cp.on('color:change', function (newColor) {
    //将当前颜色记录为十六进制字符串
    color.value.hex.value = newColor.hexString;
    color.value.hex8.value = newColor.hex8String;
    color.value.rgb.value = newColor.rgbString;
    color.value.rgba.value = newColor.rgbaString;
    resetAllUnsave();
    emit('update:color', {
      hex: color.value.hex.value,
      hex8: color.value.hex8.value,
      rgb: color.value.rgb.value,
      rgba: color.value.rgba.value,
    });
  });
  setColor(nonEmptyColorKey);
});

const setColor = (type) => {
  cp.color.set(color.value[type].value);
  resetAllUnsave();
};

const resetAllUnsave = () => {
  color.value['hex'].isSave = true;
  color.value['hex8'].isSave = true;
  color.value['rgb'].isSave = true;
  color.value['rgba'].isSave = true;
};
</script>