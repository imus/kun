<template>
  <div class="el-form-item">
    <label></label>
    <slot></slot>
    <div v-if="error" class="el-error">{{
      error
    }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ElFormItem"
};
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { key } from './type';
import createEvent from "../../utils/event";
import Schema from 'async-validator';

const event = createEvent();
interface Props {
  props?: string,
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  prop: ""
});


const formData = inject(key);

let o;
defineExpose(o = {
  validate
});

onMounted(() => {
  if (props.prop) {
    event.on('validate', () => {
      validate();
    });
    event.emit('addFormItem', o);
  }


});

const error = ref("");

function validate() {
  if (!formData?.rules) {
    return Promise.resolve({ result: true});
  }
  const prop = props.prop;
  const model = formData.model[prop];
  const rules = formData.rules[prop];
  const schema = new Schema({[prop]: rules});

  return schema.validate({[prop]: model}, errors => {
    if (errors) {
      error.value = errors[0].message || "校验失败";
    } else {
      error.value = "";
    }
  });

}


</script>

<style scoped>

</style>