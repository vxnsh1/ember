"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

const Hero = () => {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <main className="w-full flex flex-col text-center items-center justify-center gap-4 px-5 md:px-10">
      <h1 className="font-heading text-7xl">Ember</h1>
      <div className="leading-4">
        <p className="text-xl font-semibold">
          Think your Github is solid?
        </p>
        <p className="text-card-foreground/50">
          We judge your commits so others don’t have to.
        </p>
      </div>
    </main>
  );
};

export default Hero;
