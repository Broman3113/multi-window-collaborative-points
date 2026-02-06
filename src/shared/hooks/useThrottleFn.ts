import { useEffect, useMemo, useRef } from "react";

export function useThrottleFn<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number
) {
  const fnRef = useRef(fn);
  const lastRef = useRef(0);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useMemo(() => {
    return (...args: TArgs) => {
      const now = performance.now();
      if (now - lastRef.current < waitMs) return;
      lastRef.current = now;
      fnRef.current(...args);
    };
  }, [waitMs]);
}
