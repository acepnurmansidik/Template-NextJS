"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useState } from "react";
import BiodataSection from "./BiodataSection";
import SkillSection from "./SkillSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import ShowCaseSection from "./ShowCaseSection";

const Page = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("biodata");

  const menus = [
    { key: "biodata", label: "Biodata" },
    { key: "skill", label: "Skill" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "showcase", label: "Show Case" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <CMSLayout>
      <div className="w-full px-6">
        <h5 className="text-3xl font-bold mb-7">Profile</h5>

        {/* MENU TABS */}
        <div className=" flex justify-between items-center mb-5 py-1">
          <div className="flex gap-3 items-center overflow-x-auto">
            {menus.map((m) => (
              <div
                key={m.key}
                onClick={() => setSelectedMenu(m.key)}
                className={`px-4 py-2 rounded-lg hover:cursor-pointer duration-300 shadow-xs text-sm bg-white whitespace-nowrap ${
                  selectedMenu === m.key ? "font-bold bg-gray-100" : ""
                }`}
              >
                {m.label}
              </div>
            ))}
          </div>
          <div className="flex gap-3 items-center overflow-x-auto">
            <button
              className={`px-4 py-2 bg-blue-600 font-bold rounded-lg hover:cursor-pointer duration-300 shadow-xs text-sm text-white whitespace-nowrap `}
            >
              Update
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          {selectedMenu === "biodata" && <BiodataSection />}
          {selectedMenu === "skill" && <SkillSection />}
          {selectedMenu === "experience" && <ExperienceSection />}
          {selectedMenu === "education" && <EducationSection />}
          {selectedMenu === "showcase" && <ShowCaseSection />}

          {selectedMenu === "contact" && (
            <div className="p-5 bg-white rounded-lg shadow-xs">
              Contact Content
            </div>
          )}
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;
