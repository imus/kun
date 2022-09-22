<template>
  <input 
    placeholder="please input" 
    class="el-input" 
    :value="modelValue"
    @input="onInput"
    type="text" />
</template>
<script lang="ts">
  export default {
    name: "ElInput"
  };
</script>
<script setup lang="ts">
import createEvent from "../../utils/event";

const event = createEvent();
defineProps<{
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:model-value', value: string): void
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:model-value', target.value);
  event.emit('validate');
}

</script>

<style scoped>

</style>