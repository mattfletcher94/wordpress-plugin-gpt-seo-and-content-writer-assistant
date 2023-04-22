export type Settings = {
  gpt_seo_assistant_openai_api_key: string
  gpt_seo_assistant_business_name: string
  gpt_seo_assistant_business_description: string,
  gpt_seo_assistant_business_tonality: string
}

export type SettingsUpdate = {
  gpt_seo_assistant_openai_api_key?: string
  gpt_seo_assistant_business_name?: string
  gpt_seo_assistant_business_description?: string,
  gpt_seo_assistant_business_tonality?: string
}