<!--
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-19 16:20:26
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 10:54:12
-->
<template>
  <section
    class="el-container"
    :class="{'is-vertical': isVertical}"
    >
    <slot />
  </section>
</template>

<script lang="ts">
export default {
  name: 'ElContainer' // name只能通过options设置
}
</script>

<script setup lang="ts">
import { useSlots, computed, VNode, Component } from 'vue';

interface Props {
  direction?: string
}
const props = defineProps<Props>();
const slots = useSlots();

const isVertical = computed(() => {
  if (slots?.default) {
    return slots.default().some((vNode:VNode) => {
      const tag = (vNode.type as Component).name;

      return tag === 'ElHeader' || tag === 'ElFooter';
    });
  } else {
    return props.direction === 'vertical';
  }

});

</script>

<style lang="scss">
@use "../styles/mixin";

@include mixin.b(container) {
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
  @include mixin.when(vertical) {
    flex-direction: column;
  }
}
</style>