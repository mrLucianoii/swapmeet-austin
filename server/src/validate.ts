import type { Category, NewListing, ValidationError } from './types.js'

const CONDITIONS = ['used-like-new', 'used-good', 'used-fair'] as const

interface FieldError {
  field: keyof NewListing
  message: string
}

type ValidationResult =
  | { ok: true; value: NewListing }
  | { ok: false; error: ValidationError }

function trimmedLength(value: unknown): number | null {
  return typeof value === 'string' ? value.trim().length : null
}

function inRange(length: number | null, min: number, max: number): boolean {
  return length !== null && length >= min && length <= max
}

export function validateNewListing(body: unknown, categories: Category[]): ValidationResult {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const categoryIds = new Set(categories.map((c) => c.id))
  const errors: FieldError[] = []

  if (!inRange(trimmedLength(input.title), 3, 80)) {
    errors.push({ field: 'title', message: 'title must be 3-80 characters' })
  }
  if (!(typeof input.price === 'number' && Number.isInteger(input.price) && input.price >= 0 && input.price <= 1_000_000)) {
    errors.push({ field: 'price', message: 'price must be an integer between 0 and 1,000,000' })
  }
  if (!(typeof input.category === 'string' && categoryIds.has(input.category))) {
    errors.push({ field: 'category', message: 'category must be one of the known category ids' })
  }
  if (!(typeof input.condition === 'string' && (CONDITIONS as readonly string[]).includes(input.condition))) {
    errors.push({ field: 'condition', message: 'condition must be one of used-like-new, used-good, used-fair' })
  }
  if (!inRange(trimmedLength(input.description), 10, 1000)) {
    errors.push({ field: 'description', message: 'description must be 10-1000 characters' })
  }
  if (!inRange(trimmedLength(input.seller), 2, 60)) {
    errors.push({ field: 'seller', message: 'seller must be 2-60 characters' })
  }
  if (!inRange(trimmedLength(input.location), 2, 60)) {
    errors.push({ field: 'location', message: 'location must be 2-60 characters' })
  }
  if (input.emoji !== undefined && !(typeof input.emoji === 'string' && input.emoji.length <= 8)) {
    errors.push({ field: 'emoji', message: 'emoji must be a string of at most 8 UTF-16 units' })
  }

  if (errors.length > 0) {
    return { ok: false, error: { error: 'Validation failed', details: errors } }
  }

  const value: NewListing = {
    title: (input.title as string).trim(),
    price: input.price as number,
    category: input.category as string,
    condition: input.condition as NewListing['condition'],
    description: (input.description as string).trim(),
    seller: (input.seller as string).trim(),
    location: (input.location as string).trim(),
    ...(typeof input.emoji === 'string' ? { emoji: input.emoji.trim() } : {}),
  }

  return { ok: true, value }
}
