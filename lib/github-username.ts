/** GitHub username rules (aligned with UI validation). */
const GITHUB_USERNAME_REGEX = /^(?!-)(?!.*--)[A-Za-z\d-]{1,39}(?<!-)$/;

export function isValidGithubUsername(value: string): boolean {
  return GITHUB_USERNAME_REGEX.test(value.trim());
}
