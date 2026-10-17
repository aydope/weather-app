import { useEffect, useState } from "react";

export function useGithubStars(repo: string) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${repo}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === "number")
          setStars(data.stargazers_count);
      })
      // The count is decorative. A failed or rate-limited request just hides it.
      .catch(() => {});
    return () => controller.abort();
  }, [repo]);

  return stars;
}
