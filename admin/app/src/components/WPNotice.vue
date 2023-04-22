<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
  variant: {
    type: String as PropType<'error' | 'warning' | 'success' | 'info'>,
    default: 'error',
  },
  content: {
    type: String,
    default: '',
  },
})

</script>

<template>
  <div
    class="notice inline wp-pp-notice"
    :class="{
      'notice-error': props.variant === 'error',
      'notice-warning': props.variant === 'warning',
      'notice-success': props.variant === 'success',
      'notice-info': props.variant === 'info',
    }"
  >
    <p v-if="props.content">
      {{ content }}
    </p>
    <p v-else-if="$slots.default">
      <slot />
    </p>
  </div>
</template>
<style scoped>
.notice {
  margin: unset;
}
</style>
