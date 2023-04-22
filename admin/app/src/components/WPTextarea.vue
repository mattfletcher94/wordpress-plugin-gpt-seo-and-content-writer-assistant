<script lang="ts" setup>

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
})

const emit = defineEmits<{
  (event: 'change', val: string): void
}>()

</script>
<template>
  <textarea
    :value="props.value"
    class="tw-relative tw-block tw-w-full !tw-p-[8px] tw-whitespace-pre-wrap"
    :rows="props.rows"
    @input="(e) => emit('change', (e.target as HTMLInputElement).value)"
  />
</template>
