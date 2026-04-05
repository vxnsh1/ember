"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/card";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { roastModes } from "@/data/roast";
import { GithubUsername } from "@/components/github-username";
import analyzeGithub from "./actions/github";
import { Loader } from "lucide-react";
import { motion } from "motion/react";

const HISTORY_KEY = "ember" as const;

type EmberHistoryState = {
  step: 1 | 2;
  username?: string;
  screen?: "pick" | "result";
  modeId?: string;
};

function readEmberState(state: unknown): EmberHistoryState | null {
  if (!state || typeof state !== "object" || !(HISTORY_KEY in state)) return null;
  const raw = (state as Record<string, unknown>)[HISTORY_KEY];
  if (!raw || typeof raw !== "object") return null;
  return raw as EmberHistoryState;
}

function pushEmberState(next: EmberHistoryState) {
  window.history.pushState({ [HISTORY_KEY]: next }, "", "");
}

function replaceEmberState(next: EmberHistoryState) {
  window.history.replaceState({ [HISTORY_KEY]: next }, "", "");
}

function FadeInOut({ show, children }: { show: boolean; children: React.ReactNode }) {
  const [visible, setVisible] = useState(show);
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      const timeoutId = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [show]);

  return shouldRender ? (
    <div className={`transition-opacity duration-500 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  ) : null;
}

function TypingFeedback({
  text,
  onTypingComplete,
}: {
  text: string;
  onTypingComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const onCompleteRef = useRef(onTypingComplete);
  onCompleteRef.current = onTypingComplete;

  useEffect(() => {
    setDisplayed("");
    const str = typeof text === "string" ? text : String(text ?? "");
    let cancelled = false;

    if (!str) {
      queueMicrotask(() => {
        if (!cancelled) onCompleteRef.current?.();
      });
      return () => {
        cancelled = true;
      };
    }

    let i = 0;
    const interval = setInterval(() => {
      if (cancelled) return;
      if (i >= str.length) {
        clearInterval(interval);
        if (!cancelled) onCompleteRef.current?.();
        return;
      }
      const ch = str[i];
      if (ch !== undefined) {
        setDisplayed((prev) => prev + ch);
      }
      i++;
    }, 20);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [text]);

  return <span className="block text-left w-full">{displayed}</span>;
}

const Home = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackTypingDone, setFeedbackTypingDone] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const roastRequestId = useRef(0);
  const [gridMinHeight, setGridMinHeight] = useState<number | undefined>(undefined);

  const applyHistoryToUi = useCallback((ember: EmberHistoryState | null) => {
    if (!ember || ember.step === 1) {
      setStep(1);
      setUsername("");
      setSelectedMode(null);
      setFeedback(null);
      setLoading(false);
      setFeedbackTypingDone(false);
      return;
    }
    setStep(2);
    setUsername(ember.username ?? "");
    if (ember.screen === "result") {
      setSelectedMode(ember.modeId ?? null);
      setFeedback(null);
      setLoading(false);
      setFeedbackTypingDone(false);
    } else {
      setSelectedMode(null);
      setFeedback(null);
      setLoading(false);
      setFeedbackTypingDone(false);
    }
  }, []);

  useEffect(() => {
    replaceEmberState({ step: 1 });
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      roastRequestId.current += 1;
      applyHistoryToUi(readEmberState(event.state));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [applyHistoryToUi]);

  useEffect(() => {
    if (step === 2 && selectedMode !== null && gridRef.current) {
      setGridMinHeight(gridRef.current.offsetHeight);
    }
  }, [selectedMode, step]);

  useEffect(() => {
    if (step !== 2 || selectedMode === null) {
      setGridMinHeight(undefined);
    }
  }, [step, selectedMode]);

  const handleUsernameSubmit = (submittedUsername: string) => {
    setUsername(submittedUsername);
    setStep(2);
    pushEmberState({ step: 2, username: submittedUsername, screen: "pick" });
  };

  const handleModeSelect = async (modeId: string) => {
    const id = (roastRequestId.current += 1);
    setSelectedMode(modeId);
    setLoading(true);
    setFeedback(null);
    setFeedbackTypingDone(false);
    pushEmberState({
      step: 2,
      username,
      screen: "result",
      modeId,
    });

    try {
      const response = await analyzeGithub({
        username: username,
        roastModeId: modeId,
      });
      if (id !== roastRequestId.current) return;
      setFeedbackTypingDone(false);
      setFeedback(response);
    } catch (err) {
      if (id !== roastRequestId.current) return;
      console.error(err);
      setFeedbackTypingDone(false);
      setFeedback("Failed to generate roast. Please try again.");
    } finally {
      if (id === roastRequestId.current) setLoading(false);
    }
  };

  const handleTryAnotherMode = () => {
    roastRequestId.current += 1;
    setSelectedMode(null);
    setFeedback(null);
    setLoading(false);
    setFeedbackTypingDone(false);
    replaceEmberState({ step: 2, username, screen: "pick" });
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center mt-20 gap-10 px-2 sm:px-4 md:px-10 lg:px-20 w-full">
        <Hero />
        {step === 1 && (
          <GithubUsername onSubmitUsername={handleUsernameSubmit} />
        )}
        <FadeInOut show={step === 2}>
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              gap-4 
              mt-6 
              h-80
              w-full 
              transition-all 
              duration-500"
            ref={gridRef}
            style={gridMinHeight !== undefined ? { minHeight: gridMinHeight } : undefined}
          >
            {selectedMode == null ? (
              roastModes.map((mode) => (
                <Card
                  key={mode.id}
                  title={mode.title}
                  subtitle={mode.subtitle}
                  images={mode.images}
                  description={mode.description}
                  isActive={selectedMode === mode.id}
                  onClick={() => handleModeSelect(mode.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center w-full h-full">
                {loading && (
                  <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                    Generating roast
                    <Loader className="animate-spin" size={16} />
                  </p>
                )}
                {feedback && (
                  <div className="max-w-2xl px-4 rounded-md text-foreground/80 w-full text-left flex flex-col gap-4">
                    <TypingFeedback
                      text={feedback}
                      onTypingComplete={() => setFeedbackTypingDone(true)}
                    />
                    {feedbackTypingDone && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        onClick={handleTryAnotherMode}
                        className="self-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
                      >
                        Try another mode
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </FadeInOut>
      </div>
    </div>
  );
};

export default Home;
