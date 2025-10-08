import { useEffect, useMemo, useState } from "react";
import { fetchNotes } from "../lib/db";

/**
 * PUBLIC_INTERFACE
 * useNotes: abstracts note fetching with filters and pagination
 */
export function useNotes({ q, tag, sort, page, pageSize = 12 }) {
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchNotes({ q, tag, sort, limit: pageSize, offset })
      .then(({ items, total }) => {
        if (!active) return;
        setNotes(items);
        setCount(total);
      })
      .catch(() => {
        if (active) {
          setNotes([]);
          setCount(0);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [q, tag, sort, pageSize, offset]);

  return { notes, count, loading, hasNext: (offset + notes.length) < count };
}
