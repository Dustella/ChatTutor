import { createAgent } from '@chat-tutor/agent'

export default defineEventHandler(async (event) => {
  const apiKey = process.env.API_KEY!
  const baseURL = process.env.BASE_URL!
  const model = process.env.MODELS!.split(',')[0]!
  const { input } = getQuery(event)
  const { id } = event.context.params
  const agent = createAgent({
    apiKey,
    baseURL,
    model,
    messages: [],
    pages: [],
  })
  const stream = createEventStream(event)
  event.waitUntil((async () => {
    for await (const chunk of agent(input)) {
      stream.push(JSON.stringify(chunk))
      if (chunk.type === 'text') {
        console.log(chunk.options.chunk)
      } else {
        console.log(JSON.stringify(chunk, null, 2))
      }
    }
  })().then(() => {
    stream.close()
  }))
  return stream.send()
})