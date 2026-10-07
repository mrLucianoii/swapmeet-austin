import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, getListing } from "../api/listings";
import { CONDITION_LABELS } from "../types";
import type { Listing } from "../types";
import { Badge } from "../design-system";

type LoadState = "loading" | "found" | "not-found" | "error";

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setState("loading");
    getListing(id)
      .then((result) => {
        if (result === null) {
          setState("not-found");
        } else {
          setListing(result);
          setState("found");
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Failed to load this listing");
        setState("error");
      });
  }, [id]);

  if (state === "loading") {
    return <p className="text-body text-muted">Loading listing…</p>;
  }

  if (state === "not-found") {
    return (
      <div className="flex flex-col items-start gap-token-3">
        <h1 className="text-h2">We couldn't find that listing</h1>
        <p className="text-body text-muted">It may have sold or the link may be out of date.</p>
        <Link to="/" className="rounded-token-md bg-primary px-token-4 py-token-2 text-button text-on-primary no-underline">
          Back to listings
        </Link>
      </div>
    );
  }

  if (state === "error" || !listing) {
    return (
      <p role="alert" className="rounded-token-md border-[length:var(--hairline)] border-solid border-danger bg-surface p-token-4 text-body text-danger">
        Couldn't load this listing: {error}
      </p>
    );
  }

  return (
    <article className="flex flex-col gap-token-4">
      <Link to="/" className="text-body-sm text-primary no-underline">
        ← Back to listings
      </Link>
      <div className="flex items-center gap-token-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-token-lg bg-panel text-5xl" aria-hidden="true">
          {listing.emoji}
        </div>
        <div>
          <div className="text-price">${listing.price}</div>
          <h1 className="text-h2">{listing.title}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-token-2">
        <Badge color="teal">{CONDITION_LABELS[listing.condition]}</Badge>
        <span className="text-meta text-muted">{listing.location}</span>
      </div>
      <p className="text-body">{listing.description}</p>
      <dl className="grid grid-cols-2 gap-token-2 text-body-sm text-muted">
        <dt className="text-label uppercase">Seller</dt>
        <dd>{listing.seller}</dd>
        <dt className="text-label uppercase">Posted</dt>
        <dd>{listing.postedAt}</dd>
      </dl>
    </article>
  );
}
