<script lang="ts" setup>

const props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (event: 'change', val: boolean): void
}>()

</script>
<template>
  <div class="tw-relative tw-block tw-w-full">
    <input
      :id="props.id"
      type="checkbox"
      :checked="props.checked"
      class="tw-relative tw-inline-block tw-align-top"
      @input="(e) => emit('change', (e.target as HTMLInputElement).checked)"
    >
    <label
      v-if="props.label"
      :for="props.id"
      class="tw-relative tw-inline-block tw-ml-1 tw-align-middle"
    >
      {{ props.label }}
    </label>
  </div>
</template>
