<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<Array<{ value: string; label: string }>>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: 'change', val: string): void
}>()

</script>

<template>
  <select
    class="tw-relative tw-block tw-w-full !tw-max-w-none"
    :value="props.value"
    @input="(e) => emit('change', (e.target as HTMLInputElement).value)"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :selected="option.value === props.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
