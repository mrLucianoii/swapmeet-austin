import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import categoriesRoutes from './routes/categories.js'
import listingsRoutes from './routes/listings.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIST = path.join(__dirname, '..', '..', 'client', 'dist')

const app = Fastify({ logger: true })

app.get('/api/health', async () => ({ status: 'ok', service: 'swapmeet-api' }))

await app.register(categoriesRoutes)
await app.register(listingsRoutes)

// Serve the built React app when client/dist exists (production mode).
// In development the Vite dev server handles the frontend and proxies /api here.
if (existsSync(CLIENT_DIST)) {
  await app.register(fastifyStatic, { root: CLIENT_DIST })

  app.setNotFoundHandler((request, reply) => {
    if (request.raw.url?.startsWith('/api')) {
      return reply.code(404).send({ error: 'Not found' })
    }
    return reply.code(200).sendFile('index.html')
  })
}

const port = Number(process.env.PORT) || 3001
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
