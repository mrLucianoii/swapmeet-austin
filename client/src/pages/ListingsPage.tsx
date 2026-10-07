import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ApiError, getCategories, getListings } from "../api/listings";
import { CONDITION_LABELS } from "../types";
import type { Category, Listing } from "../types";
import { CategoryFilter } from "../components/CategoryFilter";
import { ItemCard, type BadgeColor } from "../design-system";

const CONDITION_BADGE_COLOR: Record<Listing["condition"], BadgeColor> = {
  "used-like-new": "leaf",
  "used-good": "denim",
  "used-fair": "marigold",
};

export function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Failed to load categories"));
  }, []);

  useEffect(() => {
    setError(null);
    setListings(null);
    getListings(category ?? undefined)
      .then(setListings)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Failed to load listings"));
  }, [category]);

  return (
    <div className="flex flex-col gap-token-6">
      <div>
        <h1 className="text-h1">Local finds</h1>
        <p className="text-body text-muted">Browse what people nearby are selling.</p>
      </div>

      {categories ? (
        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={(id) => setSearchParams(id ? { category: id } : {})}
        />
      ) : null}

      {error ? (
        <p role="alert" className="rounded-token-md border-[length:var(--hairline)] border-solid border-danger bg-surface p-token-4 text-body text-danger">
          Couldn't load listings: {error}
        </p>
      ) : null}

      {!error && listings === null ? <p className="text-body text-muted">Loading listings…</p> : null}

      {listings && listings.length === 0 ? <p className="text-body text-muted">No listings in this category yet.</p> : null}

      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-token-4">
          {listings.map((listing) => (
            <Link key={listing.id} to={`/listings/${listing.id}`} className="no-underline">
              <ItemCard
                price={`$${listing.price}`}
                title={listing.title}
                distance={listing.location}
                emoji={listing.emoji}
                badge={{ label: CONDITION_LABELS[listing.condition], color: CONDITION_BADGE_COLOR[listing.condition] }}
              />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
