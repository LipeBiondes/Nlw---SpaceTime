import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import cors from '@fastify/cors'
const app = fastify()
app.register(memoriesRoutes)
app.register(cors, { origin: true })
app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  })
