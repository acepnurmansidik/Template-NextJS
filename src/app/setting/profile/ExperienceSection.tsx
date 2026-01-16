"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

const ExperienceSection = () => {
  const [list, setList] = useState<any[]>([]);

  const addExperience = () => {
    setList([...list, { start: "", end: "", role: "", description: "" }]);
  };

  const update = (i: number, field: string, value: string) => {
    const temp = [...list];
    temp[i][field] = value;
    setList(temp);
  };

  // Auto expand textarea logic
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const removeExperience = (index: number) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Education</h3>
        <button
          onClick={addExperience}
          className="p-3 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          <FaPlus />
        </button>
      </div>

      {/* Scroll Area */}
      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: "calc(87vh - 200px)" }}
      >
        <div className="relative border-l-2 border-slate-300 ml-4 flex flex-col gap-6">
          {list.map((exp, i) => (
            <div key={i} className="relative pl-6">
              {/* Bullet point */}
              <span className="absolute -left-2 top-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></span>

              <div className="p-4 rounded-lg bg-white shadow-sm flex gap-3 w-full">
                <div className="grid gap-3 w-full">
                  {/* Start/End */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Start (MM YYYY)"
                      className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                      onChange={(e) => update(i, "start", e.target.value)}
                    />
                    <input
                      placeholder="End (MM YYYY)"
                      className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                      onChange={(e) => update(i, "end", e.target.value)}
                    />
                  </div>

                  {/* Company/Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Company Name"
                      className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                      onChange={(e) =>
                        update(i, "company_name", e.target.value)
                      }
                    />
                    <input
                      placeholder="Role"
                      className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                      onChange={(e) => update(i, "role", e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <textarea
                    rows={3}
                    placeholder="Description"
                    className="p-2 border border-slate-300 outline-none rounded-lg text-sm transition-all duration-300"
                    onFocus={(e) => autoResize(e.target as HTMLTextAreaElement)}
                    onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                    onBlur={(e) => {
                      const el = e.target as HTMLTextAreaElement;
                      el.style.height = "70px";
                    }}
                    onChange={(e) =>
                      update(
                        i,
                        "description",
                        (e.target as HTMLTextAreaElement).value,
                      )
                    }
                  />
                </div>

                <div
                  className="relative h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                  onClick={() => removeExperience(i)}
                >
                  <GoTrash fontSize={20} className="text-red-500 font-bold" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
