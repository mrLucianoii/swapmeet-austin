import type { Category, Listing, NewListing, ValidationError } from "../types";

export class ApiError extends Error {}

export class ValidationFailedError extends Error {
  details: ValidationError["details"];
  constructor(details: ValidationError["details"]) {
    super("Validation failed");
    this.details = details;
  }
}

async function getJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path);
  } catch {
    throw new ApiError(`Network error while fetching ${path}`);
  }
  if (!res.ok) {
    throw new ApiError(`${path} responded ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>("/api/categories");
}

export function getListings(category?: string): Promise<Listing[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  return getJson<Listing[]>(`/api/listings${qs}`);
}

export async function getListing(id: string): Promise<Listing | null> {
  let res: Response;
  try {
    res = await fetch(`/api/listings/${encodeURIComponent(id)}`);
  } catch {
    throw new ApiError(`Network error while fetching listing ${id}`);
  }
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiError(`/api/listings/${id} responded ${res.status}`);
  }
  return res.json() as Promise<Listing>;
}

export async function createListing(newListing: NewListing): Promise<Listing> {
  let res: Response;
  try {
    res = await fetch("/api/listings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newListing),
    });
  } catch {
    throw new ApiError("Network error while posting the listing");
  }
  if (res.status === 201) {
    return res.json() as Promise<Listing>;
  }
  if (res.status === 400) {
    const body = (await res.json()) as ValidationError;
    throw new ValidationFailedError(body.details);
  }
  throw new ApiError(`POST /api/listings responded ${res.status}`);
}
