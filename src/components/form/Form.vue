<!--
 * @Description: 组件设计我们需要考虑的就是内部交互的逻辑，对子组件提供什么数据，对父组件提供什么方法，需不需要通过 provide 或者 inject 来进行跨组件通信等等
 * @Author: sunsh
 * @Date: 2022-09-21 19:24:09
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-22 13:10:58
-->

<template>
  <div class="el-form">
    <slot />
  </div>
</template>
<script lang="ts">
  export default {
    name: "ElForm"
  };
</script>
<script setup lang="ts">
import { PropType, ref, provide } from 'vue';
import { Rules } from "async-validator";
import { FormItem, key } from './type';
import createEvent from '../../utils/event';

const event = createEvent();
const props = defineProps({
  model: { type: Object, required: true },
  rules: { type: Object as PropType<Rules> },
});

provide(key, {
  model: props.model,
  rules: props.rules
});

const itemValidate = ref<Array<FormItem>>([]);

event.on('addFormItem', (item) => {
  itemValidate.value.push(item);
});

// 对外提供validate方法和validate事件
function validate(cb: (isValid: boolean) => void) {
  const validates = itemValidate.value.map(item => item.validate());
  Promise.all(validates)
    .then(args => { cb(true); })
    .catch(args => { cb(false); });
}

defineExpose({
  validate,
});

</script>

<style scoped>

</style>