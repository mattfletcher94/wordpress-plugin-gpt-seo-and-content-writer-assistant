<script setup lang="ts">
import Metabox from './pages/Metabox.vue';
import Settings from './pages/Settings.vue';

const props = defineProps<{
  type: 'settings' | 'metabox';
}>();

</script>
<template>
  <div id="wpAIAssistantWrap">
    <div v-if="props.type === 'settings'" class="wrap">
      <div id="poststuff">
        <Settings />
      </div>
    </div>
    <div v-if="props.type === 'metabox'">
      <Metabox />
    </div>
  </div>
</template>

<style>
#wpAIAssistantWrap {
  position: relative;
  display: block;
  width: 100%;
}

#wpAIAssistantWrap svg {
  display: inline;
  vertical-align: middle;
}

#wpAIAssistantMetaBox .inside {
  padding: 0px;
  margin: 0px;
} 
</style>
