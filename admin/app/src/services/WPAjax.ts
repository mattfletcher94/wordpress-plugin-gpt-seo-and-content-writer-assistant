import { 
  GPT_SEO_ASSISTANT_AJAX_NONCE, 
  GPT_SEO_ASSISTANT_AJAX_BASE_URL, 
  GPT_SEO_ASSISTANT_AJAX_ACTIONS 
} from "../consts"

import type { Settings, SettingsUpdate } from "../types"


export const getSettings = async () => {
  const response = await fetchData<Settings>({
    action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.GET_SETTINGS,
    data: {},
  })
  return response
}

export const updateSettings = async (data: SettingsUpdate) => {
  const response = await fetchData<Settings>({
    action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.UPDATE_SETTINGS,
    data,
  })
  return response
}

export const askGPT = async (options: {
  pageDescription: string
  task: string
}) => {
  return await fetchData<{
      status: 'ok'
      data: string
    } | {
      status: 'error'
      error: string
  }>({
    action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.ASK_GPT,
    data: {
      page_description: options.pageDescription,
      task: options.task,
    },
  })
}

export const checkAPIKey = async () => {
  return fetchData<{
      status: 'ok'
      data: string
    } | {
      status: 'error'
      error: string
  }>({
    action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.CHECK_OPENAI_API_KEY,
    data: {},
  })
}

async function fetchData<T>({
  action,
  data,  
}: {
  action: string
  data: { [key: string]: any }
}) {
  const formData = new FormData()
  formData.append('action', action)
  formData.append('nonce', GPT_SEO_ASSISTANT_AJAX_NONCE)
  data && formData.append('data', JSON.stringify(data))
  const response = await fetch(GPT_SEO_ASSISTANT_AJAX_BASE_URL, {
    method: 'POST',
    body: formData,
    headers: { },
  })
  if (response.status !== 200) {
    throw new Error(response.statusText)
  }
  const json = await response.json()
  if (json.success === false) {
    console.error(json.data)
    throw new Error(json.data)
  }
  return json as T
}
