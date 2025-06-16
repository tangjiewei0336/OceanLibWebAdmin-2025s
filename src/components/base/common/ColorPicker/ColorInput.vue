<template>
  <a-flex>
    <a-popover placement="leftBottom" v-for="(color, index) in colors" :key="index">
      <template #content>
        <ColorPicker style="width: 320px" v-model:color="colors[index]" :readonly="readonly" />
      </template>
      <template #title>
        <span>颜色选择器</span>
      </template>
      <div style="position: relative; height: 40px; width: 40px; padding: 4px">
        <font-awesome-icon
          :icon="['fas', 'circle-xmark']"
          style="position: absolute; top: 0px; right: 0px; z-index: 1; color: #ff4d4f"
          @click="remove(index)"
          v-if="props.sizeLimit == null && !readonly"
        />
        <a-avatar :style="{ backgroundColor: color.hex ? color.hex : color.hex8 ? color.hex8 : color.rgb ? color.rgb : color.rgba, verticalAlign: 'middle' }" />
      </div>
    </a-popover>
    <div style="position: relative; height: 40px; width: 40px; padding: 4px" @click="add" v-if="props.sizeLimit == null && !readonly">
      <a-avatar> <font-awesome-icon :icon="['fas', 'plus']" /></a-avatar>
    </div>
  </a-flex>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import ColorPicker from './ColorPicker.vue';

const props = defineProps({
  colorValue: { default: [] },
  colorValueType: { default: 'rgba' },
  sizeLimit: { default: null },
  readonly: { default: false },
});
const emit = defineEmits(['update:colorValue']);

let colors = ref([]);

onMounted(() => {
  init();
  setPropsWatch();
});

let unWatchColor = null;
let unWatchProps = null;

const init = () => {
  if (unWatchColor != null) {
    unWatchColor();
  }

  let value = props.colorValue;
  if (!Array.isArray(value) && props.sizeLimit == 1) {
    value = [value];
  } // 单个颜色值变为数组

  for (let i = 0; i < value.length; i++) {
    if (colors.value[i] != undefined) {
      colors.value[i][props.colorValueType] = value[i];
    } else {
      let object = {};
      object[props.colorValueType] = value[i];
      colors.value.push(object);
    }
  }

  if (props.sizeLimit != null) {
    for (let i = 0; i < props.sizeLimit - colors.value.length; i++) {
      add();
    }
  }
  setColorWatch();
};

const setPropsWatch = () => {
  unWatchProps = watch(
    () => props,
    () => {
      init();
    },
    {
      deep: true,
    }
  );
};

const setColorWatch = () => {
  unWatchColor = watch(
    () => colors,
    () => {
      let list = colors.value.map((element) => element[props.colorValueType]);
      if (unWatchProps != null) {
        unWatchProps();
      }
      emit('update:colorValue', props.sizeLimit == 1 ? list[0] : list);
      setPropsWatch();
    },
    {
      deep: true,
    }
  );
};

const add = () => {
  colors.value.push({
    hex: '#000000',
    hex8: '#000000ff',
    rgb: 'rgb(0, 0, 0)',
    rgba: 'rgba(0, 0, 0, 1)',
  });
};

const remove = (index) => {
  colors.value.splice(index, 1);
};
</script>