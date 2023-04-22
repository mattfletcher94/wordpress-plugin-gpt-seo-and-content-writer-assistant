<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import WPButton from '../components/WPButton.vue';
import WPFormGroup from '../components/WPFormGroup.vue'
import WPTextarea from '../components/WPTextarea.vue'
import Dialog from '../components/Dialog.vue';
import { askGPT, getSettings } from '../services/WPAjax';
import { Settings } from '../types';
import GenerateIcon from '../components/GenerateIcon.vue';
import { GPT_SEO_ASSISTANT_TASKS } from '../consts';
import WPSelect from '../components/WPSelect.vue';
import WPNotice from '../components/WPNotice.vue';

const pageDescription = ref('');
const pageDescriptionInput = ref<HTMLInputElement>(document.querySelector('#gpt_seo_assistant_page_description') as HTMLInputElement);

const isLoading = ref(false);
const isGenerating = ref(false);
const isDialogOpen = ref(false);

const tasks = ref([
  {
    label: 'Content: Heading 1',
    value: GPT_SEO_ASSISTANT_TASKS.H1,
  },
  {
    label: 'Content: Heading 2',
    value: GPT_SEO_ASSISTANT_TASKS.H2,
  },
  {
    label: 'Content: Paragraph',
    value: GPT_SEO_ASSISTANT_TASKS.PARAGRAPH,
  },
  {
    label: 'Content: Blog Post',
    value: GPT_SEO_ASSISTANT_TASKS.BLOG_POST,
  },
  {
    label: 'SEO: Title',
    value: GPT_SEO_ASSISTANT_TASKS.TITLE,
  },
  {
    label: 'SEO: Meta Description',
    value: GPT_SEO_ASSISTANT_TASKS.META_DESCRIPTION,
  },
  {
    label: 'SEO: Meta Keywords',
    value: GPT_SEO_ASSISTANT_TASKS.META_KEYWORDS,
  },
  {
    label: 'SEO: Slug',
    value: GPT_SEO_ASSISTANT_TASKS.SLUG,
  },
])

const selectedTask = ref(GPT_SEO_ASSISTANT_TASKS.H1);

const generatedContent = ref('');
const generatedContentEdited = ref(false);
const generatedContentError = ref('');

const settings = ref<Settings>({
  gpt_seo_assistant_openai_api_key: '',
  gpt_seo_assistant_business_name: '',
  gpt_seo_assistant_business_description: '',
  gpt_seo_assistant_business_tonality: '',
});

const isSettingsMissing = computed(() => {
  return !settings.value.gpt_seo_assistant_openai_api_key
    || !settings.value.gpt_seo_assistant_business_name
    || !settings.value.gpt_seo_assistant_business_description
});

const generateContent = async () => {

  if (isGenerating.value) return;

  isGenerating.value = true;

  generatedContentError.value = '';
  generatedContentEdited.value = false;

  try {
    const response = await askGPT({
      pageDescription: pageDescription.value,
      task: selectedTask.value,
    });

    if (response.status === 'ok' && response.data) {
      generatedContent.value = response.data;
      return
    }

    generatedContent.value = '';
    generatedContentError.value = 'Sorry, an error occurred. Please try again.';

  } catch (e) {

    generatedContent.value = '';
    generatedContentError.value = 'Sorry, an error occurred. Please make sure your API key is valid.';
  
  } finally {
  
    isGenerating.value = false;
  
  }
}

const handlePageDescriptionChange = (val: string) => {
  pageDescription.value = val;
  pageDescriptionInput.value.setAttribute('value', val);
}

const handleEditGeneratedContent = (val: string) => {
  generatedContent.value = val;
  generatedContentEdited.value = true;
}

const handleCopyAndClose = () => {
  if (generatedContent.value) {
    try {
      navigator.clipboard.writeText(generatedContent.value);
    } catch (e) { }
  }
  isDialogOpen.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  const response = await getSettings();
  settings.value = {
    ...settings.value,
    ...response,
  };
  pageDescription.value = pageDescriptionInput.value.getAttribute('value') || '';
  isLoading.value = false;
})

</script>
<template>
  <div v-if="isLoading" class="tw-relative tw-block tw-w-full tw-p-4 tw-min-h-[170px]">
    <p>Loading...</p>
  </div>
  <div v-else-if="isSettingsMissing" class="tw-relative tw-block tw-w-full tw-p-4">
    <h3 class="tw-font-bold">
      Please configure the plugin settings
    </h3>
    <p class="tw-text-sm tw-mt-2">
      You need to configure the plugin settings before you can use the GPT SEO Assistant.
    </p>
    <div class="tw-mt-4">
      <WPButton
        variant="secondary"
        class='tw-w-full tw-text-center'
        as="a"
        href="/wp-admin/admin.php?page=gpt-seo-assistant-admin"
      >
        Configure plugin settings
      </WPButton>
    </div>
  </div>
  <div v-else class="tw-relative tw-block tw-w-full tw-p-4">
    <div>
      <WPFormGroup 
        title="Page Description"
        description="Enter a short description of the page you want to generate content for. This will help the AI generate more relevant content."
      >
        <WPTextarea
          :disabled="isGenerating"
          placeholder="E.g. This page is about the best WordPress plugins for SEO. It contains a list of the top 10 plugins and a short description of each one..."
          :value="pageDescription"
          maxlength="500"
          :rows="5"
          @change="(val) => handlePageDescriptionChange(val)"
        />
      </WPFormGroup>
    </div>
    <div class="tw-mt-4">
      <WPButton
        variant="secondary"
        type="button"
        class='tw-flex tw-items-center tw-w-full'
        @click="() => isDialogOpen = true"
      >
        <div class="tw-mr-2">
          <GenerateIcon class="tw-w-4 tw-h-4" />
        </div>
        <div>
          Generate Content
        </div>
      </WPButton>
      <Dialog
        :open="isDialogOpen"
        @close="() => isDialogOpen = false"
      >
        <template #header>
          <div class="tw-flex tw-items-center tw-gap-2">
            <div>
              <div class="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-primary-500 tw-text-white">
                <GenerateIcon class="tw-w-4 tw-h-4" />
              </div>
            </div>
            <div>
              <h2 class="!tw-p-0 tw-font-medium tw-text-[16px]">
                GPT SEO Assistant
              </h2>
            </div>
          </div>
        </template>
        <template #content>
          <div>
            <WPNotice
              v-if="generatedContentError"
              class="!tw-block !tw-mb-4"
              variant="error"
              :content="generatedContentError"
            />
            <div class="tw-flex tw-items-end tw-gap-2">
              <WPFormGroup
                for="generate-content-task"
                title="Generate content for..."
              >
                <WPSelect
                  id="generate-content-task"
                  :disabled="isGenerating"
                  :options="tasks"
                  :value="selectedTask"
                  @change="(val) => selectedTask = val"
                />
              </WPFormGroup>
              <WPButton
                class="tw-h-8 !tw-py-0 tw-whitespace-nowrap tw-flex tw-items-center"
                variant="primary"
                type="button"
                :disabled="isGenerating"
                @click="() => generateContent()"
              >
                <div class="tw-mr-2">
                  <GenerateIcon class="tw-w-4 tw-h-4" />
                </div>
                <div>
                  Generate Content
                </div>
              </WPButton>
            </div>
            <WPFormGroup
              for="generated-content"
              title="Generated content"
              description="This is the content generated by GPT. You can edit it before copying and pasting it into your page."
              class="tw-mt-4"
            >
              <WPTextarea
                v-if="!isGenerating"
                id="generated-content"
                class="tw-h-[180px]"
                :value="generatedContent"
                @change="(val) => handleEditGeneratedContent(val)"
              />
              <div
                v-else
                class="tw-flex tw-items-center tw-justify-center tw-h-[180px] tw-rounded-md tw-p-4 tw-border tw-border-solid tw-border-[#8c8f94]"
              >
                <div class="tw-flex tw-flex-col tw-align-center tw-justify-center tw-gap-2">
                  <p>Generating content...</p>
                  <svg aria-hidden="true" class="tw-block tw-mx-auto tw-w-8 tw-h-8 tw-text-gray-300 tw-animate-spin tw-fill-primary-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
                
              </div>
            </WPFormGroup>
            <div class="tw-mt-4 tw-flex tw-justify-end tw-gap-2">
              <WPButton
                variant="secondary"
                type="button"
                :disabled="isGenerating"
                @click="() => isDialogOpen = false"
              >
                Close
              </WPButton>
              <WPButton
                variant="primary"
                type="button"
                :disabled="isGenerating || !generatedContent"
                @click="() => handleCopyAndClose()"
              >
                Copy Content and Close
              </WPButton>
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>