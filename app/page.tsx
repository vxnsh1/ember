"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/card";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { roastModes } from "@/data/roast";
import { GithubUsername } from "@/components/github-username";
import analyzeGithub from "./actions/github";
import { Loader } from "lucide-react";

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

function TypingFeedback({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const str = typeof text === "string" ? text : String(text ?? "");
    if (!str) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= str.length) {
        clearInterval(interval);
        return;
      }
      const ch = str[i];
      if (ch !== undefined) {
        setDisplayed((prev) => prev + ch);
      }
      i++;
    }, 20);
    return () => clearInterval(interval);
  }, [text]);
  return <span className="block text-left w-full">{displayed}</span>;
}

const Home = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const [gridMinHeight, setGridMinHeight] = useState<number | undefined>(undefined);

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
  };

  const handleModeSelect = async (modeId: string) => {
    setSelectedMode(modeId);
    setLoading(true);

    try {
      const response = await analyzeGithub({
        username: username,
        roastModeId: modeId,
      });
      setFeedback(response);
    } catch (err) {
      console.error(err);
      setFeedback("Failed to generate roast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="w-full h-full flex flex-col items-center justify-center gap-10">
        <Hero />
        {step === 1 && (
          <GithubUsername onSubmitUsername={handleUsernameSubmit} />
        )}
        <FadeInOut show={step === 2}>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5 lg:px-20 mt-10 w-full h-80 transition-all duration-500"
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
                  <div className="max-w-2xl px-4 rounded-md text-foreground/80 w-full text-left">
                    <TypingFeedback text={feedback} />
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
