<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { nextTick, ref, watch } from 'vue'
import IconClose from './IconClose.vue'
import WPLoadingBar from './WPLoadingBar.vue'

// Props
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '600px',
  },
  title: {
    type: String,
    default: '',
  },
  busy: {
    type: Boolean,
    default: false,
  },
})

// Emit
const emit = defineEmits<{
  (event: 'close'): void
}>()

// HTML Refs
const dialogHeader = ref<null | HTMLElement>(null)
const dialogContent = ref<null | HTMLElement>(null)
const dialogFooter = ref<null | HTMLElement>(null)

// COntent height
const contentHeight = ref('calc(100vh- 4rem')

// Watch open prop
watch(() => props.open, async (open) => {
  if (!open)
    return

  await nextTick()
  const headerHeight = Math.ceil(dialogHeader.value?.getBoundingClientRect().height || 0)
  const footerHeight = Math.ceil(dialogFooter.value?.getBoundingClientRect().height || 0)
  contentHeight.value = `calc(100vh - ${headerHeight}px - ${footerHeight}px - 14rem)`
})

const handleClose = () => {
  if (!props.busy)
    emit('close')
}
</script>

<template>
  <TransitionRoot
    appear
    :show="props.open"
    as="template"
  >
    <Dialog
      as="div"
      @close="() => handleClose()"
    >
      <div class="tw-fixed tw-inset-0 tw-overflow-hidden tw-flex tw-item-center tw-justify-center tw-h-screen tw-p-8 tw-z-[99999]">
        <TransitionChild
          as="template"
          enter="tw-duration-200 tw-ease-out"
          enter-from="tw-opacity-0"
          enter-to="tw-opacity-100"
          leave="tw-duration-200 tw-ease-in"
          leave-from="tw-opacity-100"
          leave-to="tw-opacity-0"
        >
          <DialogOverlay
            class="tw-fixed tw-inset-0 tw-bg-slate-800/70"
          />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="tw-duration-200 tw-ease-in-out"
          enter-from="tw-opacity-0 tw-scale-75"
          enter-to="tw-opacity-100 tw-scale-100"
          leave="tw-duration-200 tw-ease-in-out"
          leave-from="tw-opacity-100 tw-scale-100"
          leave-to="tw-opacity-0 tw-scale-75"
        >
          <div
            class="dialog"
            :style="{ maxWidth: props.width }"
          >
            <WPLoadingBar
              v-if="busy"
              class="!tw-absolute tw-top-0 tw-left-0 tw-z-10"
            />
            <div class="tw-flex tw-flex-col-reverse">
              <div v-if="$slots.content" ref="dialogContent" class="dialog-content" :style="{ maxHeight: contentHeight }">
                <slot name="content" />
              </div>
              <div v-if="$slots.header || props.title" ref="dialogHeader" class="dialog-header">
                <div class="tw-flex tw-w-full tw-gap-4 tw-items-center tw-justify-start">
                  <div class="tw-w-full">
                    <template v-if="$slots.header">
                      <slot name="header" />
                    </template>
                    <template v-else>
                      <h2 class="tw-text-base tw-font-bold">
                        {{ props.title }}
                      </h2>
                    </template>
                  </div>
                  <div class="tw-ml-auto">
                    <button
                      type="button"
                      title="Close"
                      class="tw-btn tw-flex tw-items-center tw-justify-center tw-text-gray-900 tw-rounded-full tw-w-8 tw-h-8 tw-p-0 !tw-outline-none tw-transition-colors tw-bg-transparent hover:tw-bg-gray-200 focus:tw-bg-gray-200"
                      :disabled="props.busy"
                      @click="() => handleClose()"
                    >
                      <IconClose class="tw-h-5 tw-w-5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
            <div>
              <div v-if="$slots.footer" ref="dialogFooter" class="dialog-footer">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style>
.dialog {
  @apply
    tw-relative
    tw-block
    tw-my-auto
    tw-mx-auto
    tw-w-full
    tw-rounded-md
    tw-bg-white
    tw-shadow-md;
  max-height: calc(100% - 6rem);
}
.dialog-header {
  @apply
    tw-flex
    tw-items-center
    tw-justify-between
    tw-px-6
    tw-py-3
    tw-border-b
    tw-border-b-slate-200;
}
.dialog-footer {
  @apply tw-block tw-w-full tw-border-t tw-border-t-slate-200;
}
.dialog-content {
  @apply tw-block tw-w-full tw-overflow-y-auto tw-overflow-x-hidden tw-p-6;
}

.dialog-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: rgba(255,255,255,0.8);
}
.dialog-content::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.3);
  @apply tw-rounded-lg;
}
</style>
