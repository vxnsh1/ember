"use client";

import { useState } from "react";
import { Card } from "@/components/card";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { roastModes } from "@/data/roast";
import { GithubUsername } from "@/components/github-username";

const Home = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="w-full h-full flex flex-col items-center justify-center gap-10">
        <Hero />
        <GithubUsername />

        <div className="hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5 lg:px-20 mt-10">
          {roastModes.map((mode) => (
            <Card
              key={mode.id}
              title={mode.title}
              subtitle={mode.subtitle}
              images={mode.images}
              isActive={selected === mode.id}
              description={mode.description}
              onClick={() => setSelected(mode.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
