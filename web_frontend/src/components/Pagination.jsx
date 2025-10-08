import Button from "./Button";

/**
 * PUBLIC_INTERFACE
 * Pagination: Simple previous/next pagination
 */
export default function Pagination({ page, setPage, hasNext }) {
  return (
    <div className="flex items-center justify-between mt-6">
      <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
        ← Previous
      </Button>
      <div className="text-sm text-gray-600">Page {page}</div>
      <Button variant="ghost" onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
        Next →
      </Button>
    </div>
  );
}
