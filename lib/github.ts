"use server";

type GithubRepo = {
  name?: string;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  description?: string | null;
};

type GithubProfile = {
  login: string;
  name?: string | null;
  bio?: string | null;
  followers?: number;
  following?: number;
  public_repos?: number;
  created_at: string;
};

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function getUserGithubProfile({ username }: { username: string }) {
  const safe = encodeURIComponent(username);
  const headers = githubHeaders();

  const [profileRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${safe}`, {
      headers,
      cache: "no-store",
    }),
    fetch(
      `https://api.github.com/users/${safe}/repos?sort=updated&per_page=10`,
      { headers, cache: "no-store" },
    ),
  ]);

  const profileJson: unknown = await profileRes.json();
  const reposJson: unknown = await reposRes.json();

  const profile =
    profileRes.ok &&
    profileJson &&
    typeof profileJson === "object" &&
    "login" in profileJson &&
    typeof (profileJson as { login: unknown }).login === "string"
      ? (profileJson as GithubProfile)
      : null;

  const repos: GithubRepo[] =
    reposRes.ok && Array.isArray(reposJson) ? reposJson : [];

  return { profile, repos };
}
