"use server";

import { roastModes } from "@/data/roast";
import { getUserGithubProfile } from "@/lib/github";
import generateResponse from "@/lib/model";


export default async function analyzeGithub({ username, roastModeId }: { username?: string; roastModeId?: string }) {
  if (!username || !roastModeId) {
    throw new Error("Username and roast mode are required");
  }

  const mode = roastModes.find((m) => m.id === roastModeId);
  if (!mode) throw new Error("Invalid roast mode selected");

  const { profile, repos } = await getUserGithubProfile({ username });
  if (!profile) return `User ${username} not found`;
  if (!repos || repos.length === 0) return `User ${username} has no repositories`;

  const data = `
User: ${profile.login} (${profile.name || "N/A"})
Bio: "${profile.bio || "N/A"}"
Stats: ${profile.followers ?? 0} followers, ${profile.following ?? 0} following.
Total Repos: ${profile.public_repos ?? 0}.
Account Age: Created in ${new Date(profile.created_at).getFullYear()}.

Recent Repositories:
${repos.map((repo: any, i: number) => 
    `${i + 1}. ${repo.name || "N/A"} (${repo.language || "N/A"}) - ${repo.stargazers_count ?? 0}⭐, ${repo.forks_count ?? 0}🍴. ${repo.description || "No description"}`
).join("\n")}
`;
  const feedback = await generateResponse(data, mode);
  return feedback;
}