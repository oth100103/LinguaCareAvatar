"use client";

import { useState } from "react";

const updateConfig = async (newScenario: string, newLevel: string) => {
  await fetch("/api/config", {
    method: "POST",
    body: JSON.stringify({
      scenario: newScenario,
      level: newLevel,
    }),
  });
};



export default function Home() {
  const [scenario, setScenario] = useState("job interview");
  const [level, setLevel] = useState("A2");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">LinguaCare UI</h1>

      {/* Scenario */}
      <div className="flex flex-col gap-2">
        <label>Scenario</label>
        <select
  value={scenario}
  onChange={(e) => {
    const value = e.target.value;
    setScenario(value);
    updateConfig(value, level);
  }}
  className="border p-2"
        >
          <option value="job interview">Job Interview</option>
          <option value="cafe">Café</option>
        </select>
      </div>

      {/* Level */}
      <div className="flex flex-col gap-2">
        <label>Level</label>
        <select
value={level}
onChange={(e) => {
  const value = e.target.value;
  setLevel(value);
  updateConfig(scenario, value);
}}
className="border p-2"
>     
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>
      </div>

      {/* Debug Output */}
      <div className="mt-4 p-4 border">
        <p>Scenario: {scenario}</p>
        <p>Level: {level}</p>
      </div>
    </main>
  );
}