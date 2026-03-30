"use client";

import { useState } from "react";
import { Card } from "@/components/card";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { roastModes } from "@/data/roast";

const Home = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <Navbar />
      <Hero />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5 lg:px-40 mt-10">
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
  );
};

export default Home;
