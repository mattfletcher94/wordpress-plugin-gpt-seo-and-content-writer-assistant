<script lang="ts" setup>

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})

</script>
<template>
  <div class="postbox">
    <div class="postbox-header postbox-header-vue !tw-font-semibold !tw-flex !tw-items-center !tw-justify-start !tw-gap-4 !tw-p-4">
      <h2 v-if="props.title" class="tw-font-semibold !tw-p-0">
        {{ props.title }}
      </h2>
      <slot v-else-if="$slots.title" name="title" />
    </div>
    <div class="inside !tw-p-0 !tw-m-0">
      <slot name="content" />
    </div>
  </div>
</template>

<style>
.postbox-header-vue h2+* {
  display: none !important;
}
</style>
