<script setup lang="ts">
import type { Message } from '@/components/Chat.vue'

const input = ref('')

const messages = ref<Message[]>([])

const send = async () => {
  messages.value.push({
    type: 'user',
    content: input.value,
    id: crypto.randomUUID(),
  })
  const response = await fetch(`/api/chat/xxx`, {
    method: 'POST',
    body: JSON.stringify({ input: input.value }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  if (!response.ok) {
    throw new Error('Failed to send message')
  }
  messages.value.push({
    type: 'assistant',
    content: '',
    id: crypto.randomUUID(),
  })
  for await (const chunk of response.body!) {
    const message = JSON.parse(chunk) as Message
    if (message.type === 'text') {
      messages.value[messages.value.length - 1]!.content += message.options.chunk
    }
  }
}
</script>

<template>
  <div class="flex flex-row w-full h-full">
    <div class="flex h-full w-full p-5 items-center justify-center">Content</div>
    <div class="flex flex-col h-screen max-h-screen bg-gray-200 w-150 p-3 shadow-lg">
      <Chat :messages="messages" v-model:input="input" @keydown.enter="send" />
    </div>
  </div>
</template>