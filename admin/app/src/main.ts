import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

declare global {
  interface Window {
    gpt_seo_assistant_ajax: { 
      url: string; 
      nonce: string 
    };
  }
}


const settingsElement = document.getElementById('wpGPTSEOAssistant');
const metaBoxElement = document.querySelector('#wpAIAssistantMetaBox .inside #wpAIAssistantMetaBoxVueApp');
if (settingsElement || metaBoxElement) {
  
  if (settingsElement) {
    const app = createApp(App, {
      type: 'settings'
    })
    app.mount(settingsElement)
  }

  else if (metaBoxElement) {
    const app = createApp(App, {
      type: 'metabox'
    })
    app.mount(metaBoxElement)
  }
}