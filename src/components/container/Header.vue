<!--
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-20 11:01:09
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 12:29:17
-->
<template>
  <header
    class="el-header"
    :style="{ height }"
    >
    <slot></slot>
  </header>
</template>

<script lang="ts">
  export default {
    name: "ElHeader"
  };
</script>

<script setup lang="ts">
import { withDefaults } from 'vue';

interface Props {
  height?: string;
}

withDefaults(defineProps<Props>(),
  {
    height:"60px"
  }
);

</script>

<style lang="scss">
@use "../styles/mixin";


@include mixin.b(header) {
  padding: mixin.getVar('$--header-padding');
  box-sizing: border-box;
  flex-shrink: 0;
}
</style>