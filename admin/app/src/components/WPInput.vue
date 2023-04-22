<script lang="ts" setup>

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (event: 'change', val: string): void
}>()

</script>
<template>
  <input
    :value="props.value"
    class="tw-relative tw-block tw-w-full"
    @input="(e) => emit('change', (e.target as HTMLInputElement).value)"
  >
</template>
