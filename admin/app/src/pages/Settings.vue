<script lang="ts" setup>
import WPMetaBox from '../components/WPMetaBox.vue';
import WPButton from '../components/WPButton.vue';
import WPFormGroup from '../components/WPFormGroup.vue'
import WPTextarea from '../components/WPTextarea.vue'
import WPSelect from '../components/WPSelect.vue'
import WPInput from '../components/WPInput.vue'
import WPLoadingBar from '../components/WPLoadingBar.vue';
import { computed, onMounted, ref } from 'vue';
import { getSettings, updateSettings, askGPT, checkAPIKey } from '../services/WPAjax';
import { Settings } from '../types';

const isLoading = ref(false);
const isUpdatingOpenAIKey = ref(false);
const isUpdatingSettings = ref(false);
const isTestingOpenAIKey = ref(false);
const hasAddedOpenAIKey = ref(false);

const settings = ref<Settings>({
  gpt_seo_assistant_openai_api_key: '',
  gpt_seo_assistant_business_name: '',
  gpt_seo_assistant_business_description: '',
  gpt_seo_assistant_business_tonality: 'formal',
});

const tonalityOptions = ref([
  {
    value: 'authoritative',
    label: 'Authoritative',
  },
  {
    value: 'conversational',
    label: 'Conversational',
  },
  {
    value: 'educational',
    label: 'Educational',
  },
  {
    value: 'empathetic',
    label: 'Empathetic',
  },
  {
    value: 'formal',
    label: 'Formal',
  },
  {
    value: 'humorous',
    label: 'Humorous',
  },
  {
    value: 'inspirational',
    label: 'Inspirational',
  },
  {
    value: 'informal',
    label: 'Informal',
  },
  {
    value: 'persuasive',
    label: 'Persuasive',
  },
  {
    value: 'positive',
    label: 'Positive',
  }
]);

const canUpdateSettings = computed(() => {
  return !isLoading.value && !isUpdatingSettings.value;
});

const canUpdateOpenAIKey = computed(() => {
  return !isLoading.value && !isUpdatingOpenAIKey.value && !isTestingOpenAIKey.value;
});

const handleUpdateApiKey = async () => {
  isUpdatingOpenAIKey.value = true;
  const response = await updateSettings({
    gpt_seo_assistant_openai_api_key: settings.value.gpt_seo_assistant_openai_api_key,
  });
  settings.value.gpt_seo_assistant_openai_api_key = response.gpt_seo_assistant_openai_api_key;
  hasAddedOpenAIKey.value = settings.value.gpt_seo_assistant_openai_api_key ? true : false;
  isUpdatingOpenAIKey.value = false;
}

const handleRemoveOpenAIKey = () => {
  settings.value.gpt_seo_assistant_openai_api_key = '';
  handleUpdateApiKey();
}

const handleUpdateSettings = async () => {
  isUpdatingSettings.value = true;
  const response = await updateSettings({
    gpt_seo_assistant_business_name: settings.value.gpt_seo_assistant_business_name,
    gpt_seo_assistant_business_description: settings.value.gpt_seo_assistant_business_description,
    gpt_seo_assistant_business_tonality: settings.value.gpt_seo_assistant_business_tonality,
  });
  settings.value.gpt_seo_assistant_business_name = response.gpt_seo_assistant_business_name;
  settings.value.gpt_seo_assistant_business_description = response.gpt_seo_assistant_business_description;
  settings.value.gpt_seo_assistant_business_tonality = response.gpt_seo_assistant_business_tonality;
  isUpdatingSettings.value = false;
}

const handleTestOpenAIKey = async () => {
  isTestingOpenAIKey.value = true;
  const response = await checkAPIKey();
  if (response.status === 'ok') {
    alert('OpenAI API Key is valid!');
  } else {
    alert(`Error: ${response.error}`);
  }
  isTestingOpenAIKey.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  const response = await getSettings();
  settings.value = {
    ...settings.value,
    ...response,
  };
  isLoading.value = false;
  hasAddedOpenAIKey.value = settings.value.gpt_seo_assistant_openai_api_key ? true : false;
})

</script>
<template>
  <div class="tw-flex tw-gap-4">
    <div class="tw-flex-1">
      <WPMetaBox>
        <template #title>
          <div>
            <div class="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-primary-500 tw-text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="tw-w-4 tw-h-4">
                <path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="!tw-p-0">
              Setting up Open AI
            </h2>
          </div>
        </template>
        <template #content>
          <div class="tw-relative tw-block tw-w-full">
            <div class="tw-absolute tw-top-0 tw-left-0 tw-w-full">
              <WPLoadingBar v-if="isLoading || isUpdatingOpenAIKey" />
            </div>
            <div class="tw-relative tw-block tw-w-full tw-p-6">
              <div>
                <p class="tw-p-0">
                  In order to use GPT SEO Assistant, you need to get an API key from OpenAI. 
                  Your API key is used to communicate with OpenAI's servers which 
                  is where the AI magic happens.
                </p>
                <WPButton class="!tw-mt-4" as="a" variant="secondary" href="https://platform.openai.com/account/api-keys" target="_blank">
                  Get your API key from OpenAI
                </WPButton>
              </div>
              <div class="tw-mt-6">
                <WPFormGroup
                  for="business-name"
                  title="OpenAI API Key"
                >
                  <div class="tw-flex tw-items-center tw-gap-2">
                    <WPInput
                      v-if="!hasAddedOpenAIKey"
                      class="tw-h-8"
                      type="text"
                      :disabled="!canUpdateSettings"
                      placeholder="E.g. sk-xxxxxxxxxxxxxxxxx"
                      :value="settings.gpt_seo_assistant_openai_api_key"
                      @change="(val) => settings.gpt_seo_assistant_openai_api_key = val"
                    />
                    <WPInput
                      v-else
                      type="password"
                      class="tw-h-8"
                      placeholder=""
                      :value="settings.gpt_seo_assistant_openai_api_key"
                      readonly
                    />
                    <div>
                      <WPButton
                        v-if="!hasAddedOpenAIKey"
                        class="tw-h-8 !tw-py-0 tw-whitespace-nowrap"
                        :disabled="!settings.gpt_seo_assistant_openai_api_key || !canUpdateOpenAIKey"
                        @click="handleUpdateApiKey()"
                      >
                        Save API Key
                      </WPButton>
                      <WPButton
                        v-else
                        variant='secondary'
                        class="tw-h-8 !tw-py-0 tw-whitespace-nowrap"
                        :disabled="!canUpdateOpenAIKey"
                        @click="handleRemoveOpenAIKey()"
                      >
                        Remove API Key
                      </WPButton>
                    </div>
                    <div v-if="hasAddedOpenAIKey">
                      <WPButton
                        variant='secondary'
                        class="tw-h-8 !tw-py-0 tw-whitespace-nowrap"
                        :disabled="!canUpdateOpenAIKey"
                        @click="handleTestOpenAIKey()"
                      >
                        Test API Key
                      </WPButton>
                    </div>
                  </div>
                </WPFormGroup>
              </div>
              <div class="tw-mt-6 tw-pt-6 tw-border-t tw-border-t-gray-300">
                <h2 class="!tw-p-0 !tw-font-medium">
                  Open AI FAQs 
                </h2>
                <details class="tw-mt-2">
                  <summary class="tw-font-medium tw-cursor-pointer">How much does OpenAI cost?</summary>
                  <p>OpenAI offers a very affordable pricing structure. You only pay for what you use, with prices based on the number of words generated. At the current rate, you can expect to pay approximately $1 for every 100,000 words. Plus, you can set limits on how much you want to spend to stay within your budget.</p>
                </details>
                <details class="tw-mt-2">
                  <summary class="tw-font-medium tw-cursor-pointer">How is my API key used?</summary>
                  <p>Your API key is securely stored in your WordPress database and is sent directly to the Open AI API. We do not send your API Key through any third party services.</p>
                </details>
                <details class="tw-mt-2">
                  <summary class="tw-font-medium tw-cursor-pointer">How do I test my API key?</summary>
                  <p>You can easily test your API key to ensure it's working by clicking the "Save API Key" button. If the key is valid, you'll see a success message, confirming that you're all set to use the OpenAI API.</p>
                </details>
                <details class="tw-mt-2">
                  <summary class="tw-font-medium tw-cursor-pointer">What should I do if my API key isn't working?</summary>
                  <p>If your API key isn't working, there are a few things you can check. First, make sure you haven't exceeded your budget. You can easily track your usage within the OpenAI dashboard. Additionally, you must enter your billing information on OpenAI before you can use their API, so double-check that you've completed this step.</p>
                </details>
              </div>
            </div>
          </div>
        </template>
      </WPMetaBox>
      <WPMetaBox class="tw-mt-6">
        <template #title>
          <div>
            <div class="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-primary-500 tw-text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="tw-w-4 tw-h-4">
                <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clip-rule="evenodd" />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="!tw-p-0">
              Business details
            </h2>
          </div>
        </template>
        <template #content>
          <div class="tw-relative tw-block tw-w-full">
            <div class="tw-absolute tw-top-0 tw-left-0 tw-w-full">
              <WPLoadingBar v-if="isLoading || isUpdatingSettings" />
            </div>
            <div class="tw-relative tw-block tw-w-full tw-p-6">
              <div>
                <p class="tw-p-0">
                  In order to use AI Assitant effectively, you need to provide some basic information about your business or website.
                  This information will be used to generate more relevant responses.
                </p>
              </div>
              <div class="tw-mt-6">
                <WPFormGroup
                  for="business-name"
                  title="Business/Website name (max 100 characters)"
                >
                  <WPInput
                    id="business-name"
                    class="tw-h-8"
                    type="text"
                    maxlength="100"
                    placeholder="Enter your business/website name..."
                    :value="settings.gpt_seo_assistant_business_name"
                    @change="(val) => settings.gpt_seo_assistant_business_name = val"
                  />
                </WPFormGroup>
              </div>
              <div class="tw-mt-6">
                <WPFormGroup
                  for="business-description"
                  title="Describe your business in a couple of sentences (max 500 characters)"
                >
                  <WPTextarea
                    id="business-description"
                    type="text"
                    maxlength="500"
                    :disabled="isLoading"
                    placeholder="Description..."
                    :value="settings.gpt_seo_assistant_business_description"
                    @change="(val) => settings.gpt_seo_assistant_business_description = val"
                  />
                </WPFormGroup>
              </div>
              <div class="tw-mt-6">
                <WPFormGroup
                  for="business-tonality"
                  title="Tone of your business"
                  description="What is the tone of your business? Is it formal, casual, or something else?"
                >
                  <WPSelect
                    id="business-tonality"
                    :options="tonalityOptions"
                    :value="settings.gpt_seo_assistant_business_tonality"
                    @change="(val) => settings.gpt_seo_assistant_business_tonality = val"
                  />
                </WPFormGroup>
              </div>
              <div class="tw-mt-6">
                <WPButton
                  :disabled="!canUpdateSettings"
                  @click="handleUpdateSettings()"
                >
                  Save changes
                </WPButton>
              </div>
            </div>
          </div>
        </template>
      </WPMetaBox>
    </div>
    <div class="tw-w-full md:tw-w-[350px]">
      <WPMetaBox>
        <template #title>
          <div>
            <h2 class="!tw-p-0">
              👋 Enjoying this plugin?
            </h2>
          </div>
        </template>
        <template #content>
          <div class="tw-relative tw-block tw-w-full">
            <div class="tw-relative tw-block tw-w-full tw-p-6">
              <div>
                <p class="tw-p-0">
                  Thank you for using our GPT-powered SEO and content writing plugin! We hope it has made your content creation experience more efficient and enjoyable. If you find our plugin helpful and would like to support its ongoing development and maintenance, please consider making a donation.
                </p>
              </div>
              <div class="tw-mt-6">
                <WPButton
                  variant="secondary"
                  target="_blank"
                  as="a"
                  href="https://www.paypal.com/donate/?hosted_button_id=ZM78S72YLNBH8"
                >
                    <svg class="tw-inline tw-align-middle" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.351.351 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91.379-.27.712-.603.993-1.005a4.942 4.942 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.687 2.687 0 0 0-.76-.59l-.094-.061zM6.543 8.82l-.845 5.213v.001l-.208 1.32c-.01.066.04.123.105.123H8.14c.173 0 .32-.125.348-.296v-.005l.026-.129.48-3.043.03-.164a.873.873 0 0 1 .862-.734h.38c1.201 0 2.24-.244 3.043-.815.797-.567 1.39-1.477 1.663-2.874.229-1.175.096-2.087-.45-2.71a2.126 2.126 0 0 0-.548-.438l-.003.016c-.645 3.312-2.853 4.456-5.672 4.456H6.864a.695.695 0 0 0-.321.079z"></path></svg>
                    Donate with PayPal
                </WPButton>
              </div>
            </div>
          </div>
        </template>
      </WPMetaBox>
    </div>
  </div>
</template>