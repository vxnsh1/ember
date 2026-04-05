"use server";

export async function getUserGithubProfile({ username }: { username: string }) {
  const [profile, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      cache: "no-store",
    }).then(res => res.json()),

    fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        cache: "no-store",
      }
    ).then(res => res.json()),
  ]);

  return { profile, repos };
}