import type { FastifyInstance } from 'fastify'
import { readCategories } from '../store.js'

export default async function categoriesRoutes(app: FastifyInstance) {
  app.get('/api/categories', async (request) => {
    const categories = await readCategories()
    request.log.info({ count: categories.length }, 'served categories')
    return categories
  })
}
