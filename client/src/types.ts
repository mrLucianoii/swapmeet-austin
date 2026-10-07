export type Condition = "used-like-new" | "used-good" | "used-fair";

export interface Category {
  id: string;
  label: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: Condition;
  emoji: string;
  description: string;
  seller: string;
  location: string;
  postedAt: string;
}

export type NewListing = Omit<Listing, "id" | "postedAt" | "emoji"> & {
  emoji?: string;
};

export interface ValidationError {
  error: "Validation failed";
  details: { field: keyof NewListing; message: string }[];
}

export const CONDITION_LABELS: Record<Condition, string> = {
  "used-like-new": "Like new",
  "used-good": "Good",
  "used-fair": "Fair",
};
