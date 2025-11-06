import { db } from '#shared/db'
import { chat } from '#shared/db/chat'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as { limit: string, offset: string }
  const limit = parseInt(query.limit ?? '100')
  const offset = parseInt(query.offset ?? '0')
  const chats = await db.select({
    id: chat.id,
    title: chat.title,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    status: chat.status,
  }).from(chat).orderBy(desc(chat.createdAt)).limit(limit).offset(offset)
  return chats
})