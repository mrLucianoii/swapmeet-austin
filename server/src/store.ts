import { readFile, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Category, Listing } from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const LISTINGS_FILE = path.join(DATA_DIR, 'listings.json')
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json')

export async function readListings(): Promise<Listing[]> {
  const raw = await readFile(LISTINGS_FILE, 'utf8')
  return JSON.parse(raw) as Listing[]
}

export async function readCategories(): Promise<Category[]> {
  const raw = await readFile(CATEGORIES_FILE, 'utf8')
  return JSON.parse(raw) as Category[]
}

async function writeListings(listings: Listing[]): Promise<void> {
  const tmp = `${LISTINGS_FILE}.${process.pid}.tmp`
  await writeFile(tmp, JSON.stringify(listings, null, 2) + '\n', 'utf8')
  await rename(tmp, LISTINGS_FILE)
}

function nextId(listings: Listing[]): string {
  const max = listings.reduce((acc, listing) => {
    const n = Number(listing.id.slice('lst-'.length))
    return Number.isFinite(n) && n > acc ? n : acc
  }, 0)
  return `lst-${String(max + 1).padStart(3, '0')}`
}

// Serializes writes so concurrent POSTs never race on the next id or the file contents.
let queue: Promise<unknown> = Promise.resolve()

export function createListing(input: Omit<Listing, 'id' | 'postedAt'>): Promise<Listing> {
  const task = queue.then(async () => {
    const listings = await readListings()
    const listing: Listing = {
      ...input,
      id: nextId(listings),
      postedAt: new Date().toISOString().slice(0, 10),
    }
    await writeListings([...listings, listing])
    return listing
  })
  queue = task.catch(() => undefined)
  return task
}
