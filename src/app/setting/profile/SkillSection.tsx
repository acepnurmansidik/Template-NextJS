"use client";

import { BiodataDaum } from "@/types/profile";
import { useState } from "react";

interface DataProps {
  initiateData: BiodataDaum;
  onSetForm: React.Dispatch<React.SetStateAction<BiodataDaum>>;
}

const SkillSection = ({ initiateData, onSetForm }: DataProps) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (!input.trim()) return;
    setSkills([...skills, input]);
    setInput("");
  };

  const handleAddItem = () => {
    const newSkill = [...(initiateData.skills || []), { name: "", slug: "" }];
    onSetForm((prev) => {
      return {
        ...prev,
        skills: newSkill,
      };
    });
  };

  const handleRemoveItem = (index: number) => {
    const newSkill = initiateData.skills.filter((item, i) => i !== index);
    onSetForm((prev) => {
      return {
        ...prev,
        skills: newSkill,
      };
    });
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
