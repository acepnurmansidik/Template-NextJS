"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import Select from "react-select";

const techOptions = [
  { value: "React", label: "React" },
  { value: "Next.js", label: "Next.js" },
  { value: "Node.js", label: "Node.js" },
  { value: "Express", label: "Express" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "TailwindCSS", label: "TailwindCSS" },
];

interface Contributor {
  name: string;
  role: string;
  github_link: string;
}

const ShowCaseSection = () => {
  const [list, setList] = useState<any[]>([]);

  const addShowCase = () => {
    setList([
      ...list,
      {
        title: "",
        thumbnail: "",
        description: "",
        tech_stack: [],
        contributor: [], // FIXED: always array
        web_link: "",
        app_store_link: "",
        google_play_link: "",
        repo_backend: "",
        repo_frontend: "",
        repo_mobile: "",
      },
    ]);
  };

  const removeShowCase = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const update = (i: number, field: string, value: any) => {
    const copy = [...list];
    copy[i][field] = value;
    setList(copy);
  };

  const handleThumbnail = (i: number, e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update(i, "thumbnail", url);
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div className="p-6 rounded-lg h-full flex flex-col">
      {/* Header */}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Education</h3>
        <button
          onClick={addShowCase}
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
          {list.map((item, i) => (
            <div key={i} className="relative pl-6">
              {/* Bullet */}
              <span className="absolute -left-2 top-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></span>

              <div className="p-4 rounded-lg bg-white shadow-sm flex gap-3 w-full">
                <div className="grid gap-3 w-full">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                      placeholder="Title"
                      className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                      onChange={(e) => update(i, "title", e.target.value)}
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Tech Stack</label>
                    <Select
                      isMulti
                      options={techOptions}
                      className="text-sm"
                      value={item.tech_stack}
                      onChange={(selected) => update(i, "tech_stack", selected)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Thumbnail */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Thumbnail</label>

                      <div className="relative w-full max-w-xs">
                        {item.thumbnail ? (
                          <div className="relative">
                            <img
                              src={item.thumbnail}
                              alt="thumbnail"
                              className="w-full h-40 object-cover rounded-lg border"
                            />
                            <label className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer">
                              Ganti Gambar
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleThumbnail(i, e)}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="w-full h-40 border border-slate-300 rounded-lg flex items-center justify-center text-sm text-slate-500 cursor-pointer">
                            Upload Thumbnail
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleThumbnail(i, e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 col-span-2">
                      <label className="text-sm font-medium">Repository</label>
                      <div className="grid grid-cols-2 gap-2 p-2 border border-slate-200 rounded-lg">
                        <input
                          placeholder="Repo Backend"
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          onChange={(e) =>
                            update(i, "backend_link", e.target.value)
                          }
                        />
                        <input
                          placeholder="Repo Frontend"
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          onChange={(e) =>
                            update(i, "frontend_link", e.target.value)
                          }
                        />
                        <input
                          placeholder="Repo Mobile"
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          onChange={(e) =>
                            update(i, "mobile_link", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Repository Links */}

                  {/* Platform Links */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Platform</label>
                    <div className="grid grid-cols-2 gap-2 p-2 border border-slate-200 rounded-lg">
                      <input
                        placeholder="Web Link"
                        className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                        onChange={(e) => update(i, "web_link", e.target.value)}
                      />
                      <input
                        placeholder="App Store Link"
                        className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                        onChange={(e) =>
                          update(i, "app_store_link", e.target.value)
                        }
                      />
                      <input
                        placeholder="Google Play Link"
                        className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                        onChange={(e) =>
                          update(i, "google_play_link", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Contributors */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">
                        Contributors
                      </label>

                      {/* ADD CONTRIBUTOR */}
                      <button
                        onClick={() => {
                          const copy = [...list];

                          if (!Array.isArray(copy[i].contributor)) {
                            copy[i].contributor = [];
                          }

                          copy[i].contributor.push({
                            name: "",
                            role: "",
                            github_link: "",
                          });

                          setList(copy);
                        }}
                        className="px-3 py-1 bg-slate-200 rounded text-xs hover:bg-slate-300 w-fit"
                      >
                        + Add Contributor
                      </button>
                    </div>

                    {Array.isArray(item.contributor) &&
                      item.contributor.map((c: Contributor, cIndex: number) => (
                        <div
                          key={cIndex}
                          className="flex gap-3 w-full items-start border border-slate-200 rounded-lg p-2"
                        >
                          <div className="p-3 border w-full border-slate-200 rounded-lg grid gap-3 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                placeholder="Contributor Name"
                                className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                                value={c.name}
                                onChange={(e) => {
                                  const copy = [...list];
                                  copy[i].contributor[cIndex].name =
                                    e.target.value;
                                  setList(copy);
                                }}
                              />

                              <input
                                placeholder="Role (e.g. Frontend Developer)"
                                className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                                value={c.role}
                                onChange={(e) => {
                                  const copy = [...list];
                                  copy[i].contributor[cIndex].role =
                                    e.target.value;
                                  setList(copy);
                                }}
                              />
                            </div>

                            <input
                              placeholder="Github Link"
                              className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                              value={c.github_link}
                              onChange={(e) => {
                                const copy = [...list];
                                copy[i].contributor[cIndex].github_link =
                                  e.target.value;
                                setList(copy);
                              }}
                            />
                          </div>

                          {/* REMOVE BUTTON */}
                          <div
                            className="relative h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer"
                            onClick={() => {
                              const copy = [...list];
                              copy[i].contributor = copy[i].contributor.filter(
                                (_: any, idx: number) => idx !== cIndex,
                              );
                              setList(copy);
                            }}
                          >
                            <GoTrash
                              fontSize={20}
                              className="text-red-500 font-bold"
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Description */}
                  <textarea
                    rows={2}
                    placeholder="Description"
                    className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                    onFocus={(e) => autoResize(e.target as HTMLTextAreaElement)}
                    onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                    onBlur={(e) => (e.target.style.height = "60px")}
                    onChange={(e) => update(i, "description", e.target.value)}
                  />
                </div>

                {/* Delete Button */}
                <div
                  className="relative h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => removeShowCase(i)}
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

export default ShowCaseSection;
