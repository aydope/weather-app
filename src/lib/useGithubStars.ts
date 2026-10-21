import { useEffect, useRef, useState } from "react";

const CACHE_KEY = "aftab:github-stars";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

interface StarsCache {
  repo: string;
  count: number;
  savedAt: number;
}

function readCache(repo: string): StarsCache | null {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    return cache && cache.repo === repo && typeof cache.count === "number" ? cache : null;
  } catch {
    // Storage can be blocked or hold invalid JSON. Treat both as a cache miss.
    return null;
  }
}

function writeCache(cache: StarsCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage can be blocked or full. The count is only a convenience, so skip caching.
  }
}

function whenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 1500);
  return () => window.clearTimeout(id);
}

// The star count is decorative, so it never competes with the weather requests:
// it waits until `enabled`, until the element is near the viewport, and until the browser is idle.
// A cached value (6 hours) is shown immediately and skips the request entirely.
export function useGithubStars<T extends HTMLElement>(repo: string, enabled: boolean) {
  const ref = useRef<T | null>(null);
  const [stars, setStars] = useState<number | null>(() => readCache(repo)?.count ?? null);

  useEffect(() => {
    const el = ref.current;
    const cached = readCache(repo);
    if (!enabled || !el || (cached && Date.now() - cached.savedAt < CACHE_TTL_MS)) return;

    const controller = new AbortController();
    let cancelIdle = () => {};

    const load = () => {
      fetch(`https://api.github.com/repos/${repo}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.stargazers_count === "number") {
            setStars(data.stargazers_count);
            writeCache({ repo, count: data.stargazers_count, savedAt: Date.now() });
          }
        })
        // A failed or rate-limited request just leaves the count hidden (or stale).
        .catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        cancelIdle = whenIdle(load);
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelIdle();
      controller.abort();
    };
  }, [repo, enabled]);

  return { stars, ref };
}
