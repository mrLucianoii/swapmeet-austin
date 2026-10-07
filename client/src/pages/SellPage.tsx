import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, createListing, getCategories, ValidationFailedError } from "../api/listings";
import type { Category, Condition, NewListing } from "../types";
import { FormField, fieldInputClass } from "../components/FormField";
import { Button } from "../design-system";

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "used-like-new", label: "Like new" },
  { value: "used-good", label: "Good" },
  { value: "used-fair", label: "Fair" },
];

type FieldErrors = Partial<Record<keyof NewListing, string>>;

export function SellPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState<Condition>("used-good");
  const [description, setDescription] = useState("");
  const [seller, setSeller] = useState("");
  const [location, setLocation] = useState("");
  const [emoji, setEmoji] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        setCategories(cats);
        setCategory((current) => current || cats[0]?.id || "");
      })
      .catch((err: unknown) => setCategoriesError(err instanceof ApiError ? err.message : "Failed to load categories"));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);

    const payload: NewListing = {
      title,
      price: Number(price),
      category,
      condition,
      description,
      seller,
      location,
      ...(emoji ? { emoji } : {}),
    };

    try {
      const created = await createListing(payload);
      navigate(`/listings/${created.id}`);
    } catch (err) {
      if (err instanceof ValidationFailedError) {
        const next: FieldErrors = {};
        for (const detail of err.details) next[detail.field] = detail.message;
        setFieldErrors(next);
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-token-6">
      <div>
        <h1 className="text-h1">Sell something</h1>
        <p className="text-body text-muted">Found it a new home. Takes a minute.</p>
      </div>

      {categoriesError ? (
        <p role="alert" className="rounded-token-md border-[length:var(--hairline)] border-solid border-danger bg-surface p-token-4 text-body text-danger">
          Couldn't load categories: {categoriesError}
        </p>
      ) : null}

      {formError ? (
        <p role="alert" className="rounded-token-md border-[length:var(--hairline)] border-solid border-danger bg-surface p-token-4 text-body text-danger">
          {formError}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-token-4">
        <FormField label="Title" htmlFor="title" error={fieldErrors.title}>
          <input id="title" className={fieldInputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormField>

        <FormField label="Price (USD)" htmlFor="price" error={fieldErrors.price}>
          <input
            id="price"
            type="number"
            min={0}
            step={1}
            className={fieldInputClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Category" htmlFor="category" error={fieldErrors.category}>
          <select id="category" className={fieldInputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Condition" htmlFor="condition" error={fieldErrors.condition}>
          <select
            id="condition"
            className={fieldInputClass}
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Description" htmlFor="description" error={fieldErrors.description}>
          <textarea
            id="description"
            className={fieldInputClass}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Your name" htmlFor="seller" error={fieldErrors.seller}>
          <input id="seller" className={fieldInputClass} value={seller} onChange={(e) => setSeller(e.target.value)} required />
        </FormField>

        <FormField label="Location" htmlFor="location" error={fieldErrors.location}>
          <input
            id="location"
            className={fieldInputClass}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Emoji (optional)" htmlFor="emoji" error={fieldErrors.emoji}>
          <input
            id="emoji"
            className={fieldInputClass}
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={8}
            placeholder="📦"
          />
        </FormField>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Posting…" : "Post listing"}
        </Button>
      </form>
    </div>
  );
}
