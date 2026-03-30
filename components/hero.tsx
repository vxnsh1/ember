"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

const Hero = () => {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <main className="w-full flex flex-col text-center items-center justify-center mt-10 gap-4">
      <div className="relative size-12">
        <Image
          src="/ember_white_logo.png"
          alt="Ember Logo"
          fill
          className="object-contain dark:opacity-0 transition-opacity duration-300"
          priority
        />
        <Image
          src="/ember_dark_logo.png"
          alt="Ember Logo"
          fill
          className="object-contain opacity-0 dark:opacity-100 transition-opacity duration-300"
          priority
        />
      </div>
      <div className="">
        <h1 className="font-sans text-2xl font-semibold">Think your Github is solid? </h1>
        <p className="text-card-foreground/70">
          Get honest feedback on structure, projects, and what actually stands
          out.
        </p>
      </div>
    </main>
  );
};

export default Hero;
