import { createAgent } from '@chat-tutor/agent'

export default defineEventHandler(async (event) => {
  const apiKey = process.env.API_KEY!
  const baseURL = process.env.BASE_URL!
  const model = process.env.MODELS!.split(',')[0]!
  const body = await readBody<{
    input: string
  }>(event)
  const { id } = event.context.params
  const agent = createAgent({
    apiKey,
    baseURL,
    model,
    messages: [],
    pages: [],
  })
  const stream = createEventStream(event)
  console.log(body.input)
  event.waitUntil((async () => {
    for await (const chunk of agent(body.input)) {
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
  return stream
})