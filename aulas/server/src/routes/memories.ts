import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request) => {
    const paramsSquema = z.object({ id: z.string().uuid() })
    const { id } = paramsSquema.parse(request.params)
    const memory = await prisma.memory.findUniqueOrThrow({ where: { id } })
    return memory
  })

  app.post('/memories', async (request) => {
    const bodySquema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })
    const { content, coverUrl, isPublic } = bodySquema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '6cff5ea1-7278-4bde-ad70-0735693d25f3',
      },
    })
    return memory
  })

  app.put('/memories/:id', async (request) => {
    const paramsSquema = z.object({ id: z.string().uuid() })
    const { id } = paramsSquema.parse(request.params)
    const bodySquema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })
    const { content, coverUrl, isPublic } = bodySquema.parse(request.body)

    const memory = await prisma.memory.update({
      where: { id },
      data: { content, coverUrl, isPublic },
    })
    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSquema = z.object({ id: z.string().uuid() })
    const { id } = paramsSquema.parse(request.params)
    await prisma.memory.delete({ where: { id } })
  })
}
