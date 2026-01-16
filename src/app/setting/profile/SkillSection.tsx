"use client";

import { useState } from "react";

const SkillSection = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (!input.trim()) return;
    setSkills([...skills, input]);
    setInput("");
  };

  return (
    <div className="p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Skills</h3>

      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 border rounded-lg text-sm flex-1"
          placeholder="Skill name"
        />
        <button
          onClick={addSkill}
          className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-gray-100 text-sm rounded-lg shadow-xs"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillSection;
