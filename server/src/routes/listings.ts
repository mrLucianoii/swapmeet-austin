import type { FastifyInstance } from 'fastify'
import { createListing, readCategories, readListings } from '../store.js'
import { validateNewListing } from '../validate.js'
import type { Listing } from '../types.js'

function idNumber(id: string): number {
  return Number(id.slice('lst-'.length))
}

function sortListings(listings: Listing[]): Listing[] {
  return [...listings].sort((a, b) => {
    if (a.postedAt !== b.postedAt) return a.postedAt < b.postedAt ? 1 : -1
    return idNumber(b.id) - idNumber(a.id)
  })
}

export default async function listingsRoutes(app: FastifyInstance) {
  app.get('/api/listings', async (request) => {
    const { category } = request.query as { category?: string }
    const listings = await readListings()
    const filtered = category ? listings.filter((l) => l.category === category) : listings
    const sorted = sortListings(filtered)
    request.log.info({ count: sorted.length, category: category ?? null }, 'served listings')
    return sorted
  })

  app.get('/api/listings/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const listings = await readListings()
    const listing = listings.find((l) => l.id === id)
    if (!listing) {
      return reply.code(404).send({ error: 'Listing not found', id })
    }
    return listing
  })

  app.post('/api/listings', async (request, reply) => {
    const categories = await readCategories()
    const result = validateNewListing(request.body, categories)
    if (!result.ok) {
      request.log.info({ fields: result.error.details.map((d) => d.field) }, 'listing validation failed')
      return reply.code(400).send(result.error)
    }

    const listing = await createListing({ ...result.value, emoji: result.value.emoji ?? '📦' })
    request.log.info({ id: listing.id, category: listing.category }, 'created listing')
    return reply.code(201).send(listing)
  })
}
