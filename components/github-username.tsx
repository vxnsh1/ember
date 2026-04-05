import { Loader } from "lucide-react";
import { useState } from "react";

interface GithubUsernameProps {
  onSubmitUsername: (username: string) => void;
}

const GITHUB_USERNAME_REGEX = /^(?!-)(?!.*--)[A-Za-z\d-]{1,39}(?<!-)$/;

export const GithubUsername = ({ onSubmitUsername }: GithubUsernameProps) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUsername = (value: string) => {
    if (!GITHUB_USERNAME_REGEX.test(value.trim())) {
      return "Invalid GitHub username.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    const validationError = validateUsername(trimmed);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    onSubmitUsername(trimmed);

    setTimeout(() => {
      setLoading(false);
      setUsername("");
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError(null);
  };

  const handleBlur = () => {
    if (username.trim() === "") return;
    const validationError = validateUsername(username.trim());
    setError(validationError);
  };

  return (
    <form
      className="w-full flex flex-col items-center justify-center gap-2 relative"
      onSubmit={handleSubmit}
      autoComplete="off"
      aria-label="GitHub Username Form"
    >
      <input
        type="text"
        value={username}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter your GitHub username"
        className={`w-full max-w-xs h-11 rounded-md border bg-transparent px-4 text-sm 
        text-foreground placeholder:text-muted-foreground/50 
        transition-all duration-200 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary
        caret-primary
        ${error ? "border-destructive" : ""}`}
        disabled={loading}
        aria-invalid={!!error}
        aria-describedby={error ? "github-username-error" : undefined}
        inputMode="text"
        autoCapitalize="off"
        spellCheck={false}
      />
      {error && (
        <span
          id="github-username-error"
          className="text-destructive text-xs w-full max-w-xs text-left mt-1"
          role="alert"
        >
          {error}
        </span>
      )}
      <button
        type="submit"
        className="w-full max-w-xs mt-2 px-4 py-2 flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-60 h-11"
        disabled={!username.trim() || loading}
      >
        {loading ? (
          <Loader className="animate-spin text-primary-foreground" size={16} />
        ) : (
          "Roast My Github"
        )}
      </button>
    </form>
  );
};