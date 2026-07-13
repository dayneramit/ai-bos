import { useCallback, useRef, useState } from "react";

interface UseDocumentHistoryOptions<T> {
  onRestore: (value: T) => void;
  limit?: number;
}

/**
 * Generic undo/redo stack. The editor pushes a snapshot each time the
 * user makes a committed change (e.g. on blur / row add-remove), and
 * calls undo()/redo() to restore a snapshot via `onRestore`.
 */
export function useDocumentHistory<T>({ onRestore, limit = 50 }: UseDocumentHistoryOptions<T>) {
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncFlags = useCallback(() => {
    setCanUndo(past.current.length > 0);
    setCanRedo(future.current.length > 0);
  }, []);

  const push = useCallback(
    (snapshot: T) => {
      past.current.push(snapshot);
      if (past.current.length > limit) past.current.shift();
      future.current = [];
      syncFlags();
    },
    [limit, syncFlags]
  );

  const undo = useCallback(
    (current: T) => {
      const previous = past.current.pop();
      if (previous === undefined) return;
      future.current.push(current);
      onRestore(previous);
      syncFlags();
    },
    [onRestore, syncFlags]
  );

  const redo = useCallback(
    (current: T) => {
      const next = future.current.pop();
      if (next === undefined) return;
      past.current.push(current);
      onRestore(next);
      syncFlags();
    },
    [onRestore, syncFlags]
  );

  return { push, undo, redo, canUndo, canRedo };
}
